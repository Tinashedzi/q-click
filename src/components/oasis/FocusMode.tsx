import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const POMODORO = 25 * 60;
const SHORT_BREAK = 5 * 60;

const FocusMode = () => {
  const [duration, setDuration] = useState(POMODORO);
  const [timeLeft, setTimeLeft] = useState(POMODORO);
  const [running, setRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [oasisMessage, setOasisMessage] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const oasisCheckIns = [
    "Well done. Take a moment to breathe. The river rests in pools before continuing its journey.",
    "Another session complete. The Shona say: 'Kudzidza hakuperi' — learning never ends, but rest is part of learning.",
    "Beautiful focus. Your mind is like a well-tuned mbira — each session adds another note to the melody.",
    "Rest now. As the Tswana say: 'Motho ke motho ka batho' — you are becoming more through this effort.",
  ];

  const reset = useCallback(() => {
    setRunning(false);
    setTimeLeft(isBreak ? SHORT_BREAK : POMODORO);
    clearInterval(intervalRef.current);
  }, [isBreak]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRunning(false);
          if (!isBreak) {
            setSessions(s => s + 1);
            setOasisMessage(oasisCheckIns[Math.floor(Math.random() * oasisCheckIns.length)]);
            setIsBreak(true);
            // Try haptic feedback
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
          } else {
            setIsBreak(false);
            setOasisMessage('');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, isBreak]);

  useEffect(() => {
    setTimeLeft(isBreak ? SHORT_BREAK : POMODORO);
  }, [isBreak]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = 1 - timeLeft / (isBreak ? SHORT_BREAK : POMODORO);

  return (
    <div className="max-w-sm mx-auto text-center space-y-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Focus className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-serif text-foreground">Focus Mode</h3>
      </div>

      {/* Timer ring */}
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle cx="50" cy="50" r="45" fill="none" stroke={isBreak ? 'hsl(var(--celadon-jade))' : 'hsl(var(--sun-baked-clay))'} strokeWidth="3"
            strokeDasharray={`${progress * 283} 283`} strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-serif text-foreground tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground mt-1">{isBreak ? 'Break' : 'Focus'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <Button variant="outline" size="icon" onClick={reset}><RotateCcw className="w-4 h-4" /></Button>
        <Button onClick={() => setRunning(!running)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6">
          {running ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5" />}
          {running ? 'Pause' : 'Start'}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">Sessions completed: {sessions}</p>

      {/* Oasis check-in message */}
      {oasisMessage && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-secondary/10 border border-secondary/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🌿</span>
            <span className="text-xs font-medium text-muted-foreground">Oasis says:</span>
          </div>
          <p className="text-sm text-foreground italic">{oasisMessage}</p>
        </motion.div>
      )}
    </div>
  );
};

export default FocusMode;
