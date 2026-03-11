import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowRight } from 'lucide-react';
import qclickLogo from '@/assets/qclick-logo.png';
import AuraLevel from '@/components/citadel/AuraLevel';
import BeltRing from '@/components/citadel/BeltRing';
import OnboardingTour from '@/components/OnboardingTour';
import CognitiveModeToggle from '@/components/cognitive/CognitiveModeToggle';
import ExplorerFeed from '@/components/cognitive/ExplorerFeed';
import DeepFocusMode from '@/components/cognitive/DeepFocusMode';
import DeloresFloatingWidget from '@/components/DeloresFloatingWidget';

const Index = () => {
  const [cognitiveMode, setCognitiveMode] = useState<'explorer' | 'deep-focus'>('explorer');
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <OnboardingTour />

      {/* Video background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/ambient-bg.mp4"
        />
        {/* Blend overlay to match Silicon Porcelain palette */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 20% 20%, hsl(var(--lavender-mist) / 0.35), transparent),
              radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--wave-cyan) / 0.15), transparent),
              hsl(var(--background) / 0.55)
            `,
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-4 sm:px-6 pt-3 gap-2 sm:gap-0">
          <div className="flex items-center justify-between w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 min-w-0 flex-1"
            >
              <Link to="/gamification" className="shrink-0">
                <BeltRing />
              </Link>
              <div className="hidden md:block min-w-0">
                <AuraLevel />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-2 shrink-0 ml-4"
            >
              <img src={qclickLogo} alt="Q-Click" className="w-9 h-9 sm:w-11 sm:h-11 object-contain" />
              <div className="text-right">
                <h1 className="text-xl sm:text-3xl font-serif text-foreground tracking-tight">
                  Q-Click
                </h1>
                <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 italic font-serif tracking-wide">
                  the architecture of thought
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-center sm:absolute sm:top-4 sm:left-1/2 sm:-translate-x-1/2 z-30">
            <CognitiveModeToggle mode={cognitiveMode} onChange={setCognitiveMode} />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={cognitiveMode}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {cognitiveMode === 'explorer' ? (
                <div className="w-full h-full flex items-center justify-center">
                  <motion.div
                    className="w-full max-w-md h-[75%]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <ExplorerFeed />
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <DeepFocusMode />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar — Delores left, Lab right */}
      <div className="absolute bottom-20 md:bottom-6 left-0 right-0 z-20 px-4 flex items-end justify-between gap-3">
        {/* Delores widget — left */}
        <DeloresFloatingWidget />

        {/* Lab Promo Banner — right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xs w-full sm:w-auto"
        >
          <button
            onClick={() => navigate('/forge', { state: { targetTab: 'experiment' } })}
            className="w-full group relative overflow-hidden rounded-2xl border border-accent/30 bg-card/80 backdrop-blur-md p-3 sm:p-4 flex items-center gap-3 hover:border-accent/50 hover:shadow-lg transition-all"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/25 transition-colors">
              <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-foreground">Try the Lab</p>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate hidden sm:block">Interactive PhET simulations</p>
            </div>
            <ArrowRight className="w-4 h-4 text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
              <span className="text-[8px] sm:text-[9px] font-grotesk uppercase tracking-widest text-accent/70 bg-accent/10 px-1.5 py-0.5 rounded-full">New</span>
            </div>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
