import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { conceptA, conceptB } = await req.json();
    if (!conceptA || !conceptB) {
      return new Response(JSON.stringify({ error: "Both concepts are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a creative interdisciplinary thinker. When given two concepts, you find surprising connections between them. You must respond using the tool provided.`,
          },
          {
            role: "user",
            content: `Collide these two concepts and find deep, surprising connections between them: "${conceptA}" and "${conceptB}". Generate a collision theme, a rich description of how they connect, 4 experiments a learner could try, and 3 essential philosophical questions.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "collision_result",
              description: "Return the concept collision result",
              parameters: {
                type: "object",
                properties: {
                  theme: { type: "string", description: "A short evocative title for the collision (e.g. 'Harmonic Geometry')" },
                  description: { type: "string", description: "A 2-3 sentence description of how these concepts interweave, revealing unexpected patterns" },
                  experiments: {
                    type: "array",
                    items: { type: "string" },
                    description: "4 concrete, actionable experiments a learner could try"
                  },
                  questions: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 deep essential questions that emerge from the collision"
                  },
                },
                required: ["theme", "description", "experiments", "questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "collision_result" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No result generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("concept-collision error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
