import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, BookOpen, Users, Hammer, Heart, Clock, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface QuestRow {
  id: string;
  title: string;
  essential_question: string;
  integrated_domains: string[];
  target_belt_level: string;
  estimated_hours: number;
  status: string;
  stages: any[];
  real_world_connection: string | null;
  created_at: string;
}

const stageIcons: Record<string, typeof BookOpen> = {
  Research: BookOpen,
  Collaboration: Users,
  Creation: Hammer,
  Reflection: Heart,
};

const QuestLibrary = () => {
  const [quests, setQuests] = useState<QuestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchQuests = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setQuests((data || []) as unknown as QuestRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuests();
  }, [session]);

  const deleteQuest = async (id: string) => {
    const { error } = await supabase.from('quests').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', variant: 'destructive' });
    } else {
      setQuests(prev => prev.filter(q => q.id !== id));
      toast({ title: 'Quest removed' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-12">
        <Scroll className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No quests yet. Generate your first quest above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-grotesk font-medium text-muted-foreground uppercase tracking-wider">Your Quests ({quests.length})</h3>
      {quests.map(quest => {
        const expanded = expandedId === quest.id;
        return (
          <motion.div key={quest.id} layout className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : quest.id)}
              className="w-full p-4 flex items-start gap-3 text-left hover:bg-muted/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">{quest.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{quest.essential_question}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{quest.target_belt_level}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Clock className="w-3 h-3" /> {quest.estimated_hours}h</span>
                </div>
              </div>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', expanded && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/30">
                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {quest.integrated_domains?.map((d: string) => (
                        <span key={d} className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary-foreground border border-primary/20">{d}</span>
                      ))}
                    </div>
                    {quest.real_world_connection && (
                      <p className="text-xs text-muted-foreground">{quest.real_world_connection}</p>
                    )}
                    {Array.isArray(quest.stages) && (
                      <div className="flex gap-2">
                        {quest.stages.map((s: any, i: number) => {
                          const Icon = stageIcons[s.name] || BookOpen;
                          return (
                            <div key={i} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Icon className="w-3 h-3" /> {s.name}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteQuest(quest.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuestLibrary;
