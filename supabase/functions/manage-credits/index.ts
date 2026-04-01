import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { action, referral_code } = await req.json();

    // Get or create credits row
    let { data: credits } = await supabase
      .from("ai_credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!credits) {
      await supabase.from("ai_credits").insert({ user_id: user.id });
      const r = await supabase.from("ai_credits").select("*").eq("user_id", user.id).single();
      credits = r.data;
    }
    if (!credits) throw new Error("Failed to get credits");

    const today = new Date().toISOString().split("T")[0];

    // Reset daily credits at midnight
    if (credits.last_reset_date !== today) {
      credits.daily_used = 0;
      credits.last_reset_date = today;
      await supabase.from("ai_credits").update({
        daily_used: 0,
        last_reset_date: today,
      }).eq("user_id", user.id);
    }

    if (action === "check") {
      const remaining = (credits.daily_credits - credits.daily_used)
        + (credits.monthly_bonus - credits.monthly_used)
        + credits.referral_credits;
      return new Response(JSON.stringify({
        daily_credits: credits.daily_credits,
        daily_used: credits.daily_used,
        monthly_bonus: credits.monthly_bonus,
        monthly_used: credits.monthly_used,
        referral_credits: credits.referral_credits,
        remaining,
        referral_code: credits.referral_code,
        total_referrals: credits.total_referrals,
        resets_at: "midnight",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "deduct") {
      const dailyRemaining = credits.daily_credits - credits.daily_used;
      const monthlyRemaining = credits.monthly_bonus - credits.monthly_used;
      const totalRemaining = dailyRemaining + monthlyRemaining + credits.referral_credits;

      if (totalRemaining <= 0) {
        return new Response(JSON.stringify({
          error: "insufficient_credits",
          message: "You've used all your AI credits. Upgrade your plan or wait until midnight for daily credits to replenish.",
          remaining: 0,
        }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Deduct from daily first, then monthly, then referral
      const updates: Record<string, number> = {};
      if (dailyRemaining > 0) {
        updates.daily_used = credits.daily_used + 1;
      } else if (monthlyRemaining > 0) {
        updates.monthly_used = credits.monthly_used + 1;
      } else {
        updates.referral_credits = credits.referral_credits - 1;
      }

      await supabase.from("ai_credits").update(updates).eq("user_id", user.id);

      const newRemaining = totalRemaining - 1;
      return new Response(JSON.stringify({
        success: true,
        remaining: newRemaining,
        low_credits: newRemaining <= 2,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "redeem_referral" && referral_code) {
      // Find the referrer
      const { data: referrer } = await supabase
        .from("ai_credits")
        .select("user_id, referral_credits, total_referrals, monthly_bonus")
        .eq("referral_code", referral_code)
        .single();

      if (!referrer) {
        return new Response(JSON.stringify({ error: "Invalid referral code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (referrer.user_id === user.id) {
        return new Response(JSON.stringify({ error: "Cannot use your own code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (credits.referred_by) {
        return new Response(JSON.stringify({ error: "Already redeemed a referral code" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Give referrer bonus (2 credits, 4 if paid)
      const referrerBonus = referrer.monthly_bonus > 0 ? 4 : 2;
      await supabase.from("ai_credits").update({
        referral_credits: referrer.referral_credits + referrerBonus,
        total_referrals: referrer.total_referrals + 1,
      }).eq("user_id", referrer.user_id);

      // Give new user bonus (2 credits)
      await supabase.from("ai_credits").update({
        referral_credits: credits.referral_credits + 2,
        referred_by: referrer.user_id,
      }).eq("user_id", user.id);

      return new Response(JSON.stringify({ success: true, bonus: 2 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("manage-credits error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
