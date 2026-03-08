import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface DeloresGreetingProps {
  onNavigate: (path: string) => void;
}

const DeloresGreeting = ({ onNavigate }: DeloresGreetingProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm mx-auto"
    >
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full glass-wavey rounded-3xl p-4 cursor-pointer group text-left"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {/* Delores avatar */}
          <motion.div
            className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0"
            style={{ animation: 'breathe 6s ease-in-out infinite' }}
          >
            <img
              src={deloresImg}
              alt="Delores – your cognitive companion"
              className="w-full h-full object-cover"
            />
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-petal/30" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground font-grotesk mb-0.5">Delores</p>
            <p className="text-sm text-foreground font-serif leading-snug">{greeting}</p>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-muted-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {quickActions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => onNavigate(action.path)}
                  className="w-full btn-liquid px-4 py-3 flex items-center gap-3 text-left"
                >
                  <span className="text-lg">{action.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DeloresGreeting;
