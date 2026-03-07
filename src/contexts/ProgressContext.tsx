import { createContext, useContext, ReactNode } from 'react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { Belt } from '@/data/gamificationData';

interface ProgressContextType {
  progress: {
    wisdom_points: number;
    concepts_explored: number;
    streak_days: number;
    last_active_date: string | null;
    achievements: string[];
  };
  loading: boolean;
  currentBelt: Belt;
  nextBelt: Belt | undefined;
  addPoints: (points: number) => Promise<void>;
  incrementConcepts: (count?: number) => Promise<void>;
  updateStreak: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const value = useUserProgress();
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
