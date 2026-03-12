import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Video, Hammer, Heart, Compass, Trophy, Library, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const desktopTabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/glossa', label: 'Glossa', icon: BookOpen },
  { path: '/delores', label: 'Delores', icon: Heart },
  { path: '/oasis', label: 'Oasis', icon: Compass },
  { path: '/video', label: 'Video', icon: Video },
  { path: '/forge', label: 'Forge', icon: Hammer },
  { path: '/gamification', label: 'Dashboard', icon: Trophy },
  { path: '/library', label: 'Library', icon: Library },
];

const mobileTabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/forge', label: 'Forge', icon: Hammer },
  { path: '/library', label: 'Library', icon: Library },
];

const TabNav = () => {
  const location = useLocation();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:block fixed top-14 left-0 right-0 z-40 glass-wavey border-b border-white/10">
        <div className="container mx-auto flex items-center gap-0.5 px-4 h-11">
          {desktopTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-grotesk font-medium transition-all duration-300',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className={cn('w-4 h-4 transition-transform duration-300', isActive && 'scale-110')} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-xl glass-deep"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-wavey border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around h-16 px-4">
          {mobileTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all duration-300',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute inset-0 rounded-2xl glass-deep"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <motion.div
                  animate={isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                >
                  <tab.icon className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="text-[10px] font-grotesk font-medium relative z-10">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TabNav;
