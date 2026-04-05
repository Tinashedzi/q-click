/**
 * Delores Agent Engine — Client-side agent harness
 * Handles session management, tool result rendering, and memory context
 */

export type AgentState = 'idle' | 'listening' | 'thinking' | 'planning' | 'acting' | 'responding';

export interface ToolExecution {
  tool: string;
  args: Record<string, unknown>;
  success: boolean;
}

export interface AgentSession {
  id: string;
  startedAt: string;
  messageCount: number;
  toolsUsed: ToolExecution[];
  state: AgentState;
}

export interface MemoryContext {
  memories: Array<{
    id: string;
    memory_type: string;
    content: Record<string, unknown>;
    importance_score: number;
    tags: string[];
    created_at: string;
  }>;
  recent_sessions: Array<{
    id: string;
    session_summary: string;
    topics_discussed: string[];
    created_at: string;
  }>;
  total_sessions: number;
  memory_count: number;
}

// Map tool names to user-friendly descriptions and icons
export const TOOL_DISPLAY: Record<string, { label: string; emoji: string; actionVerb: string }> = {
  create_journal_entry: { label: 'Journal Entry', emoji: '📝', actionVerb: 'Created a journal entry' },
  trigger_mood_checkin: { label: 'Mood Check-in', emoji: '💛', actionVerb: 'Suggested a mood check-in' },
  recommend_quest: { label: 'Quest', emoji: '🧭', actionVerb: 'Recommended a quest' },
  start_meditation: { label: 'Meditation', emoji: '🧘', actionVerb: 'Suggested meditation' },
  set_learning_goal: { label: 'Learning Goal', emoji: '🎯', actionVerb: 'Set a learning goal' },
  store_insight: { label: 'Memory', emoji: '🧠', actionVerb: 'Remembered something about you' },
};

// Parse tool results from the X-Delores-Tools header
export function parseToolResults(header: string | null): ToolExecution[] {
  if (!header) return [];
  try {
    return JSON.parse(header);
  } catch {
    return [];
  }
}

// Get a friendly state description
export function getStateDescription(state: AgentState): string {
  switch (state) {
    case 'idle': return '';
    case 'listening': return 'Listening…';
    case 'thinking': return 'Delores is thinking…';
    case 'planning': return 'Delores is considering what to do…';
    case 'acting': return 'Delores is taking action…';
    case 'responding': return 'Delores is responding…';
  }
}
