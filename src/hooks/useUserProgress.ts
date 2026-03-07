import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { belts } from '@/data/gamificationData';

export interface UserProgress {
  wisdom_points: number;
  concepts_explored: number;
  streak_days: number;
  last_active_date: string | null;
  achievements: string[];
}

const DEFAULT_PROGRESS: UserProgress = {
  wisdom_points: 0,
  concepts_explored: 0,
  streak_days: 0,
  last_active_date: null,
  achievements: [],
};

export const useUserProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProgress({
        wisdom_points: data.wisdom_points,
        concepts_explored: data.concepts_explored,
        streak_days: data.streak_days,
        last_active_date: data.last_active_date,
        achievements: data.achievements,
      });
    } else if (error?.code === 'PGRST116') {
      // No row yet — create one
      await supabase.from('user_progress').insert({ user_id: user.id });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const addPoints = useCallback(async (points: number) => {
    if (!user) return;
    const newPoints = progress.wisdom_points + points;
    setProgress(p => ({ ...p, wisdom_points: newPoints }));
    await supabase
      .from('user_progress')
      .update({ wisdom_points: newPoints, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }, [user, progress.wisdom_points]);

  const incrementConcepts = useCallback(async (count = 1) => {
    if (!user) return;
    const newCount = progress.concepts_explored + count;
    setProgress(p => ({ ...p, concepts_explored: newCount }));
    await supabase
      .from('user_progress')
      .update({ concepts_explored: newCount, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }, [user, progress.concepts_explored]);

  const updateStreak = useCallback(async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    if (progress.last_active_date === today) return; // Already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = progress.last_active_date === yesterday ? progress.streak_days + 1 : 1;

    setProgress(p => ({ ...p, streak_days: newStreak, last_active_date: today }));
    await supabase
      .from('user_progress')
      .update({ streak_days: newStreak, last_active_date: today, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }, [user, progress.streak_days, progress.last_active_date]);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user || progress.achievements.includes(achievementId)) return;
    const newAchievements = [...progress.achievements, achievementId];
    setProgress(p => ({ ...p, achievements: newAchievements }));
    await supabase
      .from('user_progress')
      .update({ achievements: newAchievements, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
  }, [user, progress.achievements]);

  // Derived belt info
  const currentBelt = [...belts].reverse().find(b => progress.wisdom_points >= b.pointsRequired) || belts[0];
  const nextBelt = belts.find(b => b.pointsRequired > progress.wisdom_points);

  return {
    progress,
    loading,
    currentBelt,
    nextBelt,
    addPoints,
    incrementConcepts,
    updateStreak,
    unlockAchievement,
    refetch: fetchProgress,
  };
};
