import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const generateConcept = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setResult({
        topic: topic,
        universalMeaning: `the essence of ${topic.toLowerCase()} as understood across cultures`,
        translations: [
          { lang: 'English', word: topic, pronunciation: `/${topic.toLowerCase()}/` },
          { lang: 'Shona', word: `chi${topic.toLowerCase().slice(0, 4)}a`, pronunciation: `/chi${topic.toLowerCase().slice(0, 4)}a/` },
          { lang: 'Xhosa', word: `u${topic.toLowerCase().slice(0, 4)}o`, pronunciation: `/u${topic.toLowerCase().slice(0, 4)}o/` },
          { lang: 'Afrikaans', word: `${topic.toLowerCase().slice(0, 5)}heid`, pronunciation: `/${topic.toLowerCase().slice(0, 5)}heit/` },
          { lang: 'Tswana', word: `bo${topic.toLowerCase().slice(0, 4)}i`, pronunciation: `/bo${topic.toLowerCase().slice(0, 4)}i/` },
        ],
        examples: [
          `The ${topic.toLowerCase()} connects all living things.`,
          `In Shona culture, ${topic.toLowerCase()} is deeply revered.`,
          `Understanding ${topic.toLowerCase()} requires patience and reflection.`,
        ],
        related: ['wisdom', 'nature', 'culture', 'spirit'],
      });
      setGenerating(false);

      const saved = JSON.parse(localStorage.getItem('sensage-forge-concepts') || '[]');
      saved.push({ topic, createdAt: new Date().toISOString() });
      localStorage.setItem('sensage-forge-concepts', JSON.stringify(saved));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gold/30 bg-gold/5">
        <Zap className="w-5 h-5 text-gold" />
        <p className="text-sm text-muted-foreground">
          Template mode active. <span className="text-foreground font-medium">Enable Lovable Cloud + AI</span> for intelligent concept generation.
        </p>
      </div>

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
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Sparkles className="w-4 h-4" />
            </motion.div>
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
                <Globe className="w-5 h-5 text-jade" />
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
                    <span key={r} className="px-3 py-1 rounded-full text-xs bg-jade/10 text-foreground border border-jade/20">{r}</span>
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
