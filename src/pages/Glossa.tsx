import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, FileText, Sparkles, TrendingUp, Network, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import GoalSetting from '@/components/assessment/GoalSetting';
import EvidenceDashboard from '@/components/assessment/EvidenceDashboard';
import RubricGenerator from '@/components/assessment/RubricGenerator';
import TrajectoryChart from '@/components/assessment/TrajectoryChart';
import GlossaMind from '@/components/glossa/GlossaMind';
import GlossaSearch from '@/components/glossa/GlossaSearch';

type View = 'goals' | 'evidence' | 'rubrics' | 'trajectory' | 'web' | 'search';

const TABS: { id: View; label: string; icon: typeof Target }[] = [
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'evidence', label: 'Evidence', icon: FileText },
  { id: 'rubrics', label: 'Rubrics', icon: Sparkles },
  { id: 'trajectory', label: 'Trajectory', icon: TrendingUp },
  { id: 'web', label: 'Mind', icon: Network },
  { id: 'search', label: 'Search', icon: Search },
];

const Glossa = () => {
  const [view, setView] = useState<View>('goals');

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-serif text-foreground mb-1">Assignment Engine</h2>
        <p className="text-muted-foreground text-sm">Set goals, collect evidence, generate rubrics, track growth</p>
      </motion.div>

      {/* Tab Nav */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap',
              view === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {view === 'goals' && <GoalSetting />}
        {view === 'evidence' && <EvidenceDashboard />}
        {view === 'rubrics' && <RubricGenerator />}
        {view === 'trajectory' && <TrajectoryChart />}
        {view === 'web' && <GlossaMind onSelectConcept={(id) => console.log('Selected:', id)} />}
        {view === 'search' && <GlossaSearch />}
      </motion.div>
    </div>
  );
};

export default Glossa;
