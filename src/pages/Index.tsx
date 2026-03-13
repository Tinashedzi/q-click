import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Hammer, BookOpen, Heart, ArrowRight } from 'lucide-react';

const pathways = [
  {
    icon: Compass,
    title: 'Explore',
    subtitle: 'Discover ideas that change how you see the world',
    path: '/oasis',
  },
  {
    icon: Hammer,
    title: 'Create',
    subtitle: 'Build projects, experiments & creative works',
    path: '/forge',
  },
  {
    icon: BookOpen,
    title: 'Assignments',
    subtitle: 'Deep-dive into language, meaning & knowledge',
    path: '/glossa',
  },
  {
    icon: Heart,
    title: 'Reflect',
    subtitle: 'Check in with Delores, your learning companion',
    path: '/delores',
  },
];

const ONBOARDING_KEY = 'qclick-pathway-onboarding-v1';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      const timer = setTimeout(() => setShowOnboarding(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const finishOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, '1');
  }, []);

  const nextOnboarding = useCallback(() => {
    if (onboardingStep < pathways.length - 1) {
      setOnboardingStep(s => s + 1);
    } else {
      finishOnboarding();
    }
  }, [onboardingStep, finishOnboarding]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      {/* Background Video — subtle ambient layer */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-20"
      >
        <source src="/videos/ambient-bg.mp4" type="video/mp4" />
      </video>
      {/* Obsidian overlay */}
      <div className="fixed inset-0 z-0 bg-background/85" />

      {/* Logo — centered with generous whitespace */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-16 relative z-10"
      >
        <img
          src="/images/qclick-logo.svg"
          alt="Q-Click"
          className="w-16 h-16 sm:w-20 sm:h-20 mb-6"
        />
        <h1 className="text-3xl sm:text-4xl tracking-tight text-foreground">
          The future of learning.
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs text-center leading-relaxed">
          Supportive, small-dose guidance for the next generation.
        </p>
      </motion.div>

      {/* Pathway Cards — 2x2 grid, consistent 16px gap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 gap-4 w-full max-w-md relative z-10"
      >
        {pathways.map((p, i) => (
          <motion.button
            key={p.path}
            onClick={() => navigate(p.path)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative rounded-2xl p-5 text-left transition-all duration-300 group bg-card/50 backdrop-blur-xl border border-border hover:border-primary/20"
            style={{
              boxShadow: hoveredIndex === i ? '0 0 30px -8px hsl(183 100% 50% / 0.12)' : 'none',
            }}
          >
            {/* Onboarding pulse */}
            {showOnboarding && onboardingStep === i && (
              <motion.div
                className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <p.icon
              className="w-5 h-5 mb-4 text-muted-foreground group-hover:text-primary transition-colors duration-300"
            />
            <h3 className="text-sm font-semibold text-foreground mb-1">{p.title}</h3>
            <p className="text-xs text-muted-foreground leading-snug">{p.subtitle}</p>
            <ArrowRight
              className="absolute bottom-4 right-4 w-3.5 h-3.5 text-border group-hover:text-muted-foreground transition-colors"
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Onboarding tooltip */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[300px] rounded-2xl p-4 bg-card/95 backdrop-blur-xl border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center shrink-0">
                {(() => { const Icon = pathways[onboardingStep].icon; return <Icon className="w-4 h-4 text-muted-foreground" />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-0.5">{pathways[onboardingStep].title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{pathways[onboardingStep].subtitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex gap-1">
                {pathways.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === onboardingStep ? 'w-5 bg-primary' : i < onboardingStep ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-border'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={finishOnboarding} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Skip
                </button>
                <button
                  onClick={nextOnboarding}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {onboardingStep < pathways.length - 1 ? 'Next' : 'Got it'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimal footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="text-xs text-muted-foreground/40 mt-16 text-center relative z-10"
      >
        Built for curious minds
      </motion.p>
    </div>
  );
};

export default Index;
