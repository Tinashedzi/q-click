import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: BookOpen,
    title: 'Glossa',
    desc: 'Explore universal meanings across five African & global languages.',
    path: '/glossa',
    color: 'bg-jade/15 text-jade',
  },
  {
    icon: Heart,
    title: 'Delores',
    desc: 'Your emotional intelligence companion — check in, reflect, grow.',
    path: '/delores',
    color: 'bg-petal/15 text-petal',
  },
  {
    icon: Compass,
    title: 'Oasis',
    desc: 'Wisdom, Socratic guidance, and focused learning sessions.',
    path: '/oasis',
    color: 'bg-clay/15 text-clay',
  },
  {
    icon: Video,
    title: 'Video Engine',
    desc: 'Learn through immersive atomic reveals and interactive transcripts.',
    path: '/video',
    color: 'bg-gold/15 text-gold',
  },
  {
    icon: Sparkles,
    title: 'Forge',
    desc: 'Craft new understanding through interactive exercises.',
    path: '/forge',
    color: 'bg-dew/15 text-dew',
  },
  {
    icon: Globe,
    title: 'Meaning Web',
    desc: 'Visualize how concepts connect across cultures.',
    path: '/glossa',
    color: 'bg-jade/15 text-jade',
  },
];

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl md:text-6xl font-serif text-foreground mb-4 leading-tight">
          Language is the <br />
          <span className="text-primary">architecture</span> of thought
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Sensage maps the universal meanings behind words — bridging English, Shona, Xhosa, Afrikaans, and Tswana.
        </p>
      </motion.div>

      {/* Feature grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
          >
            <Link
              to={f.path}
              className="block p-6 rounded-xl border border-border/60 bg-card shadow-soft hover:shadow-card transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-lg ${f.color} flex items-center justify-center mb-3`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-foreground mb-1 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 flex items-center justify-center gap-8 text-center"
      >
        <div>
          <p className="text-2xl font-serif text-foreground">20</p>
          <p className="text-xs text-muted-foreground">Concepts</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-2xl font-serif text-foreground">5</p>
          <p className="text-xs text-muted-foreground">Languages</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div>
          <p className="text-2xl font-serif text-foreground">60+</p>
          <p className="text-xs text-muted-foreground">Sentences</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
