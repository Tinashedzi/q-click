import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Loader2, Layers, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SpatialResult {
  title: string;
  description: string;
  spatialDimensions: string[];
  interactiveElements: string[];
  arPossibilities: string[];
}

const SpatialForge = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpatialResult | null>(null);

  const explore = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('concept-collision', {
        body: { conceptA: query.trim(), conceptB: 'Spatial Intelligence & 3D Visualization' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult({
        title: data.theme,
        description: data.description,
        spatialDimensions: data.experiments?.slice(0, 3) || [],
        interactiveElements: [],
        arPossibilities: data.questions || [],
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to explore. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-accent/5 via-primary/5 to-muted/10 border border-border/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Box className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Spatial Intelligence</h3>
            <p className="text-xs text-muted-foreground">Transform any concept into spatial, 3D, and AR explorations</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., Crystal Lattices, Topology, Architectural Design"
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && explore()}
          />
          <Button onClick={explore} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
            {loading ? 'Mapping…' : 'Map'}
          </Button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl border border-border/30 bg-card p-5">
            <h3 className="text-lg font-serif text-foreground mb-2">{result.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{result.description}</p>

            {result.spatialDimensions.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-2">Spatial Experiments</p>
                <div className="space-y-2">
                  {result.spatialDimensions.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <Box className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.arPossibilities.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-2">AR / 3D Questions</p>
                {result.arPossibilities.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground/80 italic">{q}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SpatialForge;
