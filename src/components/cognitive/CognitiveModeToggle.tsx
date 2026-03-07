import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CognitiveModeToggleProps {
  mode: 'explorer' | 'deep-focus';
  onChange: (mode: 'explorer' | 'deep-focus') => void;
}

const CognitiveModeToggle = ({ mode, onChange }: CognitiveModeToggleProps) => {
  const isExplorer = mode === 'explorer';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex items-center gap-1 p-1 rounded-2xl glass-deep"
    >
      {/* Sliding pill */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-xl"
        style={{ width: 'calc(50% - 4px)' }}
        animate={{
          x: isExplorer ? 4 : 'calc(100% + 4px)',
          background: isExplorer
            ? 'linear-gradient(135deg, hsl(43 47% 54% / 0.4), hsl(22 30% 74% / 0.3))'
            : 'linear-gradient(135deg, hsl(260 30% 85% / 0.5), hsl(190 45% 65% / 0.3))',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      />

      <button
        onClick={() => onChange('explorer')}
        className={cn(
          'relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-grotesk transition-colors duration-300',
          isExplorer ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <Zap className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Explorer</span>
      </button>

      <button
        onClick={() => onChange('deep-focus')}
        className={cn(
          'relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-grotesk transition-colors duration-300',
          !isExplorer ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <Brain className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Deep Focus</span>
      </button>
    </motion.div>
  );
};

export default CognitiveModeToggle;
