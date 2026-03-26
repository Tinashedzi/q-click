import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Heart, Play, BarChart3 } from 'lucide-react';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Heart, label: 'Track', path: '/delores' },
  { icon: Play, label: 'Library', path: '/library' },
  { icon: BarChart3, label: 'Progress', path: '/gamification' },
];

interface CitadelNavProps {
  onJournalOpen: () => void;
}

const CitadelNav = ({ onJournalOpen }: CitadelNavProps) => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center bg-background/95 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-float border border-border gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center flex-1"
            >
              {isActive ? (
                <div className="relative flex flex-col items-center">
                  <motion.div
                    layoutId="citadel-bubble"
                    className="w-12 h-12 -mt-5 -mb-1 rounded-full bg-primary flex items-center justify-center shadow-lg border-[3px] border-background"
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  >
                    <motion.div
                      className="text-primary-foreground"
                      initial={{ scale: 0.5, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
                    >
                      <item.icon className="w-5 h-5" />
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
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                >
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground mt-0.5">{item.label}</span>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CitadelNav;
