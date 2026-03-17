import { ReactNode, useState, useEffect, useRef } from 'react';
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
  initial: { opacity: 0, y: 12, scale: 0.97, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -8, scale: 0.99, filter: 'blur(2px)' },
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isDelores = location.pathname === '/delores';
  const hideChrome = isHome || isDelores;
  const [journalOpen, setJournalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Bioluminescent background */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-[background] duration-1000 ease-out"
        style={{
          background: `
            radial-gradient(ellipse 50% 40% at ${mousePos.x}% ${mousePos.y}%, hsl(var(--electric-cyan) / 0.07), transparent 70%),
            radial-gradient(ellipse 80% 60% at 20% 10%, hsl(var(--electric-cyan) / 0.04), transparent),
            radial-gradient(ellipse 60% 50% at 80% 80%, hsl(var(--sunset-coral) / 0.03), transparent),
            radial-gradient(ellipse 70% 60% at 60% 30%, hsl(var(--deep-lagoon) / 0.2), transparent),
            hsl(var(--background))
          `,
        }}
      />

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2 + i * 1.5,
              height: 2 + i * 1.5,
              background: i % 2 === 0
                ? 'hsl(var(--electric-cyan) / 0.3)'
                : 'hsl(var(--sunset-coral) / 0.2)',
              left: `${15 + i * 18}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {!isHome && <Header />}
      {!isHome && <TabNav />}
      <main className={`${isHome ? '' : 'pt-14 md:pt-[6.25rem]'} pb-20 relative z-10`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global CitadelNav — hidden on home for clean look */}
      {!isHome && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
          <CitadelNav onJournalOpen={() => setJournalOpen(true)} />
        </div>
      )}

      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Layout;
