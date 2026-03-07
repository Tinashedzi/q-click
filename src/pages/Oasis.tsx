import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OasisChat from '@/components/oasis/OasisChat';
import QuestGenerator from '@/components/oasis/QuestGenerator';
import QuestLibrary from '@/components/oasis/QuestLibrary';
import FocusMode from '@/components/oasis/FocusMode';

const Oasis = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Oasis</h1>
          <p className="text-muted-foreground">The Quest Architect — project-based learning, Socratic guidance</p>
        </div>

        <Tabs defaultValue="quests">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="quests">Quests</TabsTrigger>
            <TabsTrigger value="library">My Quests</TabsTrigger>
            <TabsTrigger value="chat">Ask Oasis</TabsTrigger>
            <TabsTrigger value="focus">Focus</TabsTrigger>
          </TabsList>
          <TabsContent value="quests">
            <QuestGenerator />
          </TabsContent>
          <TabsContent value="library">
            <QuestLibrary />
          </TabsContent>
          <TabsContent value="chat">
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <OasisChat />
            </div>
          </TabsContent>
          <TabsContent value="focus">
            <div className="py-4">
              <FocusMode />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Oasis;
