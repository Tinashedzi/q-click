import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Library, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const items = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/delores', label: 'Track', icon: TrendingUp },
  { path: '/library', label: 'Library', icon: Library },
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
        className="pointer-events-auto flex items-center gap-1 px-2 py-2 rounded-2xl border border-border bg-background/80 backdrop-blur-xl shadow-lg"
      >
        {items.slice(0, 2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomnav-dot"
                  className="w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}

        {/* Center Q Logo */}
        <Link
          to="/"
          className="relative -mt-6 mx-1"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full border-2 border-primary/20 bg-background shadow-lg flex items-center justify-center"
          >
            <img
              src="/images/qclick-logo-new.svg"
              alt="Q-Click"
              className="w-9 h-9 object-contain"
            />
          </motion.div>
        </Link>

        {items.slice(2).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomnav-dot"
                  className="w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
