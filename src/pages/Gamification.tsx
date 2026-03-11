import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PointsEngine from '@/components/gamification/PointsEngine';
import AchievementEngine from '@/components/gamification/AchievementEngine';
import BeltEngine from '@/components/gamification/BeltEngine';
import TournamentEngine from '@/components/gamification/TournamentEngine';
import StreakEngine from '@/components/gamification/StreakEngine';

const Gamification = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-foreground">Dashboard</h2>
            <p className="text-sm text-muted-foreground">Track your learning journey</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="streak" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="streak">Streak</TabsTrigger>
          <TabsTrigger value="points">Points</TabsTrigger>
          <TabsTrigger value="belts">Belts</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
        </TabsList>
        <TabsContent value="streak"><StreakEngine /></TabsContent>
        <TabsContent value="points"><PointsEngine /></TabsContent>
        <TabsContent value="belts"><BeltEngine /></TabsContent>
        <TabsContent value="achievements"><AchievementEngine /></TabsContent>
        <TabsContent value="tournaments"><TournamentEngine /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Gamification;
