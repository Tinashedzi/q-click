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
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="flex items-end bg-background/95 backdrop-blur-xl rounded-2xl px-2 py-2 shadow-float border border-border relative overflow-visible">
        {/* Streak */}
        <div className="flex items-center gap-1 px-2.5 py-1.5 self-center">
          <Flame className="w-4 h-4 text-destructive" />
          <span className="text-xs font-semibold text-foreground">{streak}</span>
        </div>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        {/* Nav items */}
        <div className="flex items-end gap-0.5 relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center"
              >
                {isActive ? (
                  <div className="relative flex flex-col items-center w-12">
                    <motion.div
                      layoutId="citadel-bubble"
                      className="w-12 h-12 -mb-1 rounded-full bg-primary flex items-center justify-center shadow-lg border-[3px] border-background"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                      style={{ marginTop: -20 }}
                    >
                      <motion.div
                        className="text-primary-foreground"
                        initial={{ scale: 0.5, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
                      >
                        {item.icon}
                      </motion.div>
                    </motion.div>
                    <motion.span
                      layoutId="citadel-label"
                      className="text-[9px] font-semibold text-foreground mt-0.5"
                      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                ) : (
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted transition-colors"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                  >
                    <div className="text-muted-foreground">{item.icon}</div>
                  </motion.div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="w-px h-6 bg-border mx-1 self-center" />

        {/* Journal */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onJournalOpen}
          className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-muted transition-colors self-center"
        >
          <Pencil className="w-4 h-4 text-secondary" />
        </motion.button>

        {/* WP */}
        <Link to="/gamification" className="self-center">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-muted transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">{progress.wisdom_points}</span>
          </motion.div>
        </Link>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={signOut}
          className="p-2 rounded-xl hover:bg-destructive/10 transition-colors self-center"
          title="Sign out"
        >
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CitadelNav;
