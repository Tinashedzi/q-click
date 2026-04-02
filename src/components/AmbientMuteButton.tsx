import { Volume2, VolumeX, PauseCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAmbientSound } from '@/contexts/AmbientSoundContext';

const AmbientMuteButton = () => {
  const { isMuted, toggleMute, togglePagePause, pausedOnPage } = useAmbientSound();

  return (
    <div className="fixed bottom-24 left-4 z-50 flex flex-col gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleMute}
        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-lg flex items-center justify-center"
        title={isMuted ? 'Unmute ambient' : 'Mute ambient'}
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-foreground" />}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePagePause}
        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl border border-border shadow-lg flex items-center justify-center"
        title={pausedOnPage ? 'Resume on this page' : 'Pause on this page'}
      >
        {pausedOnPage ? <PlayCircle className="w-4 h-4 text-primary" /> : <PauseCircle className="w-4 h-4 text-muted-foreground" />}
      </motion.button>
    </div>
  );
};

export default AmbientMuteButton;
