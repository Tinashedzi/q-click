import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Brain, Target, Zap, Heart,
  Menu, X, ChevronRight, Sparkles, Play,
  Lock, Flame, Trophy, User,
  Library as LibraryIcon, Video, SlidersHorizontal,
  Info, HelpCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { categories, getVideosByCategory, type VideoItem } from '@/data/videoFeed';
import BottomNav from '@/components/BottomNav';

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Characters / Learning Paths ─── */
const characters = [
  { name: 'Xavier', role: 'Logical Architect', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Master logic, coding, and systems thinking', progress: 35 },
  { name: 'Nosi', role: 'Research Lead', icon: Target, color: 'text-green-600', bg: 'bg-green-50', desc: 'Deep research, critical analysis, and scientific method', progress: 20 },
  { name: 'Oditi', role: 'Pattern Detective', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Spot connections, solve puzzles, see the unseen', progress: 10 },
];

/* ─── Pathway cards matching mockups ─── */
const pathways = [
  {
    title: 'Master Concepts',
    subtitle: 'Assignments',
    desc: 'Connect the dots in your learning paths.',
    path: '/glossa',
    cta: 'Continue',
    progress: 20,
    icon: BookOpen,
  },
  {
    title: 'Mindfulness & Vitality',
    subtitle: 'Delores',
    desc: 'Grasp Concept – Connect the Dots!',
    path: '/delores',
    cta: 'Begin',
    progress: 60,
    icon: Heart,
    pro: true,
  },
  {
    title: 'Embodied Medicine',
    subtitle: 'Forge',
    desc: 'Build, experiment, and engineer breakthroughs.',
    path: '/forge',
    cta: 'Explore Concepts',
    progress: 35,
    icon: Brain,
  },
  {
    title: 'Project Quests',
    subtitle: 'Oasis',
    desc: 'Unlock Forge Pro for advanced concept map visualization.',
    path: '/oasis',
    cta: 'Explore',
    progress: 0,
    icon: Target,
    locked: true,
  },
];

const menuItems = [
  { icon: LibraryIcon, label: 'Library', path: '/library' },
  { icon: Video, label: 'Video Feed', path: '/video' },
  { icon: User, label: 'Profile', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', path: '/gamification' },
  { icon: Info, label: 'About Q-Click', path: '/' },
];

const ONBOARDING_KEY = 'qclick-onboarding-v3';

const TOUR_STEPS = [
  { title: 'Welcome to Q-Click!', body: 'Your personal learning sanctuary. Explore pathways, track progress, and grow.', emoji: '✨' },
  { title: 'Learning Paths', body: 'Choose a character guide — Xavier, Nosi, or Oditi — to shape your journey.', emoji: '🧭' },
  { title: 'Video Feed', body: 'Watch curated content from top educational channels worldwide.', emoji: '🎬' },
  { title: 'Forge Pro', body: 'Upgrade for AI-powered concept maps, unlimited quests, and more.', emoji: '🔓' },
];

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [showPaywall, setShowPaywall] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const filteredVideos = getVideosByCategory(selectedCat);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      const t = setTimeout(() => setShowTour(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const finishTour = useCallback(() => {
    setShowTour(false);
    localStorage.setItem(ONBOARDING_KEY, '1');
  }, []);

  const nextTour = useCallback(() => {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(s => s + 1);
    else finishTour();
  }, [tourStep, finishTour]);

  const smoothNavigate = useCallback((path: string) => {
    setNavigatingTo(path);
    setTimeout(() => navigate(path), 350);
  }, [navigate]);

  return (
    <motion.div
      className="relative w-full min-h-screen flex flex-col bg-background"
      animate={navigatingTo ? { opacity: 0, scale: 0.96, filter: 'blur(8px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease }}
    >
      {/* ═══ HERO SECTION ═══ */}
      <div className="relative w-full" style={{ minHeight: isMobile ? 320 : 420 }}>
        {/* Background image with fallback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 z-0"
        >
          <img
            src="/images/home-hero-study.png"
            alt=""
            className="w-full h-full object-cover object-top"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </motion.div>

        {/* Fallback gradient while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 z-0" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 30%, hsl(var(--primary) / 0.08), hsl(var(--background)))',
          }} />
        )}

        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="relative z-20 flex items-center justify-between px-5 pt-5"
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60 backdrop-blur-xl"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border bg-background/60 backdrop-blur-xl">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-semibold text-foreground">7 day streak</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border bg-background/60 backdrop-blur-xl">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-foreground">1280 WP</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => smoothNavigate('/gamification')}
              className="w-10 h-10 rounded-full border-2 border-primary/20 bg-background/60 backdrop-blur-xl flex items-center justify-center overflow-hidden"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Logo + Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="relative z-10 flex flex-col items-center mt-6"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 sm:w-24 sm:h-24"
          >
            <img
              src="/images/qclick-hero-logo.png"
              alt="Q-Click"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </motion.div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">Q-Click</h1>
          <p className="text-xs text-muted-foreground mt-0.5">The Architecture of Thought</p>
        </motion.div>

        {/* Delores floating button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => smoothNavigate('/delores')}
          className="absolute bottom-4 right-4 z-20 w-12 h-12 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl flex items-center justify-center shadow-lg"
          title="Talk to Delris"
        >
          <Heart className="w-5 h-5 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.button>
      </div>

      {/* ═══ PATHWAY CARDS ═══ */}
      <div className="px-5 -mt-4 relative z-10">
        <div className={cn(
          'grid gap-3',
          isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'
        )}>
          {pathways.map((p, i) => (
            <motion.button
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
              whileHover={{ y: -3, boxShadow: '0 8px 25px -8px hsl(var(--primary) / 0.15)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => p.locked ? setShowPaywall(true) : smoothNavigate(p.path)}
              className="relative w-full rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-4 text-left shadow-sm hover:shadow-md transition-all overflow-hidden group"
            >
              {p.pro && (
                <span className="absolute top-3 right-3 text-[8px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Pro</span>
              )}
              {p.locked && (
                <span className="absolute top-3 right-3">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                </span>
              )}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{p.subtitle}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{p.desc}</p>
              <div className="flex items-center justify-between">
                <Progress value={p.progress} className="h-1.5 flex-1 mr-3 bg-muted" />
                <span className="text-[10px] text-muted-foreground font-medium">{p.progress}%</span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                {p.cta} <ChevronRight className="w-3 h-3" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ═══ FORGE PRO UPSELL ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5, ease }}
        className="mx-5 mt-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-5 relative overflow-hidden"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Premium</span>
            <h3 className="text-base font-semibold text-foreground mt-0.5">Unlock Forge Pro</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Get advanced concept map visualization, unlimited AI quests, and personalized learning paths.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Zap className="w-3 h-3" /> Concept Collisions</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Brain className="w-3 h-3" /> 10x Learning Speed</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPaywall(true)}
              className="mt-3 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
            >
              Try Forge Pro
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ═══ LEARNING PATHS ═══ */}
      <div className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-foreground">Your Learning Paths</h2>
          <button className="text-xs text-primary font-medium flex items-center gap-0.5">See All <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className={cn('grid gap-3', isMobile ? 'grid-cols-1' : 'grid-cols-3')}>
          {characters.map((char, i) => (
            <motion.div
              key={char.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.4, ease }}
              className={cn('rounded-2xl border border-border p-4 cursor-pointer hover:shadow-md transition-all group', char.bg)}
              onClick={() => smoothNavigate('/oasis')}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-background/80 flex items-center justify-center">
                  <char.icon className={cn('w-5 h-5', char.color)} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{char.name}</h4>
                  <p className="text-[10px] text-muted-foreground">{char.role}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{char.desc}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[9px] text-muted-foreground font-medium">Mastery</span>
                  <Progress value={char.progress} className="h-1 flex-1 bg-muted" />
                  <span className="text-[9px] text-muted-foreground">{char.progress}%</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Continue Quest <ChevronRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ VIDEO FEED ═══ */}
      <div className="px-5 mt-8">
        <h2 className="text-base font-semibold text-foreground mb-3">Daily Insight Feed</h2>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                selectedCat === cat
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className={cn('grid gap-3 pb-6', isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3')}>
          {filteredVideos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease }}
              className="rounded-2xl border border-border bg-background/80 backdrop-blur-xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
              onClick={() => smoothNavigate('/video')}
            >
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <Play className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">{video.channel}</p>
                </div>
                <span className="absolute bottom-2 right-2 text-[9px] font-medium bg-foreground/80 text-background px-1.5 py-0.5 rounded">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 text-[8px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {video.level}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-foreground line-clamp-1">{video.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{video.channel} · {video.category}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{video.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-primary font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    Watch Now <ChevronRight className="w-3 h-3" />
                  </span>
                  <button className="text-[9px] text-muted-foreground hover:text-primary transition-colors">+ Save</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ QUICK STATS ═══ */}
      <div className="px-5 mt-4 mb-24">
        <div className={cn('grid gap-3', isMobile ? 'grid-cols-2' : 'grid-cols-4')}>
          {[
            { label: 'Concepts Mastered', value: '45' },
            { label: 'Quests Completed', value: '12' },
            { label: 'Active Projects', value: '3' },
            { label: 'Hours This Week', value: '8' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
              className="rounded-xl border border-border bg-background/70 p-3 text-center"
            >
              <p className="text-xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ BOTTOM NAV ═══ */}
      <BottomNav />

      {/* ═══ SLIDE MENU ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 border-r border-border bg-background/95 backdrop-blur-xl p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <img src="/images/qclick-logo-new.svg" alt="Q-Click" className="w-6 h-6" />
                  <span className="text-sm font-semibold text-foreground">Q-Click</span>
                </div>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMenuOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease }}
                    onClick={() => { setMenuOpen(false); smoothNavigate(item.path); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-muted transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => {
                  localStorage.removeItem(ONBOARDING_KEY);
                  setTourStep(0);
                  setShowTour(true);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-primary/70" />
                <span className="text-xs text-muted-foreground">Quick Tour</span>
              </motion.button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ═══ ONBOARDING TOUR ═══ */}
      <AnimatePresence>
        {showTour && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-foreground/10 backdrop-blur-[2px]"
              onClick={finishTour}
            />
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.35, ease }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[290px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-4 shadow-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xl">{TOUR_STEPS[tourStep].emoji}</span>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{TOUR_STEPS[tourStep].title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{TOUR_STEPS[tourStep].body}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex gap-1">
                  {TOUR_STEPS.map((_, i) => (
                    <div key={i} className={cn('h-1 rounded-full transition-all', i === tourStep ? 'w-5 bg-primary' : i < tourStep ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-border')} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={finishTour} className="text-[10px] text-muted-foreground/60">Skip</button>
                  <button onClick={nextTour} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-medium">
                    {tourStep < TOUR_STEPS.length - 1 ? <>Next <ChevronRight className="w-3 h-3" /></> : <><Sparkles className="w-3 h-3" /> Let's Go</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ PAYWALL MODAL ═══ */}
      <AnimatePresence>
        {showPaywall && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-foreground/20 backdrop-blur-sm"
              onClick={() => setShowPaywall(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.35, ease }}
              className="fixed inset-x-5 bottom-20 z-[90] max-w-md mx-auto rounded-2xl border border-primary/20 bg-background p-6 shadow-xl"
            >
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Upgrade to Q-Click Pro</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Unlock advanced concept maps, unlimited AI quests, personalized learning paths, and full access to all Forge tools.
                </p>
                <div className="flex flex-col gap-2 mt-5">
                  <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
                    Start Free Trial · 7 Days
                  </button>
                  <button onClick={() => setShowPaywall(false)} className="text-xs text-muted-foreground">
                    Maybe later
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Index;
