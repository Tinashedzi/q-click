import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSpeech } from '@/hooks/useSpeech';
import ReactMarkdown from 'react-markdown';
import DeloresAvatar from './DeloresAvatar';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-chat`;

/* ═══ MIC BUTTON ═══ */
const MicButton = ({ onTranscript, onListeningChange }: { onTranscript: (text: string) => void; onListeningChange?: (l: boolean) => void }) => {
  const [listening, setListening] = useState(false);
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const toggle = () => {
    if (!supported) return;
    if (listening) { setListening(false); onListeningChange?.(false); return; }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US';
    let result = '';
    rec.onresult = (e: any) => { result = Array.from(e.results).map((r: any) => r[0].transcript).join(''); };
    rec.onend = () => { setListening(false); onListeningChange?.(false); if (result) onTranscript(result); };
    rec.onerror = () => { setListening(false); onListeningChange?.(false); };
    setListening(true); onListeningChange?.(true);
    rec.start();
  };

  if (!supported) return null;

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'w-9 h-9 shrink-0 rounded-full flex items-center justify-center border transition-all duration-300',
        listening
          ? 'border-destructive/40 bg-destructive/10 shadow-[0_0_16px_-4px_hsl(var(--destructive)/0.3)]'
          : 'border-border/30 bg-card/20 hover:bg-card/40'
      )}
    >
      {listening ? (
        <MicOff className="w-4 h-4 text-destructive" />
      ) : (
        <Mic className="w-4 h-4 text-muted-foreground" />
      )}
    </motion.button>
  );
};

const suggestedPrompts = [
  "I'm feeling overwhelmed today",
  "Help me with a breathing exercise",
  "I need motivation to keep going",
  "Tell me an African proverb about strength",
  "I want to reflect on my day",
];

interface DeloresChatProps {
  moodLevel?: number | null;
  onMoodDetected?: (level: number) => void;
  onListeningChange?: (listening: boolean) => void;
}

const DeloresChat = ({ moodLevel, onMoodDetected, onListeningChange }: DeloresChatProps) => {
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hey there, I'm Delores. 🌿 Think of me as a gentle companion on your journey. I'm here to listen, reflect, and walk beside you — never ahead. What's on your heart today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { speak, stop } = useSpeech();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSpeak = (msgId: string, text: string) => {
    if (speakingId === msgId) {
      stop();
      setSpeakingId(null);
    } else {
      // Strip markdown for cleaner speech
      const cleanText = text.replace(/[#*_`~\[\]()>]/g, '').replace(/\n+/g, '. ');
      speak(cleanText);
      setSpeakingId(msgId);
      // Auto-clear speaking state after estimated duration
      setTimeout(() => setSpeakingId(null), cleanText.length * 60);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const hasCredit = await useCredit();
    if (!hasCredit) return;
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
          messages: allMessages.filter(m => m.id !== '0').map(m => ({
            role: m.role,
            content: m.content,
          })),
          sentiment_score: moodLevel ? (moodLevel - 3) * 2 : undefined,
        }),
      });

      if (resp.status === 429) {
        toast({ title: 'Delores needs a moment', description: 'Please wait and try again.', variant: 'destructive' });
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
      console.error('Delores chat error:', e);
      toast({ title: 'Connection error', description: 'Could not reach Delores. Please try again.', variant: 'destructive' });
    }

    setIsLoading(false);
  };

  return (
    <>
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-secondary text-secondary-foreground rounded-br-md'
                  : 'glass-deep border border-border/30 text-foreground rounded-bl-md'
              )}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <DeloresAvatar moodLevel={moodLevel ?? null} size="xs" />
                      <span className="text-xs font-medium text-muted-foreground">Delores</span>
                    </div>
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="p-1 rounded-full hover:bg-accent/20 transition-colors"
                      aria-label={speakingId === msg.id ? 'Stop listening' : 'Listen'}
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
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
            <div className="glass-deep border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <DeloresAvatar moodLevel={moodLevel ?? null} size="xs" />
                <span className="text-xs text-muted-foreground">Delores is thinking…</span>
              </div>
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {messages.length <= 2 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestedPrompts.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              className="px-3 py-1 rounded-full text-xs glass-deep text-foreground border border-border/20 hover:border-accent/40 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-border/30">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2 items-center">
          <MicButton onTranscript={(text) => { setInput(text); sendMessage(text); }} onListeningChange={onListeningChange} />
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Talk to Delores…" className="bg-card/50 border-border/30" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}
            className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0 btn-jelly">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
    <CreditExhaustedModal open={showExhausted} onClose={() => setShowExhausted(false)} />
    </>
  );
};

export default DeloresChat;
