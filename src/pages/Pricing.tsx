import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Crown, ChevronLeft } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

const plans = [
  {
    name: 'Explorer',
    price: 'Free',
    period: '',
    desc: 'Start your cognitive journey',
    features: [
      'Daily Insight Feed (3 videos/day)',
      'Basic Oasis quests',
      'Mood check-ins with Delris',
      'Community leaderboard',
      '1 Forge experiment/day',
    ],
    cta: 'Current Plan',
    active: true,
    icon: Zap,
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    desc: 'Unlock your full potential',
    features: [
      'Unlimited video feed & library',
      'Unlimited AI quests & concept maps',
      'Advanced Forge Labs (Bio, Spatial, Game)',
      'Personalised learning paths',
      'Emotional Intelligence dashboard',
      'Priority AI responses',
      'Export & share projects',
    ],
    cta: 'Start 7-Day Free Trial',
    active: false,
    highlight: true,
    icon: Sparkles,
  },
  {
    name: 'Institution',
    price: '$49.99',
    period: '/month',
    desc: 'For schools & learning groups',
    features: [
      'Everything in Pro',
      'Up to 50 learner seats',
      'Teacher dashboard & analytics',
      'Custom rubric & assessment tools',
      'Dedicated support',
      'White-label options',
    ],
    cta: 'Contact Us',
    active: false,
    icon: Crown,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-28">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease }} className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight text-center">Choose Your Path</h1>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-md mx-auto">
          Upgrade to unlock the full Q-Click experience. Cancel anytime.
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease }}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.highlight
                ? 'border-primary bg-primary/5 shadow-lg relative'
                : 'border-border bg-background/70 backdrop-blur-xl'
            }`}
          >
            {plan.highlight && (
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

            <div className="mb-4">
              <span className="text-3xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                  {f}
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                plan.highlight
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : plan.active
                  ? 'bg-muted text-muted-foreground cursor-default'
                  : 'bg-foreground/5 text-foreground border border-border hover:bg-foreground/10'
              }`}
              disabled={plan.active}
            >
              {plan.cta}
            </motion.button>
          </motion.div>
        ))}
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
