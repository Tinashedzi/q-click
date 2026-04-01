import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { lovable } from '@/integrations/lovable/index';

const ease = [0.22, 1, 0.36, 1] as const;

const Referral = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const code = params.get('code') || '';
  const [signingIn, setSigningIn] = useState(false);

  // Store referral code for post-signup redemption
  useEffect(() => {
    if (code) localStorage.setItem('qclick_referral_code', code);
  }, [code]);

  const handleSignUp = async () => {
    setSigningIn(true);
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (error) console.error('Sign in error:', error);
    setSigningIn(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 space-y-6 text-center shadow-xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
          className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto"
        >
          <Gift className="w-8 h-8 text-primary" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">You've been invited!</h1>
          <p className="text-sm text-muted-foreground">
            Someone thinks you'd love Q-Click — the AI-powered learning platform. Sign up and get <strong>2 bonus AI credits</strong> to explore.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 text-left">
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">AI-Powered Quests</p>
              <p className="text-xs text-muted-foreground">Personalised learning journeys across any subject</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 text-left">
            <Zap className="w-5 h-5 text-accent shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Forge Labs</p>
              <p className="text-xs text-muted-foreground">Create games, 3D worlds, concept maps & more</p>
            </div>
          </div>
        </div>

        {code && (
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground">Referral code</p>
            <p className="text-lg font-mono font-bold text-primary tracking-wider">{code}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Auto-applied on signup — you'll get 2 bonus credits</p>
          </div>
        )}

        <Button onClick={handleSignUp} disabled={signingIn} className="w-full gap-2 text-base py-6">
          <ArrowRight className="w-5 h-5" />
          {signingIn ? 'Redirecting…' : 'Join Q-Click Free'}
        </Button>

        <p className="text-[10px] text-muted-foreground">
          Already have an account?{' '}
          <button onClick={() => navigate('/')} className="text-primary underline">Sign in</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Referral;
