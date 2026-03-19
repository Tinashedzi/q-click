import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smile, BookHeart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type DayData = { mood: boolean; journal: boolean };

const StreakCalendar = () => {
  const { user } = useAuth();
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [checkins, setCheckins] = useState<Record<string, DayData>>({});

  useEffect(() => {
    if (!user) return;
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    Promise.all([
      supabase.from('mood_entries').select('created_at').eq('user_id', user.id).gte('created_at', start).lte('created_at', end),
      supabase.from('journal_entries').select('created_at').eq('user_id', user.id).gte('created_at', start).lte('created_at', end),
    ]).then(([moods, journals]) => {
      const map: Record<string, DayData> = {};
      const key = (d: string) => d.slice(0, 10);
      moods.data?.forEach(m => { const k = key(m.created_at); map[k] = { ...map[k], mood: true, journal: map[k]?.journal || false }; });
      journals.data?.forEach(j => { const k = key(j.created_at); map[k] = { mood: map[k]?.mood || false, ...map[k], journal: true }; });
      setCheckins(map);
    });
  }, [user, month, year]);

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const offset = first.getDay();
    const cells: (number | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= last.getDate(); d++) cells.push(d);
    return cells;
  }, [month, year]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const streak = useMemo(() => {
    let count = 0;
    const d = new Date();
    while (true) {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (checkins[k]?.mood || checkins[k]?.journal) { count++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return count;
  }, [checkins]);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Streak Calendar</h3>
          {streak > 0 && (
            <p className="text-xs text-primary mt-0.5">🔥 {streak} day streak</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.85 }} onClick={prev} className="w-7 h-7 rounded-lg border border-border/30 bg-card/20 flex items-center justify-center">
            <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.button>
          <span className="text-xs font-medium text-foreground min-w-[80px] text-center">{MONTHS[month]} {year}</span>
          <motion.button whileTap={{ scale: 0.85 }} onClick={next} className="w-7 h-7 rounded-lg border border-border/30 bg-card/20 flex items-center justify-center">
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d, i) => (
          <span key={i} className="text-[9px] text-muted-foreground/50 text-center font-medium">{d}</span>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const k = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = checkins[k];
          const isToday = k === todayKey;
          const hasBoth = data?.mood && data?.journal;
          const hasAny = data?.mood || data?.journal;

          return (
            <motion.div
              key={k}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.008 }}
              className={cn(
                'aspect-square rounded-lg flex items-center justify-center text-[10px] font-medium relative transition-all',
                isToday && 'ring-1 ring-primary/40',
                hasBoth ? 'bg-primary/20 text-primary' :
                hasAny ? 'bg-primary/8 text-primary/70' :
                'text-muted-foreground/40'
              )}
            >
              {day}
              {hasAny && (
                <div className="absolute -bottom-0.5 flex gap-0.5">
                  {data?.mood && <span className="w-1 h-1 rounded-full bg-primary/60" />}
                  {data?.journal && <span className="w-1 h-1 rounded-full bg-secondary/60" />}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[9px] text-muted-foreground/50">
        <span className="flex items-center gap-1"><Smile className="w-2.5 h-2.5" /> Mood</span>
        <span className="flex items-center gap-1"><BookHeart className="w-2.5 h-2.5" /> Journal</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
