import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Volume2, VolumeX, Mic, MicOff, Headphones, Feather, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
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
import { supabase } from '@/integrations/supabase/client';
import { parseToolResults, type AgentState, type ToolExecution, type MemoryContext } from '@/engine/delores-agent';

interface FolktaleInfo {
  theme: string;
  stemConcept: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolExecutions?: ToolExecution[];
  folktale?: FolktaleInfo;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-chat`;
const VOICE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-voice-harness`;
const MEMORY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-memory`;

/* ═══ VOICE SPECTRUM VISUALIZER ═══ */
const VoiceSpectrum = ({ isListening, volume }: { isListening: boolean; volume: number }) => {
  const bars = 24;
  const baseHeight = 3;
  const maxHeight = 32;

  return (
    <div className="flex items-center justify-center gap-[3px] h-10 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20">
      {Array.from({ length: bars }).map((_, i) => {
        let height = baseHeight;
        if (isListening) {
          const centerFactor = 1 - Math.abs(i - bars / 2) / (bars / 2) * 0.5;
          const wave = Math.sin(i * 0.6 + Date.now() * 0.008) * 0.3 + 0.5;
          height = baseHeight + (volume * wave * centerFactor) * (maxHeight - baseHeight);
        }
        return (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-gradient-to-t from-primary/40 to-primary"
            animate={{ height: `${Math.max(baseHeight, height)}px` }}
            transition={{ duration: 0.08, ease: 'linear' }}
          />
        );
      })}
      {isListening && (
        <span className="ml-2 text-[10px] font-medium text-primary animate-pulse">Listening…</span>
      )}
    </div>
  );
};

/* ═══ INLINE MIC BUTTON (with volume tracking) ═══ */
// Android Chrome ignores `continuous=true` and forcibly stops recognition after
// each utterance (or on silence). We work around it by auto-restarting until
// the user stops, or until our pause timer fires.
const IS_ANDROID = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);

const InlineMicButton = ({ onTranscript, onListeningChange, onVolumeChange, autoStart, pauseThreshold = 1500, disabled }: {
  onTranscript: (text: string) => void;
  onListeningChange?: (l: boolean) => void;
  onVolumeChange?: (v: number) => void;
  autoStart?: boolean;
  pauseThreshold?: number;
  disabled?: boolean;
}) => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [pendingSend, setPendingSend] = useState(false);
  const supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef('');
  const interimTextRef = useRef('');
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentRef = useRef(false);
  const wantListeningRef = useRef(false); // user intends to keep listening (drives Android auto-restart)
  const restartingRef = useRef(false);

  const stopVolumeTracking = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = null;
    try { mediaStreamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    mediaStreamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    onVolumeChange?.(0);
  }, [onVolumeChange]);

  const startVolumeTracking = useCallback(() => {
    // Skip on Android — getUserMedia + SpeechRecognition fight over the mic
    // and cause recognition to abort with "audio-capture" / "not-allowed".
    if (IS_ANDROID) return;
    if (audioCtxRef.current) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      mediaStreamRef.current = stream;
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        onVolumeChange?.(avg / 128);
        animFrameRef.current = requestAnimationFrame(update);
      };
      update();
    }).catch(console.warn);
  }, [onVolumeChange]);

  const clearPauseTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
  }, []);

  const commitTranscript = useCallback(() => {
    if (sentRef.current) return;
    const text = (finalTranscriptRef.current || interimTextRef.current).trim();
    if (!text) return;
    sentRef.current = true;
    wantListeningRef.current = false;
    onTranscript(text);
  }, [onTranscript]);

  const armPauseTimer = useCallback(() => {
    clearPauseTimer();
    pauseTimerRef.current = setTimeout(() => {
      setPendingSend(true);
      wantListeningRef.current = false; // stop the Android auto-restart loop
      try { recRef.current?.stop(); } catch {}
      // Fallback: if onend doesn't fire (some Android builds), commit anyway
      setTimeout(() => {
        if (!sentRef.current) commitTranscript();
      }, 400);
    }, pauseThreshold);
  }, [clearPauseTimer, pauseThreshold, commitTranscript]);

  const buildRecognizer = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    // On Android continuous is effectively ignored; keep false so we control the loop ourselves.
    rec.continuous = !IS_ANDROID;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = 'en-US';

    rec.onstart = () => startVolumeTracking();

    rec.onresult = (e: any) => {
      let interim = '';
      let final = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (final) {
        finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + final.trim();
      }
      interimTextRef.current = interim;
      setInterimText(interim);
      if (final || interim) armPauseTimer();
    };

    rec.onend = () => {
      // Android: auto-restart so the user can keep talking past the engine's
      // forced cutoff. We only stop when wantListeningRef is false (user
      // toggled off OR pause timer fired).
      if (wantListeningRef.current && !disabled) {
        restartingRef.current = true;
        try {
          recRef.current?.start();
          return;
        } catch {
          // Sometimes start() throws if called too quickly — retry once
          setTimeout(() => {
            if (!wantListeningRef.current) return;
            try { recRef.current?.start(); } catch {
              wantListeningRef.current = false;
            }
          }, 200);
          return;
        } finally {
          restartingRef.current = false;
        }
      }
      clearPauseTimer();
      setListening(false);
      setPendingSend(false);
      stopVolumeTracking();
      onListeningChange?.(false);
      setInterimText('');
      commitTranscript();
    };

    rec.onerror = (e: any) => {
      const err = e?.error;
      // no-speech: Android fires this constantly during silence — just restart.
      if (err === 'no-speech' && wantListeningRef.current) {
        return; // onend will auto-restart
      }
      if (err && err !== 'aborted') {
        console.warn('Speech recognition error:', err);
      }
      // Hard errors that should stop the loop
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        wantListeningRef.current = false;
        clearPauseTimer();
        setListening(false);
        setPendingSend(false);
        setInterimText('');
        stopVolumeTracking();
        onListeningChange?.(false);
      }
    };

    return rec;
  }, [armPauseTimer, clearPauseTimer, commitTranscript, disabled, onListeningChange, startVolumeTracking, stopVolumeTracking]);

  const startListening = useCallback(() => {
    if (!supported || listening || disabled) return;
    finalTranscriptRef.current = '';
    interimTextRef.current = '';
    sentRef.current = false;
    wantListeningRef.current = true;
    setInterimText('');
    setPendingSend(false);

    const rec = buildRecognizer();
    recRef.current = rec;
    setListening(true);
    onListeningChange?.(true);
    try {
      rec.start();
      armPauseTimer();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      wantListeningRef.current = false;
      setListening(false);
      onListeningChange?.(false);
    }
  }, [supported, listening, disabled, buildRecognizer, onListeningChange, armPauseTimer]);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      wantListeningRef.current = false;
      clearPauseTimer();
      try { recRef.current?.stop(); } catch {}
      return;
    }
    startListening();
  };

  useEffect(() => {
    if (autoStart && !listening && !disabled) {
      const t = setTimeout(startListening, 600);
      return () => clearTimeout(t);
    }
  }, [autoStart, disabled]);

  useEffect(() => () => {
    wantListeningRef.current = false;
    clearPauseTimer();
    try { recRef.current?.stop(); } catch {}
    stopVolumeTracking();
  }, [stopVolumeTracking, clearPauseTimer]);

  if (!supported) return null;

  return (
    <>
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
          listening
            ? 'text-destructive'
            : 'text-muted-foreground hover:text-foreground'
        )}
        title={listening ? 'Stop listening' : 'Speak to Delores'}
      >
        {listening ? (
          <>
            {/* Animated waveform bars when listening */}
            <div className="flex items-center gap-[2px] h-5">
              {[0, 1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-destructive"
                  animate={{ height: ['6px', `${12 + i * 3}px`, '6px'] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </>
        ) : (
          <Mic className="w-5 h-5" />
        )}
        {listening && (
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-destructive/20"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
      {listening && interimText && (
        <span className="text-[10px] text-muted-foreground italic truncate max-w-[140px]">{interimText}</span>
      )}
      {pendingSend && (
        <span className="text-[10px] font-medium text-primary animate-pulse">Sending…</span>
      )}
    </>
  );
};

/* ═══ FOLKTALE CARD ═══ */
const FolktaleCard = ({ folktale }: { folktale: FolktaleInfo }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-3 pt-3 border-t border-border/20"
  >
    <div className="flex items-center gap-1.5 text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
      <Feather className="w-3 h-3" /> Folktale Mirror: {folktale.theme}
    </div>
    <p className="text-[11px] text-muted-foreground italic leading-relaxed">
      {folktale.stemConcept}
    </p>
  </motion.div>
);

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
  const { profile, session } = useAuth();
  const cognitiveDna = useMemo(() => (profile?.preferences as any)?.cognitive_dna, [profile]);
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Welcome, young seeker. I am Delores — a gentle companion on your journey of discovery. I don't just give answers; I help you find them within yourself. What's been on your mind today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [shouldAutoListen, setShouldAutoListen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [ttsPitch, setTtsPitch] = useState(1.1);
  const [ttsRate, setTtsRate] = useState(0.9);
  const [voiceVolume, setVoiceVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [agentState, setAgentState] = useState<AgentState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [memoryContext, setMemoryContext] = useState<MemoryContext | null>(null);
  const [allToolExecutions, setAllToolExecutions] = useState<ToolExecution[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const v = getAvailableVoices();
      if (v.length) setVoices(v);
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  // Speech hook with onEnd callback for hands-free loop
  const { speak, stop, speaking } = useSpeech({
    onEnd: () => {
      if (handsFree && !isLoading) {
        setShouldAutoListen(true);
      }
    },
    voiceURI: selectedVoiceURI || undefined,
    pitch: ttsPitch,
    rate: ttsRate,
  });

  // Load memory context on mount
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
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setMemoryContext(data);
      })
      .catch(console.error);
  }, [session?.access_token]);

  // Personalized greeting based on memory
  useEffect(() => {
    if (memoryContext && memoryContext.total_sessions > 0 && messages.length === 1) {
      const lastSession = memoryContext.recent_sessions?.[0];
      let greeting = "Welcome back, my dear. 🌿 ";
      if (lastSession?.session_summary) {
        greeting += `Last time we explored ${lastSession.topics_discussed?.slice(0, 2).join(' and ') || 'some things'} together. `;
      }
      greeting += `I've been holding ${memoryContext.memory_count} memories of our conversations. What wisdom shall we seek today?`;

      setMessages([{
        id: '0',
        role: 'assistant',
        content: greeting,
      }]);
    }
  }, [memoryContext]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSpeak = (msgId: string, text: string) => {
    if (speaking) {
      stop();
    } else {
      const cleanText = text.replace(/[#*_`~\[\]()>]/g, '').replace(/\n+/g, '. ');
      speak(cleanText);
    }
  };

  // Consolidate session when unmounting
  useEffect(() => {
    return () => {
      if (sessionId && session?.access_token && messages.length > 4) {
        fetch(MEMORY_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ action: 'consolidate', session_id: sessionId }),
        }).catch(console.error);
      }
    };
  }, [sessionId, session?.access_token, messages.length]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Stop any ongoing speech when user sends a message
    if (speaking) stop();
    setShouldAutoListen(false);

    const hasCredit = await useCredit();
    if (!hasCredit) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);
    setAgentState('thinking');

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages.filter(m => m.id !== '0').map(m => ({
            role: m.role,
            content: m.content,
          })),
          sentiment_score: moodLevel ? (moodLevel - 3) * 2 : undefined,
          cognitive_dna: cognitiveDna || undefined,
          session_id: sessionId,
        }),
      });

      if (resp.status === 429) {
        toast({ title: 'Delores needs a moment', description: 'Please wait and try again.', variant: 'destructive' });
        setIsLoading(false); setAgentState('idle'); return;
      }
      if (resp.status === 402) {
        toast({ title: 'Credits exhausted', description: 'Please add AI credits to continue.', variant: 'destructive' });
        setIsLoading(false); setAgentState('idle'); return;
      }
      if (!resp.ok || !resp.body) throw new Error('Stream failed');

      const toolHeader = resp.headers.get('X-Delores-Tools');
      const toolExecutions = parseToolResults(toolHeader);

      if (toolExecutions.length > 0) {
        setAgentState('acting');
        setAllToolExecutions(prev => [...prev, ...toolExecutions]);
        await new Promise(r => setTimeout(r, 600));
      }

      setAgentState('responding');

      const newSessionId = resp.headers.get('X-Delores-Session');
      if (newSessionId) setSessionId(newSessionId);

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
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar, toolExecutions } : m);
                }
                return [...prev, { id: crypto.randomUUID(), role: 'assistant', content: assistantSoFar, toolExecutions }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Auto-speak completed response
      if (voiceEnabled && assistantSoFar) {
        const cleanText = assistantSoFar.replace(/[#*_`~\[\]()>]/g, '').replace(/\n+/g, '. ');
        speak(cleanText);
      }
    } catch (e) {
      console.error('Delores chat error:', e);
      toast({ title: 'Connection error', description: 'Could not reach Delores. Please try again.', variant: 'destructive' });
    }

    setIsLoading(false);
    setAgentState('idle');
  };

  /** Voice-specific path: calls delores-voice-harness for TTS-optimized Socratic responses */
  const sendVoiceMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (speaking) stop();
    setShouldAutoListen(false);

    const hasCredit = await useCredit();
    if (!hasCredit) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setAgentState('thinking');

    try {
      const resp = await fetch(VOICE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          transcript: text.trim(),
          session_id: sessionId,
        }),
      });

      if (resp.status === 429) {
        toast({ title: 'Delores needs a moment', description: 'Please wait and try again.', variant: 'destructive' });
        setIsLoading(false); setAgentState('idle'); return;
      }
      if (resp.status === 402) {
        toast({ title: 'Credits exhausted', description: 'Please add AI credits to continue.', variant: 'destructive' });
        setIsLoading(false); setAgentState('idle'); return;
      }
      if (!resp.ok) throw new Error('Voice harness request failed');

      const data = await resp.json();

      if (data.error) {
        toast({ title: 'Voice error', description: data.error, variant: 'destructive' });
        setIsLoading(false); setAgentState('idle'); return;
      }

      if (data.requires_approval) {
        setAgentState('acting');
        await new Promise(r => setTimeout(r, 400));
      }

      setAgentState('responding');
      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.text,
        folktale: data.folktale || undefined,
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Speak the response (already TTS-optimized, no markdown cleaning needed)
      if (voiceEnabled && data.text) {
        speak(data.text);
      }
    } catch (e) {
      console.error('Voice harness error:', e);
      toast({ title: 'Connection error', description: 'Could not reach Delores voice. Please try again.', variant: 'destructive' });
    }

    setIsLoading(false);
    setAgentState('idle');
  };

  return (
    <>
    <div className="flex flex-col h-full">
      {/* Agent Status Bar */}
      <AgentStatusBar
        state={agentState}
        memoryCount={memoryContext?.memory_count || 0}
        sessionCount={memoryContext?.total_sessions || 0}
        recentTools={allToolExecutions}
      />

      {/* Voice controls header */}
      <div className="flex items-center justify-end gap-1.5 px-3 py-1.5 border-b border-border/20 flex-wrap">
        <button
          onClick={() => setVoiceEnabled(v => !v)}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
            voiceEnabled ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'
          )}
          title={voiceEnabled ? 'Voice on' : 'Voice off'}
        >
          {voiceEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          Voice
        </button>
        {voiceEnabled && voices.length > 0 && (
          <select
            value={selectedVoiceURI}
            onChange={e => setSelectedVoiceURI(e.target.value)}
            className="h-6 px-1.5 rounded-lg text-[10px] bg-card/50 border border-border/30 text-foreground max-w-[140px] truncate"
            title="Choose Delores's voice"
          >
            <option value="">Auto (best match)</option>
            {voices
              .filter(v => v.lang.startsWith('en'))
              .map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
          </select>
        )}
        {voiceEnabled && (
          <button
            onClick={() => setShowVoiceSettings(s => !s)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
              showVoiceSettings ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'
            )}
            title="Voice settings"
          >
            <Sliders className="w-3 h-3" />
          </button>
        )}
        <button
          onClick={() => { setHandsFree(h => !h); if (!handsFree) setShouldAutoListen(true); }}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all',
            handsFree ? 'bg-accent/15 text-accent' : 'bg-muted/50 text-muted-foreground'
          )}
          title="Hands-free mode"
        >
          <Headphones className="w-3 h-3" />
          Hands-free
        </button>
      </div>

      {/* Pitch & Rate sliders panel */}
      <AnimatePresence>
        {showVoiceSettings && voiceEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border/20"
          >
            <div className="px-4 py-3 grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                  <span>Pitch</span>
                  <span className="text-primary">{ttsPitch.toFixed(1)}</span>
                </div>
                <Slider
                  value={[ttsPitch]}
                  onValueChange={([v]) => setTtsPitch(v)}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="h-4"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                  <span>Rate</span>
                  <span className="text-primary">{ttsRate.toFixed(1)}</span>
                </div>
                <Slider
                  value={[ttsRate]}
                  onValueChange={([v]) => setTtsRate(v)}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  className="h-4"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 p-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-secondary text-secondary-foreground rounded-br-md'
                  : 'glass-deep border border-border/30 text-foreground rounded-bl-md'
              )}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <DeloresAvatar moodLevel={moodLevel ?? null} size="xs" isSpeaking={speaking && messages[messages.length - 1]?.id === msg.id} />
                      <span className="text-xs font-medium text-muted-foreground">Delores</span>
                    </div>
                    <button
                      onClick={() => handleSpeak(msg.id, msg.content)}
                      className="p-1 rounded-full hover:bg-accent/20 transition-colors"
                      aria-label={speaking ? 'Stop listening' : 'Listen'}
                    >
                      {speaking ? (
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

                {/* Folktale mirror card for voice responses */}
                {msg.folktale && <FolktaleCard folktale={msg.folktale} />}
              </div>

              {msg.toolExecutions?.length ? (
                <div className="mt-2 space-y-1.5 max-w-[85%]">
                  {msg.toolExecutions.map((te, i) => (
                    <ToolResultCard key={`${te.tool}-${i}`} execution={te} />
                  ))}
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass-deep border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <DeloresAvatar moodLevel={moodLevel ?? null} size="xs" />
                <span className="text-xs text-muted-foreground">
                  {agentState === 'acting' ? 'Delores is taking action…' :
                   agentState === 'planning' ? 'Delores is reflecting…' :
                   'Delores is thinking…'}
                </span>
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

      <div className="p-4 border-t border-border/30 space-y-2">
        {/* Voice spectrum when listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <VoiceSpectrum isListening={isListening} volume={voiceVolume} />
            </motion.div>
          )}
        </AnimatePresence>
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-1 bg-card/50 border border-border/30 rounded-2xl px-3 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isListening ? 'Listening…' : 'Talk to Delores…'}
              className="flex-1 py-2.5 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isLoading}
            />
            <InlineMicButton
              onTranscript={(text) => { setInput(text); sendVoiceMessage(text); }}
              onListeningChange={(l) => { setIsListening(l); onListeningChange?.(l); }}
              onVolumeChange={setVoiceVolume}
              autoStart={shouldAutoListen && handsFree && !speaking && !isLoading}
              disabled={speaking || isLoading}
              pauseThreshold={1500}
            />
          </div>
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
