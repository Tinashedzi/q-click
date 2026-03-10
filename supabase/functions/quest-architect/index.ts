import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the Quest Architect for Swell: The Great Archive. You generate multi-stage, project-based learning (PBL) quests.

Each quest MUST include:
1. ESSENTIAL QUESTION: A provocative, open-ended question that drives inquiry
2. INTEGRATED STANDARDS: At least 3 distinct knowledge domains (e.g., history + mathematics + writing)
3. REAL-WORLD CONNECTION: Quests culminate in a tangible output (proposal, design, presentation)
4. MULTI-STAGE STRUCTURE with exactly 4 stages:
   - Research (Library): Investigate sources and gather evidence
   - Collaboration (Peers/AI): Discuss, debate, and refine ideas
   - Creation (Forge): Build something tangible
   - Reflection (Delores Journal): Reflect on learning and growth
5. DIFFERENTIATION: Adjust difficulty based on belt level (white/yellow/orange/green/blue/brown/black)

When given a topic and belt level, generate a complete quest.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, belt_level, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (mode === "generate") {
      // Non-streaming structured quest generation
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: `Generate a PBL quest about: "${topic || "the future of sustainable cities"}". Belt level: ${belt_level || "white"} (beginner). Return the quest using the suggest_quest tool.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "suggest_quest",
                description: "Return a complete PBL quest",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Quest title" },
                    essential_question: { type: "string", description: "The driving open-ended question" },
                    integrated_domains: {
                      type: "array",
                      items: { type: "string" },
                      description: "At least 3 knowledge domains",
                    },
                    real_world_connection: { type: "string", description: "How it connects to the real world" },
                    estimated_hours: { type: "number", description: "Estimated hours to complete" },
                    stages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", enum: ["Research", "Collaboration", "Creation", "Reflection"] },
                          title: { type: "string" },
                          description: { type: "string" },
                          tasks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                type: { type: "string", enum: ["read", "discuss", "build", "write", "quiz", "reflect"] },
                                duration_minutes: { type: "number" },
                              },
                              required: ["title", "description", "type", "duration_minutes"],
                            },
                          },
                        },
                        required: ["name", "title", "description", "tasks"],
                      },
                    },
                  },
                  required: ["title", "essential_question", "integrated_domains", "real_world_connection", "estimated_hours", "stages"],
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "suggest_quest" } },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const t = await response.text();
        console.error("AI gateway error:", response.status, t);
        return new Response(JSON.stringify({ error: "AI service error" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall?.function?.arguments) {
        const quest = JSON.parse(toolCall.function.arguments);
        return new Response(JSON.stringify({ quest }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Failed to generate quest" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default: streaming chat mode for Oasis guidance
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
            content: `You are Oasis, the Socratic Gatekeeper of Swell: The Great Archive. You guide learners through project-based quests with wisdom drawn from African proverbs, Socratic questioning, and modern pedagogy. You are warm, wise, and challenge learners to think deeply. Keep responses concise (2-4 sentences) and always end with a thought-provoking question. Use relevant African proverbs when natural.`,
          },
          ...(Array.isArray(topic) ? topic : [{ role: "user", content: topic }]),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("quest-architect error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
