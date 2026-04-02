import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, User, Bell, Shield, Moon, HelpCircle, Dna, MessageSquare, Info, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tabs = [
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare },
  { key: 'about', label: 'About', icon: Info },
];

const settingsItems = [
  { icon: User, label: 'Edit Profile', desc: 'Display name, avatar, bio' },
  { icon: Bell, label: 'Notifications', desc: 'Manage push & email alerts' },
  { icon: Moon, label: 'Appearance', desc: 'Theme & display preferences' },
  { icon: Shield, label: 'Privacy', desc: 'Data & account privacy' },
  { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs and contact us' },
];

const Settings = () => {
  const { signOut, profile, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');
  const [retaking, setRetaking] = useState(false);

  const handleRetakeDNA = async () => {
    if (!user) return;
    setRetaking(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: null })
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Cognitive DNA cleared — redirecting to onboarding...');
      setTimeout(() => window.location.reload(), 800);
    } catch (e: any) {
      toast.error('Failed to reset profile');
    } finally {
      setRetaking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
            <p className="text-sm text-muted-foreground">{profile?.display_name || 'Your account'}</p>
          </div>
        </div>

        {/* 3-tab menu */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/50 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'feedback') navigate('/feedback');
                else if (t.key === 'about') navigate('/about');
                else setActiveTab(t.key);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === t.key ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Settings list */}
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

        {/* How to Use link */}
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => navigate('/how-to-use')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background/70 backdrop-blur-xl hover:bg-muted/50 transition-colors text-left"
        >
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">How to Use Q-Click</p>
            <p className="text-xs text-muted-foreground">Visual manual, tutorials & docs</p>
          </div>
        </motion.button>
      </div>

      {/* Retake Cognitive DNA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-5 rounded-2xl border-2 border-primary/30 bg-primary/5"
      >
        <div className="flex items-start gap-3 mb-3">
          <Dna className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Cognitive DNA Profile</p>
            <p className="text-xs text-muted-foreground">Recalibrate your AI mentor by retaking the learning assessment.</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRetakeDNA}
          disabled={retaking}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
        >
          {retaking ? 'Resetting...' : 'Retake Cognitive DNA'}
        </motion.button>
      </motion.div>

      {/* Sign out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        onClick={async () => { await signOut(); navigate('/'); }}
        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4 text-destructive" />
        <span className="text-sm font-medium text-destructive">Sign Out</span>
      </motion.button>

      <p className="text-center text-[10px] text-muted-foreground mt-6">Q-Click v1.0 · Developer Preview</p>
    </div>
  );
};

export default Settings;
