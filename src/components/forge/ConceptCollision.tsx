import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreditExhaustedFallback from './CreditExhaustedFallback';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CollisionResult {
  theme: string;
  description: string;
  experiments: string[];
  questions: string[];
}

const ConceptCollision = ({ onExperimentSelect, onAddToCanvas }: { 
  onExperimentSelect?: (topic: string) => void;
  onAddToCanvas?: (result: CollisionResult) => void;
}) => {
  const [conceptA, setConceptA] = useState('');
  const [conceptB, setConceptB] = useState('');
  const [colliding, setColliding] = useState(false);
  const [result, setResult] = useState<CollisionResult | null>(null);
  const [errorType, setErrorType] = useState<'credits' | 'rate-limit' | null>(null);

  const collide = async () => {
    if (!conceptA.trim() || !conceptB.trim()) return;
    setColliding(true);
    setResult(null);
    setErrorType(null);

    try {
      const { data, error } = await supabase.functions.invoke('concept-collision', {
        body: { conceptA: conceptA.trim(), conceptB: conceptB.trim() },
      });

      if (error) throw error;
      if (data?.error) {
        if (data.error.includes('credits') || data.error.includes('Payment')) { setErrorType('credits'); return; }
        if (data.error.includes('Rate limit')) { setErrorType('rate-limit'); return; }
        throw new Error(data.error);
      }

      setResult(data as CollisionResult);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('402') || msg.includes('credits')) { setErrorType('credits'); }
      else if (msg.includes('429') || msg.includes('Rate')) { setErrorType('rate-limit'); }
      else { toast.error(msg || 'Failed to collide concepts. Try again.'); }
    } finally {
      setColliding(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Collision inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">Concept A</label>
          <Input
            value={conceptA}
            onChange={e => setConceptA(e.target.value)}
            placeholder="e.g., Fractals"
            className="bg-background/60 border-border/40 h-11"
            onKeyDown={e => e.key === 'Enter' && collide()}
          />
        </div>

        <motion.div
          className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mt-5 shrink-0"
          animate={colliding ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: colliding ? Infinity : 0 }}
        >
          <Zap className="w-4 h-4 text-accent" />
        </motion.div>

        <div className="flex-1 space-y-1.5">
          <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">Concept B</label>
          <Input
            value={conceptB}
            onChange={e => setConceptB(e.target.value)}
            placeholder="e.g., Music Theory"
            className="bg-background/60 border-border/40 h-11"
            onKeyDown={e => e.key === 'Enter' && collide()}
          />
        </div>
      </div>

      <Button
        onClick={collide}
        disabled={colliding || !conceptA.trim() || !conceptB.trim()}
        className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-grotesk tracking-wide"
      >
        {colliding ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Colliding with AI…</>
        ) : (
          <><Zap className="w-4 h-4 mr-2" /> Collide</>
        )}
      </Button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Theme card */}
            <div className="rounded-2xl bg-gradient-to-br from-accent/8 via-primary/5 to-secondary/8 border border-border/30 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">AI Collision Result</p>
                {onAddToCanvas && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAddToCanvas(result)}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    <Sparkles className="w-3 h-3 mr-1" /> Add to Canvas
                  </Button>
                )}
              </div>
              <h3 className="text-xl font-serif text-foreground mb-2">{result.theme}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>
            </div>

            {/* Experiments */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">Experiments to try</p>
              {result.experiments.map((exp, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => onExperimentSelect?.(exp)}
                  className="w-full text-left flex items-center gap-3 p-3.5 rounded-xl bg-card border border-border/40 hover:border-primary/30 hover:shadow-soft transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground flex-1">{exp}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>

            {/* Essential questions */}
            <div className="rounded-2xl bg-muted/30 border border-border/30 p-4 space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-grotesk">Essential Questions</p>
              {result.questions.map((q, i) => (
                <p key={i} className="text-sm text-foreground/80 italic pl-3 border-l-2 border-accent/30">
                  {q}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConceptCollision;
