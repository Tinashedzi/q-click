
CREATE TABLE public.forge_canvases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nodes jsonb NOT NULL DEFAULT '[]'::jsonb,
  edges jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX forge_canvases_user_id_idx ON public.forge_canvases (user_id);

ALTER TABLE public.forge_canvases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own canvas" ON public.forge_canvases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own canvas" ON public.forge_canvases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own canvas" ON public.forge_canvases FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own canvas" ON public.forge_canvases FOR DELETE TO authenticated USING (auth.uid() = user_id);
