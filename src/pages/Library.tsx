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
          <div className="w-10 h-10 rounded-lg bg-jade/15 flex items-center justify-center">
            <LibraryIcon className="w-5 h-5 text-jade" />
          </div>
          <div>
            <h2 className="text-2xl font-serif text-foreground">Library</h2>
            <p className="text-sm text-muted-foreground">Infinite knowledge, one search away</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="wikipedia" className="space-y-4">
        <TabsList className="w-full flex-wrap h-auto gap-1">
          <TabsTrigger value="wikipedia">Wikipedia</TabsTrigger>
          <TabsTrigger value="gutenberg">Books</TabsTrigger>
          <TabsTrigger value="arxiv">Papers</TabsTrigger>
          <TabsTrigger value="youtube">Videos</TabsTrigger>
          <TabsTrigger value="government">Professional</TabsTrigger>
          <TabsTrigger value="personal">My Library</TabsTrigger>
        </TabsList>
        <TabsContent value="wikipedia"><WikipediaSearch /></TabsContent>
        <TabsContent value="gutenberg"><GutenbergSearch /></TabsContent>
        <TabsContent value="arxiv"><ArxivSearch /></TabsContent>
        <TabsContent value="youtube"><YouTubeSearch /></TabsContent>
        <TabsContent value="government"><GovernmentPortal /></TabsContent>
        <TabsContent value="personal"><PersonalLibrary /></TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
