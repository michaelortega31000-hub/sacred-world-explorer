// Per-user rate limiter backed by security_logs.
// Hits log a `rate_limit_exceeded` event, which feeds into check_and_ban_user.
//
// Usage inside an edge function (after Supabase has verified the JWT):
//   const limited = await enforceRateLimit(supabaseAdmin, user.id, 'sacred-assistant', 30, 60);
//   if (limited) return new Response('Too many requests', { status: 429, headers: corsHeaders });

import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function enforceRateLimit(
  admin: SupabaseClient,
  userId: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

  const { count, error } = await admin
    .from("security_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("endpoint", endpoint)
    .eq("event_type", "endpoint_request")
    .gte("created_at", since);

  if (error) {
    console.error("rate-limit count error", error);
    // fail-open on infra error so we don't lock everyone out
    return false;
  }

  if ((count ?? 0) >= maxRequests) {
    await admin.from("security_logs").insert({
      user_id: userId,
      event_type: "rate_limit_exceeded",
      severity: "medium",
      action: "denied",
      endpoint,
      status_code: 429,
      details: { max: maxRequests, window_s: windowSeconds, observed: count },
    });
    return true;
  }

  // record this request for future window queries
  await admin.from("security_logs").insert({
    user_id: userId,
    event_type: "endpoint_request",
    severity: "low",
    action: "allowed",
    endpoint,
    status_code: 200,
  });

  return false;
}
