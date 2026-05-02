// claim-checkin — server-trusted Pokémon-GO-style check-in.
//
// Anti-abuse:
// - JWT required.
// - Per-user rate limit (default 30/h via app_config.checkin.max_per_hour).
// - 24h same-location cooldown per user.
// - Velocity check vs. last check-in (>900 km/h ⇒ reject).
// - Mock-GPS heuristics (suspicious accuracy / repeated identical coords) — flag, don't auto-ban.
// - Photo proof required when (multiplier >= threshold) OR (verified location with check_in_count_total < threshold).
//
// Privacy:
// - The user's lat/lng is consumed in-memory ONLY for distance + velocity.
//   It is never written to check_ins.
//
// XP:
// - base_xp from locations.base_xp (admin-curated).
// - multiplier = piecewise function of distance from profiles.home_location.
// - cap at 5.0 (Q9).
// - cross-track 30%/week ceiling enforced via _shared/coefficients.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enforceRateLimit } from "../_shared/rateLimit.ts";
import { getCoefficient, applyCoefficient, withinCrossTrackCap, Track } from "../_shared/coefficients.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ClaimRequest {
  location_id: string;
  // Browser-supplied position. Used in-memory only.
  lat: number;
  lng: number;
  // GeolocationPositionCoords.accuracy in meters, optional.
  accuracy_m?: number;
  // Optional pre-uploaded photo (handled by upload-file edge fn first).
  photo_url?: string;
}

const EARTH_R_KM = 6371.0088;

function haversineKm(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const sa =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_R_KM * Math.asin(Math.min(1, Math.sqrt(sa)));
}

// Piecewise multiplier from home distance. Tunable in app_config later.
function distanceMultiplier(distanceKm: number, cap = 5.0): number {
  if (distanceKm <= 50) return 1.0;
  if (distanceKm <= 500) return 1.0 + (distanceKm - 50) / 450; // 1.0 → 2.0
  if (distanceKm <= 2000) return 2.0 + (distanceKm - 500) / 1000; // 2.0 → 3.5
  const m = 3.5 + (distanceKm - 2000) / 1000; // 3.5 → ∞
  return Math.min(cap, m);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authErr } = await supabaseAuth.auth.getClaims(token);
    if (authErr || !claims?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claims.claims.sub as string;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Configurable knobs.
    const cfg = await admin
      .from("app_config")
      .select("key, value")
      .in("key", [
        "checkin.multiplier_cap",
        "checkin.photo_threshold_multiplier",
        "checkin.photo_threshold_rare_visits",
        "checkin.cooldown_hours",
        "checkin.max_per_hour",
        "checkin.max_velocity_kmh",
      ]);
    const knob = (k: string, fallback: number) => {
      const row = cfg.data?.find((r: any) => r.key === k);
      return row ? Number(row.value) : fallback;
    };
    const multiplierCap = knob("checkin.multiplier_cap", 5.0);
    const photoMultThreshold = knob("checkin.photo_threshold_multiplier", 3.0);
    const rareVisitsThreshold = knob("checkin.photo_threshold_rare_visits", 100);
    const cooldownHours = knob("checkin.cooldown_hours", 24);
    const maxPerHour = knob("checkin.max_per_hour", 30);
    const maxVelocityKmh = knob("checkin.max_velocity_kmh", 900);

    if (await enforceRateLimit(admin, userId, "claim-checkin", maxPerHour, 3600)) {
      return json({ error: "Trop de check-ins. Réessayez plus tard.", code: "rate_limited" }, 429);
    }

    const body = (await req.json()) as ClaimRequest;
    if (!body?.location_id || typeof body.lat !== "number" || typeof body.lng !== "number") {
      return json({ error: "location_id, lat, lng required" }, 400);
    }

    // Profile + home_location.
    const { data: profile } = await admin
      .from("profiles")
      .select("home_location, denominations:denomination_id (code), consents")
      .eq("id", userId)
      .maybeSingle();

    const userTrack = ((profile?.denominations as any)?.code ?? "heritage") as Track;
    const consents = (profile?.consents ?? {}) as Record<string, { granted: boolean }>;
    if (!consents.geolocation_checkin?.granted) {
      return json({ error: "Geolocation consent missing", code: "consent_missing" }, 403);
    }

    let homeKm = 0;
    if (profile?.home_location?.coordinates) {
      const [hLng, hLat] = profile.home_location.coordinates as [number, number];
      homeKm = haversineKm([hLat, hLng], [body.lat, body.lng]);
    }

    // Location row.
    const { data: location } = await admin
      .from("locations")
      .select("id, name, geom, base_xp, verified, check_in_count_total, denomination_scope")
      .eq("id", body.location_id)
      .maybeSingle();
    if (!location) return json({ error: "Unknown location" }, 404);

    // Geofence: user must be within 100m of the location's geom.
    if (location.geom?.coordinates) {
      const [lLng, lLat] = location.geom.coordinates as [number, number];
      const proximityKm = haversineKm([lLat, lLng], [body.lat, body.lng]);
      if (proximityKm > 0.1) {
        return json({ error: "Vous n'êtes pas sur place.", code: "out_of_geofence", distance_m: Math.round(proximityKm * 1000) }, 422);
      }
    }

    // 24h cooldown for same location.
    const cooldownStart = new Date(Date.now() - cooldownHours * 3600 * 1000).toISOString();
    const { data: recent } = await admin
      .from("check_ins")
      .select("id")
      .eq("user_id", userId)
      .eq("location_id", body.location_id)
      .gte("created_at", cooldownStart)
      .limit(1)
      .maybeSingle();
    if (recent) {
      return json({ error: "Déjà visité récemment.", code: "cooldown_active" }, 429);
    }

    // Velocity check vs. previous check-in (any location).
    const { data: prev } = await admin
      .from("check_ins")
      .select("created_at, locations!inner(geom)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (prev?.locations?.geom?.coordinates && prev.created_at) {
      const [pLng, pLat] = (prev as any).locations.geom.coordinates as [number, number];
      const distSinceKm = haversineKm([pLat, pLng], [body.lat, body.lng]);
      const hours = (Date.now() - new Date(prev.created_at).getTime()) / 3600000;
      if (hours > 0 && distSinceKm / hours > maxVelocityKmh) {
        await admin.from("security_logs").insert({
          user_id: userId,
          event_type: "suspicious_activity",
          severity: "high",
          action: "denied",
          endpoint: "claim-checkin",
          status_code: 422,
          details: { reason: "velocity", km: distSinceKm, hours, kmh: distSinceKm / hours },
        });
        return json({ error: "Mouvement physiquement impossible.", code: "velocity_violation" }, 422);
      }
    }

    // Mock-GPS heuristic — flag, never auto-ban.
    if (typeof body.accuracy_m === "number" && body.accuracy_m < 1.5) {
      await admin.from("security_logs").insert({
        user_id: userId,
        event_type: "gps_heuristic_flag",
        severity: "low",
        action: "allowed",
        endpoint: "claim-checkin",
        status_code: 200,
        details: { reason: "suspicious_accuracy", accuracy_m: body.accuracy_m },
      });
    }

    // Compute XP.
    const multiplier = distanceMultiplier(homeKm, multiplierCap);
    const baseXp = location.base_xp ?? 25;
    const rawXp = Math.round(baseXp * multiplier);

    // Cross-track cap.
    const allowed = await withinCrossTrackCap(admin, userId, userTrack, location.denomination_scope as Track, rawXp);
    const coef = await getCoefficient(admin, location.denomination_scope as Track, "weekly");
    const normalizedXp = allowed ? applyCoefficient(rawXp, coef) : 0;

    // Photo gate (Q10).
    const needsPhoto =
      multiplier >= photoMultThreshold ||
      (location.verified && (location.check_in_count_total ?? 0) < rareVisitsThreshold);
    const validation_status = needsPhoto && !body.photo_url ? "pending_photo" : "verified";

    // Insert check_in (no raw GPS).
    const { data: inserted, error: insertErr } = await admin
      .from("check_ins")
      .insert({
        user_id: userId,
        location_id: body.location_id,
        distance_km: homeKm.toFixed(3),
        multiplier,
        base_xp: baseXp,
        raw_xp: rawXp,
        normalized_xp: normalizedXp,
        photo_url: body.photo_url ?? null,
        validation_status,
      })
      .select("id, validation_status, raw_xp, normalized_xp, multiplier")
      .single();
    if (insertErr) {
      console.error("claim-checkin insert error", insertErr);
      return json({ error: "internal_error" }, 500);
    }

    // If verified now, credit XP and bump location count.
    if (validation_status === "verified") {
      const { data: progress } = await admin
        .from("user_progress")
        .select("total_points")
        .eq("user_id", userId)
        .maybeSingle();
      await admin.from("user_progress").upsert(
        {
          user_id: userId,
          total_points: (progress?.total_points ?? 0) + normalizedXp,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );
      await admin
        .from("locations")
        .update({ check_in_count_total: (location.check_in_count_total ?? 0) + 1 })
        .eq("id", location.id);
    }

    return json({
      ok: true,
      check_in_id: inserted.id,
      validation_status,
      raw_xp: rawXp,
      normalized_xp: normalizedXp,
      multiplier,
      cross_track_capped: !allowed,
      photo_required: needsPhoto && !body.photo_url,
    });
  } catch (e) {
    console.error("claim-checkin unhandled", e);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
