import { createContext, useContext, ReactNode } from 'react';
import { useAICredits, CreditState } from '@/hooks/useAICredits';

interface CreditsContextType {
  credits: CreditState;
  fetchCredits: () => Promise<void>;
  deductCredit: () => Promise<boolean>;
  redeemReferral: (code: string) => Promise<boolean>;
  redeemUpgradeCode: (code: string) => Promise<boolean>;
}

const CreditsContext = createContext<CreditsContextType | null>(null);

export const useCredits = () => {
  const ctx = useContext(CreditsContext);
  if (!ctx) throw new Error('useCredits must be used within CreditsProvider');
  return ctx;
};

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const value = useAICredits();
  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};
