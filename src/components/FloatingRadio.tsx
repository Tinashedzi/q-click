import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Radio, X, GripHorizontal } from 'lucide-react';
import DelorisRadio from '@/components/delores/DelorisRadio';

const FloatingRadio = () => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  if (!open) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-[88px] right-[calc(50%-108px)] z-[60] w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center"
        title="Open Deloris Radio"
      >
        <Radio className="w-4 h-4" />
      </motion.button>
    );
  }

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed z-[110] w-80 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-background/95 backdrop-blur-xl shadow-2xl"
      style={{ right: 16, bottom: 100 }}
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-1 cursor-grab active:cursor-grabbing">
        <GripHorizontal className="w-4 h-4 text-muted-foreground" />
        <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <X className="w-3 h-3 text-foreground" />
        </button>
      </div>
      <div className="px-4 pb-4">
        <DelorisRadio compact={false} />
      </div>
    </motion.div>
  );
};

export default FloatingRadio;
