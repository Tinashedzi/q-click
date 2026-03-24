import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import OasisChat from '@/components/oasis/OasisChat';
import QuestGenerator from '@/components/oasis/QuestGenerator';
import QuestLibrary from '@/components/oasis/QuestLibrary';
import FocusMode from '@/components/oasis/FocusMode';
import oasisBg from '@/assets/oasis-bg.png';

const ease = [0.22, 1, 0.36, 1] as const;

const Oasis = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* BG Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={oasisBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 container mx-auto px-4 py-8 max-w-2xl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-1">
            Oasis
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Learn and Grow with Delris, your AI learning coach
          </p>
        </motion.div>

        {/* Tabs — frosted glass */}
        <Tabs defaultValue="quests">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease }}
          >
            <TabsList className="grid w-full grid-cols-4 mb-5 bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-1 h-auto">
              {['quests', 'library', 'chat', 'focus'].map((val, i) => (
                <TabsTrigger
                  key={val}
                  value={val}
                  className="rounded-xl py-2.5 text-xs font-medium text-gray-500 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm transition-all"
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Enter what you'd like to explore..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
            </div>
          </motion.div>

          {/* Tab content in glass cards */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}
          >
            <TabsContent value="quests">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 p-5 shadow-sm">
                <QuestGenerator />
              </div>
            </TabsContent>
            <TabsContent value="library">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 p-5 shadow-sm">
                <QuestLibrary />
              </div>
            </TabsContent>
            <TabsContent value="chat">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 overflow-hidden shadow-sm">
                <OasisChat />
              </div>
            </TabsContent>
            <TabsContent value="focus">
              <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-200 p-5 shadow-sm">
                <FocusMode />
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Oasis;
