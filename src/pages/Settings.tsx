import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, User, Bell, Shield, Moon, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const settingsItems = [
  { icon: User, label: 'Edit Profile', desc: 'Display name, avatar, bio' },
  { icon: Bell, label: 'Notifications', desc: 'Manage push & email alerts' },
  { icon: Moon, label: 'Appearance', desc: 'Theme & display preferences' },
  { icon: Shield, label: 'Privacy', desc: 'Data & account privacy' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact us' },
];

const Settings = () => {
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">{profile?.display_name || 'Your account'}</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {settingsItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background/70 backdrop-blur-xl hover:bg-muted/50 transition-colors text-left"
          >
            <item.icon className="w-5 h-5 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={async () => { await signOut(); navigate('/'); }}
        className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Sign Out</span>
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground mt-6">Q-Click v1.0 · Developer Preview</p>
    </div>
  );
};

export default Settings;
