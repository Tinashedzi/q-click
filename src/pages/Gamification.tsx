import { motion } from 'framer-motion';
import { Trophy, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import PointsEngine from '@/components/gamification/PointsEngine';
import AchievementEngine from '@/components/gamification/AchievementEngine';
import BeltEngine from '@/components/gamification/BeltEngine';
import TournamentEngine from '@/components/gamification/TournamentEngine';
import StreakEngine from '@/components/gamification/StreakEngine';

const Gamification = () => {
  const { signOut, profile } = useAuth();
  const { progress } = useProgress();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">{profile?.display_name || 'Dashboard'}</h2>
              <p className="text-sm text-muted-foreground">{progress.wisdom_points} WP · {progress.streak_days} day streak</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-xl border border-border bg-muted/50 flex items-center justify-center"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={async () => { await signOut(); navigate('/'); }}
              className="w-9 h-9 rounded-xl border border-destructive/20 bg-destructive/5 flex items-center justify-center"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-destructive" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="streak" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-1">
          <TabsTrigger value="streak" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Streak</TabsTrigger>
          <TabsTrigger value="points" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Points</TabsTrigger>
          <TabsTrigger value="belts" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Belts</TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Achievements</TabsTrigger>
          <TabsTrigger value="tournaments" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Tournaments</TabsTrigger>
        </TabsList>
        <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
          <TabsContent value="streak" className="mt-0"><StreakEngine /></TabsContent>
          <TabsContent value="points" className="mt-0"><PointsEngine /></TabsContent>
          <TabsContent value="belts" className="mt-0"><BeltEngine /></TabsContent>
          <TabsContent value="achievements" className="mt-0"><AchievementEngine /></TabsContent>
          <TabsContent value="tournaments" className="mt-0"><TournamentEngine /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Gamification;
