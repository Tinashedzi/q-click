import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Pencil, Library, Trophy, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AmbientCircle from '@/components/AmbientCircle';
import TotemIcon from '@/components/TotemIcon';
import JournalOverlay from '@/components/JournalOverlay';
import FloatingParticles from '@/components/FloatingParticles';
import DeloresGreeting from '@/components/DeloresGreeting';
import OnboardingTour from '@/components/OnboardingTour';
import { OasisSvg, GlossaSvg, DeloresSvg, ForgeSvg } from '@/components/icons/TotemSvgs';

const totems = [
  {
    icon: <OasisSvg className="w-8 h-8 sm:w-10 sm:h-10" />,
    label: 'Oasis',
    description: 'Wisdom and guidance',
    path: '/oasis',
    colorClass: 'bg-clay/20 text-clay glass-deep',
    glowClass: 'bg-clay/30',
    id: 'totem-oasis',
  },
  {
    icon: <GlossaSvg className="w-8 h-8 sm:w-10 sm:h-10" />,
    label: 'Glossa',
    description: 'Explore universal meanings',
    path: '/glossa',
    colorClass: 'bg-jade/20 text-jade glass-deep',
    glowClass: 'bg-jade/30',
    id: 'totem-glossa',
  },
  {
    icon: <DeloresSvg className="w-8 h-8 sm:w-10 sm:h-10" />,
    label: 'Delores',
    description: 'Emotional intelligence',
    path: '/delores',
    colorClass: 'bg-petal/20 text-petal glass-deep',
    glowClass: 'bg-petal/30',
    id: 'totem-delores',
  },
  {
    icon: <ForgeSvg className="w-8 h-8 sm:w-10 sm:h-10" />,
    label: 'Forge',
    description: 'Create and build',
    path: '/forge',
    colorClass: 'bg-gold/20 text-gold glass-deep',
    glowClass: 'bg-gold/30',
    id: 'totem-forge',
  },
];

const secondaryLinks = [
  { icon: Trophy, label: 'Progress', path: '/gamification', color: 'text-gold' },
  { icon: Library, label: 'Library', path: '/library', color: 'text-jade' },
];

const Index = () => {
  const [journalOpen, setJournalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <FloatingParticles />
      <OnboardingTour />

      {/* Ambient Circle Logo */}
      <motion.div
        id="ambient-orb"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-8 relative z-10"
      >
        <AmbientCircle size={180} />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-5"
        >
          <h1 className="text-5xl sm:text-6xl font-serif text-foreground tracking-tight silk-text">
            Sensage
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 italic font-serif tracking-wide">
            the architecture of thought
          </p>
        </motion.div>
      </motion.div>

      {/* Four Totems */}
      <div className="flex items-start justify-center gap-5 sm:gap-8 mb-10 relative z-10">
        {totems.map((t, i) => (
          <TotemIcon key={t.label} {...t} delay={0.3 + i * 0.12} />
        ))}
      </div>

      {/* Delores greeting card */}
      <div className="mb-8 relative z-10 w-full flex justify-center">
        <DeloresGreeting onNavigate={(path) => navigate(path)} />
      </div>

      {/* Secondary links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="flex items-center gap-3 mb-10 relative z-10"
      >
        {secondaryLinks.map((link, i) => (
          <Link
            key={link.path}
            to={link.path}
            className="group flex items-center gap-2 px-4 py-2 rounded-2xl btn-liquid text-sm text-muted-foreground hover:text-foreground"
          >
            <link.icon className={`w-4 h-4 ${link.color} transition-transform group-hover:scale-110`} />
            {link.label}
            <ArrowRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
          </Link>
        ))}
      </motion.div>

      {/* Journal Nub */}
      <motion.button
        id="journal-nub"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.03, y: -3 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setJournalOpen(true)}
        className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 glass-wavey px-6 py-3.5 rounded-2xl shadow-elevated flex items-center gap-3 cursor-pointer z-30 group"
      >
        <div className="w-8 h-8 rounded-xl bg-petal/15 flex items-center justify-center group-hover:bg-petal/25 transition-colors">
          <Pencil className="w-4 h-4 text-petal" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Today's note...</span>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-petal"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>

      {/* Journal Overlay */}
      <JournalOverlay isOpen={journalOpen} onClose={() => setJournalOpen(false)} />
    </div>
  );
};

export default Index;
