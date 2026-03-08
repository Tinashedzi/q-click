import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';
import SELRadarChart from '@/components/delores/SELRadarChart';
import MoodAmbient from '@/components/delores/MoodAmbient';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import VoiceInput from '@/components/delores/VoiceInput';

const Delores = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="relative min-h-screen">
      {/* Dynamic mood background */}
      <MoodAmbient moodLevel={currentMood} />

      <div className="container relative z-10 mx-auto px-4 py-8 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8 space-y-3">
            <div className="flex justify-center">
              <DeloresAvatar moodLevel={currentMood} size="lg" isListening={isListening} />
            </div>
            <h1 className="text-4xl font-serif text-foreground">Delores</h1>
            <p className="text-muted-foreground">Your emotional intelligence companion</p>
            <VoiceInput
              onTranscript={(text) => {
                setIsListening(false);
                console.log('Voice transcript:', text);
              }}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="checkin">Check-in</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sel">SEL Skills</TabsTrigger>
              <TabsTrigger value="matrix">Matrix</TabsTrigger>
            </TabsList>
            <TabsContent value="checkin">
              <MoodCheckIn
                onComplete={() => setActiveTab('dashboard')}
                onMoodChange={setCurrentMood}
              />
            </TabsContent>
            <TabsContent value="dashboard">
              <EmotionalDashboard />
            </TabsContent>
            <TabsContent value="sel">
              <SELRadarChart />
            </TabsContent>
            <TabsContent value="matrix">
              <EmotionalMatrix />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Delores;
