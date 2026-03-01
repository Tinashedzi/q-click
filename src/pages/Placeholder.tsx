import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
}

const Placeholder = ({ title, description }: PlaceholderProps) => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <Construction className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-serif text-foreground mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    </div>
  );
};

export default Placeholder;
