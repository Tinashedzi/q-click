import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, Library as LibraryIcon, Video, User,
  SlidersHorizontal, Info, ChevronLeft,
} from 'lucide-react';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import DeloresChat from '@/components/delores/DeloresChat';
import MoodAmbient from '@/components/delores/MoodAmbient';

/* ════════════════════════════════════════════════
   MENU DATA (mirrors homepage)
   ════════════════════════════════════════════════ */

const menuItems = [
  { icon: LibraryIcon, label: 'Library', hover: 'Your Collection', path: '/library' },
  { icon: Video, label: 'Video', hover: 'Watch & Learn', path: '/video' },
  { icon: User, label: 'Profile', hover: 'Your Settings', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', hover: 'Customize App', path: '/gamification' },
  { icon: Info, label: 'About', hover: 'Q-Click Info', path: '/' },
];

/* ════════════════════════════════════════════════
   DELORES PAGE
   ════════════════════════════════════════════════ */

const Delores = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const smoothNavigate = useCallback((path: string) => {
    setTimeout(() => navigate(path), 300);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* ═══ VIDEO BACKGROUND — reacts to voice ═══ */}
      <motion.video
        autoPlay muted loop playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        animate={{
          filter: isListening
            ? ['brightness(0.7)', 'brightness(1)', 'brightness(0.7)']
            : 'brightness(0.65)',
        }}
        transition={isListening ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
      >
        <source src="/videos/delores-bg.mp4" type="video/mp4" />
      </motion.video>
      <div className="fixed inset-0 z-0 bg-background/25" />

      {/* Mood ambient overlay */}
      <MoodAmbient moodLevel={currentMood} />

      {/* ═══ LOADING PHASE ═══ */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl"
            exit={{ opacity: 0, filter: 'blur(12px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <DeloresAvatar moodLevel={null} size="lg" isListening />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] bg-primary/40 mt-6 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HAMBURGER MENU (same as homepage) ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 backdrop-blur-3xl border-r border-border/20 bg-card/80 p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold text-foreground tracking-tight">Menu</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="space-y-1 flex-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    onHoverStart={() => setMenuHover(i)}
                    onHoverEnd={() => setMenuHover(null)}
                    onClick={() => { setMenuOpen(false); smoothNavigate(item.path); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-card/40 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={menuHover === i ? 'hover' : 'label'}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs font-medium"
                      >
                        {menuHover === i ? item.hover : item.label}
                      </motion.span>
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 flex flex-col h-full"
      >
        {/* Top bar — hamburger only + orb */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between px-5 pt-5 pb-2"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-border/40 bg-card/15 hover:bg-card/25 transition-colors"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {/* Pulsating orb only — no text */}
          <DeloresAvatar moodLevel={currentMood} size="md" isListening={isListening} />

          {/* Spacer for centering */}
          <div className="w-10" />
        </motion.div>

        {/* Chat — full remaining height, frosted glass card */}
        <div className="flex-1 min-h-0 px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full backdrop-blur-2xl border border-border/20 bg-card/10 rounded-3xl overflow-hidden"
          >
            <DeloresChat moodLevel={currentMood} onMoodDetected={setCurrentMood} />
          </motion.div>
        </div>

        {/* Bottom — home button only */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="fixed bottom-4 left-0 right-0 z-20 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border border-border/30 bg-card/20 hover:bg-card/35 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Delores;
