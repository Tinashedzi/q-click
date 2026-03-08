import { motion } from 'framer-motion';

/**
 * Dynamic mood background — floating orbs that shift color/speed based on mood level.
 * Mood 1 = cool/slow (heavy), Mood 5 = warm/fast (radiant)
 */

interface MoodAmbientProps {
  moodLevel: number | null; // 1-5 or null
}

const moodPalettes: Record<number, { bg: string; orbs: string[]; speed: number }> = {
  1: {
    bg: 'from-[hsl(230_35%_25%/0.06)] via-[hsl(260_30%_85%/0.1)] to-transparent',
    orbs: ['hsl(260 30% 78% / 0.2)', 'hsl(230 35% 65% / 0.15)', 'hsl(220 40% 70% / 0.12)'],
    speed: 12,
  },
  2: {
    bg: 'from-[hsl(220_40%_70%/0.06)] via-[hsl(260_30%_85%/0.08)] to-transparent',
    orbs: ['hsl(220 40% 75% / 0.18)', 'hsl(260 30% 80% / 0.15)', 'hsl(190 45% 70% / 0.12)'],
    speed: 10,
  },
  3: {
    bg: 'from-[hsl(34_33%_93%/0.05)] via-[hsl(108_18%_69%/0.06)] to-transparent',
    orbs: ['hsl(108 18% 72% / 0.18)', 'hsl(190 45% 70% / 0.14)', 'hsl(34 33% 88% / 0.12)'],
    speed: 8,
  },
  4: {
    bg: 'from-[hsl(330_25%_75%/0.08)] via-[hsl(43_47%_54%/0.06)] to-transparent',
    orbs: ['hsl(330 25% 78% / 0.2)', 'hsl(43 47% 60% / 0.16)', 'hsl(22 30% 74% / 0.14)'],
    speed: 6,
  },
  5: {
    bg: 'from-[hsl(43_47%_54%/0.1)] via-[hsl(330_25%_75%/0.08)] to-transparent',
    orbs: ['hsl(43 47% 62% / 0.22)', 'hsl(330 25% 80% / 0.18)', 'hsl(22 30% 78% / 0.16)'],
    speed: 5,
  },
};

const MoodAmbient = ({ moodLevel }: MoodAmbientProps) => {
  const palette = moodPalettes[moodLevel ?? 3];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient wash */}
      <motion.div
        className={`absolute inset-0 bg-gradient-radial ${palette.bg}`}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: palette.speed * 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating orbs */}
      {palette.orbs.map((color, i) => (
        <motion.div
          key={`${moodLevel}-${i}`}
          className="absolute rounded-full"
          style={{
            width: 120 + i * 60,
            height: 120 + i * 60,
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${15 + i * 25}%`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 30 - i * 15, -20 + i * 10, 0],
            y: [0, -25 + i * 12, 15 - i * 8, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: palette.speed + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default MoodAmbient;
