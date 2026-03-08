import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, Lightbulb, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Exchange {
  id: string;
  role: 'seeker' | 'oracle';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quest-architect`;

const deepPrompts = [
  "What is the nature of understanding?",
  "How does language shape thought?",
  "Why do we forget what we learn?",
  "What makes a question powerful?",
];

const DeepFocusMode = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([
    {
      id: '0',
      role: 'oracle',
      content: "Welcome to the inner sanctum, seeker. Here we shed the noise and pursue depth.\n\n*\"The unexamined life is not worth living.\"* — Socrates\n\nPose a question, and I shall respond not with answers — but with deeper questions.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [exchanges, isThinking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;
    const userMsg: Exchange = { id: crypto.randomUUID(), role: 'seeker', content: text.trim() };
    const all = [...exchanges, userMsg];
    setExchanges(all);
    setInput('');
    setIsThinking(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          topic: [
            { role: 'system', content: 'You are a Socratic oracle. Never give direct answers. Always respond with thoughtful counter-questions, philosophical provocations, and references to African wisdom traditions. Keep responses under 100 words. Use italics for proverbs. End every response with exactly one probing question.' },
            ...all.filter(m => m.id !== '0').map(m => ({
              role: m.role === 'oracle' ? 'assistant' : 'user',
              content: m.content,
            })),
          ],
        }),
      });

      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setExchanges(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'oracle' && last.id !== '0') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { id: crypto.randomUUID(), role: 'oracle', content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error('Deep Focus error:', e);
      setExchanges(prev => [...prev, { id: crypto.randomUUID(), role: 'oracle', content: 'The connection to the oracle has been interrupted. Please try again.' }]);
    }

    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-full pt-16 pb-20">
      {/* Scroll area — padded to clear fixed top controls and bottom nav */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
        <AnimatePresence>
          {exchanges.map((ex) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn('max-w-lg', ex.role === 'seeker' ? 'ml-auto' : 'mr-auto')}
            >
              {ex.role === 'oracle' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-lavender/30 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-foreground/60" />
                  </div>
                  <span className="text-[10px] font-grotesk text-muted-foreground/60 tracking-widest uppercase">Oracle</span>
                </div>
              )}
              <div className={cn(
                'rounded-2xl px-5 py-4',
                ex.role === 'seeker'
                  ? 'bg-foreground/5 text-foreground rounded-br-md'
                  : 'glass-deep border border-border/30 rounded-bl-md'
              )}>
                <div className="prose prose-sm max-w-none text-foreground/80 font-journal leading-relaxed [&_em]:text-accent [&_p]:mb-2 [&_p:last-child]:mb-0">
                  <ReactMarkdown>{ex.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && exchanges[exchanges.length - 1]?.role === 'seeker' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mr-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-lavender/30 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-foreground/60" />
              </div>
              <span className="text-[10px] font-grotesk text-muted-foreground/60 tracking-widest uppercase">Contemplating…</span>
            </div>
            <div className="glass-deep rounded-2xl rounded-bl-md px-5 py-4 border border-border/30">
              <div className="flex gap-1.5">
                {[0, 150, 300].map(d => (
                  <motion.div key={d} className="w-2 h-2 rounded-full bg-lavender/50"
                    animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d / 1000 }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested deep prompts */}
      {exchanges.length <= 2 && (
        <div className="px-4 sm:px-8 pb-3 flex flex-wrap gap-2">
          {deepPrompts.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-deep text-xs font-journal text-muted-foreground hover:text-foreground transition-colors">
              <Lightbulb className="w-3 h-3 text-gold/60" />
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input — lifted above bottom nav */}
      <div className="p-4 sm:px-8 border-t border-border/30 mb-2">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pose your question to the Oracle…"
            className="bg-card/50 border-border/30 font-journal"
            disabled={isThinking}
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isThinking}
            className="bg-lavender/30 text-foreground hover:bg-lavender/50 shrink-0 border border-border/30">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DeepFocusMode;
