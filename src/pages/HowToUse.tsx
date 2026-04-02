import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Video } from 'lucide-react';
import VideoPlayerModal from '@/components/VideoPlayerModal';
import type { VideoItem } from '@/data/videoFeed';

interface TutorialSlot {
  id: string;
  title: string;
  description: string;
  category: string;
  youtubeId?: string;
  thumbnail?: string;
}

const TUTORIAL_SLOTS: TutorialSlot[] = [
  { id: 'tut-1', title: 'Navigating the Learning Oasis', description: 'Discover how to explore curated STEM content and launch quests.', category: 'Getting Started', youtubeId: '' },
  { id: 'tut-2', title: 'Building in The Forge', description: 'Learn to use AI-powered creation labs for scripts, games, and simulations.', category: 'Getting Started', youtubeId: '' },
  { id: 'tut-3', title: 'Understanding Your Cognitive DNA', description: 'How your learning profile personalizes every aspect of Q-Click.', category: 'Personalization', youtubeId: '' },
  { id: 'tut-4', title: 'Deloris: Your AI Wellness Coach', description: 'Mood tracking, journaling, focus tools, and adaptive mentorship.', category: 'Features', youtubeId: '' },
  { id: 'tut-5', title: 'The Achievement & Belt System', description: 'Earn wisdom points, advance belts, and track your growth.', category: 'Gamification', youtubeId: '' },
  { id: 'tut-6', title: 'Super Library & Research Tools', description: 'Access Wikipedia, arXiv, Gutenberg, YouTube, and government portals.', category: 'Features', youtubeId: '' },
];

const HowToUse = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const handlePlayTutorial = (slot: TutorialSlot) => {
    if (!slot.youtubeId) return;
    setActiveVideo({
      id: slot.id,
      title: slot.title,
      channel: 'Q-Click Tutorials',
      duration: '5:00',
      level: 'Beginner',
      youtubeId: slot.youtubeId,
      thumbnail: slot.thumbnail || '',
      domain: 'Tutorial',
      tags: ['tutorial'],
    });
  };

  const categories = [...new Set(TUTORIAL_SLOTS.map(t => t.category))];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">How to Use Q-Click</h1>
            <p className="text-sm text-muted-foreground">Visual manual, tutorials & documentation</p>
          </div>
        </div>

        {/* Feature overview images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl border border-border overflow-hidden">
            <img src="/images/how-to-platform.png" alt="Q-Click Platform Feature Matrix" className="w-full h-auto" />
          </div>
          <div className="rounded-2xl border border-border overflow-hidden">
            <img src="/images/how-to-homepage.png" alt="Q-Click Home Page Guide" className="w-full h-auto" />
          </div>
        </div>

        {/* Tutorial video grid */}
        {categories.map(cat => (
          <div key={cat} className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              {cat}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TUTORIAL_SLOTS.filter(t => t.category === cat).map((slot, i) => (
                <motion.button
                  key={slot.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handlePlayTutorial(slot)}
                  className="text-left p-4 rounded-2xl border border-border bg-background/70 backdrop-blur-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {slot.youtubeId ? (
                        <Play className="w-5 h-5 text-primary" />
                      ) : (
                        <Video className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{slot.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{slot.description}</p>
                      {!slot.youtubeId && (
                        <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border-t border-border pt-6 mt-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            This is the central hub for tutorials and documentation. Video instructions added to the 
            Super Library will automatically populate here using the standard media player. 
            More explainers coming soon.
          </p>
        </div>
      </motion.div>

      <VideoPlayerModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
};

export default HowToUse;
