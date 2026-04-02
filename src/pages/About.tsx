import { motion } from 'framer-motion';
import { Info, Zap, Brain, Target, Heart, Shield } from 'lucide-react';

const features = [
  { icon: Brain, title: 'Cognitive DNA', desc: 'Personalized learning profile that adapts the entire platform to your unique cognitive style.' },
  { icon: Target, title: 'Learning Oasis', desc: 'Curated STEM content discovery with quests, concepts, and multi-media resources.' },
  { icon: Zap, title: 'The Forge', desc: 'AI-powered creation labs — build scripts, games, simulations, and spatial experiences.' },
  { icon: Heart, title: 'Deloris AI Coach', desc: 'Emotional intelligence companion with mood tracking, journaling, and focus tools.' },
  { icon: Shield, title: 'Achievement Matrix', desc: 'Belt progression, wisdom points, streaks, and real-world skill accreditation.' },
];

const About = () => (
  <div className="container mx-auto px-4 py-8 max-w-2xl">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">About Q-Click</h1>
          <p className="text-sm text-muted-foreground">The future of personalized STEM learning</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-background/70 backdrop-blur-xl p-6 mb-6">
        <p className="text-sm text-foreground leading-relaxed">
          Q-Click is a next-generation learning platform that combines cognitive science, AI mentorship, 
          and gamification to create deeply personalized STEM education experiences. Every learner gets a 
          unique pathway shaped by their Cognitive DNA profile.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-4">Core Capabilities</h2>
      <div className="space-y-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-background/70"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{f.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-8">Q-Click v1.0 · Developer Preview · © 2026</p>
    </motion.div>
  </div>
);

export default About;
