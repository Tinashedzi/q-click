import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Pencil, Flame, Sparkles, LogOut, Home } from 'lucide-react';
import { OasisSvg, GlossaSvg, DeloresSvg, ForgeSvg } from '@/components/icons/TotemSvgs';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';

const navItems = [
  { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
  { icon: <OasisSvg className="w-5 h-5" />, label: 'Oasis', path: '/oasis' },
  { icon: <GlossaSvg className="w-5 h-5" />, label: 'Glossa', path: '/glossa' },
  { icon: <DeloresSvg className="w-5 h-5" />, label: 'Delores', path: '/delores' },
  { icon: <ForgeSvg className="w-5 h-5" />, label: 'Forge', path: '/forge' },
];

interface CitadelNavProps {
  onJournalOpen: () => void;
}

const CitadelNav = ({ onJournalOpen }: CitadelNavProps) => {
  const { signOut } = useAuth();
  const { progress } = useProgress();
  const location = useLocation();
  const streak = progress.streak_days;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Main bar */}
      <div className="flex items-center bg-[hsl(var(--deep-sea))] rounded-2xl px-2 py-2 shadow-elevated relative">
        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1.5">
          <Flame className="w-4 h-4 text-destructive" />
          <span className="text-xs font-grotesk font-semibold text-white/90">{streak}</span>
        </div>

        <div className="w-px h-6 bg-white/15 mx-1" />

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="relative">
                {isActive ? (
                  <motion.div
                    layoutId="citadel-active"
                    className="relative flex flex-col items-center"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  >
                    {/* Raised circle */}
                    <motion.div
                      className="w-12 h-12 -mt-7 rounded-full bg-[hsl(var(--celadon-jade))] flex items-center justify-center shadow-lg border-[3px] border-[hsl(var(--deep-sea))]"
                      initial={{ y: 10, scale: 0.8 }}
                      animate={{ y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="text-white">{item.icon}</div>
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] font-grotesk font-semibold text-white mt-0.5"
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="text-white/60">{item.icon}</div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="w-px h-6 bg-white/15 mx-1" />

        {/* Journal */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onJournalOpen}
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
        >
          <Pencil className="w-4 h-4 text-accent" />
        </motion.button>

        {/* WP */}
        <Link to="/gamification">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs font-grotesk font-semibold text-white/90">{progress.wisdom_points}</span>
          </motion.div>
        </Link>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signOut}
          className="p-2 rounded-xl hover:bg-destructive/20 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-white/50" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CitadelNav;
