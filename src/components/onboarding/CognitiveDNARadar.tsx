import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { Brain } from 'lucide-react';
import type { CognitiveDNA } from '@/engine/cognitive-profile';

const DIMENSION_SHORT: Record<string, string> = {
  information_processing: 'Processing',
  motivational_drivers: 'Motivation',
  risk_resilience: 'Resilience',
  social_dynamics: 'Social',
  emotional_baseline: 'Emotional',
};

/** Map trait text to a 1-10 strength score for visualization */
function traitToScore(trait: string): number {
  if (!trait) return 0;
  if (trait.includes('High Grit') || trait.includes('High Challenge') || trait.includes('High Stimulation')) return 9;
  if (trait.includes('Mastery') || trait.includes('Strategic') || trait.includes('Analytical')) return 8;
  if (trait.includes('Collaborative') || trait.includes('Leader') || trait.includes('Mentor')) return 7;
  if (trait.includes('Exploratory') || trait.includes('Kinesthetic') || trait.includes('Application')) return 7;
  if (trait.includes('Visual') || trait.includes('Intrinsic') || trait.includes('Context')) return 6;
  if (trait.includes('Extrinsic') || trait.includes('Status')) return 5;
  if (trait.includes('Fixed Mindset') || trait.includes('Low') || trait.includes('Defeated')) return 3;
  return 5;
}

const CognitiveDNARadar = () => {
  const { profile } = useAuth();

  const dna = useMemo(() => {
    const prefs = profile?.preferences as Record<string, unknown> | null;
    return prefs?.cognitive_dna as CognitiveDNA | undefined;
  }, [profile]);

  const radarData = useMemo(() => {
    if (!dna) return null;
    return Object.entries(DIMENSION_SHORT).map(([key, label]) => ({
      dimension: label,
      score: traitToScore((dna as unknown as Record<string, string>)[key] || ''),
      trait: (dna as unknown as Record<string, string>)[key] || '',
      fullMark: 10,
    }));
  }, [dna]);

  if (!radarData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-semibold text-foreground">Cognitive DNA</h4>
        </div>
        <p className="text-xs text-muted-foreground">Complete the onboarding probes to see your learning profile.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-background/80 backdrop-blur-xl p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Brain className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">Your Cognitive DNA</h4>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3">How Q-Click personalizes your experience</p>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis angle={90} domain={[0, 10]} tick={false} />
            <Radar
              name="DNA"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(_: number, __: string, props: any) => [props.payload.trait, 'Trait']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-1.5 mt-2">
        {radarData.map(d => (
          <div key={d.dimension} className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground w-16 shrink-0">{d.dimension}</span>
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.score * 10}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full bg-primary/60"
              />
            </div>
            <span className="text-[9px] text-muted-foreground w-24 truncate text-right">{d.trait.split(',')[0]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CognitiveDNARadar;
