import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { belts } from '@/data/gamificationData';
import { useProgress } from '@/contexts/ProgressContext';

const BeltEngine = () => {
  const { progress, currentBelt, nextBelt } = useProgress();
  const totalPoints = progress.wisdom_points;
  const progressPct = nextBelt
    ? ((totalPoints - currentBelt.pointsRequired) / (nextBelt.pointsRequired - currentBelt.pointsRequired)) * 100
    : 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="hsl(var(--ochre-gold))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - progressPct / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Award className="w-8 h-8 text-gold mb-1" />
            <p className="text-sm font-medium text-foreground">{currentBelt.name}</p>
            <p className="text-xs text-muted-foreground">Level {currentBelt.level}</p>
          </div>
        </motion.div>

        {nextBelt && (
          <p className="text-sm text-muted-foreground text-center">
            {nextBelt.pointsRequired - totalPoints} WP to <span className="font-medium text-foreground">{nextBelt.name}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        {belts.map((belt) => (
          <Card key={belt.level} className={belt.level === currentBelt.level ? 'border-gold/30 bg-gold/5' : ''}>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${belt.color} border`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{belt.name}</p>
                <p className="text-xs text-muted-foreground">{belt.pointsRequired} WP • {belt.conceptsRequired} concepts</p>
              </div>
              {totalPoints >= belt.pointsRequired && <span className="text-xs text-jade">✓</span>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeltEngine;
