import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RubricCriteria {
  name: string;
  description: string;
  levels: {
    beginning: string;
    developing: string;
    proficient: string;
    mastery: string;
  };
}

const LEVEL_COLORS: Record<string, string> = {
  beginning: 'bg-destructive/10 text-destructive',
  developing: 'bg-secondary/20 text-secondary-foreground',
  proficient: 'bg-primary/15 text-primary',
  mastery: 'bg-accent/20 text-accent-foreground',
};

const RubricGenerator = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expandedRubric, setExpandedRubric] = useState<string | null>(null);

  const { data: goals = [] } = useQuery({
    queryKey: ['learning-goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: rubrics = [], isLoading } = useQuery({
    queryKey: ['rubrics', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rubrics')
        .select('*, learning_goals(title)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const generateRubric = async () => {
    if (!selectedGoalId) return;
    const goal = goals.find((g: any) => g.id === selectedGoalId);
    if (!goal) return;

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-rubric', {
        body: { goalTitle: (goal as any).title, goalDescription: (goal as any).description, domain: (goal as any).domain },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      // Save rubric to DB
      const { error: insertError } = await supabase.from('rubrics').insert({
        user_id: user!.id,
        goal_id: selectedGoalId,
        title: data.title,
        criteria: data.criteria,
        generated_by_ai: true,
      });
      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ['rubrics'] });
      toast.success('Rubric generated!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to generate rubric');
    } finally {
      setGenerating(false);
    }
  };

  const deleteRubric = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rubrics').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubrics'] });
      toast.success('Rubric removed');
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-serif text-foreground mb-1">AI Rubric Generator</h3>
        <p className="text-sm text-muted-foreground">Generate mastery-based rubrics from your learning goals</p>
      </div>

      {/* Generator */}
      <div className="bg-card rounded-xl border border-border/60 p-4 space-y-3">
        <select
          value={selectedGoalId || ''}
          onChange={(e) => setSelectedGoalId(e.target.value || null)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Select a learning goal…</option>
          {goals.map((g: any) => (
            <option key={g.id} value={g.id}>{g.title} ({g.domain})</option>
          ))}
        </select>
        <Button
          onClick={generateRubric}
          disabled={!selectedGoalId || generating}
          className="gap-1.5"
          size="sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {generating ? 'Generating…' : 'Generate Rubric'}
        </Button>
      </div>

      {/* Rubric List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : rubrics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No rubrics yet. Select a goal and generate one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rubrics.map((rubric: any) => {
            const isExpanded = expandedRubric === rubric.id;
            const criteria: RubricCriteria[] = rubric.criteria || [];
            return (
              <motion.div
                key={rubric.id}
                layout
                className="bg-card rounded-xl border border-border/60 overflow-hidden group"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedRubric(isExpanded ? null : rubric.id)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground">{rubric.title}</h4>
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    {rubric.learning_goals && (
                      <span className="text-[10px] text-muted-foreground">
                        Goal: {(rubric.learning_goals as any).title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteRubric.mutate(rubric.id); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-4">
                        {criteria.map((c, ci) => (
                          <div key={ci} className="space-y-2">
                            <div>
                              <h5 className="text-xs font-medium text-foreground">{c.name}</h5>
                              <p className="text-[10px] text-muted-foreground">{c.description}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {(['beginning', 'developing', 'proficient', 'mastery'] as const).map((level) => (
                                <div key={level} className={`rounded-lg p-2 ${LEVEL_COLORS[level]}`}>
                                  <div className="text-[10px] font-medium capitalize mb-0.5">{level}</div>
                                  <p className="text-[10px] leading-relaxed opacity-80">{c.levels[level]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RubricGenerator;
