import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trash2, Star, Tag, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Memory {
  id: string;
  memory_type: string;
  content: any;
  importance_score: number;
  tags: string[];
  created_at: string;
  expires_at: string | null;
}

interface Session {
  id: string;
  session_summary: string | null;
  topics_discussed: string[];
  created_at: string;
  is_active: boolean;
}

const MemoryDashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'memories' | 'sessions'>('memories');

  useEffect(() => {
    if (!session?.user?.id) return;
    loadData();
  }, [session?.user?.id]);

  const loadData = async () => {
    setLoading(true);
    const [memRes, sesRes] = await Promise.all([
      supabase
        .from('delores_memory')
        .select('*')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('delores_sessions')
        .select('id, session_summary, topics_discussed, created_at, is_active')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    if (memRes.data) setMemories(memRes.data);
    if (sesRes.data) setSessions(sesRes.data as Session[]);
    setLoading(false);
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase.from('delores_memory').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'Could not delete memory', variant: 'destructive' });
    } else {
      setMemories(prev => prev.filter(m => m.id !== id));
      toast({ title: 'Memory deleted' });
    }
  };

  const getContentSummary = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content?.summary) return content.summary;
    if (content?.text) return content.text;
    if (content?.insight) return content.insight;
    return JSON.stringify(content).slice(0, 120) + '…';
  };

  const typeIcon: Record<string, string> = {
    interaction: '💬',
    insight: '💡',
    consolidation: '🧠',
    preference: '⚙️',
    emotional: '❤️',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Brain className="w-8 h-8 text-primary animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading memories…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">{memories.length} memories</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20">
          <MessageCircle className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">{sessions.length} sessions</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50">
        {(['memories', 'sessions'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'memories' ? '🧠 Memories' : '💬 Sessions'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'memories' ? (
          <motion.div
            key="memories"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {memories.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No memories yet. Chat with Delores to build your memory.</p>
              </div>
            ) : (
              memories.map(mem => (
                <motion.div
                  key={mem.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 rounded-xl border border-border bg-card/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{typeIcon[mem.memory_type] || '📝'}</span>
                      <span className="text-xs font-medium text-muted-foreground capitalize">{mem.memory_type}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.ceil(mem.importance_score / 2) ? 'text-primary fill-primary' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-7 h-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteMemory(mem.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed">
                    {getContentSummary(mem.content)}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {mem.tags.slice(0, 4).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                          <Tag className="w-2.5 h-2.5 mr-0.5" />{tag}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {format(new Date(mem.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="sessions"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No sessions yet. Start a conversation with Delores.</p>
              </div>
            ) : (
              sessions.map(ses => (
                <div key={ses.id} className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {format(new Date(ses.created_at), 'MMM d, yyyy · h:mm a')}
                    </span>
                    {ses.is_active && (
                      <Badge variant="default" className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">
                        Active
                      </Badge>
                    )}
                  </div>
                  {ses.session_summary && (
                    <p className="text-sm text-foreground">{ses.session_summary}</p>
                  )}
                  {ses.topics_discussed.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ses.topics_discussed.map(topic => (
                        <Badge key={topic} variant="outline" className="text-[10px]">{topic}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryDashboard;
