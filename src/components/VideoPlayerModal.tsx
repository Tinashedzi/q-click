import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, MessageCircle } from 'lucide-react';
import type { VideoItem } from '@/data/videoFeed';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

const DELORES_COMMENTS = [
  "This is a beautiful concept. Notice how it connects to systems thinking...",
  "Take a breath here. Let this idea settle before moving on.",
  "This reminds me of something you explored last week. See the pattern?",
  "A powerful insight. How might you apply this in your own life?",
  "Notice the structure here — hook, tension, resolution. Classic storytelling.",
];

const VideoPlayerModal = ({ video, onClose }: VideoPlayerModalProps) => {
  const [wisdomEarned, setWisdomEarned] = useState(0);
  const [deloresComment, setDeloresComment] = useState('');
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    if (!video) return;
    setWisdomEarned(0);
    setShowComment(false);

    const commentTimer = setTimeout(() => {
      setDeloresComment(DELORES_COMMENTS[Math.floor(Math.random() * DELORES_COMMENTS.length)]);
      setShowComment(true);
    }, 8000);

    const pointsTimer = setTimeout(() => {
      setWisdomEarned(15);
    }, 15000);

    return () => {
      clearTimeout(commentTimer);
      clearTimeout(pointsTimer);
    };
  }, [video]);

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-foreground/40 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl rounded-2xl border border-border bg-background overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video embed */}
          <div className="relative aspect-video bg-foreground/5">
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Video unavailable
              </div>
            )}

            {/* Close button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-xl flex items-center justify-center shadow-md"
            >
              <X className="w-4 h-4 text-foreground" />
            </motion.button>

            {/* Wisdom points earned */}
            <AnimatePresence>
              {wisdomEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold shadow-lg"
                >
                  <Sparkles className="w-3 h-3" />
                  +{wisdomEarned} WP earned
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info bar */}
          <div className="p-4 border-t border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground line-clamp-1">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{video.channel} · {video.duration} · {video.level}</p>
              </div>
              <button className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Delores AI commentary */}
            <AnimatePresence>
              {showComment && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <MessageCircle className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Delris · AI Coach</p>
                      <p className="text-xs text-foreground mt-1 leading-relaxed">{deloresComment}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VideoPlayerModal;
