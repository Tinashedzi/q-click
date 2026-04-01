import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Missing signature or secret" }), { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    console.error("Webhook signature verification failed:", msg);
    return new Response(JSON.stringify({ error: `Webhook Error: ${msg}` }), { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only process credit pack purchases (mode=payment with credits metadata)
    if (session.mode === "payment" && session.metadata?.credits) {
      const userId = session.metadata.user_id;
      const creditsToAdd = parseInt(session.metadata.credits, 10);

      if (!userId || isNaN(creditsToAdd)) {
        console.error("Invalid metadata", session.metadata);
        return new Response(JSON.stringify({ error: "Invalid metadata" }), { status: 400 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Add purchased credits to referral_credits (bonus pool)
      const { data: current, error: fetchErr } = await supabase
        .from("ai_credits")
        .select("referral_credits")
        .eq("user_id", userId)
        .single();

      if (fetchErr) {
        console.error("Failed to fetch credits:", fetchErr);
        return new Response(JSON.stringify({ error: "DB fetch error" }), { status: 500 });
      }

      const { error: updateErr } = await supabase
        .from("ai_credits")
        .update({ referral_credits: (current?.referral_credits || 0) + creditsToAdd })
        .eq("user_id", userId);

      if (updateErr) {
        console.error("Failed to update credits:", updateErr);
        return new Response(JSON.stringify({ error: "DB update error" }), { status: 500 });
      }

      console.log(`Added ${creditsToAdd} credits to user ${userId}`);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
