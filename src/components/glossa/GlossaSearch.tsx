import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { concepts, Concept } from '@/data/concepts';
import ConceptCard from './ConceptCard';
import MeaningWeb from './MeaningWeb';
import { AnimatePresence, motion } from 'framer-motion';

const GlossaSearch = () => {
  const [query, setQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<string | undefined>();

  const results = useMemo(() => {
    if (!query.trim()) return concepts.slice(0, 8);
    const q = query.toLowerCase();
    return concepts.filter((c) => {
      if (c.id.includes(q)) return true;
      if (c.universalMeaning.toLowerCase().includes(q)) return true;
      return Object.values(c.translations).some((t) => t.word.toLowerCase().includes(q));
    });
  }, [query]);

  const handleSelectFromWeb = (id: string) => {
    setSelectedConcept(id);
    const concept = concepts.find(c => c.id === id);
    if (concept) {
      setQuery(concept.translations.en?.word || concept.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a word or concept across languages…"
          className="pl-10 h-12 rounded-xl bg-card border-border/60 text-base shadow-soft focus-visible:ring-primary/30"
        />
      </div>

      {/* Meaning Web */}
      <MeaningWeb focusConcept={selectedConcept} onSelectConcept={handleSelectFromWeb} />

      {/* Results */}
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {query.trim() ? `${results.length} concept${results.length !== 1 ? 's' : ''} found` : 'Explore concepts'}
        </p>
        <AnimatePresence mode="popLayout">
          {results.map((concept) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              onSelect={(c) => setSelectedConcept(c.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GlossaSearch;
