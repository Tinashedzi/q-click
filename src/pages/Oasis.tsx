import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OasisChat from '@/components/oasis/OasisChat';
import FocusMode from '@/components/oasis/FocusMode';
import MasterClassPortal from '@/components/oasis/MasterClassPortal';

const Oasis = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Oasis</h1>
          <p className="text-muted-foreground">Wisdom, focus, and guided learning</p>
        </div>

        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chat">Ask Oasis</TabsTrigger>
            <TabsTrigger value="focus">Focus Mode</TabsTrigger>
            <TabsTrigger value="classes">Master Classes</TabsTrigger>
          </TabsList>
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
          <TabsContent value="classes">
            <MasterClassPortal />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Oasis;
