import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TotemIconProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  path: string;
  colorClass: string;
  glowClass?: string;
  delay?: number;
  id?: string;
}

const TotemIcon = ({ icon, label, description, path, colorClass, glowClass, delay = 0, id }: TotemIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center"
    >
      {/* Tooltip */}
      <motion.div
        initial={false}
        animate={{
          opacity: showTooltip ? 1 : 0,
          y: showTooltip ? 0 : 8,
          scale: showTooltip ? 1 : 0.9,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-14 whitespace-nowrap px-4 py-2 rounded-2xl glass-wavey text-xs font-medium text-foreground pointer-events-none z-10 shadow-elevated"
      >
        {description}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-3 h-3 glass-wavey rotate-45 -mt-1.5 border-t-0 border-l-0" />
      </motion.div>

      <Link
        to={path}
        className="group flex flex-col items-center gap-2.5"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => { setShowTooltip(true); setTimeout(() => setShowTooltip(false), 2000); }}
      >
        <motion.div
          className={cn(
            'relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-500',
            'group-hover:shadow-elevated group-active:scale-95',
            colorClass
          )}
          whileHover={{ y: -6, scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{ animation: `breathe ${5 + delay}s ease-in-out infinite` }}
        >
          {/* Liquid glow behind on hover */}
          <div className={cn(
            'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10 scale-125',
            glowClass
          )} />
          {icon}
        </motion.div>
        <span className="text-sm font-grotesk font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export default TotemIcon;
