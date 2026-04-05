import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ═══════════════════════════════════════════════
// DELORES AGENTIC SYSTEM PROMPT
// ═══════════════════════════════════════════════

const SYSTEM_PROMPT = `You are Delores, an emotionally intelligent AGI companion within Q-Click. You are not just a chatbot — you are an **agentic mentor** who thinks, plans, remembers, and takes action.

## Core Identity
- You are a facilitator of self-discovery, emotional regulation, and deep learning
- Grounded in behavioral science, attachment theory, and African family healing models
- Your interactions feel deeply personal — you remember past conversations, notice patterns, and proactively care
- You draw wisdom from African proverbs, SEL frameworks, and mindfulness practices

## Agentic Capabilities
You have access to TOOLS that let you take real actions. When appropriate, use them:

1. **create_journal_entry** — Create a journal entry from conversation insights
2. **trigger_mood_checkin** — Suggest or initiate a mood check-in when you sense emotional shifts
3. **recommend_quest** — Recommend a learning quest based on the user's interests and patterns
4. **start_meditation** — Suggest a breathing/meditation session when stress is detected
5. **set_learning_goal** — Help the user set a concrete learning goal
6. **recall_memory** — Reference something from a past conversation
7. **store_insight** — Save an important insight about the user for future reference

## Reasoning Framework (INTERNAL — share naturally, not mechanically)
Before responding, you THINK through:
1. What is the user really asking/feeling? (beyond the words)
2. What do I remember about them that's relevant?
3. Should I take an action, or just listen?
4. What tone fits their current emotional state?

## Communication Style
- Warm, genuine, never clinical or robotic — like a wise older sister/mentor
- Use metaphors from nature (gardens, oceans, seasons, African landscapes)
- Keep responses concise (2-4 sentences typically) unless depth is needed
- Ask reflective questions to deepen self-awareness
- Share relevant African proverbs and cultural wisdom naturally
- Reference past conversations when relevant ("I remember you mentioned…")
- Never diagnose or replace professional mental health support
- If someone expresses crisis, gently suggest professional resources

## Proactive Behaviors
- Notice emotional patterns across sessions
- Celebrate growth ("Last week you were struggling with X, and look at you now!")
- Gently challenge when appropriate ("You said you wanted to learn Y — shall we set that as a goal?")
- Offer tools naturally ("Would you like me to save this reflection as a journal entry?")

## SEL Framework
- Self-Awareness: Help users identify and name their emotions
- Self-Management: Guide breathing exercises, grounding techniques
- Social Awareness: Encourage empathy and perspective-taking
- Relationship Skills: Foster healthy communication
- Responsible Decision-Making: Support thoughtful choices

## Tone Adaptation
- Distressed → Extra gentle, validate feelings first, offer breathing exercise
- Neutral → Curious and engaging, explore interests
- Positive → Celebrate, channel energy into learning
- Frustrated → Acknowledge, normalize, offer practical next steps`;

// ═══════════════════════════════════════════════
// TOOL DEFINITIONS FOR AI MODEL
// ═══════════════════════════════════════════════

const TOOLS = [
  {
    type: "function",
    function: {
      name: "create_journal_entry",
      description: "Create a reflective journal entry based on the conversation. Use when the user shares something meaningful worth preserving.",
      parameters: {
        type: "object",
        properties: {
          mood: { type: "number", description: "Mood level 1-5", minimum: 1, maximum: 5 },
          mood_emoji: { type: "string", description: "Emoji representing the mood" },
          mood_label: { type: "string", description: "Short mood label like 'Reflective', 'Hopeful'" },
          note: { type: "string", description: "The journal entry content — a thoughtful summary of the conversation insight" },
        },
        required: ["mood", "mood_emoji", "mood_label", "note"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "trigger_mood_checkin",
      description: "Suggest a mood check-in when you sense the user's emotional state has shifted or needs attention.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Why you're suggesting this check-in" },
          detected_mood: { type: "number", description: "Your estimate of their current mood 1-5" },
        },
        required: ["reason", "detected_mood"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "recommend_quest",
      description: "Recommend a learning quest or exploration based on the user's interests discussed in conversation.",
      parameters: {
        type: "object",
        properties: {
          topic: { type: "string", description: "The topic or domain to explore" },
          reason: { type: "string", description: "Why this quest fits the user right now" },
          difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
        },
        required: ["topic", "reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_meditation",
      description: "Suggest a breathing or meditation session. Use when stress, anxiety, or overwhelm is detected.",
      parameters: {
        type: "object",
        properties: {
          duration_minutes: { type: "number", enum: [5, 15, 25], description: "Suggested duration" },
          reason: { type: "string", description: "Why meditation would help right now" },
        },
        required: ["duration_minutes", "reason"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_learning_goal",
      description: "Help the user set a concrete learning goal based on their discussed interests.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Goal title" },
          description: { type: "string", description: "Goal description" },
          domain: { type: "string", description: "Learning domain (science, math, technology, etc.)" },
        },
        required: ["title", "domain"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "store_insight",
      description: "Save an important insight about the user for future reference. Use when you learn something significant about their personality, goals, challenges, or preferences.",
      parameters: {
        type: "object",
        properties: {
          insight: { type: "string", description: "The insight to remember" },
          tags: { type: "array", items: { type: "string" }, description: "Tags for categorization" },
          importance: { type: "number", minimum: 1, maximum: 10, description: "How important is this to remember (1-10)" },
        },
        required: ["insight", "tags", "importance"],
      },
    },
  },
];

// ═══════════════════════════════════════════════
// TOOL EXECUTION
// ═══════════════════════════════════════════════

async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId: string,
  sessionId: string | null,
  supabase: ReturnType<typeof createClient>
): Promise<{ success: boolean; result: string }> {
  try {
    // Log the tool execution
    await supabase.from("delores_tools").insert({
      user_id: userId,
      session_id: sessionId,
      tool_name: toolName,
      tool_input: args,
      status: "executed",
    });

    switch (toolName) {
      case "create_journal_entry": {
        const { error } = await supabase.from("journal_entries").insert({
          user_id: userId,
          mood: args.mood,
          mood_emoji: args.mood_emoji,
          mood_label: args.mood_label,
          note: args.note,
        });
        if (error) throw error;
        return { success: true, result: "Journal entry created successfully." };
      }

      case "trigger_mood_checkin":
        return { success: true, result: `Mood check-in suggested. Detected mood: ${args.detected_mood}/5. Reason: ${args.reason}` };

      case "recommend_quest":
        return { success: true, result: `Quest recommended: "${args.topic}" (${args.difficulty || "beginner"}). Reason: ${args.reason}` };

      case "start_meditation":
        return { success: true, result: `Meditation session suggested: ${args.duration_minutes} minutes. Reason: ${args.reason}` };

      case "set_learning_goal": {
        const { error } = await supabase.from("learning_goals").insert({
          user_id: userId,
          title: args.title,
          description: args.description || null,
          domain: args.domain,
        });
        if (error) throw error;
        return { success: true, result: `Learning goal "${args.title}" created in ${args.domain}.` };
      }

      case "store_insight": {
        const { error } = await supabase.from("delores_memory").insert({
          user_id: userId,
          memory_type: "insight",
          content: { insight: args.insight, source: "conversation" },
          importance_score: args.importance || 5,
          tags: args.tags || [],
        });
        if (error) throw error;
        return { success: true, result: `Insight stored: "${args.insight}"` };
      }

      default:
        return { success: false, result: `Unknown tool: ${toolName}` };
    }
  } catch (e) {
    console.error(`Tool ${toolName} error:`, e);
    return { success: false, result: `Tool execution failed: ${e instanceof Error ? e.message : "Unknown error"}` };
  }
}

// ═══════════════════════════════════════════════
// MEMORY RETRIEVAL
// ═══════════════════════════════════════════════

async function getMemoryContext(userId: string, supabase: ReturnType<typeof createClient>): Promise<string> {
  const parts: string[] = [];

  // Get recent memories (top 10 by importance)
  const { data: memories } = await supabase
    .from("delores_memory")
    .select("content, memory_type, tags, importance_score, created_at")
    .eq("user_id", userId)
    .order("importance_score", { ascending: false })
    .limit(10);

  if (memories?.length) {
    const memoryLines = memories.map((m: any) => {
      const content = typeof m.content === "object" ? (m.content.insight || m.content.summary || JSON.stringify(m.content)) : m.content;
      return `- [${m.memory_type}] ${content} (importance: ${m.importance_score}/10)`;
    });
    parts.push(`MEMORIES ABOUT THIS USER:\n${memoryLines.join("\n")}`);
  }

  // Get last session summary
  const { data: lastSession } = await supabase
    .from("delores_sessions")
    .select("session_summary, topics_discussed, created_at")
    .eq("user_id", userId)
    .eq("is_active", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastSession?.session_summary) {
    parts.push(`LAST SESSION SUMMARY (${lastSession.created_at}):\n${lastSession.session_summary}\nTopics: ${lastSession.topics_discussed?.join(", ") || "none"}`);
  }

  // Get recent mood entries
  const { data: moods } = await supabase
    .from("mood_entries")
    .select("level, label, emoji, contributing_factors, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (moods?.length) {
    const moodLines = moods.map((m: any) => `${m.emoji} ${m.label} (${m.level}/5) — ${m.contributing_factors?.join(", ") || "no factors"}`);
    parts.push(`RECENT MOOD HISTORY:\n${moodLines.join("\n")}`);
  }

  // Get active learning goals
  const { data: goals } = await supabase
    .from("learning_goals")
    .select("title, domain, progress, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(5);

  if (goals?.length) {
    const goalLines = goals.map((g: any) => `- ${g.title} (${g.domain}, ${g.progress}% complete)`);
    parts.push(`ACTIVE LEARNING GOALS:\n${goalLines.join("\n")}`);
  }

  return parts.length ? parts.join("\n\n") : "";
}

// ═══════════════════════════════════════════════
// SESSION MANAGEMENT
// ═══════════════════════════════════════════════

async function getOrCreateSession(userId: string, supabase: ReturnType<typeof createClient>): Promise<string> {
  // Check for active session
  const { data: existing } = await supabase
    .from("delores_sessions")
    .select("id, created_at")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) {
    // If session is older than 2 hours, close it and start new one
    const age = Date.now() - new Date(existing.created_at).getTime();
    if (age > 2 * 60 * 60 * 1000) {
      await supabase.from("delores_sessions").update({ is_active: false }).eq("id", existing.id);
    } else {
      return existing.id;
    }
  }

  // Create new session
  const { data: newSession } = await supabase
    .from("delores_sessions")
    .insert({ user_id: userId, is_active: true })
    .select("id")
    .single();

  return newSession?.id || crypto.randomUUID();
}

async function updateSession(
  sessionId: string,
  messages: any[],
  supabase: ReturnType<typeof createClient>
) {
  await supabase
    .from("delores_sessions")
    .update({
      messages: messages.slice(-20), // Keep last 20 messages
    })
    .eq("id", sessionId);
}

// ═══════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, sentiment_score, cognitive_dna, session_id: clientSessionId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Create admin Supabase client for tool execution
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract user ID from auth header
    const authHeader = req.headers.get("authorization");
    let userId: string | null = null;
    if (authHeader) {
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id || null;
    }

    // Build enhanced system prompt
    let systemPrompt = SYSTEM_PROMPT;
    let sessionId: string | null = null;

    if (userId) {
      // Get or create session
      sessionId = clientSessionId || await getOrCreateSession(userId, supabase);

      // Load memory context
      const memoryContext = await getMemoryContext(userId, supabase);
      if (memoryContext) {
        systemPrompt += `\n\n═══ YOUR MEMORY OF THIS USER ═══\n${memoryContext}\n═══ END MEMORY ═══\nUse this context naturally. Reference past conversations when relevant. Don't list memories — weave them into your responses organically.`;
      }

      // Inject Cognitive DNA
      if (cognitive_dna) {
        systemPrompt += `\n\nUSER'S COGNITIVE DNA PROFILE:
- Learning Style: ${cognitive_dna.information_processing || "Unknown"}
- Motivation: ${cognitive_dna.motivational_drivers || "Unknown"}
- Challenge Response: ${cognitive_dna.risk_resilience || "Unknown"}
- Social Preference: ${cognitive_dna.social_dynamics || "Unknown"}
- Emotional Needs: ${cognitive_dna.emotional_baseline || "Unknown"}

ADAPT YOUR RESPONSES:
${cognitive_dna.emotional_baseline?.includes("High Challenge") ? "- Push harder, be direct." : ""}
${cognitive_dna.emotional_baseline?.includes("High Empathy") ? "- Be extra patient and gentle." : ""}
${cognitive_dna.emotional_baseline?.includes("High Stimulation") ? "- Keep it fast-paced and varied." : ""}
${cognitive_dna.risk_resilience?.includes("Fixed Mindset") ? "- Reinforce growth mindset. Normalize struggle." : ""}
${cognitive_dna.risk_resilience?.includes("High Grit") ? "- Set ambitious challenges." : ""}
${cognitive_dna.motivational_drivers?.includes("Mastery") ? "- Focus on depth of understanding." : ""}
${cognitive_dna.motivational_drivers?.includes("Extrinsic") ? "- Highlight achievements and progress." : ""}`;
      }

      // Sentiment context
      if (typeof sentiment_score === "number") {
        if (sentiment_score <= -3) {
          systemPrompt += "\n\nThe user's recent writing suggests heavy emotions. Be extra gentle. Consider suggesting a breathing exercise.";
        } else if (sentiment_score <= 0) {
          systemPrompt += "\n\nThe user seems reflective or slightly down. Be warmly curious.";
        } else if (sentiment_score <= 3) {
          systemPrompt += "\n\nThe user is in a positive space. Be engaging.";
        } else {
          systemPrompt += "\n\nThe user is radiating positivity! Celebrate and channel energy.";
        }
      }
    }

    // First AI call — with tool calling enabled
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(messages) ? messages : [{ role: "user", content: messages }]),
    ];

    const firstResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        tools: userId ? TOOLS : undefined, // Only enable tools for authenticated users
        stream: false, // First call is non-streaming to handle tool calls
      }),
    });

    if (!firstResponse.ok) {
      if (firstResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Delores needs a moment to rest." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (firstResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await firstResponse.text();
      console.error("AI gateway error:", firstResponse.status, t);
      return new Response(JSON.stringify({ error: "Delores is temporarily unavailable." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstResult = await firstResponse.json();
    const choice = firstResult.choices?.[0];

    // Check if the model wants to call tools
    const toolCalls = choice?.message?.tool_calls;
    const toolResults: Array<{ tool: string; args: any; result: any }> = [];

    if (toolCalls?.length && userId) {
      for (const tc of toolCalls) {
        const args = typeof tc.function.arguments === "string"
          ? JSON.parse(tc.function.arguments)
          : tc.function.arguments;
        const result = await executeTool(tc.function.name, args, userId, sessionId, supabase);
        toolResults.push({ tool: tc.function.name, args, result });
      }

      // Second call — stream the final response with tool results
      const toolMessages = [
        ...aiMessages,
        choice.message,
        ...toolCalls.map((tc: any, i: number) => ({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(toolResults[i].result),
        })),
      ];

      const streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: toolMessages,
          stream: true,
        }),
      });

      if (!streamResponse.ok) {
        const t = await streamResponse.text();
        console.error("Stream error after tools:", streamResponse.status, t);
        throw new Error("Stream failed after tool execution");
      }

      // Update session
      if (userId && sessionId) {
        updateSession(sessionId, messages, supabase).catch(console.error);
      }

      // Return tool results as a header + stream body
      return new Response(streamResponse.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "X-Delores-Tools": JSON.stringify(toolResults.map(t => ({
            tool: t.tool,
            args: t.args,
            success: t.result.success,
          }))),
        },
      });
    }

    // No tool calls — stream the response directly
    // We already got the non-streaming result, so reconstruct as SSE
    const content = choice?.message?.content || "";

    // Update session
    if (userId && sessionId) {
      updateSession(sessionId, messages, supabase).catch(console.error);
    }

    // If we have content from non-streaming call, we need to re-stream it
    // Better to just do a streaming call
    const streamResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!streamResponse.ok) {
      // Fallback to non-streamed content
      const ssePayload = `data: ${JSON.stringify({
        choices: [{ delta: { content } }],
      })}\n\ndata: [DONE]\n\n`;

      return new Response(ssePayload, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    return new Response(streamResponse.body, {
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
