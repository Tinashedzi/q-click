import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRESETS = [
  { label: '25 min', seconds: 25 * 60 },
  { label: '15 min', seconds: 15 * 60 },
  { label: '5 min', seconds: 5 * 60 },
];

type Session = { duration: number; completedAt: Date };

const playChime = () => {
  try {
    const ctx = new AudioContext();
    const play = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    play(523.25, 0, 0.6);
    play(659.25, 0.2, 0.6);
    play(783.99, 0.4, 0.8);
  } catch { /* audio not available */ }
};

const PomodoroFocus = () => {
  const [duration, setDuration] = useState(25 * 60);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(() => {
    try { return JSON.parse(localStorage.getItem('pomodoro-sessions') || '[]'); } catch { return []; }
  });
  const chimePlayed = useRef(false);

  useEffect(() => {
    if (!running) return;
    chimePlayed.current = false;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          setRunning(false);
          if (!chimePlayed.current) { chimePlayed.current = true; playChime(); }
          const s: Session = { duration, completedAt: new Date() };
          setSessions(prev => {
            const next = [s, ...prev].slice(0, 20);
            localStorage.setItem('pomodoro-sessions', JSON.stringify(next));
            return next;
          });
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, duration]);

  const reset = useCallback(() => { setRunning(false); setRemaining(duration); }, [duration]);
  const pick = (s: number) => { setDuration(s); setRemaining(s); setRunning(false); };

  const pct = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;

  const todaySessions = sessions.filter(s => {
    const d = new Date(s.completedAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary/70" />
        <span className="text-sm font-medium text-foreground/80">Focus Timer</span>
      </div>

      {/* Ring */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" strokeWidth="4" className="stroke-border/20" />
          <motion.circle
            cx="60" cy="60" r={radius} fill="none" strokeWidth="4"
            strokeLinecap="round"
            className="stroke-primary"
            style={{ strokeDasharray: circ, strokeDashoffset: offset }}
          />
        </svg>
        <span className="text-3xl font-mono font-semibold text-foreground tabular-nums">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </span>
      </div>

      {/* Presets */}
      <div className="flex gap-2">
        {PRESETS.map(p => (
          <motion.button
            key={p.seconds}
            whileTap={{ scale: 0.92 }}
            onClick={() => pick(p.seconds)}
            className={cn(
              'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              duration === p.seconds
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border/30 bg-card/20 text-muted-foreground'
            )}
          >
            {p.label}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: [1, 0.88, 1.05, 1] }}
          onClick={() => setRunning(!running)}
          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border border-primary/30 bg-primary/10 text-primary"
        >
          {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-2xl border border-border/30 bg-card/20 text-muted-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {remaining === 0 && (
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-medium text-primary"
          >
            ✨ Session complete — well done!
          </motion.p>
        )}
      </AnimatePresence>

      {/* Today's sessions */}
      {todaySessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs"
        >
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-[10px] text-muted-foreground/60 font-medium">Today: {todaySessions.length} session{todaySessions.length > 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {todaySessions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-2 py-1 rounded-lg border border-primary/15 bg-primary/5 text-[9px] text-primary/70 font-medium"
              >
                {Math.floor(s.duration / 60)}m
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroFocus;
