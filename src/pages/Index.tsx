import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AuraLevel from '@/components/citadel/AuraLevel';
import BeltRing from '@/components/citadel/BeltRing';
import CitadelNav from '@/components/citadel/CitadelNav';
import JournalOverlay from '@/components/JournalOverlay';
import OnboardingTour from '@/components/OnboardingTour';
import CognitiveModeToggle from '@/components/cognitive/CognitiveModeToggle';
import ExplorerFeed from '@/components/cognitive/ExplorerFeed';
import DeepFocusMode from '@/components/cognitive/DeepFocusMode';

const Index = () => {
  const [journalOpen, setJournalOpen] = useState(false);
  const [cognitiveMode, setCognitiveMode] = useState<'explorer' | 'deep-focus'>('explorer');

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <OnboardingTour />

      {/* Ambient background — light Silicon Porcelain gradients */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 20% 20%, hsl(var(--lavender-mist) / 0.3), transparent),
              radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--wave-cyan) / 0.12), transparent),
              radial-gradient(ellipse 80% 60% at 50% 50%, hsl(var(--celadon-jade) / 0.06), transparent),
              hsl(var(--background))
            `,
          }}
        />
        {/* Subtle morphing blob */}
        <motion.div
          className="absolute w-[400px] h-[400px] top-[10%] right-[5%] opacity-[0.07]"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--lavender-mist)), hsl(var(--wave-cyan)))',
          }}
          animate={{
            borderRadius: [
              '42% 58% 60% 40% / 45% 55% 45% 55%',
              '55% 45% 40% 60% / 60% 40% 55% 45%',
              '45% 55% 55% 45% / 40% 60% 45% 55%',
              '42% 58% 60% 40% / 45% 55% 45% 55%',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] bottom-[15%] left-[10%] opacity-[0.05]"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--ochre-gold)), hsl(var(--sun-baked-clay)))',
          }}
          animate={{
            borderRadius: [
              '55% 45% 40% 60% / 60% 40% 55% 45%',
              '42% 58% 60% 40% / 45% 55% 45% 55%',
              '60% 40% 45% 55% / 55% 45% 60% 40%',
              '55% 45% 40% 60% / 60% 40% 55% 45%',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-start justify-between px-4 sm:px-6 pt-4">
          {/* Left: Aura + Belt Ring */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3"
          >
            <Link to="/gamification">
              <BeltRing />
            </Link>
            <AuraLevel />
          </motion.div>

          {/* Center: Cognitive Toggle */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
            <CognitiveModeToggle mode={cognitiveMode} onChange={setCognitiveMode} />
          </div>

          {/* Right: Brand */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-right pt-1"
          >
            <h1 className="text-2xl sm:text-3xl font-serif text-foreground/80 tracking-tight">
              Sensage
            </h1>
            <p className="text-[10px] text-muted-foreground/50 italic font-serif tracking-wide mt-0.5">
              the architecture of thought
            </p>
          </motion.div>
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

        {/* Bottom: Totem Navigation */}
        <div className="pb-4 px-4 flex justify-center">
          <CitadelNav onJournalOpen={() => setJournalOpen(true)} />
        </div>
      </div>

      {/* Journal Overlay */}
      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Index;
