
CREATE TABLE public.video_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL,
  channel_name TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  stem_domain TEXT NOT NULL DEFAULT 'general',
  stem_subdomain TEXT,
  stem_topic TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  ai_summary TEXT,
  ai_keywords TEXT[] DEFAULT '{}'::TEXT[],
  ai_quality_score INTEGER,
  view_count INTEGER DEFAULT 0,
  is_curated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  added_by UUID REFERENCES auth.users(id),
  UNIQUE(youtube_id)
);

ALTER TABLE public.video_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view video content"
  ON public.video_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert video content"
  ON public.video_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = added_by);

ALTER PUBLICATION supabase_realtime ADD TABLE public.video_content;
