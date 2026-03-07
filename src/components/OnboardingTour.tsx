import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface TourStep {
  targetId: string;
  title: string;
  body: string;
  emoji: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'ambient-orb',
    title: 'Welcome to Sensage',
    body: 'This is your Sanctuary — the heart of your cognitive journey. The orb breathes with you.',
    emoji: '✨',
    position: 'bottom',
  },
  {
    targetId: 'totem-oasis',
    title: 'Oasis',
    body: 'Your wisdom & guidance module. Ask questions, get masterclasses, and find your focus here.',
    emoji: '🌿',
    position: 'bottom',
  },
  {
    targetId: 'totem-glossa',
    title: 'Glossa',
    body: 'Explore the universal meaning of words across languages, cultures, and time.',
    emoji: '📚',
    position: 'bottom',
  },
  {
    targetId: 'totem-delores',
    title: 'Delores',
    body: 'Your emotional intelligence companion. She senses how you feel and adapts your learning.',
    emoji: '💜',
    position: 'bottom',
  },
  {
    targetId: 'totem-forge',
    title: 'The Forge',
    body: 'Turn ideas into creations — concept maps, scripts, games. This is your maker space.',
    emoji: '🔨',
    position: 'bottom',
  },
  {
    targetId: 'journal-nub',
    title: 'Your Journal',
    body: 'Tap here anytime to log how you feel and jot down thoughts. Entries can be sent to the Forge!',
    emoji: '📝',
    position: 'top',
  },
  {
    targetId: 'wp-counter',
    title: 'Wisdom Points',
    body: 'Every action earns you WP. Track your progress, streaks, and achievements here.',
    emoji: '⭐',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'sensage-onboarding-done';

const OnboardingTour = () => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setActive(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const measureTarget = useCallback(() => {
    const el = document.getElementById(TOUR_STEPS[step]?.targetId);
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!active) return;
    measureTarget();
    window.addEventListener('resize', measureTarget);
    return () => window.removeEventListener('resize', measureTarget);
  }, [active, step, measureTarget]);

  const finish = () => {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const next = () => {
    if (step < TOUR_STEPS.length - 1) setStep(s => s + 1);
    else finish();
  };

  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  if (!active) return null;

  const currentStep = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  // Tooltip positioning
  const getTooltipStyle = (): React.CSSProperties => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    const pad = 16;
    const tooltipW = 320;

    switch (currentStep.position) {
      case 'bottom':
        return {
          top: rect.bottom + pad,
          left: Math.max(pad, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - pad)),
        };
      case 'top':
        return {
          bottom: window.innerHeight - rect.top + pad,
          left: Math.max(pad, Math.min(rect.left + rect.width / 2 - tooltipW / 2, window.innerWidth - tooltipW - pad)),
        };
      case 'right':
        return {
          top: rect.top + rect.height / 2 - 60,
          left: rect.right + pad,
        };
      case 'left':
        return {
          top: rect.top + rect.height / 2 - 60,
          right: window.innerWidth - rect.left + pad,
        };
      default:
        return {};
    }
  };

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-label="Onboarding tour">
          {/* Backdrop with spotlight cutout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={finish}
          >
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  {rect && (
                    <rect
                      x={rect.left - 8}
                      y={rect.top - 8}
                      width={rect.width + 16}
                      height={rect.height + 16}
                      rx="16"
                      fill="black"
                    />
                  )}
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="hsl(240 20% 12% / 0.55)"
                mask="url(#spotlight-mask)"
              />
            </svg>
          </motion.div>

          {/* Spotlight ring */}
          {rect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              className="absolute rounded-2xl border-2 border-gold/50 pointer-events-none"
              style={{
                top: rect.top - 8,
                left: rect.left - 8,
                width: rect.width + 16,
                height: rect.height + 16,
                boxShadow: '0 0 30px hsl(43 47% 54% / 0.25), inset 0 0 20px hsl(43 47% 54% / 0.1)',
              }}
            />
          )}

          {/* Tooltip card */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: currentStep.position === 'top' ? 12 : -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-10 w-[320px] glass-wavey rounded-3xl p-5 shadow-elevated"
            style={getTooltipStyle()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentStep.emoji}</span>
                <h3 className="text-base font-serif text-foreground">{currentStep.title}</h3>
              </div>
              <button onClick={finish} className="p-1 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {currentStep.body}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? 'w-4 bg-gold' : i < step ? 'bg-gold/40' : 'bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="p-2 rounded-xl glass-deep hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold/20 text-foreground text-sm font-grotesk font-medium hover:bg-gold/30 transition-colors"
                >
                  {isLast ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-gold" />
                      Let's go!
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingTour;
