
-- AI Credits table
CREATE TABLE public.ai_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  daily_credits integer NOT NULL DEFAULT 5,
  daily_used integer NOT NULL DEFAULT 0,
  monthly_bonus integer NOT NULL DEFAULT 0,
  monthly_used integer NOT NULL DEFAULT 0,
  referral_credits integer NOT NULL DEFAULT 0,
  last_reset_date date NOT NULL DEFAULT CURRENT_DATE,
  total_referrals integer NOT NULL DEFAULT 0,
  referral_code text NOT NULL DEFAULT encode(gen_random_bytes(4), 'hex'),
  referred_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Unique referral codes
CREATE UNIQUE INDEX idx_ai_credits_referral_code ON public.ai_credits(referral_code);

-- RLS
ALTER TABLE public.ai_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits" ON public.ai_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credits" ON public.ai_credits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credits" ON public.ai_credits FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Auto-create credits row for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.ai_credits (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_credits();
