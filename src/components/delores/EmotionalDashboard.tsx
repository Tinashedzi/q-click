import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMoodEntries, clearMoodEntries, exportMoodEntries, moodLevels } from '@/data/deloresResponses';
import { ACTION_CONFIG } from '@/types/delores-matrix';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Trash2, Shield } from 'lucide-react';

const EmotionalDashboard = () => {
  const [entries, setEntries] = useState(getMoodEntries());

  const weeklyData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return days.map(day => {
      const dayEntries = entries.filter(e => e.timestamp.startsWith(day));
      const avg = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.level, 0) / dayEntries.length
        : null;
      return {
        day: new Date(day).toLocaleDateString('en', { weekday: 'short' }),
        mood: avg ? Math.round(avg * 10) / 10 : null,
      };
    });
  }, [entries]);

  const avgMood = useMemo(() => {
    if (entries.length === 0) return null;
    return Math.round(entries.reduce((s, e) => s + e.level, 0) / entries.length * 10) / 10;
  }, [entries]);

  const topFactors = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => e.contributingFactors.forEach(f => { counts[f] = (counts[f] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [entries]);

  const bestLearningMood = useMemo(() => {
    if (avgMood === null) return null;
    if (avgMood >= 4) return "You learn best when feeling bright or radiant!";
    if (avgMood >= 3) return "Your steady energy creates consistent learning patterns.";
    return "Consider gentle learning activities when your mood is lower.";
  }, [avgMood]);

  const handleExport = () => {
    const data = exportMoodEntries();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sensage-emotional-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all emotional data? This cannot be undone.')) {
      clearMoodEntries();
      setEntries([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy notice */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/15">
        <Shield className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">Your emotions stay with you</p>
          <p className="text-xs text-muted-foreground mt-0.5">All emotional data is stored on your device only. Nothing is sent to any server.</p>
        </div>
      </motion.div>

      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No mood entries yet. Complete a check-in to see your dashboard.</p>
        </div>
      ) : (
        <>
          {/* Weekly chart */}
          <div className="p-4 rounded-xl bg-card border border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-4">Weekly Mood Trend</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(v) => moodLevels[v - 1]?.emoji || ''} />
                  <Tooltip formatter={(v: number) => [moodLevels[Math.round(v) - 1]?.label || v, 'Mood']}
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--accent))', r: 4 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-xs text-muted-foreground">Average Mood</p>
              <p className="text-2xl font-serif text-foreground">{avgMood} <span className="text-lg">{moodLevels[Math.round(avgMood!) - 1]?.emoji}</span></p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-xs text-muted-foreground">Total Check-ins</p>
              <p className="text-2xl font-serif text-foreground">{entries.length}</p>
            </div>
          </div>

          {bestLearningMood && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15">
              <p className="text-sm text-foreground font-medium">💡 Insight</p>
              <p className="text-sm text-muted-foreground mt-1">{bestLearningMood}</p>
            </div>
          )}

          {/* Latest recommendation from matrix */}
          {entries.length > 0 && entries[entries.length - 1].recommendation && (() => {
            const lastEntry = entries[entries.length - 1];
            const cfg = ACTION_CONFIG[lastEntry.recommendation!.action];
            return (
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <span>{cfg.emoji}</span>
                  <Badge variant="secondary" className="text-xs">{cfg.label}</Badge>
                  <span className="text-xs text-muted-foreground ml-auto">Latest recommendation</span>
                </div>
                <p className="text-sm text-muted-foreground italic">{lastEntry.recommendation!.message}</p>
              </div>
            );
          })()}

          {topFactors.length > 0 && (
            <div className="p-4 rounded-xl bg-card border border-border/50">
              <p className="text-sm font-medium text-foreground mb-3">Top Contributing Factors</p>
              <div className="space-y-2">
                {topFactors.map(([factor, count]) => (
                  <div key={factor} className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-accent/60" style={{ width: `${(count / entries.length) * 100}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">{factor}</span>
                    <span className="text-xs text-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Privacy controls */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Export Data
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear} className="gap-1.5 text-destructive hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" /> Delete All Data
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmotionalDashboard;
