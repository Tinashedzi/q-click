ALTER TABLE public.ai_credits ALTER COLUMN daily_credits SET DEFAULT 25;
UPDATE public.ai_credits SET daily_credits = 25;