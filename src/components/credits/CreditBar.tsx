import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useCredits } from '@/contexts/CreditsContext';
import { cn } from '@/lib/utils';

const CreditBar = () => {
  const { credits } = useCredits();
  if (credits.loading) return null;

  const total = credits.daily_credits + credits.monthly_bonus + credits.referral_credits;
  const used = credits.daily_used + credits.monthly_used;
  const pct = total > 0 ? Math.max(0, Math.min(100, (credits.remaining / total) * 100)) : 0;
  const isLow = credits.remaining <= 2;
  const isEmpty = credits.remaining <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
        isEmpty
          ? 'border-destructive/40 bg-destructive/10 text-destructive'
          : isLow
          ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
          : 'border-primary/30 bg-primary/5 text-primary'
      )}
    >
      <Zap className={cn('w-3.5 h-3.5', isEmpty ? 'text-destructive' : isLow ? 'text-yellow-500' : 'text-primary')} />
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full',
              isEmpty ? 'bg-destructive' : isLow ? 'bg-yellow-500' : 'bg-primary'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span>{credits.remaining}</span>
      </div>
    </motion.div>
  );
};

export default CreditBar;
