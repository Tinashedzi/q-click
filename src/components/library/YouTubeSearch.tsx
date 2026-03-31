import { motion } from 'framer-motion';
import { Play, BookPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { curatedPlaylists } from '@/data/libraryData';

const YouTubeSearch = () => {
  const saveToLibrary = (playlist: typeof curatedPlaylists[0]) => {
    const saved = JSON.parse(localStorage.getItem('qclick-library-items') || '[]');
    saved.push({ id: `yt-${playlist.id}`, title: playlist.title, source: 'youtube', description: `${playlist.channel} · ${playlist.videoCount} videos`, savedAt: new Date().toISOString() });
    localStorage.setItem('qclick-library-items', JSON.stringify(saved));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Curated educational playlists for deep learning.</p>

      {curatedPlaylists.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card>
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">{p.thumbnail}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">{p.title}</h4>
                <p className="text-xs text-muted-foreground">{p.channel} · {p.videoCount} videos</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm"><Play className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" onClick={() => saveToLibrary(p)}><BookPlus className="w-3 h-3" /></Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default YouTubeSearch;
