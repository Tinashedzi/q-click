import { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuraLevel from '@/components/citadel/AuraLevel';
import CitadelNav from '@/components/citadel/CitadelNav';
import JournalOverlay from '@/components/JournalOverlay';
import OnboardingTour from '@/components/OnboardingTour';
import CognitiveModeToggle from '@/components/cognitive/CognitiveModeToggle';
import ExplorerFeed from '@/components/cognitive/ExplorerFeed';
import DeepFocusMode from '@/components/cognitive/DeepFocusMode';

const GlossaMind = lazy(() => import('@/components/glossa/GlossaMind'));

const Index = () => {
  const [journalOpen, setJournalOpen] = useState(false);
  const [cognitiveMode, setCognitiveMode] = useState<'explorer' | 'deep-focus'>('explorer');

  return (
    <div className="relative w-full h-screen">
      <OnboardingTour />

      {/* Wavey transition background layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cognitiveMode}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {cognitiveMode === 'explorer' ? (
            /* Explorer: Knowledge web background with feed overlay */
            <div className="w-full h-full relative">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-deep-sea/20 to-background">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-jade/40 border-t-jade animate-spin" />
                      <span className="text-xs font-grotesk text-muted-foreground/60 tracking-wider uppercase">
                        Mapping your knowledge…
                      </span>
                    </motion.div>
                  </div>
                }
              >
                <GlossaMindFullscreen />
              </Suspense>
              {/* Explorer feed overlaid on the knowledge web */}
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-full max-w-md h-[70%]">
                  <ExplorerFeed />
                </div>
              </motion.div>
            </div>
          ) : (
            /* Deep Focus: immersive Socratic space */
            <motion.div
              className="w-full h-full"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 30% 20%, hsl(var(--lavender-mist) / 0.15), transparent),
                  radial-gradient(ellipse 50% 40% at 70% 70%, hsl(var(--wave-cyan) / 0.08), transparent),
                  hsl(var(--background))
                `,
              }}
            >
              <DeepFocusMode />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Top-left: Aura Level */}
      <div className="absolute top-4 left-4 z-20">
        <AuraLevel />
      </div>

      {/* Top-center: Cognitive Mode Toggle */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
        <CognitiveModeToggle mode={cognitiveMode} onChange={setCognitiveMode} />
      </div>

      {/* Top-right: Sensage brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute top-4 right-4 z-20 text-right"
      >
        <h1 className="text-2xl sm:text-3xl font-serif text-foreground/80 tracking-tight">
          Sensage
        </h1>
        <p className="text-[10px] text-muted-foreground/50 italic font-serif tracking-wide mt-0.5">
          the architecture of thought
        </p>
      </motion.div>

      {/* Bottom: Totem Navigation */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center">
        <CitadelNav onJournalOpen={() => setJournalOpen(true)} />
      </div>

      {/* Journal Overlay */}
      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

/** Wrapper that renders GlossaMind at full height without its own border/container */
const GlossaMindFullscreen = () => {
  return (
    <div className="w-full h-full [&>div]:!h-full [&>div]:!rounded-none [&>div]:!border-0">
      <GlossaMind />
    </div>
  );
};

export default Index;
