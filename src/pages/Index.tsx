import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import AuraLevel from '@/components/citadel/AuraLevel';
import CitadelNav from '@/components/citadel/CitadelNav';
import JournalOverlay from '@/components/JournalOverlay';
import OnboardingTour from '@/components/OnboardingTour';

const GlossaMind = lazy(() => import('@/components/glossa/GlossaMind'));

const Index = () => {
  const [journalOpen, setJournalOpen] = useState(false);

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <OnboardingTour />

      {/* Full-screen Knowledge Web */}
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[hsl(230,35%,12%)] to-[hsl(260,25%,14%)]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
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
      </div>

      {/* Top-left: Aura Level + Timeline Title */}
      <div className="absolute top-4 left-4 z-20">
        <AuraLevel points={128} conceptsExplored={8} />
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
