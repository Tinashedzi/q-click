import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ForgeToQuestProps {
  topic?: string;
}

const ForgeToQuest = ({ topic }: ForgeToQuestProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-secondary/20 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5 p-5"
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
          <Compass className="w-5 h-5 text-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-grotesk font-medium text-foreground mb-1">Turn this into a Quest</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Take your forged {topic ? `"${topic}" ` : ''}concept to Oasis and generate a full project-based quest with stages, tasks, and reflection prompts.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-secondary/30 text-secondary hover:bg-secondary/10"
            onClick={() => navigate('/oasis', { state: { prefillTopic: topic } })}
          >
            Open Quest Architect <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgeToQuest;
