import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Eye, Loader2, ExternalLink, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreditExhaustedFallback from './CreditExhaustedFallback';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BioResult {
  system: string;
  description: string;
  keyStructures: string[];
  functions: string[];
  connections: string[];
}

interface BioDigitalForgeProps {
  onAddToCanvas?: (result: { theme: string; description: string }) => void;
  prefillTopic?: string;
}

const BIODIGITAL_MODELS: Record<string, string> = {
  'heart': 'https://human.biodigital.com/viewer/?id=5sHx',
  'brain': 'https://human.biodigital.com/viewer/?id=5L7n',
  'lungs': 'https://human.biodigital.com/viewer/?id=5N6x',
  'skeleton': 'https://human.biodigital.com/viewer/?id=5F0z',
  'digestive': 'https://human.biodigital.com/viewer/?id=5N7y',
  'nervous system': 'https://human.biodigital.com/viewer/?id=5L7n',
  'muscular': 'https://human.biodigital.com/viewer/?id=5G2x',
  'eye': 'https://human.biodigital.com/viewer/?id=5K9m',
};

const findBioDigitalModel = (query: string): string | null => {
  const q = query.toLowerCase();
  for (const [key, url] of Object.entries(BIODIGITAL_MODELS)) {
    if (q.includes(key)) return url;
  }
  return null;
};

const BioDigitalForge = ({ onAddToCanvas, prefillTopic }: BioDigitalForgeProps) => {
  const [query, setQuery] = useState(prefillTopic || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BioResult | null>(null);
  const [bioDigitalUrl, setBioDigitalUrl] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);
  const [errorType, setErrorType] = useState<'credits' | 'rate-limit' | null>(null);

  const explore = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setBioDigitalUrl(null);
    setShowViewer(false);

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

      const modelUrl = findBioDigitalModel(query);
      if (modelUrl) setBioDigitalUrl(modelUrl);
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
            <p className="text-xs text-muted-foreground">Explore anatomy, physiology, and biological systems with AI + 3D models</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g., Heart, Brain, Nervous System, Lungs"
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && explore()}
          />
          <Button onClick={explore} disabled={loading || !query.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            {loading ? 'Exploring…' : 'Explore'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {Object.keys(BIODIGITAL_MODELS).map(model => (
            <button
              key={model}
              onClick={() => { setQuery(model); }}
              className="px-2.5 py-1 text-[10px] rounded-full bg-muted/40 border border-border/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 capitalize transition-colors"
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      {/* BioDigital Human 3D Viewer */}
      {bioDigitalUrl && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">BioDigital Human 3D Model</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowViewer(!showViewer)}
              >
                {showViewer ? 'Hide Viewer' : 'Show 3D Viewer'}
              </Button>
              <a
                href={bioDigitalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Open Full <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          {showViewer && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-border/30 bg-background/50">
              <iframe
                src={bioDigitalUrl}
                className="w-full h-full"
                title="BioDigital Human 3D"
                allow="fullscreen"
                style={{ border: 'none' }}
              />
            </div>
          )}
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="rounded-2xl border border-border/30 bg-card p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-serif text-foreground">{result.system}</h3>
              {onAddToCanvas && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-accent hover:text-accent"
                  onClick={() => onAddToCanvas({ theme: result.system, description: result.description })}
                >
                  <LayoutGrid className="w-3 h-3 mr-1" /> Add to Canvas
                </Button>
              )}
            </div>
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

      {/* Instructions */}
      <div className="rounded-xl bg-muted/20 border border-border/20 px-4 py-3">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk mb-1.5">How to use</p>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
          <li>Type an organ or system name (Heart, Brain, Lungs) to get AI analysis</li>
          <li>Use the quick-access buttons for instant 3D anatomy models</li>
          <li>Click "Show 3D Viewer" to view an interactive BioDigital Human model</li>
          <li>Click "Add to Canvas" to save results to your concept map</li>
          <li>Click "Open Full" to launch the model in a new tab</li>
        </ul>
      </div>
    </div>
  );
};

export default BioDigitalForge;
