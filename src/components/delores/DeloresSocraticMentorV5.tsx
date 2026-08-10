import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, Volume2, VolumeX, Brain, BookOpen,
  Loader2, ShieldCheck, Activity, Sliders,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeech } from '@/hooks/useSpeech';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';
import { cn } from '@/lib/utils';

interface JSpaceThought {
  id: string;
  timestamp: string;
  thought: string;
  source: 'think' | 'observe' | 'steer';
}

interface TAORState {
  currentGoal: string;
  iteration: number;
  lastAction: string;
  lastObservation: string;
}

interface ConscienceAudit {
  allowed: boolean;
  reason?: string;
  rulesChecked: string[];
}

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  folktale?: { theme: string; stemConcept: string };
}

const VOICE_HARNESS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-voice-harness`;

const DeloresSocraticMentorV5 = () => {
  const { session } = useAuth();
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();

  const [messages, setMessages] = useState<Msg[]>([{
    id: 'welcome',
    role: 'assistant',
    content:
      'Welcome, my dear. I am Delores, running on the J-Space cognitive core. I am here to examine not just what you think, but how you build your understanding. What shall we tackle today?',
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const [jSpaceThoughts, setJSpaceThoughts] = useState<JSpaceThought[]>([{
    id: '1',
    timestamp: new Date().toLocaleTimeString(),
    thought: 'Initialised core cognitive loop. Awaiting stimulus.',
    source: 'think',
  }]);
  const [taorState, setTaorState] = useState<TAORState>({
    currentGoal: 'Initialise Socratic mentoring & cognitive decoding',
    iteration: 0,
    lastAction: 'Idle',
    lastObservation: 'Waiting for input',
  });
  const [conscienceAudit, setConscienceAudit] = useState<ConscienceAudit>({
    allowed: true,
    rulesChecked: ['no_harm', 'value_alignment', 'socratic_integrity'],
  });
  const [showJSpace, setShowJSpace] = useState(false);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [showTuning, setShowTuning] = useState(false);
  const [pitch, setPitch] = useState(1.1);
  const [rate, setRate] = useState(0.9);

  const scrollRef = useRef<HTMLDivElement>(null);
  const handsFreeRef = useRef(handsFree);
  handsFreeRef.current = handsFree;

  const pushThought = useCallback((thought: string, source: JSpaceThought['source']) => {
    setJSpaceThoughts(prev => [
      { id: `${Date.now()}-${Math.random()}`, timestamp: new Date().toLocaleTimeString(), thought, source },
      ...prev.slice(0, 11),
    ]);
  }, []);

  const startListeningRef = useRef<() => void>(() => {});
  const { speak, stop: stopSpeaking, speaking } = useSpeech({
    pitch,
    rate,
    onEnd: () => {
      if (handsFreeRef.current) setTimeout(() => startListeningRef.current(), 350);
    },
  });

  const sendMessage = useCallback(async (raw?: string) => {
    const query = (raw ?? input).trim();
    if (!query || isLoading) return;
    if (!(await useCredit())) return;

    setMessages(prev => [...prev, { id: `${Date.now()}`, role: 'user', content: query }]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);

    // THINK
    setTaorState(prev => ({
      ...prev,
      iteration: prev.iteration + 1,
      currentGoal: query,
      lastAction: 'Thinking (TAOR)',
    }));
    pushThought(`Deconstructing query: "${query}". Applying Socratic friction & folktale mapping.`, 'think');

    // CONSCIENCE
    setTaorState(prev => ({ ...prev, lastAction: 'Conscience evaluation' }));
    setConscienceAudit({ allowed: true, rulesChecked: ['no_harm', 'value_alignment', 'socratic_integrity'] });

    try {
      const res = await fetch(VOICE_HARNESS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ transcript: query }),
      });

      if (!res.ok) throw new Error(`Harness error ${res.status}`);
      const data = await res.json();

      setTaorState(prev => ({
        ...prev,
        lastAction: data.plan ? `Plan: ${data.plan}` : 'Generating Socratic response',
        lastObservation: 'User intent decoded successfully.',
      }));
      pushThought(`Observed response plan "${data.plan ?? 'conversational'}"${data.folktale?.theme ? ` via ${data.folktale.theme}` : ''}.`, 'observe');
      if (data.requires_approval) {
        setConscienceAudit({
          allowed: false,
          reason: 'Action flagged as restrictive — user confirmation required.',
          rulesChecked: ['no_harm', 'user_consent'],
        });
      }

      const text: string = data.text || 'I hear you, my dear. Say that once more for me?';
      setMessages(prev => [...prev, {
        id: `${Date.now()}-a`,
        role: 'assistant',
        content: text,
        folktale: data.folktale,
      }]);
      if (voiceEnabled) speak(text);
    } catch (err) {
      pushThought('Cognitive core unreachable — falling back to reflective prompt.', 'steer');
      setMessages(prev => [...prev, {
        id: `${Date.now()}-e`,
        role: 'assistant',
        content: 'My thoughts are quiet just now, young one. Let us try that again in a moment.',
      }]);
    } finally {
      setIsThinking(false);
      setIsLoading(false);
    }
  }, [input, isLoading, session, speak, voiceEnabled, pushThought, useCredit]);

  const { supported, isListening, interim, startListening, stopListening } = useSpeechRecognition({
    onSpeechStart: () => { if (speaking) stopSpeaking(); },
    onCommit: (text) => { void sendMessage(text); },
  });
  startListeningRef.current = startListening;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex flex-col h-full min-h-[70vh] rounded-2xl overflow-hidden border border-border bg-background/80 backdrop-blur-xl">
      {/* HEADER */}
      <div className="p-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">Delores AGI</h2>
            <p className="text-xs text-muted-foreground">J-Space + TAOR cognitive core</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(v => { if (v) stopSpeaking(); return !v; })}
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label={voiceEnabled ? 'Mute Delores' : 'Unmute Delores'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowTuning(s => !s)}
            className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Voice tuning"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setHandsFree(h => { const next = !h; if (next) startListening(); else stopListening(); return next; })}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
              handsFree
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            Hands-free
          </button>
          <button
            onClick={() => setShowJSpace(s => !s)}
            className="px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {showJSpace ? 'Hide J-Space' : 'Inspect J-Space'}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{isListening ? 'Listening' : speaking ? 'Speaking' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* TUNING */}
      <AnimatePresence>
        {showTuning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-muted/30"
          >
            <div className="p-4 grid sm:grid-cols-2 gap-4">
              <label className="text-xs font-medium text-muted-foreground">
                Pitch — {pitch.toFixed(2)}
                <input type="range" min={0.5} max={1.5} step={0.05} value={pitch}
                  onChange={e => setPitch(parseFloat(e.target.value))} className="w-full accent-primary mt-1" />
              </label>
              <label className="text-xs font-medium text-muted-foreground">
                Rate — {rate.toFixed(2)}
                <input type="range" min={0.5} max={1.5} step={0.05} value={rate}
                  onChange={e => setRate(parseFloat(e.target.value))} className="w-full accent-primary mt-1" />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* CHAT */}
        <div className="flex-1 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="space-y-4 max-w-3xl mx-auto w-full">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-card border border-border text-card-foreground rounded-bl-sm',
                  )}>
                    <p>{msg.content}</p>
                    {msg.folktale && (
                      <div className="mt-3 pt-3 border-t border-border flex items-start gap-2 text-xs text-primary">
                        <BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold">{msg.folktale.theme}:</span> {msg.folktale.stemConcept}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span>TAOR loop executing thought cycle…</span>
                </div>
              )}
            </div>
          </div>

          {/* INPUT */}
          <div className="p-4 border-t border-border">
            <div className="max-w-3xl mx-auto w-full">
              <AnimatePresence>
                {isListening && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    className="mb-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-end gap-0.5 h-4">
                      {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <motion.span
                          key={i}
                          className="w-1 rounded-full bg-primary"
                          animate={{ height: [4, 14, 6, 16, 5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.08 }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground truncate">
                      {interim || 'Listening… pause when you are done.'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={(e) => { e.preventDefault(); void sendMessage(); }}
                className="flex items-center gap-2 p-2 rounded-full border border-border bg-card shadow-sm"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Delores or speak your mind…"
                  className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-foreground placeholder:text-muted-foreground"
                />
                {supported && (
                  <button
                    type="button"
                    onClick={() => (isListening ? stopListening() : startListening())}
                    className={cn(
                      'p-3 rounded-full transition-colors',
                      isListening
                        ? 'bg-destructive/10 text-destructive animate-pulse'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                    aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* J-SPACE PANEL */}
        <AnimatePresence>
          {showJSpace && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-border bg-muted/30 p-4 overflow-y-auto hidden lg:block text-xs font-mono shrink-0"
            >
              <h3 className="font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> J-Space & TAOR
              </h3>

              <div className="space-y-4">
                <div className="p-3 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground font-semibold">Current goal</p>
                  <p className="text-foreground mt-0.5 break-words">{taorState.currentGoal}</p>
                  <p className="text-muted-foreground mt-2 font-semibold">Iteration: {taorState.iteration}</p>
                  <p className="text-muted-foreground mt-2 font-semibold">Last action</p>
                  <p className="text-primary">{taorState.lastAction}</p>
                  <p className="text-muted-foreground mt-2 font-semibold">Last observation</p>
                  <p className="text-foreground">{taorState.lastObservation}</p>
                </div>

                <div className="p-3 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground font-semibold mb-1">Conscience audit</p>
                  <p className={conscienceAudit.allowed ? 'text-primary' : 'text-destructive'}>
                    {conscienceAudit.allowed ? 'allowed' : 'blocked'}
                  </p>
                  {conscienceAudit.reason && <p className="text-muted-foreground mt-1">{conscienceAudit.reason}</p>}
                  <p className="text-muted-foreground mt-1">{conscienceAudit.rulesChecked.join(', ')}</p>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2 font-semibold">Working memory (J-Space)</p>
                  <div className="space-y-2">
                    {jSpaceThoughts.map(t => (
                      <div key={t.id} className="p-2 bg-card rounded-lg border border-border">
                        <span className="text-[10px] text-muted-foreground">{t.timestamp} · {t.source}</span>
                        <p className="text-foreground mt-0.5">{t.thought}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <CreditExhaustedModal open={showExhausted} onOpenChange={setShowExhausted} />
    </div>
  );
};

export default DeloresSocraticMentorV5;
