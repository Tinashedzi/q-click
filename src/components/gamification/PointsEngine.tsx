import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { pointRules } from '@/data/gamificationData';
import { useProgress } from '@/contexts/ProgressContext';

const PointsEngine = () => {
  const { progress } = useProgress();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold/15 border border-gold/30">
          <Coins className="w-6 h-6 text-gold" />
          <span className="text-3xl font-serif text-foreground">{progress.wisdom_points}</span>
          <span className="text-sm text-muted-foreground">WP</span>
        </motion.div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">How to earn Wisdom Points</h3>
        {pointRules.map((rule, i) => (
          <motion.div key={rule.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="py-3 px-4 flex items-center gap-3">
                <span className="text-xl">{rule.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{rule.action}</p>
                  {rule.condition && <p className="text-xs text-muted-foreground">{rule.condition}</p>}
                </div>
                <span className="text-sm font-medium text-gold">+{rule.points}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PointsEngine;
