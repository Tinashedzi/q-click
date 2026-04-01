import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown, ChevronLeft, Loader2, Settings, Share2, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCredits } from '@/contexts/CreditsContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ReferralCard from '@/components/credits/ReferralCard';

const ease = [0.22, 1, 0.36, 1] as const;

const TIERS = {
  pro: {
    price_id: 'price_1THFVgC5aAzFbeKd8qN1S0G5',
    product_id: 'prod_UFl1ztk4G68QX9',
  },
  institution: {
    price_id: 'price_1THFW8C5aAzFbeKdKcaIctRJ',
    product_id: 'prod_UFl2GwiNBP4644',
  },
};

const Pricing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, subscription, refreshSubscription } = useAuth();
  const { credits, fetchCredits } = useCredits();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    refreshSubscription();
    // Handle post-credit-purchase
    if (searchParams.get('credits_purchased') === 'true') {
      toast.success('🎉 50 bonus credits added to your account!');
      fetchCredits();
      // Clean URL
      window.history.replaceState({}, '', '/pricing');
    }
  }, [refreshSubscription, searchParams, fetchCredits]);

  const activeTier = subscription.subscribed
    ? Object.entries(TIERS).find(([, v]) => v.product_id === subscription.productId)?.[0] ?? null
    : null;

  const plans = [
    {
      name: 'Explorer',
      price: 'Free',
      period: '',
      desc: 'Start your cognitive journey',
      features: [
        '5 AI credits/day (resets at midnight)',
        'Daily Insight Feed (3 videos/day)',
        'Basic Oasis quests',
        'Mood check-ins with Delris',
        '1 Forge experiment/day',
        'Earn credits via referrals',
      ],
      creditInfo: '5 daily credits',
      cta: activeTier ? 'Free Plan' : 'Current Plan',
      isCurrentPlan: !activeTier,
      icon: Zap,
      tier: null as string | null,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      desc: 'Unlock your full potential',
      features: [
        '50 AI credits/day + 200 monthly bonus',
        'Unlimited video feed & library',
        'Unlimited AI quests & concept maps',
        'Advanced Forge Labs (Bio, Spatial, Game)',
        'Personalised learning paths',
        'Emotional Intelligence dashboard',
        'Priority AI responses',
        'Double referral rewards (4 credits each)',
        'Export & share projects',
      ],
      creditInfo: '50 daily + 200 monthly',
      cta: activeTier === 'pro' ? 'Your Plan' : 'Start 7-Day Free Trial',
      isCurrentPlan: activeTier === 'pro',
      highlight: true,
      icon: Sparkles,
      tier: 'pro',
    },
    {
      name: 'Institution',
      price: '$49.99',
      period: '/month',
      desc: 'For schools & learning groups',
      features: [
        '200 AI credits/day + 1000 monthly bonus',
        'Everything in Pro',
        'Up to 50 learner seats',
        'Teacher dashboard & analytics',
        'Custom rubric & assessment tools',
        'Dedicated support',
        'White-label options',
      ],
      creditInfo: '200 daily + 1000 monthly',
      cta: activeTier === 'institution' ? 'Your Plan' : 'Subscribe',
      isCurrentPlan: activeTier === 'institution',
      icon: Crown,
      tier: 'institution',
    },
  ];

  const handleSubscribe = useCallback(async (tier: string) => {
    if (!user) {
      toast.error('Please sign in first to subscribe.');
      navigate('/auth');
      return;
    }
    const priceId = TIERS[tier as keyof typeof TIERS]?.price_id;
    if (!priceId) return;
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (e: any) {
      toast.error(e.message || 'Failed to start checkout');
    } finally {
      setLoadingTier(null);
    }
  }, [user, navigate]);

  const handleManageSubscription = useCallback(async () => {
    if (!user) return;
    setLoadingTier('manage');
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (e: any) {
      toast.error(e.message || 'Failed to open subscription management');
    } finally {
      setLoadingTier(null);
    }
  }, [user]);

  const handleBuyCredits = useCallback(async () => {
    if (!user) {
      toast.error('Please sign in first.');
      return;
    }
    setLoadingTier('credits');
    try {
      const { data, error } = await supabase.functions.invoke('purchase-credits');
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (e: any) {
      toast.error(e.message || 'Failed to start checkout');
    } finally {
      setLoadingTier(null);
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-28">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }} className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight text-center">Choose Your Path</h1>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-md mx-auto">
          Every AI feature costs 1 credit. Free users get 5/day. Upgrade for more.
        </p>
      </motion.div>

      {/* Current credits banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 p-4 rounded-2xl border border-border/40 bg-muted/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Your AI Credits</p>
            <p className="text-xs text-muted-foreground">
              {credits.remaining} remaining • Resets at midnight
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-primary">{credits.remaining}</div>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease }}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.isCurrentPlan
                ? 'border-green-500 bg-green-500/5 shadow-lg relative'
                : plan.highlight
                ? 'border-primary bg-primary/5 shadow-lg relative'
                : 'border-border bg-background/70 backdrop-blur-xl'
            }`}
          >
            {plan.isCurrentPlan && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-green-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Your Plan
              </span>
            )}
            {plan.highlight && !plan.isCurrentPlan && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.highlight ? 'bg-primary/10' : 'bg-muted'}`}>
                <plan.icon className={`w-5 h-5 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-[11px] text-muted-foreground">{plan.desc}</p>
              </div>
            </div>

            <div className="mb-2">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
            </div>

            {/* Credit allocation badge */}
            <div className="mb-4 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 w-fit">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">{plan.creditInfo}</span>
            </div>

            {subscription.subscribed && plan.isCurrentPlan && subscription.subscriptionEnd && (
              <p className="text-xs text-muted-foreground mb-3">
                Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
              </p>
            )}

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.isCurrentPlan ? 'text-green-600' : plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                plan.isCurrentPlan
                  ? 'bg-green-600/10 text-green-700 border border-green-500/30 cursor-default'
                  : plan.highlight
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-foreground/5 text-foreground border border-border hover:bg-foreground/10'
              }`}
              disabled={plan.isCurrentPlan || loadingTier === plan.tier}
              onClick={() => plan.tier && !plan.isCurrentPlan && handleSubscribe(plan.tier)}
            >
              {loadingTier === plan.tier ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                plan.cta
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      {subscription.subscribed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex justify-center mt-6">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleManageSubscription}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-background/80 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Settings className="w-4 h-4" />
            Manage Subscription
          </motion.button>
        </motion.div>
      )}

      {/* Referral section */}
      <div className="mt-8">
        <ReferralCard />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-xs text-muted-foreground mt-8"
      >
        All plans include a 7-day free trial. No credit card required to start.
      </motion.p>
    </div>
  );
};

export default Pricing;
