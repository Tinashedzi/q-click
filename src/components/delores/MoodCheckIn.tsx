import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { moodLevels, contributingChips, saveMoodEntry, getDeloresResponse } from '@/data/deloresResponses';
import { emotionalMatrix } from '@/engine/delores-matrix';
import { cn } from '@/lib/utils';

interface MoodCheckInProps {
  onComplete?: () => void;
}

const MoodCheckIn = ({ onComplete }: MoodCheckInProps) => {
  const [step, setStep] = useState<'mood' | 'factors' | 'response'>('mood');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [showAdvice, setShowAdvice] = useState(false);

  const handleMoodSelect = (level: number) => {
    setSelectedMood(level);
    setStep('factors');
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev =>
      prev.includes(factor) ? prev.filter(f => f !== factor) : [...prev, factor]
    );
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;
    const snapshot = emotionalMatrix.createSnapshot(selectedMood, freeText || undefined);
    saveMoodEntry({
      id: crypto.randomUUID(),
      level: selectedMood,
      label: moodLevels[selectedMood - 1].label,
      emoji: moodLevels[selectedMood - 1].emoji,
      contributingFactors: selectedFactors,
      freeText: freeText || undefined,
      timestamp: new Date().toISOString(),
      detected: snapshot.detected,
      recommendation: snapshot.recommendation,
    });
    setStep('response');
  };

  const deloresResponse = selectedMood ? getDeloresResponse(selectedMood) : null;
  const randomMsg = deloresResponse ? deloresResponse.messages[Math.floor(Math.random() * deloresResponse.messages.length)] : '';
  const randomWisdom = deloresResponse?.culturalWisdom[Math.floor(Math.random() * deloresResponse.culturalWisdom.length)];

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {step === 'mood' && (
          <motion.div key="mood" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="text-center space-y-6">
            <h3 className="text-2xl font-serif text-foreground">How are you feeling today?</h3>
            <p className="text-sm text-muted-foreground">Delores is here to listen</p>
            <div className="flex justify-center gap-3">
              {moodLevels.map(m => (
                <button key={m.level} onClick={() => handleMoodSelect(m.level)} className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border/50 bg-card hover:bg-accent/10 hover:border-accent transition-all">
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'factors' && (
          <motion.div key="factors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
            <div className="text-center">
              <span className="text-4xl">{selectedMood && moodLevels[selectedMood - 1].emoji}</span>
              <h3 className="text-xl font-serif text-foreground mt-2">What's contributing to this feeling?</h3>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {contributingChips.map(chip => (
                <button key={chip} onClick={() => toggleFactor(chip)} className={cn(
                  'px-3 py-1.5 rounded-full text-sm border transition-all',
                  selectedFactors.includes(chip)
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-card border-border/50 text-muted-foreground hover:border-accent/50'
                )}>
                  {chip}
                </button>
              ))}
            </div>
            <Textarea placeholder="Anything else on your mind? (optional)" value={freeText} onChange={e => setFreeText(e.target.value)} className="bg-card" />
            <Button onClick={handleSubmit} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Share with Delores</Button>
          </motion.div>
        )}

        {step === 'response' && deloresResponse && (
          <motion.div key="response" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="p-5 rounded-xl bg-accent/10 border border-accent/20 space-y-3">
              <p className="text-foreground font-serif text-lg italic">"{randomMsg}"</p>
              {randomWisdom && (
                <div className="pt-3 border-t border-accent/20">
                  <p className="text-sm text-muted-foreground italic">"{randomWisdom.proverb}"</p>
                  {randomWisdom.translation && <p className="text-xs text-muted-foreground mt-1">— {randomWisdom.culture}: {randomWisdom.translation}</p>}
                </div>
              )}
            </div>

            {!showAdvice ? (
              <Button variant="outline" onClick={() => setShowAdvice(true)} className="w-full">Ask Delores for advice</Button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-card border border-border/50 space-y-2">
                <p className="text-sm font-medium text-foreground">Delores suggests:</p>
                <ul className="space-y-1.5">
                  {deloresResponse.advice.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-accent">•</span> {a}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setStep('mood'); setSelectedMood(null); setSelectedFactors([]); setFreeText(''); setShowAdvice(false); }} className="flex-1">Check in again</Button>
              <Button onClick={onComplete} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Continue learning</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCheckIn;
