import { motion } from 'framer-motion';

/**
 * AI Voice-assistant style orb avatar for Delores.
 * Reacts to mood with color shifts, breathing speed, and particle intensity.
 */

interface DeloresAvatarProps {
  moodLevel: number | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isListening?: boolean;
}

const moodConfig: Record<number, { breathe: number; color1: string; color2: string; color3: string; pulseOpacity: number }> = {
  1: { breathe: 8, color1: 'hsl(200 60% 75%)', color2: 'hsl(210 50% 80%)', color3: 'hsl(190 45% 78%)', pulseOpacity: 0.35 },
  2: { breathe: 6.5, color1: 'hsl(195 55% 70%)', color2: 'hsl(180 50% 75%)', color3: 'hsl(210 45% 72%)', pulseOpacity: 0.4 },
  3: { breathe: 5, color1: 'hsl(183 60% 65%)', color2: 'hsl(200 50% 72%)', color3: 'hsl(170 45% 70%)', pulseOpacity: 0.5 },
  4: { breathe: 3.5, color1: 'hsl(170 55% 62%)', color2: 'hsl(183 50% 68%)', color3: 'hsl(160 45% 65%)', pulseOpacity: 0.55 },
  5: { breathe: 2.5, color1: 'hsl(160 50% 58%)', color2: 'hsl(170 55% 62%)', color3: 'hsl(150 45% 60%)', pulseOpacity: 0.6 },
};

const sizes = {
  xs: { container: 24, orb: 18 },
  sm: { container: 48, orb: 36 },
  md: { container: 80, orb: 60 },
  lg: { container: 112, orb: 84 },
};

const DeloresAvatar = ({ moodLevel, size = 'md', isListening = false }: DeloresAvatarProps) => {
  const config = moodConfig[moodLevel ?? 3];
  const s = sizes[size];
  const listeningSpeed = isListening ? config.breathe * 0.4 : config.breathe;

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
            border: `1px solid ${config.color1}`,
          }}
          animate={{
            scale: isListening ? [1, 1.3 + i * 0.15, 1] : [1, 1.1 + i * 0.05, 1],
            opacity: [0.15 - i * 0.04, 0.3 - i * 0.06, 0.15 - i * 0.04],
          }}
          transition={{
            duration: listeningSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Core glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: s.orb + 8,
          height: s.orb + 8,
          background: `radial-gradient(circle, ${config.color1} 0%, transparent 70%)`,
        }}
        animate={{
          scale: isListening ? [1, 1.4, 0.95, 1.3, 1] : [1, 1.15, 1],
          opacity: isListening ? [0.4, 0.8, 0.3, 0.7, 0.4] : [config.pulseOpacity, config.pulseOpacity + 0.2, config.pulseOpacity],
        }}
        transition={{
          duration: isListening ? listeningSpeed * 0.7 : listeningSpeed,
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
            0 0 ${s.orb * 0.4}px ${config.color1},
            inset 0 -${s.orb * 0.15}px ${s.orb * 0.3}px ${config.color3}
          `,
        }}
        animate={{
          scale: isListening ? [1, 1.08, 0.96, 1.05, 1] : [1, 1.04, 1],
        }}
        transition={{
          duration: isListening ? listeningSpeed * 0.6 : listeningSpeed,
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
            x: isListening ? [-2, 2, -2] : [0, 1, 0],
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
