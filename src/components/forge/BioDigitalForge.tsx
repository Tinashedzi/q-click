import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ExternalLink, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BioDigitalForgeProps {
  onAddToCanvas?: (result: { theme: string; description: string }) => void;
  prefillTopic?: string;
}

const BIODIGITAL_MODELS: { key: string; label: string; url: string; description: string }[] = [
  { key: 'heart', label: 'Heart', url: 'https://human.biodigital.com/viewer/?id=5sHx', description: 'Explore the chambers, valves, and blood flow of the human heart.' },
  { key: 'brain', label: 'Brain', url: 'https://human.biodigital.com/viewer/?id=5L7n', description: 'Navigate the cerebral cortex, cerebellum, and neural pathways.' },
  { key: 'lungs', label: 'Lungs', url: 'https://human.biodigital.com/viewer/?id=5N6x', description: 'Examine the bronchial tree, alveoli, and respiratory mechanics.' },
  { key: 'skeleton', label: 'Skeleton', url: 'https://human.biodigital.com/viewer/?id=5F0z', description: 'Study the 206 bones of the adult human skeletal system.' },
  { key: 'digestive', label: 'Digestive', url: 'https://human.biodigital.com/viewer/?id=5N7y', description: 'Trace the path from esophagus through stomach and intestines.' },
  { key: 'muscular', label: 'Muscular', url: 'https://human.biodigital.com/viewer/?id=5G2x', description: 'Explore skeletal, smooth, and cardiac muscle groups.' },
  { key: 'eye', label: 'Eye', url: 'https://human.biodigital.com/viewer/?id=5K9m', description: 'Discover the cornea, lens, retina, and optic nerve.' },
];

const BioDigitalForge = ({ onAddToCanvas, prefillTopic }: BioDigitalForgeProps) => {
  const initial = BIODIGITAL_MODELS.find(m => prefillTopic?.toLowerCase().includes(m.key));
  const [selected, setSelected] = useState(initial || null);
  const [showViewer, setShowViewer] = useState(false);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border border-border/30 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Biological Intelligence</h3>
            <p className="text-xs text-muted-foreground">Explore anatomy with interactive 3D models from BioDigital Human</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {BIODIGITAL_MODELS.map(model => (
            <button
              key={model.key}
              onClick={() => { setSelected(model); setShowViewer(false); }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${
                selected?.key === model.key
                  ? 'bg-primary/10 border-primary/30 text-foreground'
                  : 'bg-muted/20 border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/40'
              }`}
            >
              {model.label}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="rounded-2xl border border-border/30 bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-serif text-foreground">{selected.label}</h3>
              <div className="flex items-center gap-2">
                {onAddToCanvas && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-accent hover:text-accent"
                    onClick={() => onAddToCanvas({ theme: selected.label, description: selected.description })}
                  >
                    <LayoutGrid className="w-3 h-3 mr-1" /> Canvas
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowViewer(!showViewer)}>
                  {showViewer ? 'Hide 3D' : 'Show 3D'}
                </Button>
                <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                  Open Full <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
          </div>

          {showViewer && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 400 }} className="rounded-2xl overflow-hidden border border-border/30 bg-background/50">
              <iframe src={selected.url} className="w-full h-[400px]" title={`BioDigital ${selected.label}`} allow="fullscreen" style={{ border: 'none' }} />
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BioDigitalForge;
