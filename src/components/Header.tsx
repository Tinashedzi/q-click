import { Sparkles, Flame, LogOut, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import qclickLogo from '@/assets/qclick-logo.png';

const Header = () => {
  const { profile, signOut } = useAuth();
  const streak = 7; // TODO: persist to DB

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-wavey border-b border-white/10">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Avatar + name */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2.5"
        >
          <motion.div
            className="w-9 h-9 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{
              background: profile?.avatar_url
                ? undefined
                : 'linear-gradient(135deg, hsl(260 30% 85% / 0.5), hsl(190 45% 65% / 0.3), hsl(330 25% 75% / 0.4))',
              animation: 'morph 8s ease-in-out infinite',
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-sm font-grotesk font-semibold text-foreground">
                {(profile?.display_name || 'S')[0].toUpperCase()}
              </span>
            )}
          </motion.div>
          <Link to="/" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <img src={qclickLogo} alt="Q-Click" className="w-6 h-6 object-contain" />
            <span className="text-lg font-semibold tracking-tight text-foreground">Q-Click</span>
          </Link>
        </motion.div>

        {/* Right: Home + Streak + WP + Logout */}
        <div className="flex items-center gap-2">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl glass-deep hover:bg-accent/10 transition-colors"
              title="Home"
            >
              <Home className="w-3.5 h-3.5 text-muted-foreground" />
            </motion.div>
          </Link>
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-deep"
          >
            <Flame className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-grotesk font-medium text-foreground">{streak}</span>
          </motion.div>
          <Link to="/gamification" id="wp-counter">
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-deep cursor-pointer group"
              style={{ boxShadow: '0 0 20px -5px hsl(43 47% 54% / 0.2)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-grotesk font-medium text-foreground">128 WP</span>
            </motion.div>
          </Link>
          <motion.button
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onClick={signOut}
            className="p-2 rounded-xl glass-deep hover:bg-destructive/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
