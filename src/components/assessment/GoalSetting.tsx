import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const DOMAINS = ['Mathematics', 'Science', 'Language Arts', 'History', 'Technology', 'Arts', 'General'];

const GoalSetting = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('General');

  const { data: goals = [], isLoading } = useQuery({
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

  const createGoal = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('learning_goals').insert({
        user_id: user!.id,
        title,
        description,
        domain,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
      setTitle('');
      setDescription('');
      setShowForm(false);
      toast.success('Learning goal created');
    },
    onError: () => toast.error('Failed to create goal'),
  });

  const deleteGoal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('learning_goals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-goals'] });
      toast.success('Goal removed');
    },
  });

  const updateProgress = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const { error } = await supabase.from('learning_goals').update({
        progress,
        status: progress >= 100 ? 'completed' : 'active',
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['learning-goals'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif text-foreground">Learning Goals</h3>
          <p className="text-sm text-muted-foreground">Set targets, track mastery</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          size="sm"
          variant={showForm ? 'outline' : 'default'}
          className="gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          New Goal
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-xl border border-border/60 p-4 space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master quadratic equations"
                className="bg-background"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description…"
                className="bg-background"
              />
              <div className="flex gap-2 flex-wrap">
                {DOMAINS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDomain(d)}
                    className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                      domain === d
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <Button
                onClick={() => createGoal.mutate()}
                disabled={!title.trim() || createGoal.isPending}
                size="sm"
              >
                {createGoal.isPending ? 'Creating…' : 'Create Goal'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Target className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No learning goals yet. Set your first target above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((goal: any) => (
            <motion.div
              key={goal.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border/60 p-4 group"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground text-sm">{goal.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {goal.domain}
                    </span>
                    {goal.status === 'completed' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/20 text-primary">
                        ✓ Mastered
                      </span>
                    )}
                  </div>
                  {goal.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteGoal.mutate(goal.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={goal.progress} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground font-mono w-8 text-right">{goal.progress}%</span>
              </div>
              <div className="flex gap-1 mt-2">
                {[0, 25, 50, 75, 100].map((v) => (
                  <button
                    key={v}
                    onClick={() => updateProgress.mutate({ id: goal.id, progress: v })}
                    className={`text-[10px] px-1.5 py-0.5 rounded transition-all ${
                      goal.progress >= v
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {v}%
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalSetting;
