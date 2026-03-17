import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, HeartPulse, BarChart3, Brain, Grid3X3 } from 'lucide-react';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import DeloresChat from '@/components/delores/DeloresChat';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';
import SELRadarChart from '@/components/delores/SELRadarChart';
import MoodAmbient from '@/components/delores/MoodAmbient';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import VoiceInput from '@/components/delores/VoiceInput';
import deloresBg from '@/assets/delores-bg.gif';

const tabs = [
  { value: 'chat', label: 'Talk', icon: MessageCircle },
  { value: 'checkin', label: 'Check-in', icon: HeartPulse },
  { value: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { value: 'sel', label: 'SEL', icon: Brain },
  { value: 'matrix', label: 'Matrix', icon: Grid3X3 },
];

const Delores = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* GIF background — reacts to voice with brightness pulse */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          filter: isListening
            ? ['brightness(0.6)', 'brightness(0.85)', 'brightness(0.6)']
            : 'brightness(0.5)',
        }}
        transition={isListening ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
      >
        <img
          src={deloresBg}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="fixed inset-0 z-0 bg-background/30" />

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
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 text-sm text-muted-foreground tracking-wider"
            >
              Connecting…
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.6, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-[1px] bg-primary/40 mt-3 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MAIN CONTENT ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 flex flex-col items-center min-h-screen"
      >
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center pt-10 pb-4 gap-3"
        >
          <div className="flex items-center gap-3">
            <DeloresAvatar moodLevel={currentMood} size="md" isListening={isListening} />
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Delores</h1>
              <p className="text-[11px] text-muted-foreground/60">Emotional Intelligence</p>
            </div>
          </div>

          {/* Voice — centered */}
          <VoiceInput
            onTranscript={(text) => {
              setIsListening(false);
              console.log('Voice transcript:', text);
            }}
          />
        </motion.div>

        {/* Tab navigation — frosted glass, icon-based */}
        <div className="w-full max-w-md px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4 backdrop-blur-2xl border border-border/20 bg-card/15 rounded-2xl h-12 p-1">
              {tabs.map((tab, i) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  asChild
                >
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex flex-col items-center gap-0.5 rounded-xl py-1.5 transition-all duration-300 cursor-pointer ${
                      activeTab === tab.value
                        ? 'bg-primary/10 text-primary shadow-[0_0_16px_-4px_hsl(var(--primary)/0.25)]'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-[8px] font-medium leading-none">{tab.label}</span>
                  </motion.button>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Content area — frosted glass card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="backdrop-blur-2xl border border-border/20 bg-card/15 rounded-2xl overflow-hidden"
            >
              <TabsContent value="chat" className="m-0">
                <DeloresChat moodLevel={currentMood} onMoodDetected={setCurrentMood} />
              </TabsContent>
              <TabsContent value="checkin" className="m-0 p-4">
                <MoodCheckIn
                  onComplete={() => setActiveTab('dashboard')}
                  onMoodChange={setCurrentMood}
                />
              </TabsContent>
              <TabsContent value="dashboard" className="m-0 p-4">
                <EmotionalDashboard />
              </TabsContent>
              <TabsContent value="sel" className="m-0 p-4">
                <SELRadarChart />
              </TabsContent>
              <TabsContent value="matrix" className="m-0 p-4">
                <EmotionalMatrix />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default Delores;
