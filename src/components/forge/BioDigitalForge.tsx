import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BioResult {
  system: string;
  description: string;
  keyStructures: string[];
  functions: string[];
  connections: string[];
}

const BioDigitalForge = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BioResult | null>(null);

  const explore = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('concept-collision', {
        body: { conceptA: query.trim(), conceptB: 'Human Biology' },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult({
        system: data.theme,
        description: data.description,
        keyStructures: data.experiments?.slice(0, 3) || [],
        functions: data.questions || [],
        connections: [],
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to explore. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border border-border/30 p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Biological Intelligence</h3>
            <p className="text-xs text-muted-foreground">Explore anatomy, physiology, and biological systems with AI</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., Nervous System, Mitochondria, DNA Replication"
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && explore()}
          />
          <Button onClick={explore} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            {loading ? 'Exploring…' : 'Explore'}
          </Button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl border border-border/30 bg-card p-5">
            <h3 className="text-lg font-serif text-foreground mb-2">{result.system}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{result.description}</p>

            {result.keyStructures.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-2">Key Explorations</p>
                <div className="space-y-2">
                  {result.keyStructures.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 border border-border/30">
                      <Activity className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.functions.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-2">Essential Questions</p>
                {result.functions.map((f, i) => (
                  <p key={i} className="text-sm text-foreground/80 italic pl-3 border-l-2 border-primary/30 mb-1.5">{f}</p>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BioDigitalForge;
