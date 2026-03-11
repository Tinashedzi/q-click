import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AtomicRevealPlayer from '@/components/video/AtomicRevealPlayer';
import VideoPlayer from '@/components/video/VideoPlayer';
import { sampleVideos } from '@/data/sampleVideos';
import { Upload, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">Video Engine</h1>
          <p className="text-muted-foreground">Learn through immersive visual stories</p>
        </div>

        <Tabs defaultValue="atomic">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="atomic">Atomic Reveal</TabsTrigger>
            <TabsTrigger value="player">Full Player</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="atomic">
            <div className="flex justify-center">
              <AtomicRevealPlayer />
            </div>
          </TabsContent>

          <TabsContent value="player">
            <div className="space-y-6">
              {/* Video selector */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sampleVideos.map(v => (
                  <button key={v.id} onClick={() => setSelectedVideo(v)}
                    className={`shrink-0 px-3 py-2 rounded-lg text-xs border transition-all ${
                      selectedVideo.id === v.id
                        ? 'bg-secondary/20 border-secondary text-foreground'
                        : 'bg-card border-border/50 text-muted-foreground hover:border-secondary/50'
                    }`}>
                    {v.title}
                  </button>
                ))}
              </div>
              <VideoPlayer video={selectedVideo} />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-secondary/10 border-2 border-dashed border-secondary/30 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-foreground">Upload Educational Video</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Upload your own educational videos. Q-Click will automatically transcribe, annotate with Glossa, and make it interactive.
                </p>
              </div>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                <Upload className="w-4 h-4" /> Choose Video
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
                <span>MP4, WebM, MOV</span>
                <span>•</span>
                <span>Max 500MB</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Auto-transcription</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default VideoPage;
