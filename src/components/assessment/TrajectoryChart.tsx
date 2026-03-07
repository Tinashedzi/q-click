import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const TrajectoryChart = () => {
  const { user } = useAuth();

  const { data: evidence = [] } = useQuery({
    queryKey: ['evidence', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evidence_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: goals = [] } = useQuery({
    queryKey: ['learning-goals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Build trajectory data — cumulative evidence over time
  const trajectoryData = (() => {
    if (evidence.length === 0) return [];
    const byDate: Record<string, number> = {};
    evidence.forEach((e: any) => {
      const d = new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      byDate[d] = (byDate[d] || 0) + 1;
    });
    let cumulative = 0;
    return Object.entries(byDate).map(([date, count]) => {
      cumulative += count;
      return { date, evidence: cumulative };
    });
  })();

  const activeGoals = goals.filter((g: any) => g.status === 'active').length;
  const completedGoals = goals.filter((g: any) => g.status === 'completed').length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum: number, g: any) => sum + (g.progress || 0), 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-serif text-foreground mb-1">Learning Trajectory</h3>
        <p className="text-sm text-muted-foreground">Visualize your cognitive growth over time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl border border-border/60 p-4 text-center">
          <div className="text-2xl font-serif text-foreground">{activeGoals}</div>
          <div className="text-[10px] text-muted-foreground">Active Goals</div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4 text-center">
          <div className="text-2xl font-serif text-primary">{completedGoals}</div>
          <div className="text-[10px] text-muted-foreground">Mastered</div>
        </div>
        <div className="bg-card rounded-xl border border-border/60 p-4 text-center">
          <div className="text-2xl font-serif text-foreground">{avgProgress}%</div>
          <div className="text-[10px] text-muted-foreground">Avg Progress</div>
        </div>
      </div>

      {/* Chart */}
      {trajectoryData.length > 1 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-xl border border-border/60 p-4"
        >
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Cumulative Evidence Over Time</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="evidenceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="evidence"
                  stroke="hsl(var(--primary))"
                  fill="url(#evidenceGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : (
        <div className="bg-card rounded-xl border border-border/60 p-8 text-center text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Collect more evidence to see your learning trajectory chart.</p>
        </div>
      )}

      {/* Goal Progress Bars */}
      {goals.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-muted-foreground">Goal Progress</h4>
          {goals.map((g: any) => (
            <div key={g.id} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-foreground">{g.title}</span>
                <span className="text-muted-foreground font-mono">{g.progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${g.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrajectoryChart;
