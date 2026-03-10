import { motion } from 'framer-motion';
import { CreditCard, Zap, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreditExhaustedFallbackProps {
  type: 'credits' | 'rate-limit';
  onRetry: () => void;
}

const CreditExhaustedFallback = ({ type, onRetry }: CreditExhaustedFallbackProps) => {
  const isCredits = type === 'credits';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/40 bg-gradient-to-br from-muted/40 via-background to-muted/20 p-6 text-center space-y-4"
    >
      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
        {isCredits ? (
          <CreditCard className="w-5 h-5 text-accent" />
        ) : (
          <Zap className="w-5 h-5 text-accent" />
        )}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-serif text-foreground">
          {isCredits ? 'AI Credits Needed' : 'Too Many Requests'}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {isCredits
            ? 'Your AI credits have been used up. Add more credits in Settings → Workspace → Usage to continue exploring.'
            : 'You\'re sending requests too quickly. Wait a moment and try again.'}
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        className="gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Try Again
      </Button>
    </motion.div>
  );
};

export default CreditExhaustedFallback;
