import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';
import BottomNav from './BottomNav';
import JournalOverlay from './JournalOverlay';
import AmbientMuteButton from './AmbientMuteButton';
import FloatingRadio from './FloatingRadio';

interface LayoutProps {
  children: ReactNode;
}

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.99 },
};

const fixedChromePageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isDelores = location.pathname === '/delores';
  const isHome = location.pathname === '/';
  const isFullScreen = isDelores;
  const activePageVariants = isHome ? fixedChromePageVariants : pageVariants;
  const [journalOpen, setJournalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      {!isFullScreen && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 10%, hsl(var(--primary) / 0.03), transparent),
              radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--secondary) / 0.03), transparent),
              hsl(var(--background))
            `,
          }}
        />
      )}

      <main className={`${(isFullScreen || isHome) ? '' : 'pt-4'} pb-20 relative z-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={activePageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isFullScreen && <BottomNav />}

      {/* Global floating components */}
      <AmbientMuteButton />
      <FloatingRadio />

      {/* Help icon — top-right */}
      <Link
        to="/how-to-use"
        className="fixed top-4 right-4 z-50 w-9 h-9 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-lg flex items-center justify-center hover:bg-primary/10 transition-colors"
        title="How to use Q-Click"
      >
        <HelpCircle className="w-4 h-4 text-muted-foreground" />
      </Link>

      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Layout;
