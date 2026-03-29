import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass, FlaskConical, Timer, BookOpen,
  Menu, X, Library as LibraryIcon, Video, User,
  SlidersHorizontal, Info, HelpCircle, Eye, EyeOff,
  Sparkles, ChevronRight, Heart, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const ease = [0.22, 1, 0.36, 1] as const;

const pathways = [
  {
    icon: Compass,
    title: 'Discover',
    description: 'Explore ideas that shift perspective',
    path: '/oasis',
    gradient: 'from-primary/10 to-primary/5',
  },
  {
    icon: FlaskConical,
    title: 'Sandbox',
    subtitle: 'Sim Labs',
    description: 'Build experiments & simulations',
    path: '/forge?tab=lab',
    notification: true,
    gradient: 'from-secondary/10 to-secondary/5',
  },
  {
    icon: Timer,
    title: 'Focus',
    description: 'Pomodoro & mental check-in',
    path: '/delores',
    delores: true,
    gradient: 'from-accent/10 to-accent/5',
  },
  {
    icon: BookOpen,
    title: 'Assignments',
    description: 'Deep-dive into knowledge',
    path: '/glossa',
    gradient: 'from-muted to-muted/50',
  },
];

const menuItems = [
  { icon: LibraryIcon, label: 'Library', hover: 'Your Collection', path: '/library' },
  { icon: Video, label: 'Video', hover: 'Watch & Learn', path: '/video' },
  { icon: User, label: 'Profile', hover: 'Your Settings', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', hover: 'Customize App', path: '/gamification' },
  { icon: Info, label: 'About', hover: 'Q-Click Info', path: '/' },
];

const ONBOARDING_KEY = 'qclick-pathway-onboarding-v2';

const TOUR_STEPS = [
  { title: 'Welcome to Q-Click!', body: 'Your personal learning sanctuary. Tap any pathway to begin exploring.', emoji: '✨' },
  { title: 'Discover', body: 'Explore curated ideas and AI-generated quests that shift your perspective.', emoji: '🧭' },
  { title: 'Sandbox', body: 'Build experiments, collide concepts, and run interactive simulations.', emoji: '🧪' },
  { title: 'Focus', body: 'Check in with Delris — your AI wellness coach for mindfulness & focus.', emoji: '⏱️' },
  { title: 'Assignments', body: 'Dive deep into language, meaning, and structured learning paths.', emoji: '📖' },
];

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [bgVideo, setBgVideo] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [menuHover, setMenuHover] = useState<number | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

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

  const restartTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setTourStep(0);
    setShowTour(true);
    setMenuOpen(false);
  }, []);

  const nextTour = useCallback(() => {
    if (tourStep < TOUR_STEPS.length - 1) setTourStep(s => s + 1);
    else finishTour();
  }, [tourStep, finishTour]);

  const smoothNavigate = useCallback((path: string) => {
    setNavigatingTo(path);
    setTimeout(() => navigate(path), 350);
  }, [navigate]);

  useEffect(() => {
    if (!dashOpen) return;
    const close = () => setDashOpen(false);
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', close); };
  }, [dashOpen]);

  return (
    <motion.div
      className="relative w-full min-h-screen flex flex-col overflow-hidden bg-background"
      animate={navigatingTo ? { opacity: 0, scale: 0.96, filter: 'blur(8px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease }}
    >
      {/* BG Video */}
      <AnimatePresence>
        {bgVideo && (
          <motion.video
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            autoPlay muted loop playsInline
            className="fixed inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(1.25)' }}
          >
            <source src="/videos/ambient-bg.mp4" type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>
      <div className="fixed inset-0 z-0 bg-background/10" />

      {/* ═══ TOP BAR ═══ */}
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
          className="w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60 backdrop-blur-xl hover:bg-muted transition-colors"
        >
          <Menu className="w-4 h-4 text-muted-foreground" />
        </motion.button>

        <div className="relative flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl border border-border bg-background/60 backdrop-blur-xl"
            id="wp-counter"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-foreground">128</span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); setDashOpen(!dashOpen); }}
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center border border-border bg-background/60 backdrop-blur-xl overflow-hidden group"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-foreground">
                {(profile?.display_name || 'U')[0].toUpperCase()}
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {dashOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.25, ease }}
                className="absolute top-14 right-0 w-52 rounded-2xl border border-border bg-background/90 backdrop-blur-xl p-3 shadow-float"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">128 Wisdom Points</span>
                </div>
                <button
                  onClick={() => { setDashOpen(false); smoothNavigate('/gamification'); }}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  Open Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══ CENTER — LOGO + PATHWAYS ═══ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo + Welcome */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease }}
          className="relative mb-10 flex flex-col items-center"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1], rotate: [0, 1, -1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center relative"
          >
            <img
              src="/images/qclick-logo.svg"
              alt="Q-Click"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-[0_0_30px_hsl(var(--primary)/0.3)] brightness-125"
            />
          </motion.div>
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1.6, 1.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl"
          />
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease }}
            className="mt-4 text-xl sm:text-2xl font-semibold text-foreground tracking-tight text-center"
          >
            Welcome to Q-Click
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xs text-muted-foreground mt-1"
          >
            Your learning sanctuary
          </motion.p>
        </motion.div>

        {/* MOBILE: 1×4 icon row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
          className="flex md:hidden gap-4 items-start"
        >
          {pathways.map((p, i) => {
            const isExp = expanded === i;
            const isTourTarget = showTour && tourStep === i + 1;
            return (
              <div key={p.path} className="flex flex-col items-center relative">
                <motion.button
                  id={`pathway-mobile-${i}`}
                  onClick={() => isExp ? smoothNavigate(p.path) : setExpanded(i)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
                  whileTap={{ scale: 0.88 }}
                  className={cn(
                    'relative w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300',
                    isExp
                      ? 'border-primary/30 bg-primary/10 shadow-[0_0_24px_-6px_hsl(var(--primary)/0.2)]'
                      : 'border-border bg-background/60 backdrop-blur-xl'
                  )}
                >
                  {p.notification && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {isTourTarget && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                  <p.icon className={cn('w-5 h-5 transition-colors duration-300', isExp ? 'text-primary' : 'text-muted-foreground')} />
                </motion.button>
                <span className={cn('text-[9px] mt-1.5 font-medium transition-colors duration-300', isExp ? 'text-primary' : 'text-muted-foreground/60')}>
                  {p.title}
                </span>
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="mt-2 w-28 rounded-xl border border-border bg-background/80 backdrop-blur-xl p-2 text-center overflow-hidden"
                    >
                      <p className="text-[9px] text-muted-foreground leading-relaxed">{p.description}</p>
                      <motion.span
                        className="inline-block mt-1.5 text-[8px] text-primary/70 font-medium"
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Tap to open →
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* DESKTOP: 2×2 grid cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease }}
          className="hidden md:grid grid-cols-2 gap-3 w-full max-w-lg"
        >
          {pathways.map((p, i) => {
            const isH = hovered === i;
            const isTourTarget = showTour && tourStep === i + 1;
            return (
              <motion.button
                key={p.path}
                id={`pathway-desktop-${i}`}
                onClick={() => smoothNavigate(p.path)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'relative rounded-2xl border bg-background/70 backdrop-blur-xl p-5 text-left transition-all duration-300 overflow-hidden hover:shadow-lg group',
                  isTourTarget ? 'border-primary/40 ring-2 ring-primary/20' : 'border-border hover:border-primary/20'
                )}
              >
                {p.notification && (
                  <motion.div
                    className="absolute top-3 right-3 flex items-center gap-1"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[8px] text-primary/70 font-medium">NEW</span>
                  </motion.div>
                )}
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300',
                    isH ? 'border-primary/20 bg-primary/10' : 'border-border bg-muted'
                  )}>
                    <p.icon className={cn('w-4.5 h-4.5 transition-colors duration-300', isH ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {p.title}
                      {p.subtitle && <span className="text-muted-foreground font-normal text-xs ml-1">{p.subtitle}</span>}
                    </h3>
                    <p className={cn(
                      'text-xs text-muted-foreground mt-1 leading-relaxed transition-opacity duration-300',
                      isH ? 'opacity-100' : 'opacity-70'
                    )}>
                      {p.description}
                    </p>
                  </div>
                </div>
                {/* Hover arrow */}
                <motion.div
                  className="absolute bottom-4 right-4"
                  initial={{ opacity: 0, x: -4 }}
                  animate={isH ? { opacity: 1, x: 0 } : { opacity: 0, x: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-4 h-4 text-primary" />
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ═══ BOTTOM ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-5 pb-5"
      >
        <p className="text-[9px] text-muted-foreground/30 tracking-[0.15em] uppercase font-medium">
          Q-Click v1.0 · Developer Preview
        </p>
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          onClick={() => setBgVideo(!bgVideo)}
          className="w-8 h-8 rounded-xl border border-border bg-background/60 backdrop-blur-xl flex items-center justify-center hover:bg-muted transition-colors"
          title={bgVideo ? 'Hide background' : 'Show background'}
        >
          {bgVideo ? <Eye className="w-3 h-3 text-muted-foreground/50" /> : <EyeOff className="w-3 h-3 text-muted-foreground/50" />}
        </motion.button>
      </motion.div>

      {/* ═══ SLIDE MENU ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-semibold text-foreground tracking-tight uppercase">Menu</span>
                <motion.button whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.85 }} onClick={() => setMenuOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              <div className="flex flex-col gap-0.5 flex-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease }}
                    onMouseEnter={() => setMenuHover(i)}
                    onMouseLeave={() => setMenuHover(null)}
                    onClick={() => { setMenuOpen(false); smoothNavigate(item.path); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-muted transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <div className="overflow-hidden h-5 flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={menuHover === i ? 'h' : 'l'}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.18, ease }}
                          className={cn('text-sm block', menuHover === i ? 'text-primary' : 'text-foreground')}
                        >
                          {menuHover === i ? item.hover : item.label}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}
              </div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={restartTour}
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-foreground/10 backdrop-blur-[2px]"
              onClick={finishTour}
            />
            {/* Tour card */}
            <motion.div
              key={tourStep}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.35, ease }}
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[290px] rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-4 shadow-float"
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
                    <div
                      key={i}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        i === tourStep ? 'w-5 bg-primary' : i < tourStep ? 'w-1.5 bg-primary/40' : 'w-1.5 bg-border'
                      )}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={finishTour} className="text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors">Skip</button>
                  <button
                    onClick={nextTour}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors"
                  >
                    {tourStep < TOUR_STEPS.length - 1 ? (
                      <>Next <ChevronRight className="w-3 h-3" /></>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" /> Let's Go
                      </>
                    )}
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
