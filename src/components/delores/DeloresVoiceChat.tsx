import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX, Mic, MicOff, Headphones, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useSpeech, getAvailableVoices } from '@/hooks/useSpeech';
import ReactMarkdown from 'react-markdown';
import DeloresAvatar from './DeloresAvatar';
import AgentStatusBar from './AgentStatusBar';
import ToolResultCard from './ToolResultCard';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  parseToolResults,
  type AgentState,
  type ToolExecution,
  type MemoryContext,
} from '@/engine/delores-agent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolExecutions?: ToolExecution[];
  plan?: string;
}

const VOICE_HARNESS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-voice-harness`;
const MEMORY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-memory`;

interface DeloresVoiceChatProps {
  moodLevel?: number | null;
  onMoodDetected?: (level: number) => void;
  onListeningChange?: (listening: boolean) => void;
}

const DeloresVoiceChat = ({ onListeningChange }: DeloresVoiceChatProps) => {
  const { profile, session } = useAuth();
  const cognitiveDna = useMemo(
    () => (profile?.preferences as Record<string, unknown> | null)?.cognitive_dna,
    [profile],
  );
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content:
        "Hey there, I'm Delores. 🌿 I'm here with my updated reasoning harness — ask me anything, deep or quick.",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [shouldAutoListen, setShouldAutoListen] = useState(false);
  const [listening, setListening] = useState(false);
  const [, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI] = useState('');
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [sessionId] = useState<string | null>(null);
  const [memoryContext, setMemoryContext] = useState<MemoryContext | null>(null);
  const [allToolExecutions, setAllToolExecutions] = useState<ToolExecution[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const v = getAvailableVoices();
      if (v.length) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const { speak, stop, speaking } = useSpeech({
    onEnd: () => {
      if (handsFree && !isLoading) setShouldAutoListen(true);
    },
    voiceURI: selectedVoiceURI || undefined,
  });

  // Memory context
  useEffect(() => {
    if (!session?.access_token) return;
    fetch(MEMORY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ action: 'get_context' }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setMemoryContext(data);
      })
      .catch(console.error);
  }, [session?.access_token]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const processVoiceHarnessIntent = useCallback(
    async (textToSend: string) => {
      if (!textToSend.trim() || isLoading) return;
      if (speaking) stop();
      setShouldAutoListen(false);

      const hasCredit = await useCredit();
      if (!hasCredit) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: textToSend.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);
      setAgentState('thinking');

      try {
        const response = await fetch(VOICE_HARNESS_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            transcript: textToSend.trim(),
            session_id: sessionId,
            user_id: profile?.id,
            cognitive_dna: cognitiveDna || undefined,
          }),
        });

        if (response.status === 429) {
          toast({
            title: 'Delores needs a moment',
            description: 'Rate limit hit. Please wait a moment.',
            variant: 'destructive',
          });
          setAgentState('idle');
          setIsLoading(false);
          return;
        }
        if (response.status === 402) {
          setShowExhausted(true);
          setAgentState('idle');
          setIsLoading(false);
          return;
        }
        if (!response.ok) throw new Error('Harness routing failure');

        const data = await response.json();

        if (data.plan) {
          setCurrentPlan(data.plan);
          setAgentState('planning');
          await new Promise((r) => setTimeout(r, 350));
        }

        const toolHeader = response.headers.get('X-Delores-Tools');
        const toolExecutions = parseToolResults(toolHeader);
        if (toolExecutions.length > 0) {
          setAgentState('acting');
          setAllToolExecutions((prev) => [...prev, ...toolExecutions]);
        }

        setAgentState('responding');

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.text,
          plan: data.plan,
          toolExecutions,
        };
        setMessages((prev) => [...prev, assistantMsg]);

        if (voiceEnabled && data.text) {
          const clean = data.text.replace(/[#*_`~\[\]()>]/g, '').replace(/\n+/g, '. ');
          speak(clean);
        }
      } catch (err) {
        console.error('Voice Harness error:', err);
        toast({
          title: 'System Error',
          description: 'Failed to reach Delores. Try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setAgentState('idle');
      }
    },
    [
      isLoading,
      speaking,
      stop,
      useCredit,
      session?.access_token,
      sessionId,
      profile?.id,
      cognitiveDna,
      toast,
      setShowExhausted,
      voiceEnabled,
      speak,
    ],
  );

  const startListening = useCallback(() => {
    if (!supported || listening) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = navigator.language || 'en-US';
    let transcript = '';

    rec.onstart = () => {
      setListening(true);
      onListeningChange?.(true);
      setAgentState('listening');
    };
    rec.onresult = (e: any) => {
      transcript = Array.from(e.results)
        .map((r: any) => r[0].transcript)
        .join('');
    };
    rec.onend = () => {
      setListening(false);
      onListeningChange?.(false);
      setAgentState('idle');
      if (transcript) processVoiceHarnessIntent(transcript);
    };
    rec.onerror = () => {
      setListening(false);
      onListeningChange?.(false);
      setAgentState('idle');
    };

    recRef.current = rec;
    rec.start();
  }, [supported, listening, onListeningChange, processVoiceHarnessIntent]);

  const toggleListening = () => {
    if (!supported) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    startListening();
  };

  useEffect(() => {
    if (shouldAutoListen && handsFree && !listening && !isLoading) {
      const t = setTimeout(() => {
        setShouldAutoListen(false);
        startListening();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [shouldAutoListen, handsFree, listening, isLoading, startListening]);

  return (
    <>
      <div className="flex flex-col h-full bg-background/40 backdrop-blur-xl rounded-3xl border border-border/30 overflow-hidden">
        <AgentStatusBar
          state={agentState}
          memoryCount={memoryContext?.memory_count ?? 0}
          sessionCount={memoryContext?.total_sessions ?? 0}
          recentTools={allToolExecutions}
        />

        {/* Voice Operations Deck */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/30">
          <div className="flex items-center gap-2 min-w-0">
            <DeloresAvatar moodLevel={null} isSpeaking={speaking} isListening={listening} size="sm" />
            <AnimatePresence>
              {currentPlan && (
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground truncate"
                >
                  <Sparkles className="w-3 h-3 text-accent" />
                  {currentPlan.replace(/_/g, ' ')}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setVoiceEnabled((v) => !v)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all',
                voiceEnabled
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'bg-muted/50 text-muted-foreground',
              )}
            >
              {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              Voice
            </button>
            <button
              onClick={() => {
                setHandsFree((h) => !h);
                if (!handsFree) setShouldAutoListen(true);
              }}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all',
                handsFree
                  ? 'bg-accent/15 text-accent border border-accent/20'
                  : 'bg-muted/50 text-muted-foreground',
              )}
            >
              <Headphones className="w-3 h-3" />
              Hands-Free
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div className="max-w-[85%] space-y-1.5">
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-primary">
                      DELORES
                    </span>
                    {msg.plan?.includes('search') && (
                      <span className="flex items-center gap-1 text-[9px] text-accent font-semibold">
                        <Shield className="w-2.5 h-2.5" />
                        Live Context
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    'rounded-2xl px-4 py-2.5 text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground prose-invert'
                      : 'bg-card/60 border border-border/30 text-foreground',
                  )}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

                {msg.toolExecutions?.length ? (
                  <div className="space-y-1">
                    {msg.toolExecutions.map((te, i) => (
                      <ToolResultCard key={i} execution={te} />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-card/60 border border-border/30 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {agentState === 'acting'
                    ? 'Accessing tools…'
                    : agentState === 'planning'
                      ? 'Evaluating approach…'
                      : 'Thinking…'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="border-t border-border/30 p-3 bg-card/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processVoiceHarnessIntent(input);
            }}
            className="flex gap-2 items-center"
          >
            <Button
              type="button"
              size="icon"
              variant={listening ? 'default' : 'outline'}
              onClick={toggleListening}
              disabled={!supported || isLoading}
              className="shrink-0"
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Type or speak to Delores…'}
              className="bg-card/40 border-border/30 placeholder:text-muted-foreground/50 h-10"
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      <CreditExhaustedModal open={showExhausted} onClose={() => setShowExhausted(false)} />
    </>
  );
};

export default DeloresVoiceChat;
