// Phase 2.0 scaffold — server-trusted quest claim.
// Replaces the client-side XP/badge math in AppContext.visitPlace / addPoints /
// awardQuestBadge. The full quest catalog moves to the DB in Phase 2.7; for now
// the catalog is a small in-function map so we have a working server-trusted
// path today. ALL writes to user_progress here use the service-role client and
// therefore bypass the gamification-guard trigger.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enforceRateLimit } from "../_shared/rateLimit.ts";
import { getCoefficient, applyCoefficient, withinCrossTrackCap, Track } from "../_shared/coefficients.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type QuestKind = "daily_quiz" | "weekly_quest" | "place_visit_bonus";

interface ClaimRequest {
  kind: QuestKind;
  quest_id: string;
  quiz_score?: number;
  place_id?: string;
  // Track scope of the quest content. Defaults to 'common' for the stub catalog.
  track_scope?: Track;
}

const CATALOG: Record<QuestKind, { base_xp: number }> = {
  daily_quiz: { base_xp: 30 },
  weekly_quest: { base_xp: 150 },
  place_visit_bonus: { base_xp: 25 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authErr } = await supabaseAuth.auth.getClaims(token);
    if (authErr || !claimsData?.claims?.sub) {
      return json({ error: "Unauthorized" }, 401);
    }
    const userId = claimsData.claims.sub as string;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const limited = await enforceRateLimit(admin, userId, "claim-quest", 60, 60);
    if (limited) {
      return json({ error: "Trop de requêtes. Réessayez dans une minute." }, 429);
    }

    const body = (await req.json()) as ClaimRequest;
    if (!body?.kind || !body?.quest_id) {
      return json({ error: "kind and quest_id required" }, 400);
    }
    const reward = CATALOG[body.kind];
    if (!reward) {
      return json({ error: "Unknown quest kind" }, 400);
    }

    // Idempotency guard: a given (user_id, quest_id) can only be claimed once.
    const { data: existing } = await admin
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("place_id", body.quest_id)
      .maybeSingle();
    if (existing) {
      return json({ error: "Quête déjà réclamée", code: "already_claimed" }, 409);
    }

    // Read current progress (service-role bypasses RLS).
    const { data: progress, error: progressErr } = await admin
      .from("user_progress")
      .select("total_points, badges, current_streak, longest_streak, last_quest_date")
      .eq("user_id", userId)
      .maybeSingle();
    if (progressErr) {
      console.error("claim-quest progress read error", progressErr);
      return json({ error: "internal_error" }, 500);
    }

    let raw_xp = reward.base_xp;
    if (body.kind === "daily_quiz" && typeof body.quiz_score === "number") {
      raw_xp = Math.max(0, Math.min(body.quiz_score, 10)) * 5;
    }

    // Determine user track for normalization.
    const { data: profile } = await admin
      .from("profiles")
      .select("denominations:denomination_id (code)")
      .eq("id", userId)
      .maybeSingle();
    const userTrack = ((profile?.denominations as any)?.code ?? "heritage") as Track;
    const contentTrack = body.track_scope ?? "common";

    const allowed = await withinCrossTrackCap(admin, userId, userTrack, contentTrack, raw_xp);
    const coef = await getCoefficient(admin, contentTrack, "weekly");
    const normalized_xp = allowed ? applyCoefficient(raw_xp, coef) : 0;

    // Streak update
    const today = new Date().toISOString().split("T")[0];
    let streak = progress?.current_streak ?? 0;
    let longest = progress?.longest_streak ?? 0;
    const last = progress?.last_quest_date ?? null;
    if (last !== today) {
      const yesterday = new Date(Date.now() - 24 * 3600 * 1000)
        .toISOString().split("T")[0];
      streak = last === yesterday ? streak + 1 : 1;
      longest = Math.max(longest, streak);
    }

    const newTotal = (progress?.total_points ?? 0) + normalized_xp;

    // Upsert (service-role) — trigger lets us through.
    const { error: writeErr } = await admin
      .from("user_progress")
      .upsert(
        {
          user_id: userId,
          total_points: newTotal,
          current_streak: streak,
          longest_streak: longest,
          last_quest_date: today,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
    if (writeErr) {
      console.error("claim-quest write error", writeErr);
      return json({ error: "internal_error" }, 500);
    }

    // Mint a quest-badge row for idempotency.
    await admin.from("user_badges").insert({
      user_id: userId,
      place_id: body.quest_id,
      quest_name: body.kind,
      quest_description: `Phase 2.0 stub claim`,
      quest_icon: "trophy",
      badge_type: "quest",
    });

    return json({
      ok: true,
      raw_xp,
      normalized_xp,
      cross_track_capped: !allowed,
      total_points: newTotal,
      current_streak: streak,
      longest_streak: longest,
    });
  } catch (e) {
    console.error("claim-quest unhandled", e);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
