import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DeloresAvatar from '@/components/delores/DeloresAvatar';
import ResponseArchetype, { getArchetype } from '@/components/delores/ResponseArchetype';
import { getMoodEntries } from '@/data/deloresResponses';

/**
 * Post-quest reflection overlay.
 * Delores surfaces a reflection question using the archetype
 * that matches the user's latest mood (or defaults to 'reflective').
 */

interface QuestReflectionProps {
  questTitle: string;
  onClose: () => void;
  onSubmit: (reflection: string) => void;
}

const reflectionPrompts: Record<string, string[]> = {
  supportive: [
    "This quest may have felt challenging. What part surprised you about your own resilience?",
    "Even when learning is hard, you showed up. What kept you going?",
    "What would you tell a friend who was struggling with the same material?",
  ],
  reflective: [
    "What connections did you discover between this topic and your everyday life?",
    "If you could redesign one stage of this quest, what would you change and why?",
    "What assumptions did you hold before this quest that have shifted?",
  ],
  action: [
    "You crushed it! What's the boldest idea this quest sparked in you?",
    "How could you teach what you've learned to someone else in 5 minutes?",
    "What's the very next thing you want to explore based on this quest?",
  ],
};

const wisdomByArchetype: Record<string, { culture: string; proverb: string; translation: string }> = {
  supportive: { culture: 'Xhosa', proverb: 'Umntu ngumntu ngabantu', translation: 'A person is a person through other people.' },
  reflective: { culture: 'Shona', proverb: 'Chara chimwe hachitswanyi inda', translation: 'One finger cannot crush a louse — reflection deepens with connection.' },
  action: { culture: 'Tswana', proverb: 'Letsatsi le tlhaba ka dinao', translation: 'The sun rises on its feet — rise with your full energy.' },
};

const QuestReflection = ({ questTitle, onClose, onSubmit }: QuestReflectionProps) => {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Determine archetype from latest mood entry
  const archetype = useMemo(() => {
    const entries = getMoodEntries();
    if (entries.length === 0) return 'reflective' as const;
    const lastMood = entries[entries.length - 1].level;
    return getArchetype(lastMood);
  }, []);

  const prompt = useMemo(() => {
    const prompts = reflectionPrompts[archetype];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }, [archetype]);

  const wisdom = wisdomByArchetype[archetype];

  const handleSubmit = () => {
    onSubmit(reflection);
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden"
        >
          {!submitted ? (
            <div className="p-6 space-y-5">
              {/* Header with avatar */}
              <div className="flex items-center gap-3">
                <DeloresAvatar moodLevel={archetype === 'supportive' ? 2 : archetype === 'reflective' ? 3 : 5} size="sm" />
                <div>
                  <p className="text-xs text-muted-foreground font-grotesk">Quest Complete</p>
                  <p className="text-sm font-medium text-foreground">{questTitle}</p>
                </div>
              </div>

              {/* Archetype reflection prompt */}
              <ResponseArchetype
                type={archetype}
                message={prompt}
                wisdom={wisdom}
              />

              {/* User reflection input */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Share your reflection…"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="bg-background min-h-[100px] text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Skip
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!reflection.trim()}
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Share with Delores
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 text-center space-y-4"
            >
              <DeloresAvatar moodLevel={5} size="md" />
              <div>
                <p className="text-lg font-serif text-foreground">Beautiful reflection ✨</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Delores has noted your growth. This reflection is part of your learning journey.
                </p>
              </div>
              <Button onClick={onClose} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Continue
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestReflection;
