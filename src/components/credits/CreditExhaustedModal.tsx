import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Crown, Share2, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/contexts/CreditsContext';

interface CreditExhaustedModalProps {
  open: boolean;
  onClose: () => void;
}

const CreditExhaustedModal = ({ open, onClose }: CreditExhaustedModalProps) => {
  const navigate = useNavigate();
  const { credits } = useCredits();

  const shareApp = async () => {
    const text = `Join me on Q-Click! Use my referral code: ${credits.referral_code} to get 2 bonus AI credits 🎓✨`;
    if (navigator.share) {
      await navigator.share({ title: 'Q-Click', text, url: window.location.origin });
    } else {
      await navigator.clipboard.writeText(text);
      // toast handled by the caller
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-foreground/50 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 space-y-5 shadow-xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">AI Credits Exhausted</h2>
              <p className="text-sm text-muted-foreground">
                You've used all your daily AI credits. Here's how to get more:
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Wait for midnight</p>
                  <p className="text-xs text-muted-foreground">Your 5 daily credits replenish automatically</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <Crown className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Upgrade to Pro</p>
                  <p className="text-xs text-muted-foreground">Get 50 credits/day + 200 monthly bonus</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <Share2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Share & earn</p>
                  <p className="text-xs text-muted-foreground">Invite friends → earn 2 bonus credits each</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => { onClose(); navigate('/pricing'); }}
                className="flex-1 gap-2"
              >
                <Crown className="w-4 h-4" /> View Plans
              </Button>
              <Button
                variant="outline"
                onClick={shareApp}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" /> Share
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreditExhaustedModal;
