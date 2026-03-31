import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StreakEngine = () => {
  const [streak] = useState(() => parseInt(localStorage.getItem('qclick-gamification-streak') || '7'));
  const [freezes] = useState(() => parseInt(localStorage.getItem('qclick-gamification-freezes') || '2'));
  const petMood = streak >= 14 ? 'thriving' : streak >= 7 ? 'happy' : streak >= 3 ? 'okay' : 'sleepy';
  const petEmoji = { thriving: '🐉', happy: '🦊', okay: '🐣', sleepy: '😴' }[petMood];

  const today = new Date();
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    const active = i >= 30 - streak;
    return { date: d, active };
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/20"
        >
          <Flame className="w-6 h-6 text-destructive" />
          <span className="text-3xl font-serif text-foreground">{streak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </motion.div>
      </div>

      {/* Streak Guardian Pet */}
      <Card className="text-center">
        <CardContent className="pt-6">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-5xl mb-2"
          >
            {petEmoji}
          </motion.div>
          <p className="text-sm font-medium text-foreground capitalize">Your guardian is {petMood}!</p>
          <p className="text-xs text-muted-foreground mt-1">Keep your streak alive to help them thrive</p>
        </CardContent>
      </Card>

      {/* Streak Calendar */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Last 30 days</h4>
        <div className="grid grid-cols-10 gap-1">
          {last30.map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`w-full aspect-square rounded-sm ${d.active ? 'bg-jade' : 'bg-muted'}`}
              title={d.date.toLocaleDateString()}
            />
          ))}
        </div>
      </div>

      {/* Freeze */}
      <Card>
        <CardContent className="py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Streak Freezes</p>
              <p className="text-xs text-muted-foreground">Use 50 WP to protect a missed day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{freezes} left</span>
            <Button variant="outline" size="sm">Buy Freeze</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakEngine;
