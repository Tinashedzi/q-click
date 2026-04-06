import { motion } from 'framer-motion';

interface DeloresAvatarProps {
  moodLevel: number | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isListening?: boolean;
  isSpeaking?: boolean;
}

const moodConfig: Record<number, { breathe: number; color1: string; color2: string; color3: string; pulseOpacity: number }> = {
  1: { breathe: 8, color1: 'hsl(35 70% 65%)', color2: 'hsl(25 60% 72%)', color3: 'hsl(40 55% 70%)', pulseOpacity: 0.35 },
  2: { breathe: 6.5, color1: 'hsl(32 65% 60%)', color2: 'hsl(28 58% 68%)', color3: 'hsl(38 52% 66%)', pulseOpacity: 0.4 },
  3: { breathe: 5, color1: 'hsl(30 72% 58%)', color2: 'hsl(22 60% 65%)', color3: 'hsl(36 55% 62%)', pulseOpacity: 0.5 },
  4: { breathe: 3.5, color1: 'hsl(28 68% 55%)', color2: 'hsl(20 62% 60%)', color3: 'hsl(34 58% 58%)', pulseOpacity: 0.55 },
  5: { breathe: 2.5, color1: 'hsl(25 75% 52%)', color2: 'hsl(18 65% 56%)', color3: 'hsl(32 60% 54%)', pulseOpacity: 0.6 },
};

const sizes = {
  xs: { container: 24, orb: 18 },
  sm: { container: 48, orb: 36 },
  md: { container: 80, orb: 60 },
  lg: { container: 112, orb: 84 },
};

const DeloresAvatar = ({ moodLevel, size = 'md', isListening = false, isSpeaking = false }: DeloresAvatarProps) => {
  const clampedMood = Math.min(5, Math.max(1, moodLevel ?? 3));
  const config = moodConfig[clampedMood];
  const s = sizes[size];
  const active = isListening || isSpeaking;
  const listeningSpeed = active ? config.breathe * 0.4 : config.breathe;

  // Speaking uses amber ring colors
  const ringColor = isSpeaking ? 'hsl(38 85% 55%)' : config.color1;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: s.container, height: s.container }}>
      {/* Outer ripple rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: s.orb + i * 16,
            height: s.orb + i * 16,
            border: `1px solid ${ringColor}`,
          }}
          animate={{
            scale: active ? [1, 1.3 + i * 0.15, 1] : [1, 1.1 + i * 0.05, 1],
            opacity: isSpeaking
              ? [0.2, 0.5 - i * 0.08, 0.2]
              : [0.15 - i * 0.04, 0.3 - i * 0.06, 0.15 - i * 0.04],
          }}
          transition={{
            duration: isSpeaking ? 0.8 + i * 0.15 : listeningSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * (isSpeaking ? 0.12 : 0.3),
          }}
        />
      ))}

      {/* Core glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.orb + 8,
          height: s.orb + 8,
          background: `radial-gradient(circle, ${isSpeaking ? 'hsl(38 85% 55%)' : config.color1} 0%, transparent 70%)`,
        }}
        animate={{
          scale: active ? [1, 1.4, 0.95, 1.3, 1] : [1, 1.15, 1],
          opacity: active ? [0.4, 0.8, 0.3, 0.7, 0.4] : [config.pulseOpacity, config.pulseOpacity + 0.2, config.pulseOpacity],
        }}
        transition={{
          duration: active ? listeningSpeed * 0.7 : listeningSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Main orb */}
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          width: s.orb,
          height: s.orb,
          background: `radial-gradient(circle at 35% 35%, ${config.color1}, ${config.color2} 60%, ${config.color3} 100%)`,
          boxShadow: `
            0 0 ${s.orb * 0.4}px ${isSpeaking ? 'hsl(38 85% 55%)' : config.color1},
            inset 0 -${s.orb * 0.15}px ${s.orb * 0.3}px ${config.color3}
          `,
        }}
        animate={{
          scale: active ? [1, 1.08, 0.96, 1.05, 1] : [1, 1.04, 1],
        }}
        transition={{
          duration: active ? listeningSpeed * 0.6 : listeningSpeed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Inner specular highlight */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: s.orb * 0.4,
            height: s.orb * 0.35,
            top: '15%',
            left: '20%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            x: active ? [-2, 2, -2] : [0, 1, 0],
          }}
          transition={{ duration: listeningSpeed, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Swirling inner gradient */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent, ${config.color2} 90deg, transparent 180deg, ${config.color1} 270deg, transparent)`,
            opacity: 0.3,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: listeningSpeed * 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

export default DeloresAvatar;
