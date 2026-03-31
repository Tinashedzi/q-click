import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Shuffle, ArrowUpDown, Puzzle, Atom } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const templates = [
  { id: 'matching', name: 'Matching', icon: Shuffle, desc: 'Match words to meanings across languages', color: 'bg-jade/10 border-jade/20' },
  { id: 'ordering', name: 'Ordering', icon: ArrowUpDown, desc: 'Arrange sentences or concepts in correct order', color: 'bg-clay/10 border-clay/20' },
  { id: 'construction', name: 'Construction', icon: Puzzle, desc: 'Build sentences from word parts', color: 'bg-gold/10 border-gold/20' },
  { id: 'simulation', name: 'Simulation', icon: Atom, desc: 'Interactive concept exploration scenarios', color: 'bg-petal/10 border-petal/20' },
];

const GameForge = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [gameName, setGameName] = useState('');

  const saveGame = () => {
    if (!selected || !gameName) return;
    const saved = JSON.parse(localStorage.getItem('qclick-forge-games') || '[]');
    saved.push({ template: selected, name: gameName, createdAt: new Date().toISOString() });
    localStorage.setItem('qclick-forge-games', JSON.stringify(saved));
    setGameName('');
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-lg text-foreground flex items-center gap-2">
        <Gamepad2 className="w-5 h-5 text-gold" /> Choose a Game Template
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((t) => (
          <motion.div key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card
              className={`cursor-pointer transition-all ${t.color} ${selected === t.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelected(t.id)}
            >
              <CardContent className="pt-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-background/60 flex items-center justify-center shrink-0">
                  <t.icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
          <Input value={gameName} onChange={(e) => setGameName(e.target.value)} placeholder="Name your game..." className="flex-1" />
          <Button onClick={saveGame} disabled={!gameName.trim()}>Create Game</Button>
        </motion.div>
      )}
    </div>
  );
};

export default GameForge;
