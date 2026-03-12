import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Compass, Hammer, BookOpen, Heart, ArrowRight } from 'lucide-react';

const pathways = [
  {
    icon: Compass,
    title: 'Explore',
    subtitle: 'Discover ideas that change how you see the world',
    path: '/oasis',
    color: 'hsl(var(--electric-cyan))',
    bg: 'hsl(var(--electric-cyan) / 0.08)',
    border: 'hsl(var(--electric-cyan) / 0.2)',
  },
  {
    icon: Hammer,
    title: 'Create',
    subtitle: 'Build projects, experiments & creative works',
    path: '/forge',
    color: 'hsl(var(--sunset-coral))',
    bg: 'hsl(var(--sunset-coral) / 0.08)',
    border: 'hsl(var(--sunset-coral) / 0.2)',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    subtitle: 'Deep-dive into language, meaning & knowledge',
    path: '/glossa',
    color: 'hsl(var(--pearl-mist))',
    bg: 'hsl(0 0% 100% / 0.05)',
    border: 'hsl(0 0% 100% / 0.1)',
  },
  {
    icon: Heart,
    title: 'Reflect',
    subtitle: 'Check in with Delores, your learning companion',
    path: '/delores',
    color: 'hsl(var(--sunset-coral))',
    bg: 'hsl(var(--sunset-coral) / 0.06)',
    border: 'hsl(var(--sunset-coral) / 0.15)',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Centered Logo + Tagline */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center mb-12"
      >
        <img
          src="/images/qclick-logo.svg"
          alt="Q-Click"
          className="w-20 h-20 sm:w-28 sm:h-28 mb-4"
        />
        <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-foreground">
          Q-Click
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground italic font-serif tracking-wide mt-1">
          the architecture of thought
        </p>
      </motion.div>

      {/* Hook line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-center text-muted-foreground text-sm sm:text-base max-w-md mb-10 leading-relaxed"
      >
        Your mind is the most powerful tool you own.
        <br />
        <span className="text-foreground font-medium">Start sharpening it.</span>
      </motion.p>

      {/* Pathway Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg"
      >
        {pathways.map((p, i) => (
          <motion.button
            key={p.path}
            onClick={() => navigate(p.path)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-300 group"
            style={{
              background: p.bg,
              border: `1px solid ${p.border}`,
              boxShadow: hoveredIndex === i ? `0 8px 30px -8px ${p.color}30` : 'none',
            }}
          >
            <p.icon
              className="w-6 h-6 sm:w-7 sm:h-7 mb-3 transition-transform duration-300 group-hover:scale-110"
              style={{ color: p.color }}
            />
            <h3 className="text-base sm:text-lg font-serif text-foreground mb-1">{p.title}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground leading-snug">{p.subtitle}</p>
            <ArrowRight
              className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground/40 group-hover:text-foreground/60 group-hover:translate-x-0.5 transition-all"
            />
          </motion.button>
        ))}
      </motion.div>

      {/* Subtle social proof */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-[11px] text-muted-foreground/50 mt-10 text-center"
      >
        Built for curious minds · Learn anything · Go anywhere
      </motion.p>
    </div>
  );
};

export default Index;
