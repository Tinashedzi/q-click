import { motion } from 'framer-motion';
import { Concept, LANGUAGES } from '@/data/concepts';
import PosTag from './PosTag';

interface ConceptCardProps {
  concept: Concept;
  onSelect?: (concept: Concept) => void;
}

const ConceptCard = ({ concept, onSelect }: ConceptCardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onClick={() => onSelect?.(concept)}
      className="group cursor-pointer rounded-xl border border-border/60 bg-card p-5 shadow-soft hover:shadow-card transition-shadow"
    >
      {/* Universal meaning */}
      <div className="mb-4">
        <p className="universal-meaning text-lg text-muted-foreground">
          ⟦{concept.universalMeaning}⟧
        </p>
      </div>

      {/* Translations grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {LANGUAGES.map((lang) => {
          const t = concept.translations[lang.code];
          if (!t) return null;
          return (
            <div
              key={lang.code}
              className="flex flex-col gap-1 p-2.5 rounded-lg bg-background/60 border border-border/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{lang.flag} {lang.name}</span>
                <PosTag pos={t.partOfSpeech} />
              </div>
              <span className="text-base font-medium text-foreground">{t.word}</span>
            </div>
          );
        })}
      </div>

      {/* Example sentences */}
      {concept.examples.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Examples</p>
          <div className="space-y-1.5">
            {concept.examples.slice(0, 2).map((ex, i) => (
              <div key={i} className="text-sm">
                <span className="text-foreground">{ex.text}</span>
                <span className="text-muted-foreground ml-2">— {ex.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related concepts */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {concept.relatedConcepts.map((rc) => (
          <span key={rc} className="px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary-foreground font-medium">
            {rc}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ConceptCard;
