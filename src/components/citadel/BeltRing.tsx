import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { useState, useEffect, useRef } from 'react';

const BeltRing = () => {
  const { progress, currentBelt, nextBelt } = useProgress();
  const totalPoints = progress.wisdom_points;
  const prevPointsRef = useRef(totalPoints);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const prevBeltRef = useRef(currentBelt.level);

  const progressPct = nextBelt
    ? ((totalPoints - currentBelt.pointsRequired) / (nextBelt.pointsRequired - currentBelt.pointsRequired)) * 100
    : 100;

  // Detect belt level-up
  useEffect(() => {
    if (currentBelt.level > prevBeltRef.current) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      prevBeltRef.current = currentBelt.level;
      return () => clearTimeout(timer);
    }
    prevBeltRef.current = currentBelt.level;
  }, [currentBelt.level]);

  // Detect points change for pulse
  const [justEarned, setJustEarned] = useState(false);
  useEffect(() => {
    if (totalPoints > prevPointsRef.current) {
      setJustEarned(true);
      const timer = setTimeout(() => setJustEarned(false), 1200);
      prevPointsRef.current = totalPoints;
      return () => clearTimeout(timer);
    }
    prevPointsRef.current = totalPoints;
  }, [totalPoints]);

  const circumference = 2 * Math.PI * 28;

  return (
    <div className="relative">
      {/* Level-up celebration overlay */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute -inset-8 z-50 flex items-center justify-center pointer-events-none"
          >
            {/* Burst rings */}
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2 border-gold/40"
                initial={{ width: 60, height: 60, opacity: 0.8 }}
                animate={{ width: 120 + i * 30, height: 120 + i * 30, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
              />
            ))}
            {/* Sparkle particles */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                className="absolute w-1.5 h-1.5 rounded-full bg-gold"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 8) * 50,
                  y: Math.sin((i * Math.PI * 2) / 8) * 50,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              />
            ))}
            <motion.span
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: -30, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="text-xs font-grotesk font-semibold text-gold whitespace-nowrap"
            >
              {currentBelt.name}!
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Belt ring */}
      <motion.div
        className="relative w-16 h-16 cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={justEarned ? { scale: [1, 1.15, 1] } : {}}
        transition={justEarned ? { duration: 0.6, ease: 'easeOut' } : {}}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            opacity={0.4}
          />
          {/* Progress arc */}
          <motion.circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="hsl(var(--ochre-gold))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progressPct / 100) }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
          />
          {/* Glow on the tip */}
          <motion.circle
            cx="32" cy="32" r="28"
            fill="none"
            stroke="hsl(var(--ochre-gold) / 0.3)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progressPct / 100) }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
            filter="blur(3px)"
          />
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Award className="w-4 h-4 text-gold mb-0.5" />
          <span className="text-[8px] font-grotesk font-medium text-foreground/70 leading-none">
            Lv{currentBelt.level}
          </span>
        </div>

        {/* Breathing glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: [
            '0 0 0px hsl(43 47% 54% / 0)',
            '0 0 15px hsl(43 47% 54% / 0.2)',
            '0 0 0px hsl(43 47% 54% / 0)',
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
};

export default BeltRing;
