import { motion } from 'framer-motion';
import { belts } from '@/data/gamificationData';

// Timeline Titles earned at each Aura progression
const TIMELINE_TITLES = [
  { level: 1, title: 'The Awakened', epoch: 'Dawn of Curiosity' },
  { level: 2, title: 'Keeper of Embers', epoch: 'Age of Discovery' },
  { level: 3, title: 'Weaver of Roots', epoch: 'The Verdant Path' },
  { level: 4, title: 'Architect of Tides', epoch: 'Era of Mastery' },
  { level: 5, title: 'Sage of the Infinite', epoch: 'The Great Convergence' },
];

const AURA_COLORS = [
  'from-muted to-muted-foreground/20',
  'from-gold/40 to-gold/10',
  'from-jade/40 to-jade/10',
  'from-silk/40 to-primary/20',
  'from-foreground/30 to-foreground/10',
];

interface AuraLevelProps {
  points?: number;
  conceptsExplored?: number;
}

const AuraLevel = ({ points = 128, conceptsExplored = 8 }: AuraLevelProps) => {
  // Determine current belt/aura
  const currentBelt = [...belts].reverse().find(b => points >= b.pointsRequired) || belts[0];
  const nextBelt = belts.find(b => b.pointsRequired > points);
  const timelineTitle = TIMELINE_TITLES[currentBelt.level - 1] || TIMELINE_TITLES[0];
  const auraColor = AURA_COLORS[currentBelt.level - 1] || AURA_COLORS[0];

  const progress = nextBelt
    ? ((points - currentBelt.pointsRequired) / (nextBelt.pointsRequired - currentBelt.pointsRequired)) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-2"
    >
      {/* Timeline Title */}
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${auraColor} animate-breathe`} />
        <span className="text-xs font-grotesk uppercase tracking-[0.2em] text-foreground/50">
          {timelineTitle.epoch}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-serif text-foreground/90 tracking-tight leading-tight">
        {timelineTitle.title}
      </h2>

      {/* Aura bar */}
      <div className="flex items-center gap-3 mt-1">
        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden max-w-[140px]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 1, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full bg-gradient-to-r ${auraColor}`}
          />
        </div>
        <span className="text-[10px] font-grotesk text-muted-foreground">
          {currentBelt.name} · {points} WP
        </span>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mt-1">
        <div className="text-[10px] text-muted-foreground">
          <span className="text-foreground/70 font-medium">{conceptsExplored}</span> concepts
        </div>
        {nextBelt && (
          <div className="text-[10px] text-muted-foreground">
            <span className="text-foreground/70 font-medium">{nextBelt.pointsRequired - points}</span> WP to {nextBelt.name}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuraLevel;
