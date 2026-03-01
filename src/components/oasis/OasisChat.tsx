import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { findWisdomResponse, oasisFallback } from '@/data/wisdomDatabase';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'oasis';
  content: string;
  followUp?: string;
}

const suggestedQuestions = [
  "How do I learn best?",
  "Tell me about African wisdom",
  "I'm feeling stuck",
  "Why learn languages?",
  "What is AI?",
];

const OasisChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'oasis', content: "I am Oasis — your companion on the path of understanding. What draws your curiosity today?", followUp: "Choose a question below, or ask your own." },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const wisdom = findWisdomResponse(text);
      const response = wisdom || oasisFallback;
      const oasisMsg: Message = {
        id: crypto.randomUUID(),
        role: 'oasis',
        content: response.response,
        followUp: response.followUp,
      };
      setMessages(prev => [...prev, oasisMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[600px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-secondary text-secondary-foreground rounded-br-md'
                  : 'bg-card border border-border/50 text-foreground rounded-bl-md'
              )}>
                {msg.role === 'oasis' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center text-xs">🌿</span>
                    <span className="text-xs font-medium text-muted-foreground">Oasis</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.followUp && (
                  <p className="mt-2 text-xs text-muted-foreground italic">{msg.followUp}</p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedQuestions.map(q => (
            <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1 rounded-full text-xs bg-secondary/20 text-secondary-foreground border border-secondary/30 hover:bg-secondary/30 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Oasis anything..." className="bg-card" />
          <Button type="submit" size="icon" disabled={!input.trim()} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OasisChat;
