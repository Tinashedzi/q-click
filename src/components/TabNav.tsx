import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Video, Hammer, Heart, Compass, Trophy, Library, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const desktopTabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/glossa', label: 'Glossa', icon: BookOpen },
  { path: '/delores', label: 'Delores', icon: Heart },
  { path: '/oasis', label: 'Oasis', icon: Compass },
  { path: '/video', label: 'Video', icon: Video },
  { path: '/forge', label: 'Forge', icon: Hammer },
  { path: '/gamification', label: 'Progress', icon: Trophy },
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
      <nav className="hidden md:block fixed top-14 left-0 right-0 z-40 glass-surface border-b border-border/50">
        <div className="container mx-auto flex items-center gap-1 px-4 h-11">
          {desktopTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-md bg-primary/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav — minimal 3 icons */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around h-16 px-4">
          {mobileTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-lg transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <tab.icon className="w-5 h-5 relative z-10" />
                <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default TabNav;
