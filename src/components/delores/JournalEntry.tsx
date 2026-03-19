import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookHeart, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const MOODS = [
  { level: 1, emoji: '😔', label: 'Heavy' },
  { level: 2, emoji: '😐', label: 'Low' },
  { level: 3, emoji: '🙂', label: 'Okay' },
  { level: 4, emoji: '😊', label: 'Good' },
  { level: 5, emoji: '✨', label: 'Radiant' },
];

interface JournalEntryProps {
  onComplete?: () => void;
}

const JournalEntry = ({ onComplete }: JournalEntryProps) => {
  const { user } = useAuth();
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!mood) return;
    setSaving(true);
    const moodData = MOODS[mood - 1];

    if (user) {
      await supabase.from('journal_entries').insert({
        user_id: user.id,
        mood,
        mood_emoji: moodData.emoji,
        mood_label: moodData.label,
        note: note || null,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => onComplete?.(), 1500);
  };

  return (
    <div className="flex flex-col items-center gap-5 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <BookHeart className="w-4 h-4 text-primary/70" />
        <span className="text-sm font-medium text-foreground/80">Daily Journal</span>
      </div>

      <AnimatePresence mode="wait">
        {saved ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center"
            >
              <Check className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm text-foreground/80">Entry saved ✨</span>
          </motion.div>
        ) : (
          <motion.div key="form" className="w-full space-y-5">
            {/* Mood picker */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">How are you feeling?</span>
              <div className="flex justify-center gap-3">
                {MOODS.map(m => (
                  <motion.button
                    key={m.level}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    onClick={() => setMood(m.level)}
                    className={cn(
                      'flex flex-col items-center gap-0.5 p-2 rounded-xl border transition-all',
                      mood === m.level
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border/20 bg-card/10'
                    )}
                  >
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[8px] text-muted-foreground">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Reflection */}
            <Textarea
              placeholder="What's on your mind today…"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="bg-card/20 border-border/20 backdrop-blur-xl min-h-[100px] resize-none text-sm"
            />

            {/* Save */}
            <motion.button
              whileTap={{ scale: [1, 0.92, 1.05, 1] }}
              onClick={handleSave}
              disabled={!mood || saving}
              className={cn(
                'w-full py-3 rounded-2xl text-sm font-medium transition-all',
                mood
                  ? 'bg-primary/10 border border-primary/30 text-primary'
                  : 'bg-card/10 border border-border/20 text-muted-foreground/40'
              )}
            >
              {saving ? 'Saving…' : 'Save Entry'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JournalEntry;
