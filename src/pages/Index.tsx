import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Hammer, BookOpen, Heart, ArrowRight, Lightbulb } from 'lucide-react';

const pathways = [
  {
    icon: Compass,
    title: 'Explore',
    subtitle: 'Discover ideas that change how you see the world',
    path: '/oasis',
    color: 'hsl(var(--electric-cyan))',
    bg: 'hsl(var(--electric-cyan) / 0.08)',
    border: 'hsl(var(--electric-cyan) / 0.2)',
  },
  {
    icon: Hammer,
    title: 'Create',
    subtitle: 'Build projects, experiments & creative works',
    path: '/forge',
    color: 'hsl(var(--sunset-coral))',
    bg: 'hsl(var(--sunset-coral) / 0.08)',
    border: 'hsl(var(--sunset-coral) / 0.2)',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    subtitle: 'Deep-dive into language, meaning & knowledge',
    path: '/glossa',
    color: 'hsl(var(--pearl-mist))',
    bg: 'hsl(0 0% 100% / 0.05)',
    border: 'hsl(0 0% 100% / 0.1)',
  },
  {
    icon: Heart,
    title: 'Reflect',
    subtitle: 'Check in with Delores, your learning companion',
    path: '/delores',
    color: 'hsl(var(--sunset-coral))',
    bg: 'hsl(var(--sunset-coral) / 0.06)',
    border: 'hsl(var(--sunset-coral) / 0.15)',
  },
];

const dailyTips = [
  { text: "Confusion is the doorway to understanding.", source: "African Proverb" },
  { text: "Language is the architecture of thought.", source: "Q-Click" },
  { text: "The one who asks questions doesn't lose their way.", source: "Akan Proverb" },
  { text: "What is new is underfoot — learning begins with presence.", source: "Shona Wisdom" },
  { text: "A person is a person through other people.", source: "Ubuntu Philosophy" },
  { text: "The best time to plant a tree was 20 years ago. The second best is now.", source: "Chinese Proverb" },
  { text: "Knowledge without wisdom is like water in sand.", source: "Guinean Proverb" },
];

const ONBOARDING_KEY = 'qclick-pathway-onboarding-v1';

const Index = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Daily tip based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTipIndex(dayOfYear % dailyTips.length);
  }, []);

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

  const tip = dailyTips[tipIndex];

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-35"
      >
        <source src="/videos/ambient-bg.mp4" type="video/mp4" />
      </video>
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />

      {/* Centered Logo + Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-10 relative z-10"
      >
        <img
          src="/images/qclick-logo.svg"
          alt="Q-Click"
          className="w-20 h-20 sm:w-28 sm:h-28 mb-4 drop-shadow-lg"
        />
        <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-foreground">
          Q-Click
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic font-serif tracking-wide mt-1">
          the architecture of thought
        </p>
      </motion.div>

      {/* Hook line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center text-muted-foreground text-sm sm:text-base max-w-md mb-8 leading-relaxed relative z-10"
      >
        Your mind is the most powerful tool you own.
        <br />
        <span className="text-foreground font-medium">Start sharpening it.</span>
      </motion.p>

      {/* Pathway Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg relative z-10"
      >
        {pathways.map((p, i) => (
          <motion.button
            key={p.path}
            onClick={() => navigate(p.path)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 group backdrop-blur-sm"
            style={{
              background: p.bg,
              border: `1px solid ${p.border}`,
              boxShadow: hoveredIndex === i ? `0 8px 30px -8px ${p.color}30` : 'none',
            }}
          >
            {/* Onboarding pulse indicator */}
            {showOnboarding && onboardingStep === i && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                style={{ background: p.color }}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <p.icon
              className="w-6 h-6 sm:w-7 sm:h-7 mb-3 transition-transform duration-300 group-hover:scale-110"
              style={{ color: p.color }}
            />
            <h3 className="text-base sm:text-lg font-serif text-foreground mb-1">{p.title}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{p.subtitle}</p>
            <ArrowRight
              className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all"
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[320px] rounded-2xl p-4 backdrop-blur-xl border border-border/50"
            style={{ background: 'hsl(var(--card) / 0.95)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: pathways[onboardingStep].bg, border: `1px solid ${pathways[onboardingStep].border}` }}
              >
                {(() => { const Icon = pathways[onboardingStep].icon; return <Icon className="w-4 h-4" style={{ color: pathways[onboardingStep].color }} />; })()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-serif text-foreground mb-0.5">{pathways[onboardingStep].title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{pathways[onboardingStep].subtitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/30">
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
                <button onClick={finishOnboarding} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  Skip
                </button>
                <button
                  onClick={nextOnboarding}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                >
                  {onboardingStep < pathways.length - 1 ? 'Next' : 'Got it'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="flex items-center gap-2 mt-8 px-4 py-2.5 rounded-xl relative z-10"
        style={{ background: 'hsl(var(--muted) / 0.4)', border: '1px solid hsl(var(--border) / 0.5)' }}
      >
        <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0" />
        <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
          <span className="italic">"{tip.text}"</span>
          <span className="text-foreground/40 ml-1.5">— {tip.source}</span>
        </p>
      </motion.div>

      {/* Subtle footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-[11px] text-muted-foreground/50 mt-6 text-center relative z-10"
      >
        Built for curious minds · Learn anything · Go anywhere
      </motion.p>
    </div>
  );
};

export default Index;
