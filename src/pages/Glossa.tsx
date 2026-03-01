import GlossaSearch from '@/components/glossa/GlossaSearch';
import { motion } from 'framer-motion';

const Glossa = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-serif text-foreground mb-1">Glossa</h2>
        <p className="text-muted-foreground">The Meaning Engine — explore universal concepts across languages</p>
      </motion.div>
      <GlossaSearch />
    </div>
  );
};

export default Glossa;
