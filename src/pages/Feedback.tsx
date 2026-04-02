import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Star } from 'lucide-react';
import { toast } from 'sonner';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const categories = [
    { key: 'general', label: 'General' },
    { key: 'bug', label: 'Bug Report' },
    { key: 'feature', label: 'Feature Request' },
    { key: 'content', label: 'Content' },
  ];

  const handleSubmit = () => {
    if (!message.trim()) { toast.error('Please write some feedback'); return; }
    toast.success('Thank you for your feedback!');
    setMessage('');
    setRating(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
            <p className="text-sm text-muted-foreground">Help us improve Q-Click</p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-2">How's your experience?</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setRating(s)}>
                <Star className={`w-7 h-7 transition-colors ${s <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                category === c.key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Message */}
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tell us what you think..."
          rows={5}
          className="w-full p-4 rounded-2xl border border-border bg-background/70 backdrop-blur-xl text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm"
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Feedback;
