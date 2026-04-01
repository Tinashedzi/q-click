import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AtomicRevealPlayer from '@/components/video/AtomicRevealPlayer';
import VideoPlayer from '@/components/video/VideoPlayer';
import { sampleVideos } from '@/data/sampleVideos';
import { Upload, Sparkles, Video, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreditGate } from '@/hooks/useCreditGate';
import CreditExhaustedModal from '@/components/credits/CreditExhaustedModal';
import { cn } from '@/lib/utils';

const bentoVideos = [
  { id: 1, title: 'Quantum Computers Explained', category: 'Tech', size: 'col-span-2 row-span-2', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb' },
  { id: 2, title: 'Gravitational Waves', category: 'Physics', size: 'col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564' },
  { id: 3, title: 'The Immune System', category: 'Biology', size: 'col-span-1 row-span-1', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8' },
  { id: 4, title: 'Essence of Calculus', category: 'Math', size: 'col-span-2 row-span-1', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904' },
];

const VideoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(sampleVideos[0]);
  const { useCredit, showExhausted, setShowExhausted } = useCreditGate();

  const handleAIRecommendation = async () => {
    const ok = await useCredit();
    if (!ok) return;
    // AI recommendation logic would go here
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Q-Click <span className="text-primary">Oasis</span></h1>
            <p className="text-sm text-muted-foreground">Learn through immersive visual stories</p>
          </div>
        </div>
      </motion.div>

      {/* Bento Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4 mb-8">
        {bentoVideos.map((vid, i) => (
          <motion.div
            key={vid.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className={cn(
              'group relative overflow-hidden rounded-2xl cursor-pointer bg-muted border border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
              vid.size
            )}
          >
            <img src={vid.image} alt={vid.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 bg-background/10 backdrop-blur-md border border-white/20 p-3 rounded-xl transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{vid.category}</span>
              <h3 className="text-white text-sm font-bold leading-tight mt-0.5">{vid.title}</h3>
              <div className="absolute right-3 bottom-3 h-8 w-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Play className="w-3 h-3 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Recommend Button */}
      <div className="flex justify-center mb-6">
        <Button variant="outline" onClick={handleAIRecommendation} className="rounded-xl gap-2">
          <Sparkles className="w-4 h-4" /> AI Recommend (1⚡)
        </Button>
      </div>

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

      <CreditExhaustedModal open={showExhausted} onClose={() => setShowExhausted(false)} />
    </div>
  );
};

export default VideoPage;
