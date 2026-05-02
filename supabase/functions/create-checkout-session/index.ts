// Phase 2.12 — Stripe Checkout session creator.
// Returns a Stripe-hosted checkout URL for the requested price_id.
// Webhook (stripe-webhook) handles subscription lifecycle.
//
// Required secrets (Supabase Edge Function secrets):
//   STRIPE_SECRET_KEY            sk_...
//   STRIPE_SUCCESS_URL           https://your-app/...?checkout=success
//   STRIPE_CANCEL_URL            https://your-app/...?checkout=cancel

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const { data: claims } = await supabaseAuth.auth.getClaims(authHeader.replace("Bearer ", ""));
    const userId = claims?.claims?.sub as string | undefined;
    if (!userId) return json({ error: "Unauthorized" }, 401);

    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      return json({ error: "Stripe non configuré", code: "stripe_unconfigured" }, 503);
    }

    const { price_id } = await req.json();
    if (!price_id) return json({ error: "price_id required" }, 400);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Look up an existing customer for this user.
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_customer_id, username")
      .eq("id", userId)
      .maybeSingle();

    const successUrl = Deno.env.get("STRIPE_SUCCESS_URL") ?? "https://example.com/?checkout=success";
    const cancelUrl = Deno.env.get("STRIPE_CANCEL_URL") ?? "https://example.com/?checkout=cancel";

    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("line_items[0][price]", price_id);
    params.set("line_items[0][quantity]", "1");
    params.set("success_url", successUrl);
    params.set("cancel_url", cancelUrl);
    params.set("client_reference_id", userId);
    if (profile?.stripe_customer_id) {
      params.set("customer", profile.stripe_customer_id as string);
    }
    params.set("metadata[user_id]", userId);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("stripe error", data);
      return json({ error: data.error?.message ?? "Stripe failed" }, 500);
    }

    return json({ url: data.url, session_id: data.id });
  } catch (e) {
    console.error("create-checkout-session unhandled", e);
    return json({ error: "internal_error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
