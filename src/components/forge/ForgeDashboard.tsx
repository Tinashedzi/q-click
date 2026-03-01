import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Star, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Creation {
  type: string;
  name: string;
  createdAt: string;
}

const ForgeDashboard = () => {
  const [creations, setCreations] = useState<Creation[]>([]);

  useEffect(() => {
    const concepts = JSON.parse(localStorage.getItem('sensage-forge-concepts') || '[]').map((c: any) => ({ type: 'Concept', name: c.topic, createdAt: c.createdAt }));
    const scripts = JSON.parse(localStorage.getItem('sensage-forge-scripts') || '[]').map((s: any) => ({ type: 'Script', name: s.concept, createdAt: s.createdAt }));
    const games = JSON.parse(localStorage.getItem('sensage-forge-games') || '[]').map((g: any) => ({ type: 'Game', name: g.name, createdAt: g.createdAt }));
    const paths = JSON.parse(localStorage.getItem('sensage-forge-paths') || '[]').map((p: any) => ({ type: 'Path', name: p.name, createdAt: p.createdAt }));
    setCreations([...concepts, ...scripts, ...games, ...paths].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const stats = [
    { label: 'Total Creations', value: creations.length, icon: BarChart3 },
    { label: 'Mock Views', value: creations.length * 42, icon: Eye },
    { label: 'Avg Rating', value: creations.length > 0 ? '4.2' : '—', icon: Star },
  ];

  const typeColors: Record<string, string> = {
    Concept: 'bg-jade/10 text-jade',
    Script: 'bg-clay/10 text-clay',
    Game: 'bg-gold/10 text-gold',
    Path: 'bg-petal/10 text-petal',
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 text-center">
              <s.icon className="w-5 h-5 mx-auto text-muted-foreground mb-1" />
              <p className="text-2xl font-serif text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {creations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creations yet. Start forging!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {creations.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="py-3 px-4 flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[c.type]}`}>{c.type}</span>
                  <span className="text-sm text-foreground flex-1">{c.name || 'Untitled'}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForgeDashboard;
