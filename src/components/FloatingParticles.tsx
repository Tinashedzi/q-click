import { useMemo } from 'react';
import { motion } from 'framer-motion';

const FloatingParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      opacity: 0.08 + Math.random() * 0.15,
      color: ['jade', 'petal', 'gold', 'clay', 'lavender'][Math.floor(Math.random() * 5)],
    })),
  []);

  const colorMap: Record<string, string> = {
    jade: 'hsl(108 18% 69%)',
    petal: 'hsl(330 25% 75%)',
    gold: 'hsl(43 47% 54%)',
    clay: 'hsl(22 30% 74%)',
    lavender: 'hsl(260 30% 85%)',
  };

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, ${colorMap[p.color]}, transparent)`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, -15, -45, 0],
            x: [0, 10, -8, 12, 0],
            scale: [1, 1.3, 0.8, 1.2, 1],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity * 0.5, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
