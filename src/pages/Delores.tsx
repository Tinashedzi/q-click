import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MoodCheckIn from '@/components/delores/MoodCheckIn';
import EmotionalDashboard from '@/components/delores/EmotionalDashboard';
import EmotionalMatrix from '@/components/delores/EmotionalMatrix';

const Delores = () => {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Delores</h1>
          <p className="text-muted-foreground">Your emotional intelligence companion</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="matrix">Matrix</TabsTrigger>
          </TabsList>
          <TabsContent value="checkin">
            <MoodCheckIn onComplete={() => setActiveTab('dashboard')} />
          </TabsContent>
          <TabsContent value="dashboard">
            <EmotionalDashboard />
          </TabsContent>
          <TabsContent value="matrix">
            <EmotionalMatrix />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Delores;
