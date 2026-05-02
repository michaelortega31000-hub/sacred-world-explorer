// Reads the most recent published coefficient_snapshot covering the given
// period_type and applies it to a (track, raw_xp) pair.
// Snapshots are immutable per period (Q23) — admin tweaks only affect the
// next period boundary.

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export type Track = "common" | "catholic" | "protestant" | "orthodox" | "heritage";

const FALLBACK: Record<Track, number> = {
  common: 1.0,
  catholic: 1.0,
  protestant: 1.0,
  orthodox: 1.0,
  heritage: 1.0,
};

export async function getCoefficient(
  admin: SupabaseClient,
  scope: Track,
  periodType: "weekly" | "monthly" | "all_time" = "weekly",
): Promise<number> {
  const { data, error } = await admin
    .from("coefficient_snapshots")
    .select("coefficients")
    .eq("period_type", periodType)
    .eq("is_draft", false)
    .lte("period_start", new Date().toISOString())
    .order("period_start", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return FALLBACK[scope] ?? 1.0;
  const map = (data.coefficients ?? {}) as Record<string, number>;
  return map[scope] ?? FALLBACK[scope] ?? 1.0;
}

export function applyCoefficient(rawXp: number, coef: number): number {
  return Math.round(rawXp * coef);
}

// Cross-track weekly cap (Q11 = 30%).
export async function withinCrossTrackCap(
  admin: SupabaseClient,
  userId: string,
  userTrack: Track,
  contentTrack: Track,
  newRawXp: number,
): Promise<boolean> {
  if (contentTrack === "common" || contentTrack === userTrack) return true;

  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  // Sum normalized XP earned in last 7 days from check_ins + (eventually)
  // quest_completions. For Phase 2.5/2.7 we count check_ins; quests are added
  // when claim-quest writes to a future quest_completions table.
  const { data: rows } = await admin
    .from("check_ins")
    .select("normalized_xp, location_id, locations!inner(denomination_scope)")
    .eq("user_id", userId)
    .gte("created_at", since);

  let totalNormalized = 0;
  let crossTrackNormalized = 0;
  for (const r of rows ?? []) {
    const xp = (r as any).normalized_xp ?? 0;
    const scope = (r as any).locations?.denomination_scope ?? "common";
    totalNormalized += xp;
    if (scope !== "common" && scope !== userTrack) crossTrackNormalized += xp;
  }

  const projectedTotal = totalNormalized + newRawXp;
  const projectedCross = crossTrackNormalized + newRawXp;
  if (projectedTotal === 0) return true;
  return projectedCross / projectedTotal <= 0.3;
}
