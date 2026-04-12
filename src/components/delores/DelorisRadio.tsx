import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Play, Pause, Volume2, VolumeX, SkipForward, Waves } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface SoundChannel {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'lofi' | 'nature' | 'binaural' | 'ambient';
  frequency?: number; // For binaural beats
  moodAffinity: number[]; // Which mood levels (1-5) this works best for
}

const CHANNELS: SoundChannel[] = [
  { id: 'lofi-study', name: 'Study Beats', emoji: '📚', description: 'Chill lo-fi hip hop for deep focus', category: 'lofi', moodAffinity: [3, 4, 5] },
  { id: 'lofi-jazz', name: 'Jazz Café', emoji: '☕', description: 'Smooth jazz & coffee shop vibes', category: 'lofi', moodAffinity: [2, 3, 4] },
  { id: 'rain', name: 'Rainfall', emoji: '🌧️', description: 'Gentle rain on windows', category: 'nature', moodAffinity: [1, 2, 3] },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊', description: 'Rhythmic ocean surf', category: 'nature', moodAffinity: [1, 2, 3] },
  { id: 'forest', name: 'Forest Dawn', emoji: '🌲', description: 'Birds, rustling leaves, creek', category: 'nature', moodAffinity: [2, 3, 4] },
  { id: 'thunderstorm', name: 'Thunderstorm', emoji: '⛈️', description: 'Distant thunder & heavy rain', category: 'nature', moodAffinity: [1, 2] },
  { id: 'alpha', name: 'Alpha Waves', emoji: '🧠', description: '10Hz binaural for relaxed focus', category: 'binaural', frequency: 10, moodAffinity: [2, 3, 4] },
  { id: 'beta', name: 'Beta Focus', emoji: '⚡', description: '20Hz binaural for concentration', category: 'binaural', frequency: 20, moodAffinity: [3, 4, 5] },
  { id: 'theta', name: 'Theta Dreams', emoji: '💫', description: '6Hz binaural for creativity', category: 'binaural', frequency: 6, moodAffinity: [1, 2, 3] },
  { id: 'space', name: 'Deep Space', emoji: '🌌', description: 'Ambient cosmic drones', category: 'ambient', moodAffinity: [1, 2, 3, 4] },
  { id: 'fireplace', name: 'Fireside', emoji: '🔥', description: 'Crackling fire warmth', category: 'ambient', moodAffinity: [2, 3, 4] },
];

const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '🎵' },
  { key: 'lofi', label: 'Lo-Fi', emoji: '🎧' },
  { key: 'nature', label: 'Nature', emoji: '🌿' },
  { key: 'binaural', label: 'Binaural', emoji: '🧠' },
  { key: 'ambient', label: 'Ambient', emoji: '✨' },
];

interface DelorisRadioProps {
  moodLevel?: number | null;
  compact?: boolean;
}

const DelorisRadio = ({ moodLevel, compact = false }: DelorisRadioProps) => {
  const [playing, setPlaying] = useState(false);
  const [activeChannel, setActiveChannel] = useState<SoundChannel | null>(
    CHANNELS.find(c => c.id === 'thunderstorm') || null
  );
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [filter, setFilter] = useState('all');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);

  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
    oscillatorsRef.current = [];
    try { noiseRef.current?.stop(); } catch {}
    noiseRef.current = null;
  }, []);

  const createNoise = useCallback((ctx: AudioContext, gain: GainNode, type: string) => {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        if (type === 'rain' || type === 'ocean') {
          // Filtered noise for water sounds
          data[i] = (Math.random() * 2 - 1) * 0.3;
        } else if (type === 'forest') {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        } else {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    // Shape the sound with filters
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'highpass';
      filter.frequency.value = 800;
    } else if (type === 'ocean') {
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      // Modulate for wave effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      oscillatorsRef.current.push(lfo);
    } else if (type === 'thunderstorm') {
      filter.type = 'lowpass';
      filter.frequency.value = 300;
    } else if (type === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;
    } else if (type === 'fireplace') {
      filter.type = 'lowpass';
      filter.frequency.value = 600;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
    }

    source.connect(filter);
    filter.connect(gain);
    source.start();
    noiseRef.current = source;
  }, []);

  const playChannel = useCallback((channel: SoundChannel) => {
    stopAudio();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    
    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.connect(ctx.destination);
    }
    gainRef.current.gain.value = muted ? 0 : volume;

    if (channel.category === 'binaural' && channel.frequency) {
      // Binaural beats: two slightly offset sine waves
      const baseFreq = 200;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = baseFreq;
      osc2.frequency.value = baseFreq + channel.frequency;

      const panL = ctx.createStereoPanner();
      const panR = ctx.createStereoPanner();
      panL.pan.value = -1;
      panR.pan.value = 1;

      osc1.connect(panL).connect(gainRef.current);
      osc2.connect(panR).connect(gainRef.current);
      osc1.start();
      osc2.start();
      oscillatorsRef.current = [osc1, osc2];
    } else if (channel.category === 'lofi') {
      // Lo-fi: warm chords with slight detune
      const notes = [261.63, 329.63, 392.00, 493.88]; // C E G B
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.value = freq;
        osc.detune.value = Math.random() * 10 - 5;
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.08;
        osc.connect(oscGain).connect(gainRef.current!);
        osc.start();
        oscillatorsRef.current.push(osc);
      });
      // Add subtle noise for vinyl crackle
      createNoise(ctx, gainRef.current, 'lofi');
    } else if (channel.category === 'ambient') {
      // Ambient drones
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = channel.id === 'space' ? 55 : 110;
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = channel.id === 'space' ? 82.5 : 165;
      osc2.detune.value = 3;

      [osc1, osc2].forEach(o => {
        const g = ctx.createGain();
        g.gain.value = 0.12;
        o.connect(g).connect(gainRef.current!);
        o.start();
        oscillatorsRef.current.push(o);
      });

      if (channel.id === 'fireplace') {
        createNoise(ctx, gainRef.current, 'fireplace');
      }
    } else {
      // Nature sounds via filtered noise
      createNoise(ctx, gainRef.current, channel.id);
    }

    setActiveChannel(channel);
    setPlaying(true);
  }, [volume, muted, stopAudio, createNoise]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Auto-suggest channel based on mood
  useEffect(() => {
    if (moodLevel && !activeChannel) {
      const recommended = CHANNELS.filter(c => c.moodAffinity.includes(moodLevel));
      if (recommended.length > 0) {
        setActiveChannel(recommended[0]);
      }
    }
  }, [moodLevel, activeChannel]);

  useEffect(() => {
    return () => { stopAudio(); };
  }, [stopAudio]);

  const filtered = filter === 'all' ? CHANNELS : CHANNELS.filter(c => c.category === filter);

  // Mood-recommended channels
  const recommended = moodLevel
    ? CHANNELS.filter(c => c.moodAffinity.includes(moodLevel)).slice(0, 3)
    : [];

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/70 backdrop-blur-xl">
        <Radio className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground flex-1 truncate">
          {activeChannel ? `${activeChannel.emoji} ${activeChannel.name}` : 'Deloris Radio'}
        </span>
        {activeChannel && (
          <button
            onClick={() => { playing ? stopAudio() : playChannel(activeChannel); setPlaying(!playing); }}
            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
          >
            {playing ? <Pause className="w-3 h-3 text-primary" /> : <Play className="w-3 h-3 text-primary" />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Radio className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Deloris Radio</h3>
          <p className="text-xs text-muted-foreground">AI-curated soundscapes for focus & calm</p>
        </div>
      </div>

      {/* Now Playing */}
      <AnimatePresence>
        {activeChannel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activeChannel.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{activeChannel.name}</p>
                <p className="text-xs text-muted-foreground">{activeChannel.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { if (playing) { stopAudio(); setPlaying(false); } else { playChannel(activeChannel); } }}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md"
                >
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    const idx = CHANNELS.findIndex(c => c.id === activeChannel.id);
                    const next = CHANNELS[(idx + 1) % CHANNELS.length];
                    if (playing) stopAudio();
                    playChannel(next);
                  }}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                >
                  <SkipForward className="w-3 h-3 text-foreground" />
                </button>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-3 mt-3">
              <button onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-foreground" />}
              </button>
              <Slider
                value={[muted ? 0 : volume * 100]}
                onValueChange={([v]) => { setVolume(v / 100); setMuted(false); }}
                max={100}
                step={1}
                className="flex-1"
              />
            </div>

            {/* Visualizer bars */}
            {playing && (
              <div className="flex items-end gap-0.5 h-6 mt-3 justify-center">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-primary/60"
                    animate={{ height: [4, 8 + Math.random() * 16, 4] }}
                    transition={{ duration: 0.6 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood recommendation */}
      {recommended.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Waves className="w-3 h-3" /> Recommended for your mood
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recommended.map(ch => (
              <button
                key={ch.id}
                onClick={() => playChannel(ch)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all ${
                  activeChannel?.id === ch.id
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-background/60 text-muted-foreground hover:border-primary/40'
                }`}
              >
                <span>{ch.emoji}</span>
                <span className="font-medium">{ch.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              filter === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Channel list */}
      <div className="space-y-2">
        {filtered.map((ch, i) => (
          <motion.button
            key={ch.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => playChannel(ch)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              activeChannel?.id === ch.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-background/50 hover:bg-background/80'
            }`}
          >
            <span className="text-xl">{ch.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{ch.name}</p>
              <p className="text-xs text-muted-foreground truncate">{ch.description}</p>
            </div>
            {activeChannel?.id === ch.id && playing ? (
              <div className="flex items-end gap-0.5 h-4">
                {[0, 1, 2].map(j => (
                  <motion.div
                    key={j}
                    className="w-0.5 rounded-full bg-primary"
                    animate={{ height: [3, 12, 3] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.15 }}
                  />
                ))}
              </div>
            ) : (
              <Play className="w-3 h-3 text-muted-foreground" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DelorisRadio;
