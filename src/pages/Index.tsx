import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowRight } from 'lucide-react';
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
              className="text-right shrink-0 ml-4"
            >
              <h1 className="text-xl sm:text-3xl font-serif text-foreground tracking-tight">
                Sensage
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 italic font-serif tracking-wide">
                the architecture of thought
              </p>
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

      {/* Floating Delores widget */}
      <DeloresFloatingWidget />
    </div>
  );
};

export default Index;
