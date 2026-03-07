import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Pencil, Flame, Sparkles, LogOut } from 'lucide-react';
import { OasisSvg, GlossaSvg, DeloresSvg, ForgeSvg } from '@/components/icons/TotemSvgs';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';

const totems = [
  { icon: <OasisSvg className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Oasis', path: '/oasis', accent: 'bg-clay/20 hover:bg-clay/30 text-clay' },
  { icon: <GlossaSvg className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Glossa', path: '/glossa', accent: 'bg-jade/20 hover:bg-jade/30 text-jade' },
  { icon: <DeloresSvg className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Delores', path: '/delores', accent: 'bg-petal/20 hover:bg-petal/30 text-petal' },
  { icon: <ForgeSvg className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Forge', path: '/forge', accent: 'bg-gold/20 hover:bg-gold/30 text-gold' },
];

interface CitadelNavProps {
  onJournalOpen: () => void;
}

const CitadelNav = ({ onJournalOpen }: CitadelNavProps) => {
  const { signOut } = useAuth();
  const streak = 7;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-deep"
    >
      {/* Streak */}
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl">
        <Flame className="w-3.5 h-3.5 text-destructive" />
        <span className="text-xs font-grotesk font-medium text-foreground">{streak}</span>
      </div>

      <div className="w-px h-5 bg-white/10" />

      {totems.map((t, i) => (
        <motion.div
          key={t.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.08, duration: 0.4 }}
        >
          <Link
            to={t.path}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${t.accent} transition-all duration-300 group`}
          >
            {t.icon}
            <span className="text-xs font-grotesk opacity-70 group-hover:opacity-100 transition-opacity hidden sm:inline">
              {t.label}
            </span>
          </Link>
        </motion.div>
      ))}

      <div className="w-px h-5 bg-white/10" />

      {/* Journal nub */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onJournalOpen}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-petal/15 hover:bg-petal/25 text-petal transition-all duration-300"
      >
        <Pencil className="w-3.5 h-3.5" />
        <span className="text-xs font-grotesk opacity-70 hidden sm:inline">Journal</span>
      </motion.button>

      {/* WP counter */}
      <Link to="/gamification">
        <motion.div
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-gold/10 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs font-grotesk font-medium text-foreground">128</span>
        </motion.div>
      </Link>

      <div className="w-px h-5 bg-white/10" />

      {/* Logout */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={signOut}
        className="p-1.5 rounded-xl hover:bg-destructive/10 transition-colors"
        title="Sign out"
      >
        <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
      </motion.button>
    </motion.div>
  );
};

export default CitadelNav;
