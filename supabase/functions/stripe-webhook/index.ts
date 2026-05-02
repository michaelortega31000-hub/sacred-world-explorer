// Phase 2.12 — Stripe webhook receiver.
// Handles checkout.session.completed and customer.subscription.* events.
// MUST be deployed with verify_jwt = false (Stripe signs the request itself).
//
// Required secrets:
//   STRIPE_SECRET_KEY        sk_...
//   STRIPE_WEBHOOK_SECRET    whsec_...

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "stripe-signature, content-type",
};

// Lightweight HMAC-SHA256 signature verification matching Stripe's scheme:
// header is `t=<ts>,v1=<sig>`, signed_payload = `${ts}.${rawBody}`.
async function verifyStripeSig(rawBody: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=").map((s) => s.trim())) as [string, string][],
  );
  const ts = parts.t;
  const sig = parts.v1;
  if (!ts || !sig) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign("HMAC", key, enc.encode(`${ts}.${rawBody}`));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === sig;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  const rawBody = await req.text();
  const sigHeader = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) return new Response("Webhook secret missing", { status: 500 });

  if (!(await verifyStripeSig(rawBody, sigHeader, webhookSecret))) {
    return new Response("Bad signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        const userId = s.client_reference_id || s.metadata?.user_id;
        if (!userId) break;
        await admin.from("user_subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: s.customer,
            stripe_subscription_id: s.subscription,
            subscription_tier: "premium",
            status: "active",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );
        await admin.from("profiles").update({ stripe_customer_id: s.customer }).eq("id", userId);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await admin
          .from("user_subscriptions")
          .update({
            status: sub.status,
            subscription_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }
      default:
        // Ignore other event types.
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-webhook handler error", e);
    return new Response("Internal Error", { status: 500 });
  }
});
