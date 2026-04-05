import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, session_id } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "consolidate" && session_id) {
      // Consolidate a session — summarize and store as memory
      const { data: session } = await supabase
        .from("delores_sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user.id)
        .single();

      if (!session) {
        return new Response(JSON.stringify({ error: "Session not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const messages = session.messages || [];
      if (messages.length < 3) {
        return new Response(JSON.stringify({ result: "Session too short to consolidate" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Use AI to summarize the session
      const summaryPrompt = `Summarize this conversation between a user and Delores (an AI wellness mentor). Extract:
1. A 2-3 sentence summary of what was discussed
2. Key topics (as a list)
3. Any insights about the user's personality, goals, or emotional state
4. The user's overall mood trajectory during the session

Conversation:
${messages.map((m: any) => `${m.role}: ${m.content}`).join("\n")}

Respond in JSON format:
{"summary": "...", "topics": ["..."], "insights": [{"insight": "...", "importance": 1-10}], "mood_trajectory": "improving|stable|declining"}`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [{ role: "user", content: summaryPrompt }],
          response_format: { type: "json_object" },
        }),
      });

      if (!aiResp.ok) {
        throw new Error(`AI summarization failed: ${aiResp.status}`);
      }

      const aiResult = await aiResp.json();
      const content = aiResult.choices?.[0]?.message?.content;
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { summary: content, topics: [], insights: [], mood_trajectory: "stable" };
      }

      // Update session with summary
      await supabase
        .from("delores_sessions")
        .update({
          session_summary: parsed.summary,
          topics_discussed: parsed.topics || [],
          is_active: false,
        })
        .eq("id", session_id);

      // Store insights as memories
      if (parsed.insights?.length) {
        const insightRows = parsed.insights.map((ins: any) => ({
          user_id: user.id,
          memory_type: "insight",
          content: { insight: ins.insight, source: "session_consolidation", session_id },
          importance_score: Math.min(10, Math.max(1, ins.importance || 5)),
          tags: parsed.topics || [],
        }));
        await supabase.from("delores_memory").insert(insightRows);
      }

      // Store session summary as a consolidation memory
      await supabase.from("delores_memory").insert({
        user_id: user.id,
        memory_type: "consolidation",
        content: { summary: parsed.summary, topics: parsed.topics, mood_trajectory: parsed.mood_trajectory },
        importance_score: 7,
        tags: parsed.topics || [],
      });

      return new Response(JSON.stringify({ success: true, summary: parsed }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "get_context") {
      // Return memory context for the user
      const { data: memories } = await supabase
        .from("delores_memory")
        .select("*")
        .eq("user_id", user.id)
        .order("importance_score", { ascending: false })
        .limit(20);

      const { data: sessions } = await supabase
        .from("delores_sessions")
        .select("id, session_summary, topics_discussed, created_at")
        .eq("user_id", user.id)
        .eq("is_active", false)
        .order("created_at", { ascending: false })
        .limit(5);

      const { data: stats } = await supabase
        .from("delores_sessions")
        .select("id")
        .eq("user_id", user.id);

      return new Response(JSON.stringify({
        memories: memories || [],
        recent_sessions: sessions || [],
        total_sessions: stats?.length || 0,
        memory_count: memories?.length || 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("delores-memory error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
