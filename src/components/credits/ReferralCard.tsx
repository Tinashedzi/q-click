import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCredits } from '@/contexts/CreditsContext';
import { toast } from 'sonner';

const ReferralCard = () => {
  const { credits, redeemReferral } = useCredits();
  const [redeemCode, setRedeemCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(credits.referral_code);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareApp = async () => {
    const text = `Join me on Q-Click! Use my referral code: ${credits.referral_code} to get 2 bonus AI credits 🎓✨`;
    if (navigator.share) {
      await navigator.share({ title: 'Q-Click', text, url: window.location.origin });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Share text copied to clipboard!');
    }
  };

  const handleRedeem = async () => {
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    await redeemReferral(redeemCode.trim());
    setRedeeming(false);
    setRedeemCode('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/40 bg-gradient-to-br from-accent/5 via-background to-primary/5 p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Gift className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Earn Free Credits</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Share your referral code. You get 2 credits per referral (4 if you're Pro). Friends get 2 bonus credits too!
      </p>

      <div className="flex items-center gap-2">
        <div className="flex-1 px-3 py-2 rounded-lg bg-muted/50 border border-border/40 font-mono text-sm text-foreground tracking-wider text-center">
          {credits.referral_code || '...'}
        </div>
        <Button size="sm" variant="outline" onClick={copyCode} className="gap-1">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </Button>
        <Button size="sm" onClick={shareApp} className="gap-1">
          <Share2 className="w-3.5 h-3.5" /> Share
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {credits.total_referrals} referral{credits.total_referrals !== 1 ? 's' : ''} so far
      </p>

      <div className="border-t border-border/30 pt-3">
        <p className="text-xs text-muted-foreground mb-2">Have a referral code?</p>
        <div className="flex gap-2">
          <Input
            value={redeemCode}
            onChange={e => setRedeemCode(e.target.value)}
            placeholder="Enter code"
            className="flex-1 h-8 text-sm"
          />
          <Button size="sm" variant="outline" onClick={handleRedeem} disabled={redeeming || !redeemCode.trim()}>
            Redeem
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralCard;
