import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic } = await req.json();
    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
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
            content: `You are a multilingual concept architect specializing in African languages and cross-cultural knowledge. Given a topic, produce a deep conceptual analysis with translations across English, Shona, Xhosa, Afrikaans, and Tswana. Provide authentic translations with correct pronunciation guides. You must respond using the tool provided.`,
          },
          {
            role: "user",
            content: `Create a deep concept analysis for: "${topic}". Include the universal meaning, translations in 5 languages (English, Shona, Xhosa, Afrikaans, Tswana) with pronunciation, 3 culturally rich example sentences, and 4-6 related concepts.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "concept_result",
              description: "Return the deep concept analysis",
              parameters: {
                type: "object",
                properties: {
                  universalMeaning: { type: "string", description: "A poetic, cross-cultural definition of the concept's essence" },
                  translations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        lang: { type: "string" },
                        word: { type: "string" },
                        pronunciation: { type: "string" },
                      },
                      required: ["lang", "word", "pronunciation"],
                      additionalProperties: false,
                    },
                  },
                  examples: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 culturally rich example sentences using the concept",
                  },
                  related: {
                    type: "array",
                    items: { type: "string" },
                    description: "4-6 related concepts",
                  },
                },
                required: ["universalMeaning", "translations", "examples", "related"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "concept_result" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No result generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("concept-forge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
