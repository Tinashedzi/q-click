import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- HARNESS TYPES ---
enum ToolType {
  READ_ONLY = "read_only",
  MUTATING = "mutating",
  DESTRUCTIVE = "destructive",
}

interface PermissionRule {
  toolName: string;
  autoApprove: boolean;
  wildcardPattern?: string;
}

// --- VOICE HARNESS LOGIC ---
class DeloresVoiceHarness {
  private rules: Map<string, PermissionRule> = new Map();

  constructor() {
    this.rules.set("git_reset", { toolName: "git_reset", autoApprove: false });
    this.rules.set("read_docs", { toolName: "read_docs", autoApprove: true });
  }

  async processIntent(userInput: string) {
    let plan = "standard_conversational_response";
    let requiresApproval = false;

    if (userInput.toLowerCase().includes("reset") || userInput.toLowerCase().includes("delete")) {
      plan = "restricted_action_mitigation";
      requiresApproval = true;
    } else if (userInput.toLowerCase().includes("analyze") || userInput.toLowerCase().includes("check")) {
      plan = "data_analysis_and_retrieval";
    }

    return { plan, requiresApproval };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Not authenticated");

    const { transcript, session_id } = await req.json();
    if (!transcript) throw new Error("No transcript provided");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI API key not configured");

    const harness = new DeloresVoiceHarness();
    const { plan, requiresApproval } = await harness.processIntent(transcript);

    // Call AI via Lovable AI Gateway
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are Delores, a voice-first AGI mentor for young learners on Q-Click.
Execution Plan: ${plan}.
Constraints: ${requiresApproval ? 'Action requires user confirmation before proceeding.' : 'No restrictions.'}
Keep responses natural, empathetic, warm, and concise for text-to-speech playback.
Never use markdown formatting, bullet points, or special characters — speak naturally as if talking to a friend.`,
          },
          { role: "user", content: transcript },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", errText);
      throw new Error("AI service unavailable");
    }

    const aiData = await aiResponse.json();
    const deloresSpeech = aiData.choices?.[0]?.message?.content || "I'm here for you. Could you say that again?";

    // Log to Memory Consolidation Engine
    await supabase.from("delores_memory").insert({
      user_id: user.id,
      memory_type: "voice_interaction",
      content: { plan, transcript, response: deloresSpeech },
      importance_score: requiresApproval ? 8 : 3,
      tags: ["voice", plan],
    });

    return new Response(JSON.stringify({
      text: deloresSpeech,
      plan,
      requires_approval: requiresApproval,
      voice_settings: { rate: 1.0, pitch: 0.9 },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Voice Harness Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
