// src/components/delores/DeloresVoiceChat.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, Brain, BookOpen, Loader2, Feather, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';

// ============================================================
// HELPER: African folktales for Delores's wisdom
// ============================================================
const FOLKTALES = [
  { theme: 'Anansi the Spider', concept: 'Network Theory, Algorithms', 
    question: "Anansi weaves intricate webs to catch his prey. How does the structure of his web optimize for strength and efficiency? What parallels to modern communication networks?" },
  { theme: 'The Tortoise and the Hare', concept: 'Optimization, Iterative Design', 
    question: "The tortoise's slow but steady pace won the race. When might a slower, iterative approach be more effective than a fast one?" },
  { theme: 'Ubuntu', concept: 'Ecology, Collaborative AI', 
    question: "'I am because we are.' How does this philosophy resonate with ecological interdependence or collaborative AI systems?" },
  { theme: 'Oral Tradition', concept: 'Information Theory, Memory', 
    question: "How does the human brain encode and retrieve stories? What can we learn from oral traditions about long‑term memory?" },
];

function getRandomFolktale() {
  return FOLKTALES[Math.floor(Math.random() * FOLKTALES.length)];
}

// ============================================================
// MESSAGE STORAGE (localStorage – persists across refreshes)
// ============================================================
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  folktale?: any;
}

const STORAGE_KEY = 'delores_messages';

const saveMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const loadMessages = (): Message[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch { return []; }
  }
  return [];
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DeloresVoiceChat() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceSpeed, setVoiceSpeed] = useState(0.9);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Voice hooks
  const { transcript, interimTranscript, isListening, startListening, stopListening } = useSpeechRecognition({ pauseThreshold: 1500 });
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeech();

  // Load available voices for TTS
  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length && !selectedVoiceURI) {
        setSelectedVoiceURI(available[0].voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Load saved messages
  useEffect(() => {
    const saved = loadMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Hello! I'm Delores. I don't just give answers – I help you discover them through questions. You can type or click the mic and speak naturally. I'll listen and respond after you pause for a moment."
      }]);
    }
  }, []);

  // Auto‑scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading, isThinking]);

  // Auto‑send when user finishes speaking (after pause)
  useEffect(() => {
    if (transcript && !isListening && !isLoading) {
      sendMessage(transcript);
    }
  }, [transcript, isListening]);

  // Show interim transcript while speaking
  useEffect(() => {
    if (isListening && interimTranscript) {
      setInput(interimTranscript);
    } else if (!isListening && !transcript) {
      setInput('');
    }
  }, [interimTranscript, isListening, transcript]);

  // BARGE‑IN: if user starts speaking while Delores is talking, stop her immediately
  useEffect(() => {
    if (isListening && isSpeaking) {
      stopSpeaking();
      setSpeakingId(null);
    }
  }, [isListening, isSpeaking, stopSpeaking]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);

    try {
      // Call your edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delores-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          sentiment_score: 0,
        }),
      });

      let assistantText = '';
      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  assistantText += content;
                  // Update message in real time
                  setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last?.role === 'assistant' && last.id !== 'welcome') {
                      return prev.map(m => m.id === last.id ? { ...m, content: assistantText } : m);
                    }
                    return [...prev, { id: Date.now().toString(), role: 'assistant', content: assistantText }];
                  });
                }
              } catch {}
            }
          }
        }
      } else {
        // Fallback if edge function fails
        const folktale = getRandomFolktale();
        assistantText = `Let me reflect on what you said. ${folktale.question}`;
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: assistantText,
          folktale: folktale,
        };
        setMessages(prev => [...prev, assistantMsg]);
      }

      // Save final messages
      setMessages(prev => {
        const updated = [...prev];
        saveMessages(updated);
        return updated;
      });
      
    } catch (err) {
      console.error('Delores error:', err);
      const fallback = "I'm having trouble connecting right now. Please try again in a moment.";
      const errorMsg: Message = { id: Date.now().toString(), role: 'assistant', content: fallback };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) sendMessage(input);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      inputRef.current?.focus();
    }
  };

  // Speak a message with current voice settings
  const speakMessage = (text: string, id: string) => {
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      stopSpeaking();
      speak(text, voiceSpeed, voicePitch, selectedVoiceURI);
      setSpeakingId(id);
      setTimeout(() => setSpeakingId(null), text.length * 60);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border/30 bg-card/30 backdrop-blur-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Delores</h2>
              <p className="text-xs text-muted-foreground">Socratic Mentor • Voice Enabled</p>
            </div>
          </div>

          {/* Voice Settings Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Voice</span>
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg hidden group-hover:block z-50 p-3">
              <div className="mb-3">
                <label className="text-xs font-medium">Voice</label>
                <select
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full mt-1 p-1.5 text-xs rounded-md bg-background border border-border"
                >
                  {voices.slice(0, 20).map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="text-xs font-medium">Speed: {voiceSpeed.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-muted accent-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Pitch: {voicePitch.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full bg-muted accent-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-primary/10 text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border/40 text-foreground rounded-bl-md shadow-sm'
              )}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                        <Feather className="w-3 h-3 text-accent" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">Delores</span>
                    </div>
                    <button
                      onClick={() => speakMessage(msg.content, msg.id)}
                      className="p-1 rounded-full hover:bg-accent/10 transition-colors"
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-accent" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}
                <p>{msg.content}</p>
                {msg.folktale && (
                  <div className="mt-3 pt-2 border-t border-border/30">
                    <div className="flex items-start gap-2 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium text-accent">{msg.folktale.theme}</p>
                        <p className="text-muted-foreground">{msg.folktale.concept}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
                <span className="text-xs text-muted-foreground">Delores is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-border/30 bg-card/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-all relative',
                isListening
                  ? 'bg-destructive/20 text-destructive border border-destructive/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              {isListening && (
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-accent rounded-full"
                      animate={{ height: [4, 12 + Math.random() * 20, 4] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                    />
                  ))}
                </div>
              )}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "👂 Listening... speak now" : "Type or click the mic to speak..."}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-full bg-background border border-border/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Status hint */}
        <div className="flex justify-center mt-3">
          {isListening ? (
            <p className="text-xs text-accent animate-pulse">
              🎤 Listening... (I'll respond when you pause)
            </p>
          ) : isSpeaking ? (
            <p className="text-xs text-muted-foreground">
              🔊 Delores is speaking... (you can interrupt by speaking)
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              💡 Tap the mic and speak naturally. I'll pause, then respond.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
