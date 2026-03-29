import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Compass } from 'lucide-react';
import OasisChat from '@/components/oasis/OasisChat';
import QuestGenerator from '@/components/oasis/QuestGenerator';
import QuestLibrary from '@/components/oasis/QuestLibrary';
import FocusMode from '@/components/oasis/FocusMode';

const ease = [0.22, 1, 0.36, 1] as const;

const Oasis = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease }}
        className="mb-5"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Oasis</h1>
            <p className="text-xs text-muted-foreground">Learn and Grow with Delris, your AI learning coach</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="quests">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
        >
          <TabsList className="grid w-full grid-cols-4 mb-5 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-1 h-auto">
            {['quests', 'library', 'chat', 'focus'].map((val, i) => (
              <TabsTrigger
                key={val}
                value={val}
                className="rounded-xl py-2.5 text-xs font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
              >
                {['Quests', 'My Quests', 'Ask Oasis', 'Focus'][i]}
              </TabsTrigger>
            ))}
          </TabsList>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease }}
          className="mb-5"
        >
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/70 backdrop-blur-xl border border-border">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <input
              type="text"
              placeholder="Enter what you'd like to explore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </motion.div>

        {/* Tab content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
        >
          <TabsContent value="quests">
            <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
              <QuestGenerator />
            </div>
          </TabsContent>
          <TabsContent value="library">
            <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
              <QuestLibrary />
            </div>
          </TabsContent>
          <TabsContent value="chat">
            <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border overflow-hidden shadow-sm">
              <OasisChat />
            </div>
          </TabsContent>
          <TabsContent value="focus">
            <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
              <FocusMode />
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};

export default Oasis;
