import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DeloresAvatar from '@/components/delores/DeloresAvatar';

const greetings = [
  "Hey there! How are you feeling today?",
  "Welcome back, Voyager. Ready to explore?",
  "Your mind is a garden. Let's tend to it today.",
  "I've been thinking about you. Let's learn something beautiful.",
  "The universe rewards the curious. That's you.",
];

const quickActions = [
  { emoji: '😊', label: 'I need a pick-me-up', path: '/oasis' },
  { emoji: '💜', label: 'Can we talk about it?', path: '/delores' },
  { emoji: '💡', label: 'I need some advice', path: '/oasis' },
];

const DeloresFloatingWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-deep rounded-2xl p-4 w-64 mb-2"
          >
            <p className="text-xs text-muted-foreground font-grotesk mb-1">Delores</p>
            <p className="text-sm text-foreground font-serif leading-snug mb-3">{greeting}</p>
            <div className="space-y-1.5">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => { navigate(action.path); setIsExpanded(false); }}
                  className="w-full px-3 py-2 rounded-xl bg-card/50 hover:bg-card border border-border/30 flex items-center gap-2 text-left transition-colors"
                >
                  <span className="text-base">{action.emoji}</span>
                  <span className="text-xs font-medium text-foreground">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <DeloresAvatar moodLevel={null} size="sm" />
      </motion.button>
    </div>
  );
};

export default DeloresFloatingWidget;
