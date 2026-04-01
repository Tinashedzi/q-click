import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CreditState {
  daily_credits: number;
  daily_used: number;
  monthly_bonus: number;
  monthly_used: number;
  referral_credits: number;
  remaining: number;
  referral_code: string;
  total_referrals: number;
  loading: boolean;
}

const DEFAULT: CreditState = {
  daily_credits: 5,
  daily_used: 0,
  monthly_bonus: 0,
  monthly_used: 0,
  referral_credits: 0,
  remaining: 5,
  referral_code: '',
  total_referrals: 0,
  loading: true,
};

export const useAICredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<CreditState>(DEFAULT);

  const fetchCredits = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        body: { action: 'check' },
      });
      if (error) throw error;
      setCredits({ ...data, loading: false });
    } catch {
      setCredits(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Auto-refresh every 30s
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchCredits, 30_000);
    return () => clearInterval(interval);
  }, [user, fetchCredits]);

  const deductCredit = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        body: { action: 'deduct' },
      });
      if (error) {
        // Check if it's a 402 insufficient credits
        if (error.message?.includes('402') || error.message?.includes('insufficient')) {
          return false;
        }
        throw error;
      }
      if (data?.error === 'insufficient_credits') {
        return false;
      }
      if (data?.success) {
        setCredits(prev => ({ ...prev, remaining: data.remaining }));
        if (data.low_credits) {
          toast.warning('⚡ Low credits! You have ' + data.remaining + ' AI credits left. They replenish at midnight.', {
            duration: 5000,
          });
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [user]);

  const redeemReferral = useCallback(async (code: string) => {
    if (!user) return false;
    try {
      const { data, error } = await supabase.functions.invoke('manage-credits', {
        body: { action: 'redeem_referral', referral_code: code },
      });
      if (error) throw error;
      if (data?.success) {
        toast.success(`🎉 Referral code redeemed! You earned ${data.bonus} bonus credits.`);
        await fetchCredits();
        return true;
      }
      if (data?.error) {
        toast.error(data.error);
      }
      return false;
    } catch (e: any) {
      toast.error(e.message || 'Failed to redeem code');
      return false;
    }
  }, [user, fetchCredits]);

  return { credits, fetchCredits, deductCredit, redeemReferral };
};
