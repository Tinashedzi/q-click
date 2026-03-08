import { motion } from 'framer-motion';
import deloresImg from '@/assets/delores-hologram.png';

/**
 * Sentiment-responsive Delores avatar.
 * Breathing speed, glow intensity, and ring color shift based on mood.
 */

interface DeloresAvatarProps {
  moodLevel: number | null;
  size?: 'sm' | 'md' | 'lg';
}

const moodConfig: Record<number, { breathe: number; glowColor: string; ringColor: string; brightness: number }> = {
  1: { breathe: 8, glowColor: 'hsl(260 30% 78% / 0.3)', ringColor: 'hsl(260 30% 78% / 0.4)', brightness: 0.9 },
  2: { breathe: 7, glowColor: 'hsl(220 40% 75% / 0.3)', ringColor: 'hsl(220 40% 75% / 0.4)', brightness: 0.95 },
  3: { breathe: 6, glowColor: 'hsl(330 25% 75% / 0.3)', ringColor: 'hsl(330 25% 75% / 0.5)', brightness: 1 },
  4: { breathe: 4.5, glowColor: 'hsl(330 25% 75% / 0.4)', ringColor: 'hsl(330 30% 72% / 0.6)', brightness: 1.05 },
  5: { breathe: 3.5, glowColor: 'hsl(43 47% 60% / 0.4)', ringColor: 'hsl(43 47% 60% / 0.6)', brightness: 1.1 },
};

const sizes = { sm: 'w-12 h-12', md: 'w-20 h-20', lg: 'w-28 h-28' };
const ringSizes = { sm: 'ring-2', md: 'ring-[3px]', lg: 'ring-4' };

const DeloresAvatar = ({ moodLevel, size = 'md' }: DeloresAvatarProps) => {
  const config = moodConfig[moodLevel ?? 3];

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow pulse */}
      <motion.div
        className={`absolute ${sizes[size]} rounded-2xl`}
        style={{ boxShadow: `0 0 40px 8px ${config.glowColor}` }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: config.breathe, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Avatar image */}
      <motion.div
        className={`relative ${sizes[size]} rounded-2xl overflow-hidden shrink-0`}
        animate={{
          scale: [1, 1.03, 1],
          filter: [`brightness(${config.brightness})`, `brightness(${config.brightness + 0.05})`, `brightness(${config.brightness})`],
        }}
        transition={{ duration: config.breathe, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={deloresImg}
          alt="Delores – your emotional companion"
          className="w-full h-full object-cover"
        />
        {/* Ring */}
        <div
          className={`absolute inset-0 rounded-2xl ${ringSizes[size]}`}
          style={{ boxShadow: `inset 0 0 0 2px ${config.ringColor}` }}
        />
      </motion.div>
    </div>
  );
};

export default DeloresAvatar;
