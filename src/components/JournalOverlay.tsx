import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface JournalEntry {
  id: string;
  mood: number;
  moodLabel: string;
  moodEmoji: string;
  note: string;
  createdAt: string;
}

const MOODS = [
  { value: 1, emoji: '😢', label: 'Heavy' },
  { value: 2, emoji: '😕', label: 'Cloudy' },
  { value: 3, emoji: '😐', label: 'Steady' },
  { value: 4, emoji: '🙂', label: 'Bright' },
  { value: 5, emoji: '😊', label: 'Radiant' },
];

interface JournalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const JournalOverlay = ({ isOpen, onClose }: JournalOverlayProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sensage-journal') || '[]');
    setEntries(saved);
  }, [isOpen]);

  const saveEntry = () => {
    if (!selectedMood) return;
    const mood = MOODS.find(m => m.value === selectedMood)!;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      moodLabel: mood.label,
      moodEmoji: mood.emoji,
      note,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...entries];
    localStorage.setItem('sensage-journal', JSON.stringify(updated));
    setEntries(updated);
    setSelectedMood(null);
    setNote('');
    setIsWriting(false);
  };

  const sendToForge = (entry: JournalEntry) => {
    localStorage.setItem('sensage-forge-source', JSON.stringify(entry));
    onClose();
    navigate('/forge');
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000 && d.getDate() === now.getDate()) return `Today, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diff < 172800000) return `Yesterday, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          {/* Overlay panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl shadow-elevated max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-petal" />
                <h3 className="text-lg font-serif text-foreground">Journal</h3>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Mood check-in */}
              <div>
                <p className="text-sm text-muted-foreground mb-3">How are you feeling?</p>
                <div className="flex items-center justify-between gap-2">
                  {MOODS.map(m => (
                    <motion.button
                      key={m.value}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { setSelectedMood(m.value); setIsWriting(true); }}
                      className={cn(
                        'flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1',
                        selectedMood === m.value
                          ? 'bg-petal/20 ring-2 ring-petal/40 scale-110'
                          : 'hover:bg-muted'
                      )}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-[10px] text-muted-foreground">{m.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Writing area */}
              <AnimatePresence>
                {isWriting && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Textarea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="What's on your mind?"
                      className="min-h-[100px] font-serif text-base bg-card border-border/50 resize-none"
                    />
                    <Button onClick={saveEntry} className="w-full bg-petal hover:bg-petal/90 text-foreground">
                      Save Entry
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Entry list */}
              {entries.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Recent entries</p>
                  {entries.slice(0, 20).map((entry, i) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="group relative p-3 rounded-xl bg-card border border-border/50 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{entry.moodEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{formatDate(entry.createdAt)}</p>
                          <p className="text-sm text-foreground truncate mt-0.5">
                            {entry.note || `Feeling ${entry.moodLabel.toLowerCase()}`}
                          </p>
                        </div>
                        <button
                          onClick={() => sendToForge(entry)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gold/15 transition-all"
                          title="Send to Forge"
                        >
                          <Sparkles className="w-4 h-4 text-gold" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* New entry FAB */}
            {!isWriting && (
              <div className="absolute bottom-6 right-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWriting(true)}
                  className="w-12 h-12 rounded-full bg-petal shadow-elevated flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JournalOverlay;
