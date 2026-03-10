import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { goalTitle, goalDescription, domain } = await req.json();
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
            content: `You are an expert educational assessment designer. Generate rubrics for learning goals that are specific, measurable, and aligned with mastery-based progression. Each rubric should have 3-5 criteria, each with 4 levels: Beginning (1), Developing (2), Proficient (3), Mastery (4). Return structured data via tool call.`
          },
          {
            role: "user",
            content: `Generate a detailed assessment rubric for this learning goal:
Title: ${goalTitle}
Description: ${goalDescription || 'No additional description'}
Domain: ${domain || 'general'}

Create criteria that assess both understanding and application.`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_rubric",
              description: "Create a structured assessment rubric with criteria and level descriptors",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Rubric title" },
                  criteria: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        levels: {
                          type: "object",
                          properties: {
                            beginning: { type: "string" },
                            developing: { type: "string" },
                            proficient: { type: "string" },
                            mastery: { type: "string" }
                          },
                          required: ["beginning", "developing", "proficient", "mastery"]
                        }
                      },
                      required: ["name", "description", "levels"]
                    }
                  }
                },
                required: ["title", "criteria"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_rubric" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
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
    if (!toolCall) throw new Error("No tool call in response");

    const rubric = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(rubric), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-rubric error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
