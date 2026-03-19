import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, Library as LibraryIcon, Video, User,
  SlidersHorizontal, Info, ChevronLeft,
  BookHeart, Smile, Target, LayoutDashboard, Heart, Activity,
} from 'lucide-react';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import DeloresChat from '@/components/delores/DeloresChat';
import MoodAmbient from '@/components/delores/MoodAmbient';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';
import PomodoroFocus from '@/components/delores/PomodoroFocus';
import JournalEntry from '@/components/delores/JournalEntry';
import { cn } from '@/lib/utils';

/* ════════════════════════════════════════════════
   MENU DATA
   ════════════════════════════════════════════════ */

const menuItems = [
  { icon: LibraryIcon, label: 'Library', hover: 'Your Collection', path: '/library' },
  { icon: Video, label: 'Video', hover: 'Watch & Learn', path: '/video' },
  { icon: User, label: 'Profile', hover: 'Your Settings', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', hover: 'Customize App', path: '/gamification' },
  { icon: Info, label: 'About', hover: 'Q-Click Info', path: '/' },
];

/* ════════════════════════════════════════════════
   FEATURE BUTTONS — homepage style
   ════════════════════════════════════════════════ */

const features = [
  { icon: Smile, title: 'Mood', description: 'Check in with yourself', action: 'mood' },
  { icon: LayoutDashboard, title: 'Dashboard', description: 'Your emotional trends', action: 'dashboard' },
  { icon: Activity, title: 'Matrix', description: 'Focus & signal gauge', action: 'matrix' },
  { icon: BookHeart, title: 'Journal', description: 'Reflect & grow daily', action: 'journal' },
  { icon: Target, title: 'Focus', description: 'Pomodoro deep work', action: 'focus' },
];

/* ════════════════════════════════════════════════
   FLOWING TEXT — word-by-word reveal (from homepage)
   ════════════════════════════════════════════════ */

const FlowingText = ({ text, show }: { text: string; show: boolean }) => {
  const words = text.split(' ');
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          className="text-[9px] text-muted-foreground mt-1 flex flex-wrap gap-x-1 leading-relaxed justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 6, filter: 'blur(3px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

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
  const [activeView, setActiveView] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const smoothNavigate = useCallback((path: string) => {
    setTimeout(() => navigate(path), 300);
  }, [navigate]);

  const handleFeatureTap = (action: string, index: number) => {
    if (expanded !== index) {
      setExpanded(index);
    } else {
      setActiveView(activeView === action ? null : action);
      setExpanded(null);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden">
      {/* ═══ VIDEO BACKGROUND ═══ */}
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
      <div className="fixed inset-0 z-0 bg-background/20" />

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

      {/* ═══ HAMBURGER MENU ═══ */}
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
        {/* Top bar — hamburger only */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center px-5 pt-5 pb-2"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-border/40 bg-card/15 hover:bg-card/25 transition-colors"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </motion.div>

        {/* Center content — orb + features or chat */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {!activeView ? (
              /* ═══ HUB VIEW — Orb + Feature buttons ═══ */
              <motion.div
                key="hub"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center gap-8 w-full max-w-sm"
              >
                {/* Pulsating Orb — center, thumb-reachable */}
                <motion.button
                  onClick={() => setActiveView('chat')}
                  className="relative cursor-pointer"
                  whileTap={{ scale: [1, 0.9, 1.1, 1] }}
                >
                  <DeloresAvatar moodLevel={currentMood} size="lg" isListening={isListening} />
                  
                  {/* Ambient glow */}
                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1.6, 1.2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl"
                  />
                  
                  {/* Hint */}
                  <motion.span
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-primary/60 font-medium tracking-wider flex items-center gap-1"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Heart className="w-2.5 h-2.5" /> Talk to me
                  </motion.span>
                </motion.button>

                {/* Feature buttons — 1×4 horizontal row like homepage */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-4 items-start mt-4"
                >
                  {features.map((f, i) => {
                    const isExp = expanded === i;

                    return (
                      <div key={f.action} className="flex flex-col items-center">
                        <motion.button
                          onClick={() => handleFeatureTap(f.action, i)}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          whileTap={{ scale: [1, 0.88, 1.05, 1] }}
                          className={cn(
                            'relative w-14 h-14 rounded-2xl backdrop-blur-2xl border flex items-center justify-center transition-all duration-300',
                            isExp
                              ? 'border-primary/30 bg-primary/10 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)]'
                              : 'border-border/30 bg-card/12'
                          )}
                        >
                          <motion.div
                            animate={isExp ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            <f.icon
                              className={cn(
                                'w-5 h-5 transition-colors duration-300',
                                isExp ? 'text-primary' : 'text-muted-foreground'
                              )}
                            />
                          </motion.div>
                        </motion.button>

                        {/* Label */}
                        <span className={cn(
                          'text-[9px] mt-1.5 font-medium transition-colors duration-300',
                          isExp ? 'text-primary' : 'text-muted-foreground/60'
                        )}>
                          {f.title}
                        </span>

                        {/* Expanded description */}
                        <AnimatePresence>
                          {isExp && (
                            <motion.div
                              initial={{ opacity: 0, y: -4, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -4, height: 0 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="mt-2 w-24 rounded-xl backdrop-blur-2xl border border-border/20 bg-card/60 p-2 text-center overflow-hidden"
                            >
                              <FlowingText text={f.description} show />
                              <motion.span
                                className="inline-block mt-1.5 text-[8px] text-primary/70 font-medium"
                                animate={{ x: [0, 2, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                Tap to open →
                              </motion.span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              </motion.div>
            ) : activeView === 'chat' ? (
              /* ═══ CHAT VIEW ═══ */
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full max-w-lg pb-16"
              >
                <div className="h-full backdrop-blur-2xl border border-border/20 bg-card/10 rounded-3xl overflow-hidden">
                  <DeloresChat
                    moodLevel={currentMood}
                    onMoodDetected={setCurrentMood}
                    onListeningChange={setIsListening}
                  />
                </div>
              </motion.div>
            ) : (
              /* ═══ FEATURE SUB-VIEWS ═══ */
              <motion.div
                key={activeView}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg pb-16 overflow-y-auto max-h-full"
              >
                <div className="backdrop-blur-2xl border border-border/20 bg-card/10 rounded-3xl p-5">
                  {activeView === 'mood' && (
                    <MoodCheckIn
                      onComplete={() => { setActiveView(null); setExpanded(null); }}
                      onMoodChange={setCurrentMood}
                    />
                  )}
                  {activeView === 'dashboard' && <EmotionalDashboard />}
                  {activeView === 'matrix' && <EmotionalMatrix />}
                  {activeView === 'journal' && (
                    <JournalEntry onComplete={() => { setActiveView(null); setExpanded(null); }} />
                  )}
                  {activeView === 'focus' && <PomodoroFocus />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom — home button (when in sub-view, show back) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="fixed bottom-4 left-0 right-0 z-20 flex justify-center gap-3"
        >
          {activeView && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: [1, 0.9, 1.1, 1] }}
              onClick={() => { setActiveView(null); setExpanded(null); }}
              className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border border-border/30 bg-card/20 hover:bg-card/35 transition-colors shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: [1, 0.9, 1.1, 1] }}
            onClick={() => navigate('/')}
            className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border border-border/30 bg-card/20 hover:bg-card/35 transition-colors shadow-lg"
          >
            <img src="/images/qclick-logo.svg" alt="Home" className="w-6 h-6 object-contain opacity-70" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Delores;
