import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface GeneratedConcept {
  topic: string;
  universalMeaning: string;
  translations: { lang: string; word: string; pronunciation: string }[];
  examples: string[];
  related: string[];
}

const ConceptForge = () => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedConcept | null>(null);

  const generateConcept = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('concept-forge', {
        body: { topic: topic.trim() },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult({ topic, ...data });

      const saved = JSON.parse(localStorage.getItem('sensage-forge-concepts') || '[]');
      saved.push({ topic, createdAt: new Date().toISOString() });
      localStorage.setItem('sensage-forge-concepts', JSON.stringify(saved));
    } catch (err: any) {
      console.error('Concept forge error:', err);
      toast.error(err.message || 'Failed to forge concept. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter any topic (e.g., quantum entanglement, ubuntu, photosynthesis)"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && generateConcept()}
        />
        <Button onClick={generateConcept} disabled={generating || !topic.trim()}>
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {generating ? 'Forging...' : 'Forge'}
        </Button>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                ⟦{result.universalMeaning}⟧
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Translations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {result.translations.map((t) => (
                    <div key={t.lang} className="p-3 rounded-lg border border-border/60 bg-muted/30">
                      <p className="text-xs text-muted-foreground">{t.lang}</p>
                      <p className="font-serif text-lg text-foreground">{t.word}</p>
                      <p className="text-xs text-muted-foreground">{t.pronunciation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Example Sentences</h4>
                {result.examples.map((ex, i) => (
                  <p key={i} className="text-sm text-foreground py-1">• {ex}</p>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Related Concepts</h4>
                <div className="flex flex-wrap gap-2">
                  {result.related.map((r) => (
                    <span key={r} className="px-3 py-1 rounded-full text-xs bg-primary/10 text-foreground border border-primary/20">{r}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ConceptForge;
