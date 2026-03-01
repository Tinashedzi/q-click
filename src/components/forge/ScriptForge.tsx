import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface ScriptSection {
  phase: string;
  emoji: string;
  text: string;
  visualStyle: string;
}

const defaultSections: ScriptSection[] = [
  { phase: 'Hook', emoji: '🎣', text: 'What if I told you this concept connects every culture on Earth?', visualStyle: 'Close-up, dramatic lighting' },
  { phase: 'Split', emoji: '💥', text: "Here's the surprising truth that changes everything...", visualStyle: 'Split screen, contrasting visuals' },
  { phase: 'Radiation', emoji: '☢️', text: 'This knowledge spreads into every area of life: language, science, art...', visualStyle: 'Expanding circles, web-like connections' },
  { phase: 'Fallout', emoji: '🌟', text: 'Now you can never unsee this pattern. Use it wisely.', visualStyle: 'Slow zoom out, reflective tone' },
];

const ScriptForge = () => {
  const [conceptName, setConceptName] = useState('');
  const [sections, setSections] = useState<ScriptSection[]>(defaultSections);
  const [editing, setEditing] = useState<number | null>(null);

  const updateSection = (index: number, field: keyof ScriptSection, value: string) => {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const exportScript = () => {
    const script = { concept: conceptName, sections, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(script, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script-${conceptName || 'untitled'}.json`;
    a.click();
    URL.revokeObjectURL(url);

    const saved = JSON.parse(localStorage.getItem('sensage-forge-scripts') || '[]');
    saved.push({ concept: conceptName, createdAt: new Date().toISOString() });
    localStorage.setItem('sensage-forge-scripts', JSON.stringify(saved));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-muted-foreground mb-1 block">Concept Name</label>
          <Input value={conceptName} onChange={(e) => setConceptName(e.target.value)} placeholder="e.g., River, Ubuntu, Gravity" />
        </div>
        <Button variant="outline" onClick={exportScript}>
          <Download className="w-4 h-4" /> Export JSON
        </Button>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div key={section.phase} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 cursor-pointer" onClick={() => setEditing(editing === i ? null : i)}>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{section.emoji}</span>
                  <span>{section.phase}</span>
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {editing === i ? (
                  <>
                    <Textarea value={section.text} onChange={(e) => updateSection(i, 'text', e.target.value)} rows={3} placeholder="Script text..." />
                    <Input value={section.visualStyle} onChange={(e) => updateSection(i, 'visualStyle', e.target.value)} placeholder="Visual style description..." />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-foreground">{section.text}</p>
                    <p className="text-xs text-muted-foreground italic">🎨 {section.visualStyle}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ScriptForge;
