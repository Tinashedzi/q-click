import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getMoodEntries } from '@/data/deloresResponses';

/**
 * SEL Skill Radar Chart — derives scores from mood entries and engagement patterns.
 * Skills: Communication, Empathy, Perseverance, Growth Mindset, Creativity, Self-Awareness
 */

interface SELSkill {
  skill: string;
  score: number;
  fullMark: 10;
}

const SELRadarChart = () => {
  const entries = getMoodEntries();

  const selData: SELSkill[] = useMemo(() => {
    if (entries.length === 0) {
      return [
        { skill: 'Self-Awareness', score: 0, fullMark: 10 },
        { skill: 'Empathy', score: 0, fullMark: 10 },
        { skill: 'Perseverance', score: 0, fullMark: 10 },
        { skill: 'Growth Mindset', score: 0, fullMark: 10 },
        { skill: 'Creativity', score: 0, fullMark: 10 },
        { skill: 'Communication', score: 0, fullMark: 10 },
      ];
    }

    const count = entries.length;
    const avgMood = entries.reduce((s, e) => s + e.level, 0) / count;
    const hasFreeText = entries.filter(e => e.freeText && e.freeText.length > 10).length;
    const hasFactors = entries.filter(e => e.contributingFactors.length > 0).length;
    const moodVariance = entries.reduce((s, e) => s + Math.abs(e.level - avgMood), 0) / count;

    // Derive SEL scores from patterns
    const selfAwareness = Math.min(10, Math.round((count / 3 + hasFactors / 2 + hasFreeText / 2) * 10) / 10);
    const empathy = Math.min(10, Math.round((avgMood * 1.5 + moodVariance) * 10) / 10);
    const perseverance = Math.min(10, Math.round((count / 2 + (avgMood >= 3 ? 2 : 0)) * 10) / 10);
    const growthMindset = Math.min(10, Math.round((hasFreeText / 1.5 + (avgMood >= 3 ? 3 : 1)) * 10) / 10);
    const creativity = Math.min(10, Math.round((hasFactors / 2 + hasFreeText / 2 + moodVariance * 2) * 10) / 10);
    const communication = Math.min(10, Math.round((hasFreeText + hasFactors / 3) * 10) / 10);

    return [
      { skill: 'Self-Awareness', score: selfAwareness, fullMark: 10 },
      { skill: 'Empathy', score: empathy, fullMark: 10 },
      { skill: 'Perseverance', score: perseverance, fullMark: 10 },
      { skill: 'Growth Mindset', score: growthMindset, fullMark: 10 },
      { skill: 'Creativity', score: creativity, fullMark: 10 },
      { skill: 'Communication', score: communication, fullMark: 10 },
    ];
  }, [entries]);

  const avgScore = selData.length > 0
    ? Math.round(selData.reduce((s, d) => s + d.score, 0) / selData.length * 10) / 10
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-card border border-border/50"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-foreground">SEL Skills</h4>
        <span className="text-xs text-muted-foreground font-grotesk">
          Avg: {avgScore}/10
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Complete mood check-ins to build your SEL profile.</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={selData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.6} />
              <PolarAngleAxis
                dataKey="skill"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 10]}
                tick={false}
              />
              <Radar
                name="SEL Skills"
                dataKey="score"
                stroke="hsl(var(--lotus-petal))"
                fill="hsl(var(--lotus-petal))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(v: number) => [`${v}/10`, 'Score']}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skill legend */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4">
          {selData.map(d => (
            <div key={d.skill} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: `hsl(var(--lotus-petal) / ${0.3 + d.score / 15})` }}
              />
              <span className="text-xs text-muted-foreground">{d.skill}</span>
              <span className="text-xs font-medium text-foreground ml-auto">{d.score}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SELRadarChart;
