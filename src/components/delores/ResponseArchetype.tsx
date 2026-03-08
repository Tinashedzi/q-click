import { motion } from 'framer-motion';

/**
 * Three response archetypes with distinct visual treatments:
 * - Supportive (mood 1-2): soft lavender/cool tones, gentle pulse
 * - Reflective (mood 3): neutral jade/sage tones, steady rhythm
 * - Action-Oriented (mood 4-5): warm petal/gold tones, energetic
 */

export type ArchetypeType = 'supportive' | 'reflective' | 'action';

interface ResponseArchetypeProps {
  type: ArchetypeType;
  message: string;
  wisdom?: { culture: string; proverb: string; translation?: string };
  children?: React.ReactNode;
}

const archetypeStyles: Record<ArchetypeType, {
  bg: string;
  border: string;
  icon: string;
  label: string;
  accentText: string;
  pulseColor: string;
}> = {
  supportive: {
    bg: 'bg-[hsl(260_30%_85%/0.15)]',
    border: 'border-[hsl(260_30%_78%/0.25)]',
    icon: '🤗',
    label: 'Supportive',
    accentText: 'text-[hsl(260_30%_55%)]',
    pulseColor: 'hsl(260 30% 78% / 0.2)',
  },
  reflective: {
    bg: 'bg-[hsl(108_18%_69%/0.1)]',
    border: 'border-[hsl(108_18%_69%/0.2)]',
    icon: '🪞',
    label: 'Reflective',
    accentText: 'text-[hsl(108_18%_50%)]',
    pulseColor: 'hsl(108 18% 69% / 0.15)',
  },
  action: {
    bg: 'bg-[hsl(43_47%_54%/0.1)]',
    border: 'border-[hsl(43_47%_54%/0.2)]',
    icon: '⚡',
    label: 'Action-Oriented',
    accentText: 'text-[hsl(43_47%_42%)]',
    pulseColor: 'hsl(43 47% 54% / 0.15)',
  },
};

export function getArchetype(mood: number): ArchetypeType {
  if (mood <= 2) return 'supportive';
  if (mood <= 3) return 'reflective';
  return 'action';
}

const ResponseArchetype = ({ type, message, wisdom, children }: ResponseArchetypeProps) => {
  const style = archetypeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border ${style.bg} ${style.border} p-5 space-y-3`}
    >
      {/* Subtle animated accent bar */}
      <motion.div
        className="absolute top-0 left-0 h-1 rounded-b-full"
        style={{ background: style.pulseColor }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Archetype label */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{style.icon}</span>
        <span className={`text-xs font-grotesk font-medium ${style.accentText} uppercase tracking-wider`}>
          {style.label}
        </span>
      </div>

      {/* Main message */}
      <p className="text-foreground font-serif text-lg italic leading-relaxed">
        "{message}"
      </p>

      {/* Cultural wisdom */}
      {wisdom && (
        <div className="pt-3 border-t border-border/30">
          <p className="text-sm text-muted-foreground italic">"{wisdom.proverb}"</p>
          {wisdom.translation && (
            <p className="text-xs text-muted-foreground mt-1">
              — {wisdom.culture}: {wisdom.translation}
            </p>
          )}
        </div>
      )}

      {children}
    </motion.div>
  );
};

export default ResponseArchetype;
