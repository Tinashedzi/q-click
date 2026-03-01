import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Bookmark, Maximize, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { SensageVideo } from '@/data/sampleVideos';

interface VideoPlayerProps {
  video: SensageVideo;
}

const VideoPlayer = ({ video }: VideoPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [speed, setSpeed] = useState(1);
  const [showTranscript, setShowTranscript] = useState(true);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const cycleSpeed = () => {
    const idx = speeds.indexOf(speed);
    setSpeed(speeds[(idx + 1) % speeds.length]);
  };

  // Mock transcript from video phases
  const transcript = [
    { time: '0:00', text: video.hook, phase: 'Hook' },
    { time: '0:30', text: video.split, phase: 'Split' },
    { time: '1:15', text: video.radiation, phase: 'Radiation' },
    { time: '2:00', text: video.fallout, phase: 'Fallout' },
  ];

  return (
    <div className="space-y-4">
      {/* Player area */}
      <div className="relative aspect-video bg-foreground/5 rounded-xl overflow-hidden border border-border/50 flex items-center justify-center">
        <div className="text-center space-y-2 p-6">
          <p className="text-3xl font-serif text-foreground">{video.title}</p>
          <p className="text-sm text-muted-foreground">{video.description}</p>
          <p className="text-xs text-muted-foreground mt-4">Video placeholder — {video.duration}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="w-full" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><SkipBack className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setPlaying(!playing)}>
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><SkipForward className="w-4 h-4" /></Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={cycleSpeed} className="text-xs gap-1 h-7">
              <Gauge className="w-3.5 h-3.5" /> {speed}x
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Bookmark className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Maximize className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Interactive transcript */}
      <div className="border-t border-border/50 pt-4">
        <button onClick={() => setShowTranscript(!showTranscript)} className="text-sm font-medium text-foreground mb-3 flex items-center gap-1">
          Interactive Transcript {showTranscript ? '▾' : '▸'}
        </button>
        {showTranscript && (
          <div className="space-y-3">
            {transcript.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
                <span className="text-xs text-muted-foreground w-10 shrink-0 pt-0.5">{t.time}</span>
                <div>
                  <span className="text-[10px] font-medium text-gold uppercase tracking-wider">{t.phase}</span>
                  <p className="text-sm text-foreground mt-0.5">{t.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
