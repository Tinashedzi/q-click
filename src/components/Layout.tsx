import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import TabNav from './TabNav';
import BottomNav from './BottomNav';
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
  const isDelores = location.pathname === '/delores';
  // Home and Delores manage their own chrome
  const hideChrome = isHome || isDelores;
  const [journalOpen, setJournalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
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

      {!hideChrome && <Header />}
      {!hideChrome && <TabNav />}
      <main className={`${hideChrome ? '' : 'pt-14 md:pt-[6.25rem]'} pb-20 relative z-10`}>
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

      {/* Bottom nav on standard pages */}
      {!hideChrome && <BottomNav />}

      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Layout;
