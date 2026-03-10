import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, ExternalLink, Play, RotateCcw, Atom, BarChart3, Microscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const SIMULATION_CATALOG = [
  { id: 'gravity', name: 'Gravity & Orbits', category: 'Physics', url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html', icon: Atom },
  { id: 'waves', name: 'Wave Interference', category: 'Physics', url: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html', icon: Atom },
  { id: 'natural-selection', name: 'Natural Selection', category: 'Biology', url: 'https://phet.colorado.edu/sims/html/natural-selection/latest/natural-selection_en.html', icon: Microscope },
  { id: 'molecules', name: 'Build a Molecule', category: 'Chemistry', url: 'https://phet.colorado.edu/sims/html/build-a-molecule/latest/build-a-molecule_en.html', icon: FlaskConical },
  { id: 'fractions', name: 'Fractions', category: 'Math', url: 'https://phet.colorado.edu/sims/html/fractions-intro/latest/fractions-intro_en.html', icon: BarChart3 },
  { id: 'energy', name: 'Energy Forms', category: 'Physics', url: 'https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_en.html', icon: Atom },
];

interface ExperimentLabProps {
  prefilledTopic?: string;
}

const ExperimentLab = ({ prefilledTopic }: ExperimentLabProps) => {
  const [activeSim, setActiveSim] = useState<typeof SIMULATION_CATALOG[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState(prefilledTopic || '');
  const [customUrl, setCustomUrl] = useState('');

  const filtered = SIMULATION_CATALOG.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(SIMULATION_CATALOG.map(s => s.category))];

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search simulations or paste a PhET URL…"
          className="bg-background/60 border-border/40 h-11 pl-10"
        />
        <FlaskConical className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
      </div>

      {/* Active simulation */}
      <AnimatePresence mode="wait">
        {activeSim && (
          <motion.div
            key={activeSim.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">Now Experimenting</p>
                <h3 className="text-base font-serif text-foreground">{activeSim.name}</h3>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveSim(null)}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Back
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={activeSim.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Full Screen
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border/40 bg-background aspect-[4/3]">
              <iframe
                src={activeSim.url}
                className="w-full h-full"
                title={activeSim.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                allowFullScreen
              />
            </div>

            <div className="rounded-xl bg-muted/30 border border-border/30 p-3">
              <p className="text-xs text-muted-foreground">
                🧪 <span className="text-foreground font-medium">Micro-challenge:</span> Explore this simulation for 5 minutes, then explain one surprising finding. This earns you <span className="text-primary font-medium">+15 Wisdom Points</span>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog grid */}
      {!activeSim && (
        <div className="space-y-4">
          {categories.map(cat => {
            const catSims = filtered.filter(s => s.category === cat);
            if (catSims.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-2">{cat}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {catSims.map((sim, i) => (
                    <motion.button
                      key={sim.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setActiveSim(sim)}
                      className={cn(
                        'text-left p-4 rounded-xl border border-border/40 bg-card',
                        'hover:border-primary/30 hover:shadow-soft transition-all group'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                          <sim.icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{sim.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Interactive · PhET</p>
                        </div>
                        <Play className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No simulations found for "{searchTerm}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try a broader term or paste a PhET URL above</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperimentLab;
