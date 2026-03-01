import { Sparkles, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Header = () => {
  const streak = parseInt(localStorage.getItem('sensage-gamification-streak') || '7');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-surface">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Avatar + name */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-jade/40 to-petal/40 flex items-center justify-center ring-1 ring-border/50">
            <span className="text-xs font-semibold text-foreground">S</span>
          </div>
          <Link to="/" className="text-lg font-serif tracking-tight text-foreground hover:text-primary transition-colors">
            Sensage
          </Link>
        </motion.div>

        {/* Right: Streak + WP */}
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/8 border border-destructive/15"
          >
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-medium text-foreground">{streak}</span>
          </motion.div>
          <Link to="/gamification">
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold/15 border border-gold/30 cursor-pointer hover:bg-gold/25 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-medium text-foreground">128 WP</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
