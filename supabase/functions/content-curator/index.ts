import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { youtube_url, youtube_id, title, channel_name, description } = await req.json();

    const videoId = youtube_id || extractYouTubeId(youtube_url);
    if (!videoId) {
      return new Response(JSON.stringify({ error: "youtube_id or youtube_url required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Use AI to extract metadata
    const prompt = `You are an educational content curator for a STEM learning platform called Q-Click.

Given this video information:
- Title: "${title || "Unknown"}"
- Channel: "${channel_name || "Unknown"}"
- Description: "${(description || "").slice(0, 500)}"

Analyze and return a JSON object with these fields:
- stem_domain: one of "Science", "Technology", "Engineering", "Mathematics", "Arts", "Humanities", "Social Sciences", "Health", "General"
- stem_subdomain: specific subdomain (e.g., "Physics", "Computer Science", "Biology")
- stem_topic: specific topic (e.g., "Quantum Mechanics", "Machine Learning", "Genetics")
- difficulty_level: one of "beginner", "intermediate", "advanced"
- ai_summary: 2-3 sentence educational summary of this content
- ai_keywords: array of 5-8 relevant keywords
- ai_quality_score: 1-100 based on educational value (consider: depth, accuracy signals, production quality)

Return ONLY valid JSON, no markdown.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        tools: [
          {
            type: "function",
            function: {
              name: "curate_video",
              description: "Extract educational metadata from video information",
              parameters: {
                type: "object",
                properties: {
                  stem_domain: { type: "string" },
                  stem_subdomain: { type: "string" },
                  stem_topic: { type: "string" },
                  difficulty_level: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
                  ai_summary: { type: "string" },
                  ai_keywords: { type: "array", items: { type: "string" } },
                  ai_quality_score: { type: "number" },
                },
                required: ["stem_domain", "stem_subdomain", "stem_topic", "difficulty_level", "ai_summary", "ai_keywords", "ai_quality_score"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "curate_video" } },
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    let metadata;
    
    if (toolCall) {
      metadata = JSON.parse(toolCall.function.arguments);
    } else {
      // Fallback: try parsing content as JSON
      const content = aiData.choices?.[0]?.message?.content || "{}";
      metadata = JSON.parse(content.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
    }

    // Store in database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.from("video_content").upsert(
      {
        youtube_id: videoId,
        title: title || "Untitled",
        description,
        channel_name,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        stem_domain: metadata.stem_domain,
        stem_subdomain: metadata.stem_subdomain,
        stem_topic: metadata.stem_topic,
        difficulty_level: metadata.difficulty_level,
        ai_summary: metadata.ai_summary,
        ai_keywords: metadata.ai_keywords,
        ai_quality_score: metadata.ai_quality_score,
        is_curated: true,
      },
      { onConflict: "youtube_id" }
    ).select().single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-curator error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}
