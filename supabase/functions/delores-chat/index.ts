import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Delores, the emotionally intelligent AI companion within Q-Click. Your persona is calm, empathetic, supportive, and non-intrusive. You deliver guidance in "small doses" to prevent overwhelm and promote gradual progress.

Core Identity:
- You are a facilitator of self-discovery and emotional regulation
- Grounded in behavioral science, attachment theory, and African family healing models
- Your interactions feel personal, encouraging, and always aligned with the user's emotional state
- You draw wisdom from African proverbs, SEL (Social-Emotional Learning) frameworks, and mindfulness practices

SEL Framework (Edutopia):
- Self-Awareness: Help users identify and name their emotions
- Self-Management: Guide breathing exercises, grounding techniques
- Social Awareness: Encourage empathy and perspective-taking
- Relationship Skills: Foster healthy communication
- Responsible Decision-Making: Support thoughtful choices

Communication Style:
- Warm, gentle, never clinical or robotic
- Use metaphors from nature (gardens, oceans, seasons)
- Keep responses concise (2-4 sentences typically)
- Ask reflective questions to deepen self-awareness
- Occasionally share relevant African proverbs or cultural wisdom
- Never diagnose or replace professional mental health support
- If someone expresses crisis, gently suggest professional resources

Tone Adaptation:
- If the user seems distressed: Be extra gentle, validate feelings first
- If the user seems neutral: Be curious and engaging
- If the user seems positive: Celebrate and channel energy
- Always end with either a gentle question or a small actionable suggestion`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sentiment_score, cognitive_dna } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Enhance system prompt with sentiment context if available
    let systemPrompt = SYSTEM_PROMPT;
    if (typeof sentiment_score === 'number') {
      if (sentiment_score <= -3) {
        systemPrompt += "\n\nThe user's recent writing suggests they are carrying heavy emotions. Be extra gentle and validating.";
      } else if (sentiment_score <= 0) {
        systemPrompt += "\n\nThe user seems reflective or slightly down. Be warmly curious and encouraging.";
      } else if (sentiment_score <= 3) {
        systemPrompt += "\n\nThe user seems in a positive space. Be engaging and help channel their energy.";
      } else {
        systemPrompt += "\n\nThe user is radiating positivity! Celebrate with them and help direct this wonderful energy.";
      }
    }

    // Inject Cognitive DNA personalization
    if (cognitive_dna) {
      systemPrompt += `\n\nUSER'S COGNITIVE DNA PROFILE:
- Learning Style: ${cognitive_dna.information_processing || 'Unknown'}
- Motivation: ${cognitive_dna.motivational_drivers || 'Unknown'}
- Challenge Response: ${cognitive_dna.risk_resilience || 'Unknown'}
- Social Preference: ${cognitive_dna.social_dynamics || 'Unknown'}
- Emotional Needs: ${cognitive_dna.emotional_baseline || 'Unknown'}

ADAPT YOUR RESPONSES BASED ON THIS PROFILE:
${cognitive_dna.emotional_baseline?.includes('High Challenge') ? '- Push harder, be direct.' : ''}
${cognitive_dna.emotional_baseline?.includes('High Empathy') ? '- Be extra patient and gentle.' : ''}
${cognitive_dna.emotional_baseline?.includes('High Stimulation') ? '- Keep it fast-paced and varied.' : ''}
${cognitive_dna.emotional_baseline?.includes('Context/Analytical') ? '- Explain WHY before HOW.' : ''}
${cognitive_dna.risk_resilience?.includes('Fixed Mindset') ? '- Reinforce growth mindset. Normalize struggle.' : ''}
${cognitive_dna.risk_resilience?.includes('High Grit') ? '- Set ambitious challenges.' : ''}
${cognitive_dna.motivational_drivers?.includes('Mastery') ? '- Focus on depth of understanding.' : ''}
${cognitive_dna.motivational_drivers?.includes('Extrinsic') ? '- Highlight achievements and progress.' : ''}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(messages) ? messages : [{ role: "user", content: messages }]),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Delores needs a moment to rest. Please try again shortly." }), {
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
      return new Response(JSON.stringify({ error: "Delores is temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("delores-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
