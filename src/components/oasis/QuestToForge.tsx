import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hammer, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestToForgeProps {
  topic?: string;
}

const QuestToForge = ({ topic }: QuestToForgeProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
        <Hammer className="w-4 h-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium">Build in the Forge</p>
        <p className="text-xs text-muted-foreground">Create interactive experiments, games, or visualizations for this quest.</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="text-accent hover:text-accent hover:bg-accent/10 shrink-0"
        onClick={() => navigate('/forge', { state: { prefillTopic: topic } })}
      >
        Open <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </Button>
    </motion.div>
  );
};

export default QuestToForge;
