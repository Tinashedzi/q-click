import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Settings, ChevronLeft, Play, Lock } from 'lucide-react';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import DeloresChat from '@/components/delores/DeloresChat';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';
import PomodoroFocus from '@/components/delores/PomodoroFocus';
import StreakCalendar from '@/components/delores/StreakCalendar';
import JournalEntry from '@/components/delores/JournalEntry';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import deloresBg from '@/assets/delores-bg.png';

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Activity cards data ─── */
const activities = [
  {
    title: 'Deep Breathing Basics',
    subtitle: 'AI Narrated',
    progress: 35,
    unlocked: true,
    action: 'focus',
    color: 'hsl(var(--primary))',
  },
  {
    title: 'Managing Stress',
    subtitle: 'Calm your mind',
    progress: 60,
    unlocked: false,
    action: 'mood',
    color: 'hsl(var(--secondary))',
  },
  {
    title: 'Mindful Movement Flow',
    subtitle: 'Gentle body movements',
    progress: 45,
    unlocked: false,
    action: 'matrix',
    color: 'hsl(183 50% 45%)',
  },
];

const Delores = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const returnHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* BG Image — full visibility */}
      <div className="fixed inset-0 z-0">
        <img src={deloresBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
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
              transition={{ delay: 0.5, duration: 0.7, ease }}
              className="h-px mt-6 rounded-full bg-primary/30"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col h-full min-h-screen"
      >
        {/* Top bar — avatar + title + settings */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div className="flex items-center gap-3">
            {activeView ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveView(null)}
                className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60 backdrop-blur-xl"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            ) : (
              <motion.div
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 bg-background/60 backdrop-blur-xl flex items-center justify-center"
                whileTap={{ scale: 0.95 }}
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-foreground">
                    {(profile?.display_name || 'U')[0].toUpperCase()}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60 backdrop-blur-xl"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {!activeView ? (
            /* ─── Hub view ─── */
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease }}
              className="flex-1 flex flex-col px-5"
            >
              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease }}
                className="mb-2"
              >
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  Mindfulness with Delris
                </h1>
                <p className="text-sm text-muted-foreground">Your AI Wellness Coach</p>
              </motion.div>

              {/* Hero illustration area — transparent, shows BG */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease }}
                className="flex-1 min-h-[200px] max-h-[320px] flex items-center justify-center my-4"
              >
                <motion.button
                  onClick={() => setActiveView('chat')}
                  whileTap={{ scale: [1, 0.92, 1.06, 1] }}
                  className="relative"
                >
                  <DeloresAvatar moodLevel={currentMood} size="lg" isListening={isListening} />
                  <motion.div
                    animate={{ opacity: [0.08, 0.2, 0.08], scale: [1.3, 1.6, 1.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 -z-10 rounded-full blur-3xl"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)' }}
                  />
                </motion.button>
              </motion.div>

              {/* Activity cards — horizontal list */}
              <div className="space-y-3 pb-24">
                {activities.map((activity, i) => (
                  <motion.button
                    key={activity.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4, ease }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveView(activity.action)}
                    className="w-full flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/70 backdrop-blur-xl shadow-sm hover:shadow-md transition-all text-left"
                  >
                    {/* Icon circle */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2"
                      style={{ borderColor: activity.color }}
                    >
                      <DeloresAvatar moodLevel={i + 1} size="sm" isListening={false} />
                    </div>

                    {/* Text + progress */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{activity.title}</h3>
                      <p className="text-xs text-muted-foreground">{activity.subtitle}</p>
                      <div className="mt-2">
                        <Progress
                          value={activity.progress}
                          className="h-1.5 bg-muted"
                        />
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0">
                      {activity.unlocked ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
                        >
                          Begin <Play className="w-3 h-3 fill-current" />
                        </motion.div>
                      ) : (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

          ) : activeView === 'chat' ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease }}
              className="flex-1 px-5 pb-24"
            >
              <div className="h-full border border-border bg-background/70 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm">
                <DeloresChat
                  moodLevel={currentMood}
                  onMoodDetected={setCurrentMood}
                  onListeningChange={setIsListening}
                />
              </div>
            </motion.div>

          ) : (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease }}
              className="flex-1 px-5 pb-24 overflow-y-auto"
            >
              <div className="border border-border bg-background/70 backdrop-blur-xl rounded-2xl p-5 shadow-sm">
                {activeView === 'mood' && (
                  <MoodCheckIn onComplete={() => setActiveView(null)} onMoodChange={setCurrentMood} />
                )}
                {activeView === 'dashboard' && <EmotionalDashboard />}
                {activeView === 'matrix' && <EmotionalMatrix />}
                {activeView === 'journal' && <JournalEntry onComplete={() => setActiveView(null)} />}
                {activeView === 'focus' && <PomodoroFocus />}
                {activeView === 'calendar' && <StreakCalendar />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating Home Button */}
      <motion.div
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-5 left-0 right-0 z-30 flex justify-center pointer-events-none"
      >
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={returnHome}
          className="pointer-events-auto w-12 h-12 rounded-full flex items-center justify-center border border-border bg-background/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-all"
        >
          <img src="/images/qclick-logo.svg" alt="Home" className="w-6 h-6 object-contain" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Delores;
