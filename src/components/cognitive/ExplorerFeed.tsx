import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, Bookmark, Share2, ChevronUp, ChevronDown, Sparkles, Flame, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedCard {
  id: string;
  title: string;
  body: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xp: number;
  gradient: string;
  icon: string;
}

const feedCards: FeedCard[] = [
  {
    id: '1', title: 'The Fibonacci Spiral in Nature',
    body: 'From sunflower seeds to hurricane spirals — the Fibonacci sequence is nature\'s favourite pattern. Each number is the sum of the two before it: 1, 1, 2, 3, 5, 8, 13…',
    category: 'Mathematics', difficulty: 'beginner', xp: 15, gradient: 'from-jade/20 to-primary/10', icon: '🌻',
  },
  {
    id: '2', title: 'Ubuntu: I Am Because We Are',
    body: '"Umuntu ngumuntu ngabantu" — A person is a person through other people. This Nguni Bantu philosophy redefines identity as inherently communal.',
    category: 'Philosophy', difficulty: 'beginner', xp: 20, gradient: 'from-petal/20 to-accent/10', icon: '🤝',
  },
  {
    id: '3', title: 'Quantum Superposition Simplified',
    body: 'A quantum particle exists in ALL possible states simultaneously until observed. It\'s not that we don\'t know — it literally hasn\'t decided yet.',
    category: 'Physics', difficulty: 'intermediate', xp: 30, gradient: 'from-wave/20 to-silk/10', icon: '⚛️',
  },
  {
    id: '4', title: 'The Bantu Migration',
    body: 'Over 2,000 years, Bantu-speaking peoples spread across sub-Saharan Africa, carrying iron-working, agriculture, and a family of 500+ languages.',
    category: 'History', difficulty: 'intermediate', xp: 25, gradient: 'from-clay/20 to-secondary/10', icon: '🗺️',
  },
  {
    id: '5', title: 'Neuroplasticity: Rewire Your Brain',
    body: 'Your brain physically changes when you learn. New neural pathways form, strengthen, and prune — meaning you are literally not the same person you were yesterday.',
    category: 'Neuroscience', difficulty: 'advanced', xp: 35, gradient: 'from-gold/20 to-secondary/10', icon: '🧠',
  },
  {
    id: '6', title: 'The Art of Spaced Repetition',
    body: 'Forgetting is not failure — it\'s the mechanism that makes remembering powerful. Space your reviews at increasing intervals: 1 day, 3 days, 7 days, 21 days.',
    category: 'Learning Science', difficulty: 'beginner', xp: 15, gradient: 'from-lavender/30 to-wave/10', icon: '📚',
  },
  {
    id: '7', title: 'Isicholo: The Crown of Wisdom',
    body: 'In Zulu tradition, married women wear the isicholo — a wide hat symbolizing respect, status, and accumulated wisdom. Knowledge is meant to be worn proudly.',
    category: 'Culture', difficulty: 'beginner', xp: 20, gradient: 'from-gold/25 to-clay/10', icon: '👑',
  },
];

const difficultyColors: Record<string, string> = {
  beginner: 'bg-jade/20 text-jade',
  intermediate: 'bg-gold/20 text-gold',
  advanced: 'bg-petal/20 text-petal',
};

const ExplorerFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, feedCards.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -60) goNext();
    else if (info.offset.y > 60) goPrev();
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        e.deltaY > 0 ? goNext() : goPrev();
      }
    };
    const el = containerRef.current;
    el?.addEventListener('wheel', handleWheel, { passive: true });
    return () => el?.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev]);

  const card = feedCards[currentIndex];

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Progress dots */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
        {feedCards.map((_, i) => (
          <motion.div
            key={i}
            className={cn('w-1.5 rounded-full transition-all duration-300', i === currentIndex ? 'h-6 bg-foreground/60' : 'h-1.5 bg-foreground/20')}
            animate={{ scale: i === currentIndex ? 1 : 0.8 }}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <AnimatePresence>
        {currentIndex > 0 && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
            onClick={goPrev} className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        )}
        {currentIndex < feedCards.length - 1 && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
            onClick={goNext} className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30">
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 80, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -80, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className={cn(
            'relative w-full max-w-sm mx-auto rounded-3xl p-6 cursor-grab active:cursor-grabbing',
            'bg-gradient-to-br', card.gradient,
            'glass-deep border border-border/30'
          )}
          style={{ touchAction: 'none' }}
        >
          {/* Category + Difficulty */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-grotesk text-muted-foreground tracking-wider uppercase">{card.category}</span>
            <span className={cn('text-[10px] font-grotesk px-2 py-0.5 rounded-full', difficultyColors[card.difficulty])}>
              {card.difficulty}
            </span>
          </div>

          {/* Icon */}
          <motion.div
            className="text-5xl mb-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {card.icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-serif text-foreground mb-3 leading-tight">{card.title}</h3>

          {/* Body */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-6 font-journal">{card.body}</p>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="text-xs font-grotesk text-gold font-medium">+{card.xp} WP</span>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3 pt-3 border-t border-border/30">
            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={() => setLiked(prev => { const n = new Set(prev); n.has(card.id) ? n.delete(card.id) : n.add(card.id); return n; })}
              className="flex items-center gap-1"
            >
              <Heart className={cn('w-5 h-5 transition-colors', liked.has(card.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
              <span className="text-xs text-muted-foreground">{liked.has(card.id) ? 'Liked' : 'Like'}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 1.3 }}
              onClick={() => setSaved(prev => { const n = new Set(prev); n.has(card.id) ? n.delete(card.id) : n.add(card.id); return n; })}
              className="flex items-center gap-1"
            >
              <Bookmark className={cn('w-5 h-5 transition-colors', saved.has(card.id) ? 'fill-gold text-gold' : 'text-muted-foreground')} />
              <span className="text-xs text-muted-foreground">{saved.has(card.id) ? 'Saved' : 'Save'}</span>
            </motion.button>

            <motion.button whileTap={{ scale: 1.3 }} className="flex items-center gap-1 ml-auto">
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>

          {/* Card counter */}
          <div className="absolute top-3 right-3 text-[10px] font-grotesk text-muted-foreground/50">
            {currentIndex + 1}/{feedCards.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExplorerFeed;
