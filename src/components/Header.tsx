import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
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

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30"
        >
          <Sparkles className="w-4 h-4 text-gold" />
          <span className="text-sm font-medium text-foreground">128 WP</span>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
