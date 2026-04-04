import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Timer, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAmbientSound } from '@/contexts/AmbientSoundContext';

const TIMER_OPTIONS = [
  { label: '5 min', seconds: 5 * 60, video: '/videos/breathing-round.mp4' },
  { label: '15 min', seconds: 15 * 60, video: '/videos/breathing-square.mp4' },
  { label: '25 min', seconds: 25 * 60, video: '/videos/breathing-deloris.mp4' },
];

const ENCOURAGEMENTS = [
  "You did it! Your mind is clearer and stronger now. 🧘",
  "Beautiful session. You chose calm over chaos today. ✨",
  "Well done! Consistency is the ultimate superpower. 🌟",
  "You just invested in the most important thing — yourself. 💫",
];

const MeditationPlayer = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState('/videos/breathing-round.mp4');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasAmbientPaused = useRef(false);

  const { pausedOnPage, togglePagePause } = useAmbientSound();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const playDing = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 528;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2);
    } catch {}
  }, []);

  const startSession = (seconds: number) => {
    setSelectedDuration(seconds);
    setTimeRemaining(seconds);
    setIsPlaying(true);
    setIsFullscreen(true);
    setShowComplete(false);

    // Pause ambient sound if not already paused
    if (!pausedOnPage) {
      togglePagePause();
      wasAmbientPaused.current = true;
    }
  };

  // Auto-play video when fullscreen opens
  useEffect(() => {
    if (isFullscreen && isPlaying && videoRef.current) {
      const v = videoRef.current;
      v.muted = false;
      v.currentTime = 0;
      const playPromise = v.play();
      if (playPromise) {
        playPromise.catch(() => {
          // If autoplay with sound fails, try muted first then unmute
          v.muted = true;
          v.play().then(() => {
            setTimeout(() => { v.muted = false; }, 500);
          }).catch(() => {});
        });
      }
    }
  }, [isFullscreen, isPlaying]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const endSession = useCallback(() => {
    setIsPlaying(false);
    videoRef.current?.pause();
    if (timerRef.current) clearInterval(timerRef.current);
    playDing();
    setShowComplete(true);
  }, [playDing]);

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsPlaying(false);
    setShowComplete(false);
    setSelectedDuration(null);
    videoRef.current?.pause();
    if (timerRef.current) clearInterval(timerRef.current);

    // Resume ambient sound if we paused it
    if (wasAmbientPaused.current && pausedOnPage) {
      togglePagePause();
      wasAmbientPaused.current = false;
    }
  };

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, endSession]);

  // Confetti particles
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ['hsl(var(--primary))', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 6],
    size: 4 + Math.random() * 8,
  }));

  const fullscreenPlayer = isFullscreen ? createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
      onClick={togglePlayPause}
    >
      {/* Looping video with sound */}
      <video
        ref={videoRef}
        src="/videos/breathing-round.mp4"
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Timer display */}
      {!showComplete && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
            <Timer className="w-4 h-4 text-white/70" />
            <span className="text-2xl font-mono font-bold text-white tracking-wider">
              {formatTime(timeRemaining)}
            </span>
          </div>
          <p className="text-xs text-white/50">
            {isPlaying ? 'Inhale… Hold… Exhale…' : 'Paused — tap to resume'}
          </p>
        </div>
      )}

      {/* Play/Pause indicator */}
      <AnimatePresence>
        {!isPlaying && !showComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl flex items-center justify-center border border-white/10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Completion screen */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti */}
            {confetti.map(c => (
              <motion.div
                key={c.id}
                initial={{ y: -20, x: `${c.x}vw`, opacity: 1 }}
                animate={{ y: '110vh', opacity: [1, 1, 0], rotate: 360 + Math.random() * 720 }}
                transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
                className="absolute top-0 rounded-sm"
                style={{
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  left: 0,
                }}
              />
            ))}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              className="flex flex-col items-center gap-4 text-center px-8"
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
              <p className="text-white/70 text-sm max-w-xs">
                {ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]}
              </p>
              <p className="text-xs text-white/40 mt-1">
                {selectedDuration ? `${Math.floor(selectedDuration / 60)} minute session complete` : ''}
              </p>
              <Button
                onClick={closeFullscreen}
                className="mt-4 rounded-xl bg-primary text-primary-foreground px-8"
              >
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  ) : null;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Deep Breathing & Focus</h2>
        <p className="text-sm text-muted-foreground">Choose a duration. The video loops as you breathe. When time's up, celebrate.</p>
      </div>

      {/* Preview */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/10 border border-border">
        <video
          src="/videos/breathing-round.mp4"
          loop
          playsInline
          muted
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
          <p className="text-xs text-white/60">Tap a timer below to begin fullscreen</p>
        </div>
      </div>

      {/* Timer Options */}
      <div className="grid grid-cols-3 gap-3">
        {TIMER_OPTIONS.map(opt => (
          <motion.button
            key={opt.label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startSession(opt.seconds)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-background/60 backdrop-blur-xl hover:border-primary/40 transition-all"
          >
            <Timer className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">{opt.label}</span>
            <span className="text-[10px] text-muted-foreground">Focus time</span>
          </motion.button>
        ))}
      </div>

      {/* Hidden video for fullscreen use */}
      <video
        ref={videoRef}
        src="/videos/breathing-round.mp4"
        loop
        playsInline
        className="hidden"
        preload="auto"
      />

      {fullscreenPlayer}
    </div>
  );
};

export default MeditationPlayer;
