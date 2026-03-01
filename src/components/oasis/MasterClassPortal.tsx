import { motion } from 'framer-motion';
import { Play, HelpCircle, Lightbulb, Wrench } from 'lucide-react';
import { masterClasses } from '@/data/wisdomDatabase';
import { cn } from '@/lib/utils';

const typeIcons = { video: Play, quiz: HelpCircle, reflection: Lightbulb, application: Wrench };
const colorMap: Record<string, string> = {
  jade: 'bg-jade/10 border-jade/20',
  clay: 'bg-clay/10 border-clay/20',
  petal: 'bg-petal/10 border-petal/20',
  gold: 'bg-gold/10 border-gold/20',
};
const iconColorMap: Record<string, string> = {
  jade: 'text-jade', clay: 'text-clay', petal: 'text-petal', gold: 'text-gold',
};

const MasterClassPortal = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-foreground">Master Classes</h3>
      <p className="text-sm text-muted-foreground">Curated learning paths designed for deep understanding.</p>

      <div className="grid gap-4">
        {masterClasses.map((mc, i) => {
          const Icon = typeIcons.video;
          return (
            <motion.div key={mc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={cn('p-5 rounded-xl border', colorMap[mc.color] || 'bg-card border-border/50')}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{mc.series}</p>
                  <h4 className="text-lg font-serif text-foreground">{mc.title}</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{mc.description}</p>
              <div className="space-y-2">
                {mc.lessons.map((lesson, li) => {
                  const LIcon = typeIcons[lesson.type];
                  return (
                    <div key={li} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                      <LIcon className={cn('w-4 h-4', iconColorMap[mc.color])} />
                      <span className="text-sm text-foreground flex-1">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MasterClassPortal;
