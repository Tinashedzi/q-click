import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/quest-architect`;

const suggestedQuestions = [
  "How do I start my first quest?",
  "Tell me about African wisdom traditions",
  "I'm feeling stuck on a project",
  "Why is project-based learning effective?",
  "Help me think about sustainable cities",
];

const OasisChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "I am Oasis — the Socratic Gatekeeper. I guide seekers through quests of deep understanding. What draws your curiosity today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          topic: allMessages.filter(m => m.id !== '0').map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        }),
      });

      if (resp.status === 429) {
        toast({ title: 'Rate limited', description: 'Please wait a moment and try again.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: 'Credits exhausted', description: 'Please add AI credits to continue.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }
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
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant' && last.id !== '0') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { id: crypto.randomUUID(), role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error('Oasis chat error:', e);
      toast({ title: 'Connection error', description: 'Could not reach Oasis. Please try again.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[60vh] max-h-[600px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-secondary text-secondary-foreground rounded-br-md'
                  : 'bg-card border border-border/50 text-foreground rounded-bl-md'
              )}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center text-xs">🌿</span>
                    <span className="text-xs font-medium text-muted-foreground">Oasis</span>
                  </div>
                )}
                <div className="prose prose-sm prose-stone max-w-none [&_p]:mb-1 [&_p:last-child]:mb-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
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

      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedQuestions.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              className="px-3 py-1 rounded-full text-xs bg-secondary/20 text-secondary-foreground border border-secondary/30 hover:bg-secondary/30 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-border/50">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Oasis anything…" className="bg-card" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default OasisChat;
