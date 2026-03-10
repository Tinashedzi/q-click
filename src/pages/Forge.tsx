import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hammer, Zap, FlaskConical, Gamepad2, Route, FileText, BarChart3, Sparkles, LayoutGrid, Brain, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import ConceptCollision from '@/components/forge/ConceptCollision';
import ConceptCanvas, { type CanvasNode, type CanvasEdge } from '@/components/forge/ConceptCanvas';
import ConceptForge from '@/components/forge/ConceptForge';
import ScriptForge from '@/components/forge/ScriptForge';
import VideoForge from '@/components/forge/VideoForge';
import GameForge from '@/components/forge/GameForge';
import PathForge from '@/components/forge/PathForge';
import ExperimentLab from '@/components/forge/ExperimentLab';
import ForgeDashboard from '@/components/forge/ForgeDashboard';
import ForgeToQuest from '@/components/forge/ForgeToQuest';
import BioDigitalForge from '@/components/forge/BioDigitalForge';
import SpatialForge from '@/components/forge/SpatialForge';
import ForgeInstructions from '@/components/forge/ForgeInstructions';

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(142 40% 50%)',
  'hsl(280 60% 55%)',
  'hsl(30 80% 55%)',
  'hsl(200 70% 50%)',
];

const tabs = [
  { id: 'collision', label: 'Collide', icon: Zap },
  { id: 'canvas', label: 'Canvas', icon: LayoutGrid },
  { id: 'experiment', label: 'Lab', icon: FlaskConical },
  { id: 'concept', label: 'Concept', icon: Sparkles },
  { id: 'bio', label: 'Bio', icon: Brain },
  { id: 'spatial', label: 'Spatial', icon: Box },
  { id: 'script', label: 'Script', icon: FileText },
  { id: 'game', label: 'Game', icon: Gamepad2 },
  { id: 'path', label: 'Path', icon: Route },
  { id: 'dashboard', label: 'Stats', icon: BarChart3 },
];

const Forge = () => {
  const [activeTab, setActiveTab] = useState('collision');
  const [currentTopic, setCurrentTopic] = useState('');
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([]);
  const [canvasEdges, setCanvasEdges] = useState<CanvasEdge[]>([]);

  const handleExperimentSelect = (topic: string) => {
    setCurrentTopic(topic);
    setActiveTab('experiment');
  };

  const handleAddToCanvas = (result: { theme: string; description: string }) => {
    const id = `node-${Date.now()}`;
    const color = COLORS[canvasNodes.length % COLORS.length];
    setCanvasNodes(prev => [...prev, {
      id,
      x: 80 + Math.random() * 200,
      y: 60 + Math.random() * 150,
      theme: result.theme,
      description: result.description,
      color,
    }]);
    setActiveTab('canvas');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-28">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-serif text-foreground">The Forge</h1>
            <p className="text-xs text-muted-foreground font-grotesk tracking-wide">Infinite Sandbox — build, collide, experiment</p>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                )}
              >
                {isActive && (
                  <motion.div layoutId="forge-tab-bg" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'canvas' && canvasNodes.length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent/20 text-accent text-[10px] flex items-center justify-center">{canvasNodes.length}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {activeTab === 'collision' && (
            <>
              <ConceptCollision onExperimentSelect={handleExperimentSelect} onAddToCanvas={handleAddToCanvas} />
              {currentTopic && <ForgeToQuest topic={currentTopic} />}
            </>
          )}
          {activeTab === 'canvas' && <ConceptCanvas nodes={canvasNodes} onNodesChange={setCanvasNodes} edges={canvasEdges} onEdgesChange={setCanvasEdges} />}
          {activeTab === 'experiment' && <ExperimentLab prefilledTopic={currentTopic} />}
          {activeTab === 'concept' && (
            <>
              <ConceptForge />
              <ForgeToQuest topic={currentTopic || undefined} />
            </>
          )}
          {activeTab === 'bio' && <BioDigitalForge />}
          {activeTab === 'spatial' && <SpatialForge />}
          {activeTab === 'script' && <ScriptForge />}
          {activeTab === 'game' && <GameForge />}
          {activeTab === 'path' && <PathForge />}
          {activeTab === 'dashboard' && <ForgeDashboard />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Forge;
