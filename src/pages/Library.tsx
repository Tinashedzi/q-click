import { motion } from 'framer-motion';
import { Library as LibraryIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import WikipediaSearch from '@/components/library/WikipediaSearch';
import GutenbergSearch from '@/components/library/GutenbergSearch';
import ArxivSearch from '@/components/library/ArxivSearch';
import YouTubeSearch from '@/components/library/YouTubeSearch';
import GovernmentPortal from '@/components/library/GovernmentPortal';
import PersonalLibrary from '@/components/library/PersonalLibrary';

const Library = () => {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <LibraryIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground tracking-tight">Library</h2>
            <p className="text-sm text-muted-foreground">Infinite knowledge, one search away</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="wikipedia" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-1">
          <TabsTrigger value="wikipedia" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Wikipedia</TabsTrigger>
          <TabsTrigger value="gutenberg" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Books</TabsTrigger>
          <TabsTrigger value="arxiv" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Papers</TabsTrigger>
          <TabsTrigger value="youtube" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Videos</TabsTrigger>
          <TabsTrigger value="government" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Professional</TabsTrigger>
          <TabsTrigger value="personal" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">My Library</TabsTrigger>
        </TabsList>
        <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
          <TabsContent value="wikipedia" className="mt-0"><WikipediaSearch /></TabsContent>
          <TabsContent value="gutenberg" className="mt-0"><GutenbergSearch /></TabsContent>
          <TabsContent value="arxiv" className="mt-0"><ArxivSearch /></TabsContent>
          <TabsContent value="youtube" className="mt-0"><YouTubeSearch /></TabsContent>
          <TabsContent value="government" className="mt-0"><GovernmentPortal /></TabsContent>
          <TabsContent value="personal" className="mt-0"><PersonalLibrary /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Library;
