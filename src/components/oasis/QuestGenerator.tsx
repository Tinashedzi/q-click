import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Sparkles, Loader2, BookOpen, Users, Hammer, Heart, Clock, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import QuestToForge from '@/components/oasis/QuestToForge';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';

interface QuestStage {
  name: string;
  title: string;
  description: string;
  tasks: { title: string; description: string; type: string; duration_minutes: number }[];
}

interface Quest {
  title: string;
  essential_question: string;
  integrated_domains: string[];
  real_world_connection: string;
  estimated_hours: number;
  stages: QuestStage[];
}

const BELT_LEVELS = [
  { value: 'white', label: 'White Belt', description: 'Beginner — just starting out' },
  { value: 'yellow', label: 'Yellow Belt', description: 'Novice — familiar with basics' },
  { value: 'orange', label: 'Orange Belt', description: 'Intermediate — building fluency' },
  { value: 'green', label: 'Green Belt', description: 'Proficient — connecting concepts' },
  { value: 'blue', label: 'Blue Belt', description: 'Advanced — deep understanding' },
  { value: 'brown', label: 'Brown Belt', description: 'Expert — teaching others' },
  { value: 'black', label: 'Black Sage', description: 'Master — creating new knowledge' },
];

const stageIcons: Record<string, typeof BookOpen> = {
  Research: BookOpen,
  Collaboration: Users,
  Creation: Hammer,
  Reflection: Heart,
};

const stageColors: Record<string, string> = {
  Research: 'text-primary border-primary/20 bg-primary/5',
  Collaboration: 'text-accent border-accent/20 bg-accent/5',
  Creation: 'text-[hsl(var(--ochre-gold))] border-[hsl(var(--ochre-gold))]/20 bg-[hsl(var(--ochre-gold))]/5',
  Reflection: 'text-secondary border-secondary/20 bg-secondary/5',
};

const QuestGenerator = () => {
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();
  const [topic, setTopic] = useState('');
  const [beltLevel, setBeltLevel] = useState('white');
  const [generating, setGenerating] = useState(false);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { session, profile } = useAuth();
  const location = useLocation();

  // Accept prefilled topic from Forge navigation
  useEffect(() => {
    const state = location.state as { prefillTopic?: string } | null;
    if (state?.prefillTopic) {
      setTopic(state.prefillTopic);
    }
  }, [location.state]);

  const generateQuest = async () => {
    if (!topic.trim()) return;
    const hasCredit = await useCredit();
    if (!hasCredit) return;
    setGenerating(true);
    setQuest(null);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quest-architect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, belt_level: beltLevel, mode: 'generate', cognitive_dna: (profile?.preferences as any)?.cognitive_dna }),
      });

      if (resp.status === 429) {
        toast({ title: 'Rate limited', description: 'Please wait and try again.', variant: 'destructive' });
        setGenerating(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: 'Credits exhausted', description: 'Please add AI credits.', variant: 'destructive' });
        setGenerating(false);
        return;
      }
      if (!resp.ok) throw new Error('Generation failed');

      const data = await resp.json();
      if (data.quest) {
        setQuest(data.quest);
        setActiveStage(0);
      } else {
        throw new Error(data.error || 'No quest returned');
      }
    } catch (e) {
      console.error(e);
      toast({ title: 'Generation failed', description: 'Could not generate quest. Try again.', variant: 'destructive' });
    }

    setGenerating(false);
  };

  const saveQuest = async () => {
    if (!quest || !session?.user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('quests').insert({
        user_id: session.user.id,
        title: quest.title,
        essential_question: quest.essential_question,
        integrated_domains: quest.integrated_domains,
        target_belt_level: beltLevel,
        estimated_hours: quest.estimated_hours,
        stages: quest.stages as any,
        real_world_connection: quest.real_world_connection,
      });
      if (error) throw error;
      toast({ title: 'Quest saved!', description: 'Find it in your active quests.' });
    } catch (e) {
      console.error(e);
      toast({ title: 'Save failed', description: 'Could not save quest.', variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Generator form */}
      <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[hsl(var(--ochre-gold))]" />
          <h3 className="text-sm font-grotesk font-medium text-foreground uppercase tracking-wider">Quest Architect</h3>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">What would you like to explore?</label>
          <Input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g., sustainable cities, quantum physics, African history…"
            className="bg-background"
            onKeyDown={e => e.key === 'Enter' && generateQuest()}
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Your belt level</label>
          <div className="flex flex-wrap gap-1.5">
            {BELT_LEVELS.map(b => (
              <button
                key={b.value}
                onClick={() => setBeltLevel(b.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  beltLevel === b.value
                    ? 'bg-secondary text-secondary-foreground border-secondary'
                    : 'bg-background text-muted-foreground border-border/50 hover:border-border'
                )}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={generateQuest} disabled={generating || !topic.trim()} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
          {generating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Architecting quest…</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Quest (1⚡)</>}
        </Button>
      </div>

      {/* Generated quest */}
      <AnimatePresence>
        {quest && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Quest header */}
            <div className="rounded-xl border border-border/50 bg-card p-5">
              <h2 className="text-xl font-serif text-foreground mb-2">{quest.title}</h2>
              <p className="text-sm text-muted-foreground italic mb-4">⟦ {quest.essential_question} ⟧</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {quest.integrated_domains.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary-foreground border border-primary/20">{d}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ~{quest.estimated_hours}h</span>
                <span>{quest.real_world_connection}</span>
              </div>
            </div>

            {/* Stage tabs */}
            <div className="flex gap-1 bg-muted/30 rounded-xl p-1">
              {quest.stages.map((stage, i) => {
                const Icon = stageIcons[stage.name] || BookOpen;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveStage(i)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all',
                      activeStage === i ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{stage.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active stage content */}
            <AnimatePresence mode="wait">
              {quest.stages[activeStage] && (
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className={cn('rounded-xl border p-5', stageColors[quest.stages[activeStage].name] || 'bg-card border-border/50')}
                >
                  <h3 className="text-lg font-serif mb-1">{quest.stages[activeStage].title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{quest.stages[activeStage].description}</p>

                  <div className="space-y-3">
                    {quest.stages[activeStage].tasks.map((task, ti) => (
                      <div key={ti} className="flex items-start gap-3 p-3 rounded-lg bg-background/60 border border-border/30">
                        <div className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-[10px] text-muted-foreground">{ti + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{task.type}</span>
                            <span className="text-[10px] text-muted-foreground">{task.duration_minutes} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show Forge link on Creation stage */}
                  {quest.stages[activeStage]?.name === 'Creation' && (
                    <div className="mt-4">
                      <QuestToForge topic={topic} />
                    </div>
                  )}

                  {activeStage < quest.stages.length - 1 && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveStage(activeStage + 1)}>
                      Next: {quest.stages[activeStage + 1].name} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save button */}
            <Button onClick={saveQuest} disabled={saving} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</> : <><Check className="w-4 h-4 mr-2" /> Save Quest to My Archive</>}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <CreditExhaustedModal open={showExhausted} onClose={() => setShowExhausted(false)} />
    </div>
  );
};

export default QuestGenerator;
