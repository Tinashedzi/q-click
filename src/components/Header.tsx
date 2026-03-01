import { Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const streak = parseInt(localStorage.getItem('sensage-gamification-streak') || '7');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-surface">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-serif text-lg font-semibold text-primary-foreground">S</span>
          </div>
          <h1 className="text-xl font-serif tracking-tight text-foreground">Sensage</h1>
        </motion.div>

        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 border border-destructive/20"
          >
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span className="text-sm font-medium text-foreground">{streak}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-sm font-medium text-foreground">128 WP</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
