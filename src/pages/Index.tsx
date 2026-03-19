import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Compass, FlaskConical, Timer, BookOpen,
  Menu, X, Library as LibraryIcon, Video, User,
  SlidersHorizontal, Info, HelpCircle, Eye, EyeOff,
  Sparkles, ChevronRight, Heart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

/* ════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════ */

const pathways = [
  {
    icon: Compass,
    title: 'Discover',
    description: 'Explore ideas that shift perspective',
    path: '/oasis',
  },
  {
    icon: FlaskConical,
    title: 'Sandbox',
    subtitle: 'Sim Labs',
    description: 'Build experiments & simulations',
    path: '/forge?tab=lab',
    notification: true,
  },
  {
    icon: Timer,
    title: 'Focus',
    description: 'Pomodoro & mental check-in',
    path: '/delores',
    delores: true,
  },
  {
    icon: BookOpen,
    title: 'Assignments',
    description: 'Deep-dive into knowledge',
    path: '/glossa',
  },
];

const menuItems = [
  { icon: LibraryIcon, label: 'Library', hover: 'Your Collection', path: '/library' },
  { icon: Video, label: 'Video', hover: 'Watch & Learn', path: '/video' },
  { icon: User, label: 'Profile', hover: 'Your Settings', path: '/gamification' },
  { icon: SlidersHorizontal, label: 'Preferences', hover: 'Customize App', path: '/gamification' },
  { icon: Info, label: 'About', hover: 'Q-Click Info', path: '/' },
];

const ONBOARDING_KEY = 'qclick-pathway-onboarding-v1';

/* ════════════════════════════════════════════════
   FLOWING TEXT — word-by-word reveal
   ════════════════════════════════════════════════ */

const FlowingText = ({ text, show }: { text: string; show: boolean }) => {
  const words = text.split(' ');
  return (
    <AnimatePresence>
      {show && (
        <motion.p
          className="text-xs text-muted-foreground mt-1.5 flex flex-wrap gap-x-1 leading-relaxed"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 6, filter: 'blur(3px)' },
                visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
              }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

/* ════════════════════════════════════════════════
   PAGE TRANSITION WRAPPER
   ════════════════════════════════════════════════ */

const pageTransition = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(6px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(4px)' },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

/* ════════════════════════════════════════════════
   INDEX
   ════════════════════════════════════════════════ */

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [bgVideo, setBgVideo] = useState(true);
  const [hovered, setHovered] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showOnboard, setShowOnboard] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [menuHover, setMenuHover] = useState<number | null>(null);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  /* Onboarding */
  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) {
      const t = setTimeout(() => setShowOnboard(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const finishOb = useCallback(() => {
    setShowOnboard(false);
    localStorage.setItem(ONBOARDING_KEY, '1');
  }, []);

  const restartOb = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setObStep(0);
    setShowOnboard(true);
    setMenuOpen(false);
  }, []);

  const nextOb = useCallback(() => {
    if (obStep < pathways.length - 1) setObStep(s => s + 1);
    else finishOb();
  }, [obStep, finishOb]);

  /* Smooth page transition navigate */
  const smoothNavigate = useCallback((path: string) => {
    setNavigatingTo(path);
    setTimeout(() => navigate(path), 350);
  }, [navigate]);

  /* Close dashboard on outside click */
  useEffect(() => {
    if (!dashOpen) return;
    const close = () => setDashOpen(false);
    const t = setTimeout(() => document.addEventListener('click', close), 0);
    return () => { clearTimeout(t); document.removeEventListener('click', close); };
  }, [dashOpen]);

  return (
    <motion.div
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      {...pageTransition}
      animate={navigatingTo ? { opacity: 0, scale: 0.96, filter: 'blur(8px)' } : pageTransition.animate}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ═══ BG VIDEO ═══ */}
      <AnimatePresence>
        {bgVideo && (
          <motion.video
            key="bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            autoPlay
            muted
            loop
            playsInline
            className="fixed inset-0 w-full h-full object-cover z-0"
            style={{ filter: 'brightness(1.25)' }}
          >
            <source src="/videos/ambient-bg.mp4" type="video/mp4" />
          </motion.video>
        )}
      </AnimatePresence>
      <div className="fixed inset-0 z-0 bg-background/10" />

      {/* ═══════════ TOP BAR ═══════════ */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex items-center justify-between px-5 pt-5"
      >
        {/* Hamburger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setMenuOpen(true)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-border/40 bg-card/15 hover:bg-card/25 transition-colors"
        >
          <Menu className="w-4 h-4 text-muted-foreground" />
        </motion.button>

        {/* Avatar + Dashboard pullout */}
        <div className="relative flex items-center gap-2">
          {/* Points badge */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center gap-1 px-2 py-1 rounded-xl backdrop-blur-2xl border border-border/30 bg-card/15"
          >
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-foreground">128</span>
          </motion.div>

          {/* Avatar */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={(e) => { e.stopPropagation(); setDashOpen(!dashOpen); }}
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center backdrop-blur-2xl border border-border/40 bg-card/15 overflow-hidden group"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-semibold text-foreground">
                {(profile?.display_name || 'U')[0].toUpperCase()}
              </span>
            )}
            <motion.div
              animate={{ y: [0, 2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-0.5 left-1/2 -translate-x-1/2"
            >
              <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/40 rotate-90" />
            </motion.div>
          </motion.button>

          {/* Dashboard slide-out */}
          <AnimatePresence>
            {dashOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-14 right-0 w-52 rounded-2xl backdrop-blur-3xl border border-border/30 bg-card/70 p-3 shadow-deep"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/20">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">128 Wisdom Points</span>
                </div>
                <button
                  onClick={() => { setDashOpen(false); smoothNavigate('/gamification'); }}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-card/30 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                  Open Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ═══════════ CENTER — LOGO + PATHWAYS ═══════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo — no background, just the image with ambient glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-14 group cursor-pointer"
          onClick={() => smoothNavigate('/delores')}
        >
          <motion.div
            animate={{
              scale: [1, 1.04, 1],
              rotate: [0, 1, -1, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center relative"
          >
            <img
              src="/images/qclick-logo.svg"
              alt="Q-Click"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10 drop-shadow-[0_0_20px_hsl(183_100%_50%/0.15)]"
            />
          </motion.div>

          {/* Ambient glow */}
          <motion.div
            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1.6, 1.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl"
          />

          {/* Delores hover message */}
          <motion.div
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-[10px] text-primary/60 font-medium tracking-wider flex items-center gap-1">
              <Heart className="w-2.5 h-2.5" /> Check in
            </span>
          </motion.div>
        </motion.div>

        {/* ═══ PATHWAY GRID — mobile 1×4 icons only, desktop 2×2 with text ═══ */}

        {/* MOBILE: 1×4 horizontal icon row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex md:hidden gap-4 items-start"
        >
          {pathways.map((p, i) => {
            const isExp = expanded === i;

            return (
              <div key={p.path} className="flex flex-col items-center">
                <motion.button
                  onClick={() => {
                    if (!isExp) {
                      setExpanded(expanded === i ? null : i);
                    } else {
                      smoothNavigate(p.path);
                    }
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileTap={{ scale: 0.88 }}
                  className={cn(
                    'relative w-14 h-14 rounded-2xl backdrop-blur-2xl border flex items-center justify-center transition-all duration-300',
                    isExp
                      ? 'border-primary/30 bg-primary/10 shadow-[0_0_24px_-6px_hsl(183_100%_50%/0.2)]'
                      : 'border-border/30 bg-card/12'
                  )}
                >
                  {/* Notification dot */}
                  {p.notification && (
                    <motion.span
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Onboarding pulse */}
                  {showOnboard && obStep === i && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}

                  <motion.div
                    animate={isExp ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <p.icon
                      className={cn(
                        'w-5 h-5 transition-colors duration-300',
                        isExp ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </motion.div>
                </motion.button>

                {/* Label below icon */}
                <span className={cn(
                  'text-[9px] mt-1.5 font-medium transition-colors duration-300',
                  isExp ? 'text-primary' : 'text-muted-foreground/60'
                )}>
                  {p.title}
                </span>

                {/* Expanded description card */}
                <AnimatePresence>
                  {isExp && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -4, height: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-2 w-28 rounded-xl backdrop-blur-2xl border border-border/20 bg-card/60 p-2 text-center overflow-hidden"
                    >
                      <p className="text-[9px] text-muted-foreground leading-relaxed">{p.description}</p>
                      {p.delores && (
                        <div className="mt-1 flex items-center justify-center gap-1">
                          <Heart className="w-2 h-2 text-secondary/70" />
                          <span className="text-[8px] text-secondary/60">Wellness</span>
                        </div>
                      )}
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

        {/* DESKTOP: 2×2 grid with text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:grid grid-cols-2 gap-3 w-full max-w-sm"
        >
          {pathways.map((p, i) => {
            const isH = hovered === i;
            const isRight = i % 2 === 1;

            return (
              <motion.button
                key={p.path}
                onClick={() => smoothNavigate(p.path)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'relative rounded-2xl backdrop-blur-2xl border border-border/30 bg-card/12 p-5 text-left transition-all duration-500 overflow-hidden',
                  isRight ? 'justify-self-end' : 'justify-self-start',
                )}
                style={{
                  boxShadow: isH
                    ? '0 8px 40px -12px hsl(183 100% 50% / 0.12), inset 0 1px 0 hsl(0 0% 100% / 0.06)'
                    : 'inset 0 1px 0 hsl(0 0% 100% / 0.04)',
                }}
              >
                {/* Notification dot */}
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

                {/* Onboarding pulse */}
                {showOnboard && obStep === i && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}

                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl backdrop-blur-xl border flex items-center justify-center shrink-0 transition-all duration-300',
                      isH
                        ? 'border-primary/20 bg-primary/8'
                        : 'border-border/20 bg-card/20'
                    )}
                  >
                    <p.icon
                      className={cn(
                        'w-4 h-4 transition-colors duration-300',
                        isH ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                      {p.title}
                      {p.subtitle && (
                        <span className="text-muted-foreground font-normal text-xs"> {p.subtitle}</span>
                      )}
                    </h3>
                    <FlowingText text={p.description} show={isH} />
                    {p.delores && isH && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-1.5 flex items-center gap-1"
                      >
                        <Heart className="w-2.5 h-2.5 text-secondary/70" />
                        <span className="text-[9px] text-secondary/60">Wellness</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* ═══════════ BOTTOM ═══════════ */}
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
          className="w-8 h-8 rounded-xl backdrop-blur-2xl border border-border/20 bg-card/10 flex items-center justify-center hover:bg-card/20 transition-colors"
          title={bgVideo ? 'Hide background' : 'Show background'}
        >
          {bgVideo ? (
            <Eye className="w-3 h-3 text-muted-foreground/50" />
          ) : (
            <EyeOff className="w-3 h-3 text-muted-foreground/50" />
          )}
        </motion.button>
      </motion.div>

      {/* ═══════════ SLIDE MENU ═══════════ */}
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
              className="fixed left-0 top-0 bottom-0 z-50 w-60 backdrop-blur-3xl border-r border-border/20 bg-card/85 p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-semibold text-foreground tracking-tight uppercase">Menu</span>
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              <div className="flex flex-col gap-0.5 flex-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={() => setMenuHover(i)}
                    onMouseLeave={() => setMenuHover(null)}
                    onClick={() => { setMenuOpen(false); smoothNavigate(item.path); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-card/30 transition-colors group"
                  >
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    <div className="overflow-hidden h-5 flex items-center">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={menuHover === i ? 'h' : 'l'}
                          initial={{ y: 14, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -14, opacity: 0 }}
                          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                          className={cn(
                            'text-sm block',
                            menuHover === i ? 'text-primary' : 'text-foreground'
                          )}
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
                onClick={restartOb}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/20 bg-card/10 hover:bg-card/25 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-primary/70" />
                <span className="text-xs text-muted-foreground">Quick Tour</span>
              </motion.button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════ ONBOARDING ═══════════ */}
      <AnimatePresence>
        {showOnboard && (
          <motion.div
            key={obStep}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[260px] rounded-2xl p-3.5 backdrop-blur-3xl border border-border/30 bg-card/80 shadow-deep"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg backdrop-blur-xl border border-border/20 bg-card/20 flex items-center justify-center shrink-0">
                {(() => { const I = pathways[obStep].icon; return <I className="w-3.5 h-3.5 text-primary" />; })()}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground">{pathways[obStep].title}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{pathways[obStep].description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/15">
              <div className="flex gap-0.5">
                {pathways.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-0.5 rounded-full transition-all duration-300',
                      i === obStep ? 'w-4 bg-primary' : i < obStep ? 'w-1 bg-primary/30' : 'w-1 bg-border/50'
                    )}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={finishOb} className="text-[9px] text-muted-foreground/60 hover:text-foreground transition-colors">
                  Skip
                </button>
                <button
                  onClick={nextOb}
                  className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-primary/8 text-primary hover:bg-primary/15 transition-colors"
                >
                  {obStep < pathways.length - 1 ? 'Next' : 'Done'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Index;
