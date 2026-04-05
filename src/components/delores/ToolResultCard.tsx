import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { TOOL_DISPLAY, type ToolExecution } from '@/engine/delores-agent';
import { useNavigate } from 'react-router-dom';

interface ToolResultCardProps {
  execution: ToolExecution;
}

const ToolResultCard = ({ execution }: ToolResultCardProps) => {
  const navigate = useNavigate();
  const display = TOOL_DISPLAY[execution.tool];
  if (!display) return null;

  // Navigation targets for certain tools
  const navTarget: Record<string, { path: string; label: string }> = {
    trigger_mood_checkin: { path: '/delores', label: 'Open Check-in' },
    recommend_quest: { path: '/oasis', label: 'View Quests' },
    start_meditation: { path: '/delores', label: 'Start Session' },
  };

  const nav = navTarget[execution.tool];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/10 border border-accent/20 text-sm"
    >
      <span className="text-base">{display.emoji}</span>
      <span className="text-xs font-medium text-foreground flex-1">
        {display.actionVerb}
      </span>
      {execution.success ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <X className="w-3.5 h-3.5 text-destructive" />
      )}
      {nav && execution.success && (
        <button
          onClick={() => navigate(nav.path)}
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 font-medium"
        >
          {nav.label} <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
};

export default ToolResultCard;
