import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Stethoscope, Code, HardHat, BookPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { governmentResources } from '@/data/libraryData';

const categoryIcons = { nursing: Stethoscope, coding: Code, construction: HardHat };
const categoryColors = { nursing: 'bg-petal/10 border-petal/20', coding: 'bg-jade/10 border-jade/20', construction: 'bg-clay/10 border-clay/20' };

const GovernmentPortal = () => {
  const [filter, setFilter] = useState<string>('all');
  const filtered = filter === 'all' ? governmentResources : governmentResources.filter(r => r.category === filter);

  const saveToLibrary = (r: typeof governmentResources[0]) => {
    const saved = JSON.parse(localStorage.getItem('qclick-library-items') || '[]');
    saved.push({ id: `gov-${r.id}`, title: r.title, source: 'government', description: r.description, savedAt: new Date().toISOString() });
    localStorage.setItem('qclick-library-items', JSON.stringify(saved));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'nursing', 'coding', 'construction'].map(c => (
          <Button key={c} variant={filter === c ? 'default' : 'outline'} size="sm" onClick={() => setFilter(c)} className="capitalize">{c}</Button>
        ))}
      </div>

      {filtered.map((r, i) => {
        const Icon = categoryIcons[r.category];
        return (
          <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`border ${categoryColors[r.category]}`}>
              <CardContent className="py-3 px-4">
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{r.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.source}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{r.difficulty}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => saveToLibrary(r)}><BookPlus className="w-3 h-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default GovernmentPortal;
