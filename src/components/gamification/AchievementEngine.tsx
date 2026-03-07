import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { achievements } from '@/data/gamificationData';
import { useProgress } from '@/contexts/ProgressContext';

const AchievementEngine = () => {
  const { progress } = useProgress();
  const unlocked = progress.achievements;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-gold" />
        <span className="text-sm text-muted-foreground">{unlocked.length} / {achievements.length} unlocked</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.map((a, i) => {
          const isUnlocked = unlocked.includes(a.id);
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={isUnlocked ? 'border-gold/30 bg-gold/5' : 'opacity-60'}>
                <CardContent className="py-4 px-4 flex items-start gap-3">
                  <span className="text-2xl">{isUnlocked ? a.icon : '🔒'}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                    {a.reward && isUnlocked && (
                      <p className="text-xs text-gold mt-1">🎁 {a.reward}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementEngine;
