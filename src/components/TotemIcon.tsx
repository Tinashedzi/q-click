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
  delay?: number;
}

const TotemIcon = ({ icon, label, description, path, colorClass, delay = 0 }: TotemIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex flex-col items-center"
    >
      {/* Tooltip */}
      <motion.div
        initial={false}
        animate={{ opacity: showTooltip ? 1 : 0, y: showTooltip ? 0 : 8, scale: showTooltip ? 1 : 0.95 }}
        className="absolute -top-12 whitespace-nowrap px-3 py-1.5 rounded-lg bg-foreground/90 text-background text-xs font-medium pointer-events-none z-10"
      >
        {description}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-foreground/90 rotate-45 -mt-1" />
      </motion.div>

      <Link
        to={path}
        className="group flex flex-col items-center gap-2"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => { setShowTooltip(true); setTimeout(() => setShowTooltip(false), 2000); }}
      >
        <motion.div
          className={cn(
            'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300',
            'group-hover:scale-105 group-hover:shadow-elevated group-active:scale-95',
            colorClass
          )}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ delay: delay + 1, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {icon}
        </motion.div>
        <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors">
          {label}
        </span>
      </Link>
    </motion.div>
  );
};

export default TotemIcon;
