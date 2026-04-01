import { useState, useCallback } from 'react';
import { useCredits } from '@/contexts/CreditsContext';

/**
 * Hook to gate AI features behind credit checks.
 * Returns { canUse, useCredit, showExhausted, setShowExhausted }
 */
export const useCreditGate = () => {
  const { deductCredit, credits } = useCredits();
  const [showExhausted, setShowExhausted] = useState(false);

  const useCredit = useCallback(async (): Promise<boolean> => {
    const ok = await deductCredit();
    if (!ok) {
      setShowExhausted(true);
      return false;
    }
    return true;
  }, [deductCredit]);

  return {
    canUse: credits.remaining > 0,
    remaining: credits.remaining,
    useCredit,
    showExhausted,
    setShowExhausted,
  };
};
