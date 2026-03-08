import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  body: string;
  emoji: string;
  position: 'top' | 'bottom';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'cognitive-toggle',
    title: 'Two Modes of Thinking',
    body: 'Explorer feeds you bite-sized wisdom. Deep Focus opens the Socratic oracle.',
    emoji: '🧠',
    position: 'bottom',
  },
  {
    targetId: 'totem-oasis',
    title: 'Your Totems',
    body: 'Oasis, Glossa, Delores, and Forge — each unlocks a different dimension of learning.',
    emoji: '🌿',
    position: 'top',
  },
  {
    targetId: 'wp-counter',
    title: 'Wisdom Points',
    body: 'Every swipe, quest, and creation earns WP. Level up your belt and unlock new paths.',
    emoji: '⭐',
    position: 'top',
  },
];

const STORAGE_KEY = 'sensage-onboarding-v2';

const OnboardingTour = () => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setActive(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const measure = useCallback(() => {
    const el = document.getElementById(TOUR_STEPS[step]?.targetId);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!active) return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active, step, measure]);

  const finish = () => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, '1');
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(s => s + 1);
    else finish();
  };

  if (!active) return null;

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  const tooltipStyle = (): React.CSSProperties => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    const w = 300;
    const pad = 14;
    const left = Math.max(pad, Math.min(rect.left + rect.width / 2 - w / 2, window.innerWidth - w - pad));
    if (current.position === 'bottom') return { top: rect.bottom + pad, left };
    return { bottom: window.innerHeight - rect.top + pad, left };
  };

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Welcome tour">
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            onClick={finish}
          />

          {/* Spotlight ring */}
          {rect && (
            <motion.div
              key={step}
              layoutId="spotlight"
              className="absolute rounded-2xl border-2 border-gold/50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                top: rect.top - 6,
                left: rect.left - 6,
                width: rect.width + 12,
                height: rect.height + 12,
                boxShadow: '0 0 24px hsl(43 47% 54% / 0.2)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
          )}

          {/* Tooltip */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: current.position === 'top' ? 10 : -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-10 w-[300px] glass-wavey rounded-2xl p-4 shadow-elevated"
            style={tooltipStyle()}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{current.emoji}</span>
                <h3 className="text-sm font-serif text-foreground">{current.title}</h3>
              </div>
              <button onClick={finish} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{current.body}</p>

            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === step ? 'w-5 bg-gold' : i < step ? 'w-1.5 bg-gold/40' : 'w-1.5 bg-border'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gold/20 text-foreground text-xs font-grotesk font-medium hover:bg-gold/30 transition-colors"
              >
                {isLast ? (
                  <>
                    <Sparkles className="w-3 h-3 text-gold" />
                    Begin
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
