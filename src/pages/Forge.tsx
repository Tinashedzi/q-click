import { motion } from 'framer-motion';
import { Hammer } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ConceptForge from '@/components/forge/ConceptForge';
import ScriptForge from '@/components/forge/ScriptForge';
import VideoForge from '@/components/forge/VideoForge';
import GameForge from '@/components/forge/GameForge';
import PathForge from '@/components/forge/PathForge';
import ForgeDashboard from '@/components/forge/ForgeDashboard';

const Forge = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
            <Hammer className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-foreground">Creator's Forge</h2>
            <p className="text-sm text-muted-foreground">Power tools for 10x creators</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="concept" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="concept">Concept</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
          <TabsTrigger value="game">Game</TabsTrigger>
          <TabsTrigger value="path">Path</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="concept"><ConceptForge /></TabsContent>
        <TabsContent value="script"><ScriptForge /></TabsContent>
        <TabsContent value="video"><VideoForge /></TabsContent>
        <TabsContent value="game"><GameForge /></TabsContent>
        <TabsContent value="path"><PathForge /></TabsContent>
        <TabsContent value="dashboard"><ForgeDashboard /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Forge;
