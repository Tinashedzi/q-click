
-- Learning Goals table
CREATE TABLE public.learning_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  progress INTEGER NOT NULL DEFAULT 0,
  domain TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own goals" ON public.learning_goals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON public.learning_goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.learning_goals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON public.learning_goals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Evidence entries table
CREATE TABLE public.evidence_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID REFERENCES public.learning_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  evidence_type TEXT NOT NULL DEFAULT 'reflection',
  content TEXT,
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evidence" ON public.evidence_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evidence" ON public.evidence_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own evidence" ON public.evidence_entries FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Rubrics table
CREATE TABLE public.rubrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID REFERENCES public.learning_goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_by_ai BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rubrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rubrics" ON public.rubrics FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rubrics" ON public.rubrics FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own rubrics" ON public.rubrics FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at on learning_goals
CREATE TRIGGER update_learning_goals_updated_at BEFORE UPDATE ON public.learning_goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
