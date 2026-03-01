import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { emotionalMatrix } from '@/engine/delores-matrix';
import { SIGNAL_LABELS, ACTION_CONFIG, type EmotionalState } from '@/types/delores-matrix';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const EmotionalMatrix = () => {
  const [snapshots, setSnapshots] = useState<EmotionalState[]>(emotionalMatrix.getSnapshots());

  const latest = snapshots[snapshots.length - 1] ?? null;

  const radarData = useMemo(() => {
    if (!latest) return [];
    return (Object.keys(SIGNAL_LABELS) as (keyof typeof SIGNAL_LABELS)[]).map(key => ({
      signal: SIGNAL_LABELS[key],
      value: latest.detected[key],
      fullMark: 10,
    }));
  }, [latest]);

  const recentHistory = useMemo(() => snapshots.slice(-8).reverse(), [snapshots]);

  const handleClear = () => {
    if (window.confirm('Clear all emotional matrix data?')) {
      emotionalMatrix.clearData();
      setSnapshots([]);
    }
  };

  if (!latest) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No matrix data yet. Complete a mood check-in to generate your first emotional snapshot.</p>
      </div>
    );
  }

  const actionConfig = ACTION_CONFIG[latest.recommendation.action];

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-card border border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-4">Implicit Signals</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="signal" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Radar name="Signals" dataKey="value" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.25} strokeWidth={2} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Current Recommendation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-xl bg-accent/10 border border-accent/20 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{actionConfig.emoji}</span>
          <Badge variant="secondary" className="text-xs">{actionConfig.label}</Badge>
          <span className="text-xs text-muted-foreground ml-auto">Intensity: {latest.recommendation.intensity}/10</span>
        </div>
        <p className="text-foreground font-serif text-lg italic">"{latest.recommendation.message}"</p>
      </motion.div>

      {/* Recent Snapshots */}
      {recentHistory.length > 1 && (
        <div className="p-4 rounded-xl bg-card border border-border/50">
          <p className="text-sm font-medium text-foreground mb-3">Recent Snapshots</p>
          <div className="space-y-2">
            {recentHistory.map((snap, i) => {
              const cfg = ACTION_CONFIG[snap.recommendation.action];
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="text-xs text-muted-foreground w-16 shrink-0">
                    {new Date(snap.timestamp).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  </span>
                  <span>{cfg.emoji}</span>
                  <span className="text-muted-foreground flex-1 truncate">{snap.recommendation.message}</span>
                  <span className="text-xs text-muted-foreground">Mood {snap.selfReported.mood}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear */}
      <Button variant="outline" size="sm" onClick={handleClear} className="gap-1.5 text-destructive hover:text-destructive">
        <Trash2 className="w-3.5 h-3.5" /> Clear Matrix Data
      </Button>
    </div>
  );
};

export default EmotionalMatrix;
