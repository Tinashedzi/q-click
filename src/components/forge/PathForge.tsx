import { useState } from 'react';
import { motion } from 'framer-motion';
import { Route, Plus, GripVertical, CheckCircle2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface PathStep {
  id: string;
  title: string;
  type: 'concept' | 'quiz' | 'milestone';
}

const PathForge = () => {
  const [pathName, setPathName] = useState('');
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [newStep, setNewStep] = useState('');
  const [stepType, setStepType] = useState<PathStep['type']>('concept');

  const addStep = () => {
    if (!newStep.trim()) return;
    setSteps(prev => [...prev, { id: Date.now().toString(), title: newStep, type: stepType }]);
    setNewStep('');
  };

  const removeStep = (id: string) => setSteps(prev => prev.filter(s => s.id !== id));

  const savePath = () => {
    if (!pathName || steps.length === 0) return;
    const saved = JSON.parse(localStorage.getItem('qclick-forge-paths') || '[]');
    saved.push({ name: pathName, steps, createdAt: new Date().toISOString() });
    localStorage.setItem('qclick-forge-paths', JSON.stringify(saved));
    setPathName('');
    setSteps([]);
  };

  const typeColors: Record<string, string> = {
    concept: 'bg-jade/10 text-jade border-jade/20',
    quiz: 'bg-gold/10 text-gold border-gold/20',
    milestone: 'bg-petal/10 text-petal border-petal/20',
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-1 block">Learning Path Name</label>
        <Input value={pathName} onChange={(e) => setPathName(e.target.value)} placeholder="e.g., Introduction to African Languages" />
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div key={step.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm text-muted-foreground w-6">{i + 1}.</span>
            <Card className={`flex-1 ${typeColors[step.type]}`}>
              <CardContent className="py-2 px-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {step.type === 'milestone' && <CheckCircle2 className="w-4 h-4" />}
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <span className="text-xs capitalize">{step.type}</span>
              </CardContent>
            </Card>
            <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}>
              <Trash2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input value={newStep} onChange={(e) => setNewStep(e.target.value)} placeholder="Add a step..." className="flex-1" onKeyDown={(e) => e.key === 'Enter' && addStep()} />
        <select value={stepType} onChange={(e) => setStepType(e.target.value as PathStep['type'])} className="px-3 py-2 rounded-md border border-input bg-background text-sm">
          <option value="concept">Concept</option>
          <option value="quiz">Quiz</option>
          <option value="milestone">Milestone</option>
        </select>
        <Button variant="outline" onClick={addStep}><Plus className="w-4 h-4" /></Button>
      </div>

      <Button onClick={savePath} disabled={!pathName || steps.length === 0} className="w-full">
        <Route className="w-4 h-4" /> Save Learning Path
      </Button>
    </div>
  );
};

export default PathForge;
