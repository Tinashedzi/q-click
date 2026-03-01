import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Bookmark, Share2, ChevronUp, Sparkles } from 'lucide-react';
import { sampleVideos, toggleBookmark, getBookmarkedVideos } from '@/data/sampleVideos';
import { cn } from '@/lib/utils';

const phaseColors: Record<string, string> = {
  hook: 'text-gold',
  split: 'text-jade',
  radiation: 'text-clay',
  fallout: 'text-petal',
};

const phaseLabels: Record<string, string> = {
  hook: '⚡ Hook',
  split: '🔍 Split',
  radiation: '☀️ Radiation',
  fallout: '🌊 Fallout',
};

const AtomicRevealPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'hook' | 'split' | 'radiation' | 'fallout'>('hook');
  const [bookmarks, setBookmarks] = useState(getBookmarkedVideos());
  const [lastTap, setLastTap] = useState(0);

  const video = sampleVideos[currentIndex];
  const phases = ['hook', 'split', 'radiation', 'fallout'] as const;
  const phaseIndex = phases.indexOf(phase);

  const handleSwipeUp = () => {
    if (currentIndex < sampleVideos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setPhase('hook');
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setPhase('hook');
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -50) handleSwipeUp();
    else if (info.offset.y > 50) handleSwipeDown();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      const isNow = toggleBookmark(video.id);
      setBookmarks(getBookmarkedVideos());
    }
    setLastTap(now);
  };

  const nextPhase = () => {
    if (phaseIndex < phases.length - 1) setPhase(phases[phaseIndex + 1]);
  };

  const prevPhase = () => {
    if (phaseIndex > 0) setPhase(phases[phaseIndex - 1]);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[9/16] bg-foreground/5 rounded-2xl overflow-hidden border border-border/50">
      <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={handleDragEnd} onClick={handleDoubleTap}
        className="absolute inset-0 flex flex-col justify-end p-5 cursor-grab active:cursor-grabbing"
        style={{ background: `linear-gradient(to top, hsl(var(--foreground) / 0.85) 0%, hsl(var(--foreground) / 0.3) 50%, transparent 100%)` }}>

        {/* Category + WP */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <span className="text-xs font-medium bg-background/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-background">{video.category}</span>
          <div className="flex items-center gap-1 text-xs text-background/80">
            <Sparkles className="w-3.5 h-3.5" /> {video.wisdomPoints} WP
          </div>
        </div>

        {/* Phase progress */}
        <div className="flex gap-1 mb-4">
          {phases.map((p, i) => (
            <div key={p} className={cn('flex-1 h-1 rounded-full transition-all', i <= phaseIndex ? 'bg-background/80' : 'bg-background/20')} />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={`${video.id}-${phase}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
            <span className={cn('text-xs font-medium', phaseColors[phase])}>{phaseLabels[phase]}</span>
            <h3 className="text-xl font-serif text-background">{video.title}</h3>
            <p className="text-sm text-background/80 leading-relaxed">{video[phase]}</p>
          </motion.div>
        </AnimatePresence>

        {/* Phase nav */}
        <div className="flex justify-between mt-4">
          <button onClick={prevPhase} disabled={phaseIndex === 0} className="text-xs text-background/60 disabled:opacity-30">← Previous</button>
          <button onClick={nextPhase} disabled={phaseIndex === phases.length - 1} className="text-xs text-background/60 disabled:opacity-30">Next →</button>
        </div>

        {/* Actions */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-4 items-center">
          <button onClick={() => { toggleBookmark(video.id); setBookmarks(getBookmarkedVideos()); }}
            className={cn('w-10 h-10 rounded-full flex items-center justify-center', bookmarks.includes(video.id) ? 'bg-gold/80 text-foreground' : 'bg-background/20 text-background')}>
            <Bookmark className="w-5 h-5" fill={bookmarks.includes(video.id) ? 'currentColor' : 'none'} />
          </button>
          <button className="w-10 h-10 rounded-full bg-background/20 text-background flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe hint */}
        <div className="flex justify-center mt-3">
          <ChevronUp className="w-5 h-5 text-background/40 animate-bounce" />
        </div>
      </motion.div>

      {/* Video counter */}
      <div className="absolute top-4 right-1/2 translate-x-1/2 text-xs text-background/60">{currentIndex + 1}/{sampleVideos.length}</div>
    </div>
  );
};

export default AtomicRevealPlayer;
