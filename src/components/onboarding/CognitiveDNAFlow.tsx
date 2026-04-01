import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { PROBES, buildCognitiveDNA } from '@/engine/cognitive-profile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  onComplete: () => void;
}

const CognitiveDNAFlow = ({ onComplete }: Props) => {
  const { user } = useAuth();
  const [step, setStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSelect = useCallback(async (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (step < PROBES.length - 1) {
      setStep(s => s + 1);
    } else {
      // All done — build and save
      setSaving(true);
      const dna = buildCognitiveDNA(newAnswers);
      if (user) {
        await supabase
          .from('profiles')
          .update({
            preferences: { cognitive_dna: dna } as any,
          })
          .eq('user_id', user.id);
      }
      setTimeout(onComplete, 800);
    }
  }, [answers, step, user, onComplete]);

  const probe = step >= 0 ? PROBES[step] : null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center px-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Subtle ambient bg */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 40%, hsl(var(--primary) / 0.06), transparent)',
      }} />

      <AnimatePresence mode="wait">
        {step === -1 ? (
          /* ═══ INTRO ═══ */
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease }}
            className="relative z-10 max-w-sm text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Meet Deloris</h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">
              Before we begin, I'd love to understand how you think and learn.
            </p>
            <p className="text-xs text-muted-foreground/70 mb-8">
              Answer 5 quick questions so I can personalise your entire Q-Click experience.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStep(0)}
              className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-semibold shadow-md flex items-center gap-2 mx-auto"
            >
              Let's Begin <ChevronRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : saving ? (
          /* ═══ SAVING ═══ */
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <Sparkles className="w-16 h-16 text-primary" />
            </motion.div>
            <p className="text-lg font-semibold text-foreground">Building your Cognitive DNA…</p>
            <p className="text-xs text-muted-foreground mt-1">Personalising your experience</p>
          </motion.div>
        ) : probe ? (
          /* ═══ PROBE ═══ */
          <motion.div
            key={probe.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease }}
            className="relative z-10 w-full max-w-md"
          >
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {PROBES.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 rounded-full flex-1 transition-all duration-300',
                    i < step ? 'bg-primary' : i === step ? 'bg-primary/60' : 'bg-muted'
                  )}
                />
              ))}
            </div>

            <p className="text-[10px] uppercase tracking-widest text-primary font-semibold mb-2">{probe.dimension}</p>
            <h2 className="text-lg font-semibold text-foreground leading-snug mb-6">{probe.question}</h2>

            <div className="space-y-3">
              {probe.options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease }}
                  whileHover={{ y: -2, boxShadow: '0 4px 16px -4px hsl(var(--primary) / 0.12)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(i)}
                  className="w-full text-left px-4 py-3.5 rounded-2xl border border-border bg-background/80 backdrop-blur-xl hover:border-primary/30 transition-all"
                >
                  <p className="text-sm text-foreground leading-relaxed">{opt.text}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default CognitiveDNAFlow;
