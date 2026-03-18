import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { moodLevels, contributingChips, saveMoodEntry, getDeloresResponse } from '@/data/deloresResponses';
import { emotionalMatrix } from '@/engine/delores-matrix';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DeloresAvatar from './DeloresAvatar';
import ResponseArchetype, { getArchetype } from './ResponseArchetype';

interface MoodCheckInProps {
  onComplete?: () => void;
  onMoodChange?: (level: number | null) => void;
}

/** Mood-specific ring colors for the emoji buttons */
const moodRingColors: Record<number, string> = {
  1: 'border-[hsl(260_30%_72%)] bg-[hsl(260_30%_85%/0.2)]',
  2: 'border-[hsl(220_40%_70%)] bg-[hsl(220_40%_80%/0.2)]',
  3: 'border-[hsl(108_18%_65%)] bg-[hsl(108_18%_75%/0.2)]',
  4: 'border-[hsl(330_25%_70%)] bg-[hsl(330_25%_80%/0.2)]',
  5: 'border-[hsl(43_47%_54%)] bg-[hsl(43_47%_65%/0.2)]',
};

const MoodCheckIn = ({ onComplete, onMoodChange }: MoodCheckInProps) => {
  const [step, setStep] = useState<'mood' | 'factors' | 'response'>('mood');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [freeText, setFreeText] = useState('');
  const [showAdvice, setShowAdvice] = useState(false);

  const handleMoodSelect = (level: number) => {
    setSelectedMood(level);
    onMoodChange?.(level);
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
                <motion.button
                  key={m.level}
                  onClick={() => handleMoodSelect(m.level)}
                  whileHover={{ scale: 1.1, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-300',
                    moodRingColors[m.level],
                    'hover:shadow-lg'
                  )}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="text-[10px] text-muted-foreground font-medium">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'factors' && selectedMood && (
          <motion.div key="factors" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-5">
            <div className="text-center space-y-3">
              <span className="text-4xl">{moodLevels[selectedMood - 1].emoji}</span>
              <h3 className="text-xl font-serif text-foreground">What's contributing to this feeling?</h3>
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

        {step === 'response' && deloresResponse && selectedMood && (
          <motion.div key="response" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            {/* Archetype-styled response */}
            <ResponseArchetype
              type={getArchetype(selectedMood)}
              message={randomMsg}
              wisdom={randomWisdom}
            />

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
              <Button variant="outline" onClick={() => { setStep('mood'); setSelectedMood(null); onMoodChange?.(null); setSelectedFactors([]); setFreeText(''); setShowAdvice(false); }} className="flex-1">Check in again</Button>
              <Button onClick={onComplete} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Continue learning</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodCheckIn;
