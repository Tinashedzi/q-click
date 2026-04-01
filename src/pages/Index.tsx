import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Brain, Target, Zap, Heart,
  Menu, X, ChevronRight, Sparkles, Play,
  Lock, Flame, Trophy, User, Beaker,
  Library as LibraryIcon, Video, SlidersHorizontal,
  HelpCircle, Eye, EyeOff, Crown, Gamepad2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { categories, getVideosByCategory, type VideoItem } from '@/data/videoFeed';
import VideoPlayerModal from '@/components/VideoPlayerModal';

const ease = [0.22, 1, 0.36, 1] as const;

const characters = [
  { name: 'Xavier', role: 'Logical Architect', icon: Brain, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Master logic, coding & systems thinking', progress: 35 },
  { name: 'Nosi', role: 'Research Lead', icon: Target, color: 'text-green-600', bg: 'bg-green-50', desc: 'Deep research, critical analysis & method', progress: 20 },
  { name: 'Oditi', role: 'Pattern Detective', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50', desc: 'Spot connections, solve puzzles', progress: 10 },
];

const pathways = [
  { title: 'Discover', subtitle: 'Master Concepts', desc: 'Connect the dots in your learning.', path: '/oasis', cta: 'Continue', progress: 20, icon: BookOpen },
  { title: 'Focus', subtitle: 'Mindfulness', desc: 'Breathe, reflect, grow.', path: '/delores', cta: 'Begin', progress: 60, icon: Heart },
  { title: 'Sandbox', subtitle: 'Forge Labs', desc: 'Build & experiment.', path: '/forge', cta: 'Open Lab', progress: 35, icon: Beaker },
  { title: 'Quests', subtitle: 'Projects', desc: 'Real-world challenges.', path: '/oasis', cta: 'Explore', progress: 0, icon: Target, locked: true },
];

const menuItems = [
  { icon: LibraryIcon, label: 'Library', path: '/library' },
  { icon: Video, label: 'Video Feed', path: '/video' },
  { icon: User, label: 'Profile', path: '/gamification' },
  { icon: Crown, label: 'Upgrade to Pro', path: '/pricing' },
  { icon: SlidersHorizontal, label: 'Preferences', path: '/gamification' },
];

const ONBOARDING_KEY = 'qclick-onboarding-v5';

const TOUR_STEPS = [
  { title: 'Welcome to Q-Click', body: 'Your personal learning sanctuary. Tap any pathway to begin your journey.', emoji: '✨' },
  { title: 'Four Pathways', body: 'Discover concepts, Focus on wellbeing, Build in the Sandbox, or take on Quests.', emoji: '🧭' },
  { title: 'Daily Insight Feed', body: 'Tap any video to watch curated content from top educational channels.', emoji: '🎬' },
  { title: 'Forge Labs', body: 'Your infinite sandbox — collide concepts, run experiments, build with AI.', emoji: '🔬' },
  { title: 'Go Pro', body: 'Upgrade for unlimited AI, concept maps, personalised paths & more.', emoji: '🔓' },
];

const Index = () => {
  const navigate = useNavigate();
  const { profile, subscription } = useAuth();
  const isMobile = useIsMobile();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState('All');
  const [showPaywall, setShowPaywall] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const filteredVideos = getVideosByCategory(selectedCat);

  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      const t = setTimeout(() => setShowTour(true), 1400);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (videoEnabled && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoEnabled]);

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
      className="relative w-full min-h-screen flex flex-col"
      animate={navigatingTo ? { opacity: 0, scale: 0.96, filter: 'blur(8px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease }}
    >
      {/* ═══ FULLSCREEN VIDEO WALLPAPER ═══ */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {videoEnabled ? (
          <>
            <img
              src="/images/home-hero-study.png"
              alt=""
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-700',
                videoReady ? 'opacity-0' : 'opacity-100'
              )}
            />
            <video
              ref={videoRef}
              src="/videos/qclick-logo-splash.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onCanPlayThrough={() => setVideoReady(true)}
              className={cn(
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
                videoReady ? 'opacity-100' : 'opacity-0'
              )}
              style={{ filter: 'brightness(1.15) contrast(1.05)' }}
            />
          </>
        ) : (
          <img src="/images/home-hero-study.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {/* Subtle overlay for readability */}
        <div className="absolute inset-0 bg-background/20" />
      </div>

      {/* ═══ FIXED TOP BAR (never scrolls) ═══ */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/30">
        <div className="flex items-center justify-between px-5 py-3">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60"
          >
            <Menu className="w-4 h-4 text-foreground" />
          </motion.button>

          <div className="flex items-center gap-2">
            {!subscription.subscribed && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => smoothNavigate('/pricing')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/20"
              >
                <Crown className="w-3 h-3 text-primary" />
                <span className="text-[10px] font-semibold text-primary">Upgrade</span>
              </motion.button>
            )}
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border bg-background/60">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-[10px] font-semibold text-foreground">7 days</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border bg-background/60">
              <Trophy className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-semibold text-foreground">1280</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setVideoEnabled(v => !v)}
              className="w-8 h-8 rounded-xl flex items-center justify-center border border-border bg-background/60"
              title={videoEnabled ? 'Disable background video' : 'Enable background video'}
            >
              {videoEnabled ? <Eye className="w-3 h-3 text-foreground" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => smoothNavigate('/gamification')}
              className="w-10 h-10 rounded-full border-2 border-primary/20 bg-background/60 flex items-center justify-center overflow-hidden"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══ SCROLLABLE CONTENT ═══ */}
      <div className="relative z-10 flex flex-col pt-[68px] pb-24">

        {/* Logo + tagline */}
        <div className="flex flex-col items-center py-6">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16"
          >
            <img src="/images/qclick-logo-new.svg" alt="Q-Click" className="w-full h-full object-contain drop-shadow-xl" />
          </motion.div>
          <p className="text-[10px] text-muted-foreground italic tracking-wide mt-1">the architecture of thought</p>
        </div>

        {/* ═══ PATHWAY CARDS ═══ */}
        <div className="px-5 mt-2">
          <div className={cn('grid gap-3', isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4')}>
            {pathways.map((p, i) => (
              <motion.button
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
                whileHover={{ y: -3, boxShadow: '0 8px 25px -8px hsl(var(--primary) / 0.15)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => p.locked ? setShowPaywall(true) : smoothNavigate(p.path)}
                className="relative w-full rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-4 text-left shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                {p.locked && (
                  <span className="absolute top-3 right-3">
                    <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  </span>
                )}
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-2">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                <p className="text-[10px] text-muted-foreground mb-2">{p.subtitle}</p>
                <Progress value={p.progress} className="h-1 bg-muted" />
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                  {p.cta} <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* ═══ INTERACTIVE GAMES LINK ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease }}
          className="mx-5 mt-4 rounded-2xl border border-accent/20 bg-background/80 backdrop-blur-xl p-4 cursor-pointer"
          onClick={() => smoothNavigate('/glossa')}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Interactive</span>
              <h3 className="text-sm font-semibold text-foreground">P-Net Games</h3>
              <p className="text-[11px] text-muted-foreground">Word puzzles, pattern matching & concept games</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          </div>
        </motion.div>

        {/* ═══ FORGE LABS BANNER ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5, ease }}
          className="mx-5 mt-3 rounded-2xl border border-primary/20 bg-background/80 backdrop-blur-xl p-4 cursor-pointer"
          onClick={() => smoothNavigate('/forge')}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Beaker className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Labs</span>
              <h3 className="text-sm font-semibold text-foreground">Forge Labs</h3>
              <p className="text-[11px] text-muted-foreground">Build concepts, run experiments, create with AI</p>
            </div>
            <ChevronRight className="w-4 h-4 text-primary shrink-0" />
          </div>
        </motion.div>

        {/* ═══ DELORES FLOATING BUTTON ═══ */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4, ease }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => smoothNavigate('/delores')}
          className="fixed bottom-24 right-5 z-30 w-14 h-14 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl flex items-center justify-center shadow-lg pointer-events-auto"
          title="Talk to Delris"
        >
          <Heart className="w-6 h-6 text-primary" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.button>

        {/* ═══ FIND A TUTOR ═══ */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Find a Tutor</h2>
            <button className="text-xs text-primary font-medium flex items-center gap-0.5">All <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className={cn('grid gap-3', isMobile ? 'grid-cols-1' : 'grid-cols-3')}>
            {characters.map((char, i) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4, ease }}
                className={cn('rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-4 cursor-pointer hover:shadow-md transition-all group', char.bg)}
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
                    <Progress value={char.progress} className="h-1 flex-1 bg-muted" />
                    <span className="text-[9px] text-muted-foreground">{char.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ VIDEO FEED ═══ */}
        <div className="px-5 mt-6">
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
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-foreground text-foreground ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-[9px] font-medium bg-foreground/80 text-background px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 text-[8px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                    {video.level}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-foreground line-clamp-1">{video.title}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{video.channel} · {video.category}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ PRO UPSELL ═══ */}
        {!subscription.subscribed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease }}
            className="mx-5 mb-4 rounded-2xl border border-primary/20 bg-background/80 backdrop-blur-xl p-5 relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Premium</span>
                <h3 className="text-base font-semibold text-foreground mt-0.5">Upgrade to Q-Click Pro</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Advanced concept maps, unlimited AI quests, personalized learning paths.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => smoothNavigate('/pricing')}
                  className="mt-3 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
                >
                  View Plans & Pricing
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ QUICK STATS ═══ */}
        <div className="px-5 mb-6">
          <div className={cn('grid gap-3', isMobile ? 'grid-cols-2' : 'grid-cols-4')}>
            {[
              { label: 'Concepts', value: '45' },
              { label: 'Quests', value: '12' },
              { label: 'Projects', value: '3' },
              { label: 'Hours', value: '8' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
                className="rounded-xl border border-border bg-background/70 backdrop-blur-xl p-3 text-center"
              >
                <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-8 text-center">
          <p className="text-[10px] text-muted-foreground">Q-Click v1.0 · Developer Preview</p>
        </div>
      </div>

      {/* ═══ VIDEO PLAYER MODAL ═══ */}
      <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />

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
                <img src="/images/qclick-logo-new.svg" alt="Q-Click" className="w-8 h-8" />
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
                  Unlock advanced concept maps, unlimited AI quests, personalised learning paths, and full Forge Labs access.
                </p>
                <p className="text-xs text-muted-foreground mt-2">Starting at <span className="font-semibold text-foreground">$9.99/month</span></p>
                <div className="flex flex-col gap-2 mt-5">
                  <button
                    onClick={() => { setShowPaywall(false); smoothNavigate('/pricing'); }}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                  >
                    View Plans & Pricing
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
