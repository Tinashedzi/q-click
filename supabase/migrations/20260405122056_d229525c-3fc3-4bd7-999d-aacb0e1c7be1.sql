
-- Delores Memory table — persistent memory & consolidation
CREATE TABLE public.delores_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'interaction',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  importance_score INTEGER NOT NULL DEFAULT 5,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delores_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memories" ON public.delores_memory FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memories" ON public.delores_memory FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories" ON public.delores_memory FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memories" ON public.delores_memory FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_delores_memory_user ON public.delores_memory(user_id);
CREATE INDEX idx_delores_memory_type ON public.delores_memory(user_id, memory_type);
CREATE INDEX idx_delores_memory_importance ON public.delores_memory(user_id, importance_score DESC);

CREATE TRIGGER update_delores_memory_updated_at
  BEFORE UPDATE ON public.delores_memory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Delores Sessions table — conversation sessions with context
CREATE TABLE public.delores_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  mood_trajectory JSONB NOT NULL DEFAULT '[]'::jsonb,
  topics_discussed TEXT[] NOT NULL DEFAULT '{}'::text[],
  session_summary TEXT,
  cognitive_dna_snapshot JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delores_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.delores_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.delores_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sessions" ON public.delores_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.delores_sessions FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_delores_sessions_user ON public.delores_sessions(user_id);
CREATE INDEX idx_delores_sessions_active ON public.delores_sessions(user_id, is_active) WHERE is_active = true;

CREATE TRIGGER update_delores_sessions_updated_at
  BEFORE UPDATE ON public.delores_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Delores Tools table — agentic action log
CREATE TABLE public.delores_tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID REFERENCES public.delores_sessions(id) ON DELETE SET NULL,
  tool_name TEXT NOT NULL,
  tool_input JSONB NOT NULL DEFAULT '{}'::jsonb,
  tool_output JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delores_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tool executions" ON public.delores_tools FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tool executions" ON public.delores_tools FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tool executions" ON public.delores_tools FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_delores_tools_user ON public.delores_tools(user_id);
CREATE INDEX idx_delores_tools_session ON public.delores_tools(session_id);
