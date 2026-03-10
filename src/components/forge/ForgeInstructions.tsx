import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useState } from 'react';

interface ForgeInstructionsProps {
  tab: string;
}

const instructions: Record<string, { title: string; steps: string[] }> = {
  collision: {
    title: 'Concept Collider',
    steps: [
      'Enter two unrelated concepts (e.g., "Fractals" and "Jazz Music")',
      'Click "Collide" — AI will find unexpected connections between them',
      'Click any experiment to explore it in the Lab tab',
      'Click "Add to Canvas" to save the collision result to your visual canvas',
      'Essential questions help deepen your thinking about the intersection',
    ],
  },
  canvas: {
    title: 'Concept Canvas',
    steps: [
      'Collide concepts first, then click "Add to Canvas" to populate nodes',
      'Drag nodes to rearrange your concept map spatially',
      'Hover a node and click the link icon to connect two ideas',
      'Click "Save" to persist your canvas to the cloud between sessions',
      'Use zoom controls (+/−) to adjust your view',
      'Click "Clear" to start fresh',
    ],
  },
  spatial: {
    title: '3D Spatial Explorer',
    steps: [
      'Type any concept and click "Map" to generate a spatial visualization',
      'Click any 3D node to reveal its full description in a detail panel',
      'Click and drag to rotate the scene; scroll to zoom',
      'The central node is your concept; surrounding nodes are spatial dimensions',
      'Bezier curves show connections between your concept and its dimensions',
    ],
  },
};

const ForgeInstructions = ({ tab }: ForgeInstructionsProps) => {
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const info = instructions[tab];
  if (!info || dismissed[tab]) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 mb-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground mb-1.5">{info.title} — How it works</p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal pl-4">
                {info.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <button
            onClick={() => setDismissed(d => ({ ...d, [tab]: true }))}
            className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ForgeInstructions;
