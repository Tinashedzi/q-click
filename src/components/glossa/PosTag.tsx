import { PartOfSpeech, POS_COLORS } from '@/data/concepts';
import { cn } from '@/lib/utils';

interface PosTagProps {
  pos: PartOfSpeech;
  className?: string;
}

const posLabels: Record<PartOfSpeech, string> = {
  noun: 'N',
  verb: 'V',
  determiner: 'D',
  adjective: 'Adj',
  preposition: 'Prep',
  adverb: 'Adv',
  conjunction: 'Conj',
};

const colorClasses: Record<string, string> = {
  jade: 'bg-jade/20 text-jade border-jade/30',
  clay: 'bg-clay/20 text-clay border-clay/30',
  gold: 'bg-gold/20 text-gold border-gold/30',
  petal: 'bg-petal/20 text-petal border-petal/30',
  dew: 'bg-dew/20 text-dew border-dew/30',
};

const PosTag = ({ pos, className }: PosTagProps) => {
  const color = POS_COLORS[pos];
  return (
    <span
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border',
        colorClasses[color],
        className
      )}
    >
      {posLabels[pos]}
    </span>
  );
};

export default PosTag;
