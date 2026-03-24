import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu, X, Library as LibraryIcon, Video, User,
  SlidersHorizontal, Info, ChevronLeft,
  Smile, LayoutDashboard, Activity, BookHeart, Calendar, Target,
} from 'lucide-react';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import DeloresChat from '@/components/delores/DeloresChat';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';
import PomodoroFocus from '@/components/delores/PomodoroFocus';
import StreakCalendar from '@/components/delores/StreakCalendar';
import JournalEntry from '@/components/delores/JournalEntry';
import { cn } from '@/lib/utils';

/* ─── Data ─── */

const menuItems = [
  { icon: LibraryIcon, label: 'Library', hover: 'Your Collection', path: '/library' },
  { icon: Video, label: 'Video', hover: 'Watch & Learn', path: '/video' },
  { icon: User, label: 'Profile', hover: 'Your Settings', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', hover: 'Customize', path: '/gamification' },
  { icon: Info, label: 'About', hover: 'Q-Click Info', path: '/' },
];

const features = [
  { icon: Smile, title: 'Mood', desc: 'Check in', action: 'mood' },
  { icon: LayoutDashboard, title: 'Insights', desc: 'Trends', action: 'dashboard' },
  { icon: Activity, title: 'Matrix', desc: 'Focus gauge', action: 'matrix' },
  { icon: BookHeart, title: 'Journal', desc: 'Reflect', action: 'journal' },
  { icon: Calendar, title: 'Streak', desc: 'History', action: 'calendar' },
  { icon: Target, title: 'Focus', desc: 'Pomodoro', action: 'focus' },
];

/* ─── Ease constant ─── */
const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Component ─── */

const Delores = () => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const smoothNavigate = useCallback((path: string) => {
    setTimeout(() => navigate(path), 200);
  }, [navigate]);

  const returnHome = useCallback(() => {
    window.location.assign('/');
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-white">

      {/* ─── Loading ─── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease }}
            >
              <DeloresAvatar moodLevel={null} size="lg" isListening />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 0.5, duration: 1, ease }}
              className="h-px mt-6 rounded-full"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(183 100% 50% / 0.4), transparent)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Hamburger Menu ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 bg-white/90 backdrop-blur-xl border-r border-gray-200 p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-semibold text-gray-900 tracking-tight">Menu</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen(false)}>
                  <X className="w-4 h-4 text-gray-400" />
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
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

      {/* ─── Main Content ─── */}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col h-full"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-gray-200 bg-white/60 backdrop-blur-xl hover:bg-gray-50 transition-colors"
          >
            <Menu className="w-4 h-4 text-gray-500" />
          </motion.button>

          {activeView && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveView(null)}
              className="w-10 h-10 rounded-2xl flex items-center justify-center border border-gray-200 bg-white/60 backdrop-blur-xl hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </motion.button>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-5">
          <AnimatePresence mode="wait">
            {!activeView ? (
              /* ─── Hub ─── */
              <motion.div
                key="hub"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease }}
                className="flex flex-col items-center gap-10 w-full max-w-md"
              >
                {/* Orb */}
                <motion.button
                  onClick={() => setActiveView('chat')}
                  className="relative"
                  whileTap={{ scale: [1, 0.92, 1.06, 1] }}
                >
                  <DeloresAvatar moodLevel={currentMood} size="lg" isListening={isListening} />
                  
                  {/* Subtle glow — cyan accent */}
                  <motion.div
                    animate={{ opacity: [0.08, 0.2, 0.08], scale: [1.3, 1.6, 1.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 -z-10 rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, hsl(183 100% 50% / 0.15), transparent 70%)' }}
                  />
                </motion.button>

                {/* 3×2 Grid — glass cards */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {features.map((f, i) => (
                    <motion.button
                      key={f.action}
                      onClick={() => setActiveView(f.action)}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-xl hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50">
                        <f.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-900">{f.title}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{f.desc}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

            ) : activeView === 'chat' ? (
              /* ─── Chat ─── */
              <motion.div
                key="chat"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease }}
                className="w-full h-full max-w-lg pb-16"
              >
                <div className="h-full border border-gray-200 bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
                  <DeloresChat
                    moodLevel={currentMood}
                    onMoodDetected={setCurrentMood}
                    onListeningChange={setIsListening}
                  />
                </div>
              </motion.div>

            ) : (
              /* ─── Feature Sub-views ─── */
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.35, ease }}
                className="w-full max-w-lg pb-16 overflow-y-auto max-h-full"
              >
                <div className="border border-gray-200 bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-sm">
                  {activeView === 'mood' && (
                    <MoodCheckIn
                      onComplete={() => setActiveView(null)}
                      onMoodChange={setCurrentMood}
                    />
                  )}
                  {activeView === 'dashboard' && <EmotionalDashboard />}
                  {activeView === 'matrix' && <EmotionalMatrix />}
                  {activeView === 'journal' && (
                    <JournalEntry onComplete={() => setActiveView(null)} />
                  )}
                  {activeView === 'focus' && <PomodoroFocus />}
                  {activeView === 'calendar' && <StreakCalendar />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ─── Floating Home Button ─── */}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-5 left-0 right-0 z-30 flex justify-center pointer-events-none"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={returnHome}
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 bg-white/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all"
        >
          <img src="/images/qclick-logo.svg" alt="Home" className="w-6 h-6 object-contain" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Delores;
