import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Beaker, Heart, BarChart3, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const items = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/oasis', label: 'Oasis', icon: Compass },
  { path: '/forge', label: 'Forge', icon: Beaker },
  { path: '/glossa', label: 'Glossa', icon: BookOpen },
  { path: '/delores', label: 'Delris', icon: Heart },
  { path: '/gamification', label: 'Progress', icon: BarChart3 },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 px-4 pointer-events-none">
      <motion.nav
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex items-center gap-0.5 px-3 py-2 rounded-2xl border border-border bg-background/90 backdrop-blur-xl shadow-lg"
      >
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-3 sm:px-4 py-1.5 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomnav-pill"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <motion.div
                animate={isActive ? { y: -1, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.3 }}
                className="relative z-10"
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[9px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
