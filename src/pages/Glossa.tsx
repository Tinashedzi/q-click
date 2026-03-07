import { useState } from 'react';
import GlossaSearch from '@/components/glossa/GlossaSearch';
import GlossaMind from '@/components/glossa/GlossaMind';
import { motion } from 'framer-motion';
import { Network, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const Glossa = () => {
  const [view, setView] = useState<'web' | 'search'>('web');

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-end justify-between"
      >
        <div>
          <h2 className="text-3xl font-serif text-foreground mb-1">Glossa</h2>
          <p className="text-muted-foreground">The Meaning Engine — explore universal concepts across languages</p>
        </div>
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1">
          <button
            onClick={() => setView('web')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all',
              view === 'web' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Network className="w-3.5 h-3.5" />
            Mind
          </button>
          <button
            onClick={() => setView('search')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all',
              view === 'search' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </div>
      </motion.div>

      {view === 'web' ? (
        <motion.div
          key="web"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <GlossaMind onSelectConcept={(id) => console.log('Selected:', id)} />
        </motion.div>
      ) : (
        <motion.div
          key="search"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlossaSearch />
        </motion.div>
      )}
    </div>
  );
};

export default Glossa;
