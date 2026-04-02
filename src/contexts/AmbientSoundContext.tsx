import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface AmbientSoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (v: number) => void;
  pausedOnPage: string | null;
  togglePagePause: () => void;
  currentSound: string;
}

const AmbientSoundContext = createContext<AmbientSoundContextType>({
  isMuted: false,
  toggleMute: () => {},
  volume: 0.15,
  setVolume: () => {},
  pausedOnPage: null,
  togglePagePause: () => {},
  currentSound: 'thunderstorm',
});

export const useAmbientSound = () => useContext(AmbientSoundContext);

const PAGE_SOUNDS: Record<string, { type: string; label: string; filterFreq: number; filterType: BiquadFilterType }> = {
  '/': { type: 'thunderstorm', label: 'Thunderstorm', filterFreq: 300, filterType: 'lowpass' },
  '/oasis': { type: 'calm_waves', label: 'Ocean Waves', filterFreq: 400, filterType: 'lowpass' },
  '/delores': { type: 'rain', label: 'Gentle Rain', filterFreq: 800, filterType: 'highpass' },
  '/forge': { type: 'synth', label: 'Focus Synth', filterFreq: 1200, filterType: 'lowpass' },
  '/library': { type: 'forest', label: 'Forest Dawn', filterFreq: 2000, filterType: 'bandpass' },
  '/glossa': { type: 'rain', label: 'Gentle Rain', filterFreq: 800, filterType: 'highpass' },
  '/gamification': { type: 'fireplace', label: 'Fireside', filterFreq: 600, filterType: 'lowpass' },
};

function getPageSound(pathname: string) {
  return PAGE_SOUNDS[pathname] || PAGE_SOUNDS['/'];
}

export const AmbientSoundProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [pausedOnPage, setPausedOnPage] = useState<string | null>(null);
  const [currentSound, setCurrentSound] = useState('thunderstorm');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const activePathRef = useRef<string>('');

  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch {} });
    oscillatorsRef.current = [];
    try { sourceRef.current?.stop(); } catch {}
    sourceRef.current = null;
  }, []);

  const startSound = useCallback((pathname: string) => {
    stopAudio();
    const config = getPageSound(pathname);
    setCurrentSound(config.type);
    activePathRef.current = pathname;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;

    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.connect(ctx.destination);
    }
    gainRef.current.gain.setTargetAtTime(isMuted ? 0 : volume, ctx.currentTime, 0.3);

    if (config.type === 'synth') {
      // Forge: driven rhythmic synth
      const notes = [110, 146.83, 164.81, 220];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.value = freq;
        osc.detune.value = Math.random() * 6 - 3;
        const g = ctx.createGain();
        g.gain.value = 0.04;
        osc.connect(g).connect(gainRef.current!);
        osc.start();
        oscillatorsRef.current.push(osc);
      });
    } else {
      // Noise-based sounds
      const bufferSize = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        const amp = config.type === 'forest' ? 0.15 : config.type === 'rain' ? 0.3 : 0.25;
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * amp;
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = config.filterType;
      filter.frequency.value = config.filterFreq;
      if (config.filterType === 'bandpass') filter.Q.value = 0.5;

      // For ocean/calm_waves, add LFO modulation
      if (config.type === 'calm_waves') {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        oscillatorsRef.current.push(lfo);
      }

      source.connect(filter);
      filter.connect(gainRef.current);
      source.start();
      sourceRef.current = source;
    }
  }, [isMuted, volume, stopAudio]);

  // Route change: cross-fade to new sound
  useEffect(() => {
    const isPaused = pausedOnPage === location.pathname;
    if (isPaused) {
      // Mute gain but don't stop oscillators so we can resume
      if (gainRef.current && audioCtxRef.current) {
        gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3);
      }
      return;
    }

    // Need user gesture to start AudioContext
    const resumeAndPlay = () => {
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume().then(() => startSound(location.pathname));
      } else {
        startSound(location.pathname);
      }
    };

    // Small delay for smooth transition
    const t = setTimeout(resumeAndPlay, 200);
    return () => clearTimeout(t);
  }, [location.pathname, pausedOnPage, startSound, stopAudio]);

  // Volume / mute changes
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setTargetAtTime(
        isMuted || pausedOnPage === location.pathname ? 0 : volume,
        audioCtxRef.current.currentTime,
        0.3,
      );
    }
  }, [volume, isMuted, pausedOnPage, location.pathname]);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);
  const togglePagePause = useCallback(() => {
    setPausedOnPage(prev => prev ? null : location.pathname);
  }, [location.pathname]);

  return (
    <AmbientSoundContext.Provider value={{ isMuted, toggleMute, volume, setVolume, pausedOnPage, togglePagePause, currentSound }}>
      {children}
    </AmbientSoundContext.Provider>
  );
};
