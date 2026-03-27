import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AtomicRevealPlayer from '@/components/video/AtomicRevealPlayer';
import VideoPlayer from '@/components/video/VideoPlayer';
import { sampleVideos } from '@/data/sampleVideos';
import { Upload, Sparkles, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Video Engine</h1>
            <p className="text-sm text-muted-foreground">Learn through immersive visual stories</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="atomic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-2xl p-1 h-auto">
          <TabsTrigger value="atomic" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Atomic Reveal</TabsTrigger>
          <TabsTrigger value="player" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Full Player</TabsTrigger>
          <TabsTrigger value="upload" className="rounded-xl py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Upload</TabsTrigger>
        </TabsList>

        <div className="rounded-2xl bg-background/70 backdrop-blur-xl border border-border p-5 shadow-sm">
          <TabsContent value="atomic" className="mt-0">
            <div className="flex justify-center">
              <AtomicRevealPlayer />
            </div>
          </TabsContent>

          <TabsContent value="player" className="mt-0">
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sampleVideos.map(v => (
                  <button key={v.id} onClick={() => setSelectedVideo(v)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs border transition-all ${
                      selectedVideo.id === v.id
                        ? 'bg-primary/10 border-primary text-foreground'
                        : 'bg-muted border-border text-muted-foreground hover:border-primary/50'
                    }`}>
                    {v.title}
                  </button>
                ))}
              </div>
              <VideoPlayer video={selectedVideo} />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="text-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Upload Educational Video</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  Upload your own educational videos. Q-Click will automatically transcribe, annotate with Glossa, and make it interactive.
                </p>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 rounded-xl">
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
        </div>
      </Tabs>
    </div>
  );
};

export default VideoPage;
