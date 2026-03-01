import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Compass, Hammer, Sparkles, Pencil, Library, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import AmbientCircle from '@/components/AmbientCircle';
import TotemIcon from '@/components/TotemIcon';
import JournalOverlay from '@/components/JournalOverlay';

const totems = [
  {
    icon: <Compass className="w-7 h-7 sm:w-8 sm:h-8" />,
    label: 'Oasis',
    description: 'Wisdom and guidance',
    path: '/oasis',
    colorClass: 'bg-clay/20 text-clay',
  },
  {
    icon: <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />,
    label: 'Glossa',
    description: 'Explore universal meanings',
    path: '/glossa',
    colorClass: 'bg-jade/20 text-jade',
  },
  {
    icon: <Heart className="w-7 h-7 sm:w-8 sm:h-8" />,
    label: 'Delores',
    description: 'Emotional intelligence',
    path: '/delores',
    colorClass: 'bg-petal/20 text-petal',
  },
  {
    icon: <Hammer className="w-7 h-7 sm:w-8 sm:h-8" />,
    label: 'Forge',
    description: 'Create and build',
    path: '/forge',
    colorClass: 'bg-gold/20 text-gold',
  },
];

const secondaryLinks = [
  { icon: Trophy, label: 'Progress', path: '/gamification', color: 'text-gold' },
  { icon: Library, label: 'Library', path: '/library', color: 'text-jade' },
];

const Index = () => {
  const [journalOpen, setJournalOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8 relative">
      {/* Ambient Circle Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center mb-10"
      >
        <AmbientCircle size={160} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-4"
        >
          <h1 className="text-4xl sm:text-5xl font-serif text-foreground tracking-tight">Sensage</h1>
          <p className="text-sm text-muted-foreground mt-1 italic font-serif">the architecture of thought</p>
        </motion.div>
      </motion.div>

      {/* Four Totems */}
      <div className="flex items-start justify-center gap-6 sm:gap-10 mb-12">
        {totems.map((t, i) => (
          <TotemIcon key={t.label} {...t} delay={0.3 + i * 0.1} />
        ))}
      </div>

      {/* Secondary links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex items-center gap-4 mb-10"
      >
        {secondaryLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:shadow-soft transition-all"
          >
            <link.icon className={`w-3.5 h-3.5 ${link.color}`} />
            {link.label}
          </Link>
        ))}
      </motion.div>

      {/* Journal Nub */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setJournalOpen(true)}
        className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 glass-surface px-6 py-3 rounded-2xl shadow-card flex items-center gap-3 cursor-pointer z-30 hover:shadow-elevated transition-shadow"
      >
        <Pencil className="w-4 h-4 text-petal" />
        <span className="text-sm text-muted-foreground">Today's note...</span>
      </motion.button>

      {/* Journal Overlay */}
      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Index;
