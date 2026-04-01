import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, MessageCircle, Bookmark } from 'lucide-react';
import type { VideoItem } from '@/data/videoFeed';
import { useProgress } from '@/contexts/ProgressContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const [saved, setSaved] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const { user } = useAuth();

  let addPoints: ((p: number) => Promise<void>) | null = null;
  let updateStreak: (() => Promise<void>) | null = null;
  try {
    const progress = useProgress();
    addPoints = progress.addPoints;
    updateStreak = progress.updateStreak;
  } catch {
    // Not inside ProgressProvider
  }

  useEffect(() => {
    if (!video) return;
    setWisdomEarned(0);
    setShowComment(false);
    setPlayerReady(false);

    const commentTimer = setTimeout(() => {
      setDeloresComment(DELORES_COMMENTS[Math.floor(Math.random() * DELORES_COMMENTS.length)]);
      setShowComment(true);
    }, 8000);

    const pointsTimer = setTimeout(async () => {
      setWisdomEarned(15);
      if (addPoints) {
        try {
          await addPoints(15);
          if (updateStreak) await updateStreak();
        } catch (e) {
          console.error('Failed to persist WP:', e);
        }
      }
    }, 15000);

    return () => {
      clearTimeout(commentTimer);
      clearTimeout(pointsTimer);
    };
  }, [video]);

  useEffect(() => {
    if (!video) return;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  const handleSave = () => {
    if (!video) return;
    const savedVideos = JSON.parse(localStorage.getItem('qclick-saved-videos') || '[]');
    if (saved) {
      localStorage.setItem('qclick-saved-videos', JSON.stringify(savedVideos.filter((id: string) => id !== video.id)));
    } else {
      localStorage.setItem('qclick-saved-videos', JSON.stringify([...savedVideos, video.id]));
    }
    setSaved(!saved);
  };

  useEffect(() => {
    if (!video) return;
    const savedVideos = JSON.parse(localStorage.getItem('qclick-saved-videos') || '[]');
    setSaved(savedVideos.includes(video.id));
  }, [video]);

  if (!video) return null;

  const modal = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-md overscroll-none"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video bg-foreground/5">
            {video.youtubeId ? (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${playerReady ? 'opacity-100' : 'opacity-0'}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="eager"
                  onLoad={() => setPlayerReady(true)}
                  title={video.title}
                />
                {!playerReady && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-3 px-4 text-center">
                      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Preparing video</p>
                        <p className="mt-1 text-xs text-muted-foreground">Loading the player in the center so it is ready to watch.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Video unavailable
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-xl flex items-center justify-center shadow-md z-10"
            >
              <X className="w-4 h-4 text-foreground" />
            </motion.button>

            <AnimatePresence>
              {wisdomEarned > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold shadow-lg z-10"
                >
                  <Sparkles className="w-3 h-3" />
                  +{wisdomEarned} WP earned{user ? ' & saved' : ''}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-y-auto border-t border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground line-clamp-1">{video.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{video.channel} · {video.duration} · {video.level}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handleSave}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${saved ? 'bg-primary/20' : 'bg-primary/10'}`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'text-primary fill-primary' : 'text-primary'}`} />
                </button>
                <button className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

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

  return createPortal(modal, document.body);
};

export default VideoPlayerModal;
