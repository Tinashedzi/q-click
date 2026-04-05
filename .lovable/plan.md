
# Delores Agentic Upgrade — "Love Code" Architecture

## Phase 1: Database Schema (New Tables)

### `delores_memory` — Persistent conversation memory & consolidation
- `user_id`, `memory_type` (interaction | consolidation | insight), `content` (JSONB), `importance_score` (1-10), `tags` (text[]), `expires_at` (nullable)
- Stores conversation summaries, user preferences learned over time, emotional patterns
- RLS: users can only access their own memories

### `delores_sessions` — Conversation sessions with context
- `user_id`, `session_id`, `messages` (JSONB), `mood_trajectory` (JSONB), `topics_discussed` (text[]), `session_summary` (text), `cognitive_dna_snapshot` (JSONB)
- Enables Delores to remember past conversations and reference them
- RLS: users can only access their own sessions

### `delores_tools` — Tool execution log (agentic actions Delores takes)
- `user_id`, `session_id`, `tool_name`, `input` (JSONB), `output` (JSONB), `status` (pending | approved | executed | rejected), `requires_approval` (boolean)
- Tracks what Delores does on behalf of the user (e.g., creating journal entries, setting goals, recommending quests)

## Phase 2: Edge Function Upgrades

### Upgrade `delores-chat` to agentic mode
- **Memory injection**: Load recent memories and session context into system prompt
- **Tool calling**: Enable Delores to call tools (create journal entries, set mood check-ins, recommend quests, trigger breathing exercises, look up concepts)
- **Reasoning framework**: Before responding, Delores states her plan internally (collaborative reasoning pattern from your code)
- **Memory consolidation**: After N messages, auto-summarize and store as a memory

### New `delores-memory` edge function
- Consolidate old interactions into summaries ("Dream Mode")
- Extract recurring emotional patterns and insights
- Score memory importance for retrieval ranking

## Phase 3: Frontend — Agentic Chat UI

### Upgrade `DeloresChat.tsx`
- Show when Delores is "thinking" / "planning" / "taking action" (not just typing)
- Render tool-call results inline (e.g., "I've created a journal entry for you ✅")
- Session awareness: "Last time we talked about X…"
- Proactive suggestions based on memory ("You mentioned stress about exams last week — how did that go?")

### New: `AgentStatusBar` component
- Shows Delores's current state: Listening → Thinking → Planning → Acting → Responding
- Memory indicator: "Delores remembers 47 conversations with you"

## Phase 4: Agentic Tool Capabilities

Delores can autonomously (with user awareness):
1. **Create journal entries** from conversation insights
2. **Trigger mood check-ins** when she detects emotional shifts
3. **Recommend specific quests** based on learning patterns
4. **Start meditation sessions** when stress is detected
5. **Reference past conversations** ("Remember when you told me about…")
6. **Set learning goals** based on discussed interests
7. **Provide personalized wisdom** from her memory of the user

## Files to Create/Modify:
- **Migration**: New tables (`delores_memory`, `delores_sessions`, `delores_tools`)
- **Modify**: `supabase/functions/delores-chat/index.ts` (agentic upgrade)
- **New**: `supabase/functions/delores-memory/index.ts` (memory consolidation)
- **Modify**: `src/components/delores/DeloresChat.tsx` (agentic UI)
- **New**: `src/components/delores/AgentStatusBar.tsx`
- **New**: `src/engine/delores-agent.ts` (client-side agent harness)
