CREATE TABLE public.quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Quest',
  essential_question text NOT NULL,
  integrated_domains text[] NOT NULL DEFAULT '{}',
  target_belt_level text NOT NULL DEFAULT 'white',
  estimated_hours numeric NOT NULL DEFAULT 2,
  status text NOT NULL DEFAULT 'active',
  stages jsonb NOT NULL DEFAULT '[]',
  real_world_connection text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quests" ON public.quests FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quests" ON public.quests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quests" ON public.quests FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quests" ON public.quests FOR DELETE TO authenticated USING (auth.uid() = user_id);