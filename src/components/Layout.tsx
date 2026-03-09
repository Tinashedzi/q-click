import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import TabNav from './TabNav';
import CitadelNav from './citadel/CitadelNav';
import JournalOverlay from './JournalOverlay';

interface LayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [journalOpen, setJournalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Wavey background gradient layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 10%, hsl(260 30% 85% / 0.15), transparent),
            radial-gradient(ellipse 60% 50% at 80% 80%, hsl(190 45% 65% / 0.08), transparent),
            radial-gradient(ellipse 70% 60% at 60% 30%, hsl(330 25% 75% / 0.06), transparent)
          `,
        }}
      />

      {!isHome && <Header />}
      {!isHome && <TabNav />}
      <main className={`${isHome ? '' : 'pt-14 md:pt-[6.25rem]'} pb-24 relative z-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global bottom CitadelNav */}
      <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
        <CitadelNav onJournalOpen={() => setJournalOpen(true)} />
      </div>

      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Layout;
