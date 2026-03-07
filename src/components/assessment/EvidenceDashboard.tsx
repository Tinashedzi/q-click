import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Trash2, BookOpen, Lightbulb, Beaker } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const EVIDENCE_TYPES = [
  { id: 'reflection', label: 'Reflection', icon: BookOpen },
  { id: 'artifact', label: 'Artifact', icon: FileText },
  { id: 'observation', label: 'Observation', icon: Lightbulb },
  { id: 'experiment', label: 'Experiment', icon: Beaker },
];

const EvidenceDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [evidenceType, setEvidenceType] = useState('reflection');
  const [goalId, setGoalId] = useState<string | null>(null);

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

  const { data: evidence = [], isLoading } = useQuery({
    queryKey: ['evidence', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evidence_entries')
        .select('*, learning_goals(title)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addEvidence = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('evidence_entries').insert({
        user_id: user!.id,
        title,
        content,
        evidence_type: evidenceType,
        goal_id: goalId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      setTitle('');
      setContent('');
      setShowForm(false);
      toast.success('Evidence collected');
    },
    onError: () => toast.error('Failed to add evidence'),
  });

  const deleteEvidence = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('evidence_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      toast.success('Evidence removed');
    },
  });

  const typeCountMap = EVIDENCE_TYPES.map((t) => ({
    ...t,
    count: evidence.filter((e: any) => e.evidence_type === t.id).length,
  }));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {typeCountMap.map((t) => (
          <div key={t.id} className="bg-card rounded-xl border border-border/60 p-3 text-center">
            <t.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="text-lg font-serif text-foreground">{t.count}</div>
            <div className="text-[10px] text-muted-foreground">{t.label}s</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif text-foreground">Evidence Collection</h3>
        <Button onClick={() => setShowForm(!showForm)} size="sm" variant={showForm ? 'outline' : 'default'} className="gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          Collect
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-card rounded-xl border border-border/60 p-4 space-y-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Evidence title…" className="bg-background" />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe what you learned or observed…"
                className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex gap-2 flex-wrap">
                {EVIDENCE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setEvidenceType(t.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all ${
                      evidenceType === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <t.icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>
              {goals.length > 0 && (
                <select
                  value={goalId || ''}
                  onChange={(e) => setGoalId(e.target.value || null)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Link to goal (optional)</option>
                  {goals.map((g: any) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              )}
              <Button onClick={() => addEvidence.mutate()} disabled={!title.trim() || addEvidence.isPending} size="sm">
                {addEvidence.isPending ? 'Saving…' : 'Save Evidence'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : evidence.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No evidence yet. Start collecting your learning artifacts.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {evidence.map((e: any) => {
            const typeInfo = EVIDENCE_TYPES.find((t) => t.id === e.evidence_type) || EVIDENCE_TYPES[0];
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-xl border border-border/60 p-3 group flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                  <typeInfo.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground truncate">{e.title}</h4>
                    {e.learning_goals && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary shrink-0">
                        {(e.learning_goals as any).title}
                      </span>
                    )}
                  </div>
                  {e.content && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{e.content}</p>}
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(e.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteEvidence.mutate(e.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive self-start"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvidenceDashboard;
