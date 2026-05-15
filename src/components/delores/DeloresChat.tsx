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
// Platform detection — each engine handles continuous + silence differently.
// - Android Chrome ignores `continuous=true` and stops on silence → we auto-restart.
// - iOS Safari fires onend aggressively after ~3s of silence → we auto-restart.
// - Desktop Chrome/Edge respect continuous=true but still benefit from RMS-based
//   speech-end detection because their built-in cutoff is too short for long sentences.
const UA = typeof navigator !== 'undefined' ? navigator.userAgent : '';
const IS_ANDROID = /android/i.test(UA);
const IS_IOS = /iPad|iPhone|iPod/.test(UA) && !(window as any).MSStream;
const IS_MOBILE = IS_ANDROID || IS_IOS;

// Per-platform tuning. Mobile mics are noisier so we need a higher RMS floor
// and a longer silence window to avoid cutting off mid-thought.
const VOICE_RMS_THRESHOLD = IS_MOBILE ? 0.18 : 0.10; // "speaking" vs "silent"
const SPEECH_END_SILENCE_MS = IS_MOBILE ? 2200 : 1600; // silence required after speech to send
const MAX_LISTEN_MS = 30000; // hard cap so a stuck mic eventually sends what it has

type SpeechPhase = 'idle' | 'waiting' | 'speaking' | 'pausing';

const InlineMicButton = ({ onTranscript, onLiveTranscript, onListeningChange, onVolumeChange, onSpeechStart, autoStart, pauseThreshold, disabled }: {
  onTranscript: (text: string) => void;
  onLiveTranscript?: (text: string) => void;
  onListeningChange?: (l: boolean) => void;
  onVolumeChange?: (v: number) => void;
  onSpeechStart?: () => void; // fires once per turn when user first speaks (for interrupt)
  autoStart?: boolean;
  pauseThreshold?: number; // optional override (ms) for end-of-speech silence
  disabled?: boolean;
}) => {
  const [listening, setListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [phase, setPhase] = useState<SpeechPhase>('idle');
  const [countdown, setCountdown] = useState(0); // seconds until auto-send
  const supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef('');
  const interimTextRef = useRef('');
  const sentRef = useRef(false);
  const wantListeningRef = useRef(false);
  const hasSpokenRef = useRef(false);          // user produced any speech this turn
  const lastVoiceAtRef = useRef<number>(0);     // last time RMS exceeded threshold
  const lastTranscriptAtRef = useRef<number>(0);// last time interim/final updated
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SILENCE_MS = pauseThreshold ?? SPEECH_END_SILENCE_MS;
  const onSpeechStartRef = useRef(onSpeechStart);
  useEffect(() => { onSpeechStartRef.current = onSpeechStart; }, [onSpeechStart]);

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
    // On Android, getUserMedia + SpeechRecognition fight over the mic and trigger
    // "audio-capture" / "not-allowed". We rely on transcript-based timing there.
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
      analyser.fftSize = 512;
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      const buf = new Uint8Array(analyser.frequencyBinCount);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(buf);
        // RMS-style energy normalized to 0..1
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        const rms = Math.sqrt(sum / buf.length) / 128;
        onVolumeChange?.(Math.min(1, rms * 1.5));
        if (rms > VOICE_RMS_THRESHOLD) {
          lastVoiceAtRef.current = Date.now();
          if (!hasSpokenRef.current) { hasSpokenRef.current = true; onSpeechStart?.(); }
        }
        animFrameRef.current = requestAnimationFrame(update);
      };
      update();
    }).catch((err) => {
      console.warn('Volume tracking unavailable:', err);
    });
  }, [onVolumeChange]);

  const commitTranscript = useCallback(() => {
    if (sentRef.current) return;
    const text = (finalTranscriptRef.current || interimTextRef.current).trim();
    if (!text) return;
    sentRef.current = true;
    wantListeningRef.current = false;
    onTranscript(text);
  }, [onTranscript]);

  const stopAndSend = useCallback(() => {
    wantListeningRef.current = false;
    setPhase('pausing');
    try { recRef.current?.stop(); } catch {}
    // Fallback: if onend doesn't fire on some Android builds, commit anyway
    setTimeout(() => { if (!sentRef.current) commitTranscript(); }, 500);
  }, [commitTranscript]);

  // Decision tick — runs while listening. Decides phase + when to auto-send.
  const startDecisionLoop = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      if (!wantListeningRef.current) return;
      const now = Date.now();
      if (now - startedAtRef.current > MAX_LISTEN_MS) {
        if (hasSpokenRef.current) stopAndSend();
        return;
      }
      // Use whichever signal is freshest: audio energy or transcript update.
      const lastActivity = Math.max(lastVoiceAtRef.current, lastTranscriptAtRef.current);
      const sinceActivity = lastActivity ? now - lastActivity : Infinity;

      if (!hasSpokenRef.current) {
        setPhase('waiting');
        setCountdown(0);
        return;
      }
      if (sinceActivity < 350) {
        setPhase('speaking');
        setCountdown(0);
      } else {
        setPhase('pausing');
        const remaining = Math.max(0, SILENCE_MS - sinceActivity);
        setCountdown(Math.ceil(remaining / 1000));
        if (remaining <= 0) stopAndSend();
      }
    }, 150);
  }, [SILENCE_MS, stopAndSend]);

  const stopDecisionLoop = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const buildRecognizer = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    // Desktop respects continuous; mobile engines ignore it but we restart anyway.
    rec.continuous = !IS_MOBILE;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

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
      const combined = (finalTranscriptRef.current + (interim ? ' ' + interim : '')).trim();
      onLiveTranscript?.(combined);
      if (final || interim.trim()) {
        if (!hasSpokenRef.current) onSpeechStart?.();
        hasSpokenRef.current = true;
        lastTranscriptAtRef.current = Date.now();
      }
    };

    rec.onend = () => {
      // If we're still meant to be listening (mobile cutoff or no-speech), restart.
      if (wantListeningRef.current && !disabled) {
        try { recRef.current?.start(); return; }
        catch {
          setTimeout(() => {
            if (!wantListeningRef.current) return;
            try { recRef.current?.start(); } catch { wantListeningRef.current = false; }
          }, 200);
          return;
        }
      }
      stopDecisionLoop();
      setListening(false);
      setPhase('idle');
      setCountdown(0);
      stopVolumeTracking();
      onListeningChange?.(false);
      setInterimText('');
      commitTranscript();
    };

    rec.onerror = (e: any) => {
      const err = e?.error;
      // no-speech is constant on mobile during silence — let the restart loop handle it.
      if (err === 'no-speech' && wantListeningRef.current) return;
      if (err && err !== 'aborted') console.warn('Speech recognition error:', err);
      if (err === 'not-allowed' || err === 'service-not-allowed' || err === 'audio-capture') {
        wantListeningRef.current = false;
        stopDecisionLoop();
        setListening(false);
        setPhase('idle');
        setCountdown(0);
        setInterimText('');
        stopVolumeTracking();
        onListeningChange?.(false);
      }
    };

    return rec;
  }, [commitTranscript, disabled, onListeningChange, startVolumeTracking, stopVolumeTracking, stopDecisionLoop]);

  const startListening = useCallback(() => {
    if (!supported || listening || disabled) return;
    finalTranscriptRef.current = '';
    interimTextRef.current = '';
    sentRef.current = false;
    hasSpokenRef.current = false;
    lastVoiceAtRef.current = 0;
    lastTranscriptAtRef.current = 0;
    startedAtRef.current = Date.now();
    wantListeningRef.current = true;
    setInterimText('');
    setPhase('waiting');
    setCountdown(0);

    const rec = buildRecognizer();
    recRef.current = rec;
    setListening(true);
    onListeningChange?.(true);
    try {
      rec.start();
      startDecisionLoop();
    } catch (err) {
      console.warn('Could not start recognition:', err);
      wantListeningRef.current = false;
      setListening(false);
      onListeningChange?.(false);
    }
  }, [supported, listening, disabled, buildRecognizer, onListeningChange, startDecisionLoop]);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      // Manual stop — send whatever we've got.
      if (hasSpokenRef.current) {
        stopAndSend();
      } else {
        wantListeningRef.current = false;
        try { recRef.current?.stop(); } catch {}
      }
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
    stopDecisionLoop();
    try { recRef.current?.stop(); } catch {}
    stopVolumeTracking();
  }, [stopVolumeTracking, stopDecisionLoop]);

  if (!supported) {
    return (
      <span
        className="text-[10px] text-muted-foreground px-2"
        title="Voice input isn't supported in this browser. Try Chrome or Edge on desktop."
      >
        Mic n/a
      </span>
    );
  }

  const phaseLabel =
    phase === 'speaking' ? 'Hearing you' :
    phase === 'pausing' ? (countdown > 0 ? `Sending in ${countdown}s` : 'Sending…') :
    phase === 'waiting' ? 'Speak now' : '';

  const phaseColor =
    phase === 'speaking' ? 'text-primary' :
    phase === 'pausing' ? 'text-accent' :
    'text-muted-foreground';

  const phaseDot =
    phase === 'speaking' ? 'bg-primary' :
    phase === 'pausing' ? 'bg-accent' :
    'bg-muted-foreground/60';

  return (
    <>
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        className={cn(
          'relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300',
          listening ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
        )}
        title={listening ? 'Stop listening' : 'Speak to Delores'}
      >
        {listening ? (
          <div className="flex items-center gap-[2px] h-5">
            {[0, 1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                className={cn(
                  'w-[3px] rounded-full',
                  phase === 'pausing' ? 'bg-accent' : 'bg-destructive'
                )}
                animate={{ height: ['6px', `${12 + i * 3}px`, '6px'] }}
                transition={{
                  duration: phase === 'speaking' ? 0.4 : 0.9,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        ) : (
          <Mic className="w-5 h-5" />
        )}
        {listening && (
          <motion.span
            className={cn(
              'absolute inset-0 rounded-xl border-2',
              phase === 'speaking' ? 'border-primary/30' :
              phase === 'pausing' ? 'border-accent/30' : 'border-destructive/20'
            )}
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
      {listening && (
        <div className="flex flex-col items-start gap-0.5 max-w-[160px]">
          <div className={cn('flex items-center gap-1 text-[10px] font-medium', phaseColor)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', phaseDot, phase === 'speaking' && 'animate-pulse')} />
            {phaseLabel}
          </div>
          {interimText && (
            <span className="text-[10px] text-muted-foreground italic truncate max-w-[160px]">
              {interimText}
            </span>
          )}
        </div>
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
  const [liveTranscript, setLiveTranscript] = useState('');
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);
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

        {/* Live transcript preview while listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="rounded-xl border border-primary/30 bg-primary/5 p-3"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Live transcript</span>
                <span className="text-[10px] text-muted-foreground">Pause to confirm</span>
              </div>
              <p className="text-sm text-foreground min-h-[1.25rem] leading-snug">
                {liveTranscript || <span className="italic text-muted-foreground">Speak now…</span>}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pending transcript — edit & confirm before send */}
        <AnimatePresence>
          {pendingTranscript !== null && !isListening && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="rounded-xl border border-accent/40 bg-accent/5 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Review before sending</span>
                <span className="text-[10px] text-muted-foreground">Edit if needed</span>
              </div>
              <textarea
                value={pendingTranscript}
                onChange={e => setPendingTranscript(e.target.value)}
                rows={2}
                autoFocus
                className="w-full bg-background/60 border border-border/40 rounded-lg p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setPendingTranscript(null); setLiveTranscript(''); }}
                  className="px-3 py-1 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const t = pendingTranscript.trim();
                    setPendingTranscript(null);
                    setLiveTranscript('');
                    if (t) sendVoiceMessage(t);
                  }}
                  disabled={!pendingTranscript.trim()}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </div>
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
              onTranscript={(text) => {
                setLiveTranscript('');
                if (handsFree) {
                  // Hands-free: skip the confirm step for an uninterrupted loop
                  sendVoiceMessage(text);
                } else {
                  setPendingTranscript(text);
                }
              }}
              onLiveTranscript={setLiveTranscript}
              onListeningChange={(l) => {
                setIsListening(l);
                onListeningChange?.(l);
                if (l) { setLiveTranscript(''); setPendingTranscript(null); }
              }}
              onVolumeChange={setVoiceVolume}
              autoStart={shouldAutoListen && handsFree && !speaking && !isLoading}
              disabled={speaking || isLoading}
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
