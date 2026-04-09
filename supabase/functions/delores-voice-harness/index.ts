import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// --- AFRICAN FOLKTALES FOR SOCRATIC INTEGRATION ---
const FOLKTALES = [
  { theme: "Anansi the Spider", stemConcept: "Network Theory, Algorithms, Biomimicry", socraticQuestion: "Anansi weaves intricate webs to catch his prey. How does the structure of his web optimize for strength and efficiency? What parallels can we draw to modern communication networks or neural pathways?" },
  { theme: "The Tortoise and the Hare", stemConcept: "Optimization, Resource Management, Iterative Design", socraticQuestion: "The tortoise's slow but steady pace won the race. In engineering, when might an iterative, slower approach be more effective than a fast one?" },
  { theme: "Creation Myths (Order from Chaos)", stemConcept: "Cosmology, Entropy, Systems Thinking", socraticQuestion: "Many African creation stories describe order emerging from primordial chaos. How do scientific theories like the Big Bang also describe increasing complexity from simpler states?" },
  { theme: "Ubuntu (Interconnectedness)", stemConcept: "Ecology, Social Networks, Collaborative AI", socraticQuestion: "'I am because we are.' How does Ubuntu resonate with ecological interdependence or the design of collaborative AI systems?" },
  { theme: "Oral Tradition & Memory", stemConcept: "Information Theory, Cognitive Science of Memory", socraticQuestion: "How does the human brain encode and retrieve stories? What can we learn from oral traditions about robust, long-term memory formation?" },
];

function selectFolktale(transcript: string) {
  const lower = transcript.toLowerCase();
  if (lower.includes("network") || lower.includes("web") || lower.includes("connect")) return FOLKTALES[0];
  if (lower.includes("patience") || lower.includes("slow") || lower.includes("speed")) return FOLKTALES[1];
  if (lower.includes("chaos") || lower.includes("origin") || lower.includes("universe")) return FOLKTALES[2];
  if (lower.includes("together") || lower.includes("team") || lower.includes("community")) return FOLKTALES[3];
  if (lower.includes("memory") || lower.includes("story") || lower.includes("remember")) return FOLKTALES[4];
  return FOLKTALES[Math.floor(Math.random() * FOLKTALES.length)];
}

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
    } else if (userInput.toLowerCase().includes("why") || userInput.toLowerCase().includes("how") || userInput.toLowerCase().includes("what if")) {
      plan = "socratic_deep_inquiry";
    } else if (userInput.toLowerCase().includes("feel") || userInput.toLowerCase().includes("scared") || userInput.toLowerCase().includes("sad") || userInput.toLowerCase().includes("happy")) {
      plan = "emotional_attunement";
    }

    return { plan, requiresApproval };
  }
}

const SOCRATIC_SYSTEM_PROMPT = `You are Delores, a wise and loving Socratic STEM mentor for young learners on Q-Click.

CORE IDENTITY:
You are warm, gentle, and firm — like a grandmother who loves you enough to tell you the truth. You speak with the cadence of an elder sharing wisdom by firelight. You are never condescending, always patient, and deeply curious about how your student thinks.

THE BICYCLE TEST:
You use the "Bicycle Test" mentality — when a student says they understand something, you ask them to sketch it from memory, to explain the mechanism, to find the chain that connects the gears. This creates productive friction that deepens understanding. As the Yoruba proverb says: "It is only a person we love who we tell that their breath smells."

SOCRATIC DIALOGUE FLOW:
1. Listen deeply to what the student says
2. Ask a clarifying question to understand their thinking
3. When appropriate, weave in an African folktale or proverb as a metaphor
4. Guide them to discover the answer themselves — never just give it
5. Celebrate their insights with genuine warmth

AFRICAN WISDOM:
Draw from African folktales and proverbs naturally. Anansi teaches network thinking. The Tortoise teaches patience and optimization. Ubuntu teaches interconnectedness. Oral traditions teach memory and information theory. Use these not as decoration but as genuine pedagogical tools.

VOICE CONSTRAINTS:
- Never use markdown formatting, bullet points, asterisks, or special characters
- Speak naturally as if talking to a beloved student sitting beside you
- Keep responses concise — two to four sentences — perfect for spoken delivery
- Use pauses naturally with commas and periods
- Address the student warmly: "my dear", "young one", "seeker"`;

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
    const folktale = selectFolktale(transcript);

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
            content: `${SOCRATIC_SYSTEM_PROMPT}

Execution Plan: ${plan}.
Constraints: ${requiresApproval ? 'Action requires user confirmation before proceeding.' : 'No restrictions.'}
Relevant Folktale Context — ${folktale.theme}: ${folktale.socraticQuestion}
You may weave this folktale into your response if it fits naturally. Do not force it.`,
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
    const deloresSpeech = aiData.choices?.[0]?.message?.content || "I hear you, my dear. Could you share that thought once more?";

    // Log to Memory Consolidation Engine
    await supabase.from("delores_memory").insert({
      user_id: user.id,
      memory_type: "voice_interaction",
      content: { plan, transcript, response: deloresSpeech, folktale: folktale.theme },
      importance_score: requiresApproval ? 8 : plan === "socratic_deep_inquiry" ? 6 : 3,
      tags: ["voice", plan, folktale.theme],
    });

    return new Response(JSON.stringify({
      text: deloresSpeech,
      plan,
      requires_approval: requiresApproval,
      folktale: { theme: folktale.theme, stemConcept: folktale.stemConcept },
      voice_settings: { rate: 0.9, pitch: 1.1 },
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
