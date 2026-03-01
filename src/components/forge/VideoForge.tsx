import { useState } from 'react';
import { motion } from 'framer-motion';
import { Film, Zap, Play, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const phases = [
  { name: 'Hook', color: 'bg-gold/20 border-gold/30', duration: '0:00 – 0:05' },
  { name: 'Split', color: 'bg-clay/20 border-clay/30', duration: '0:05 – 0:15' },
  { name: 'Radiation', color: 'bg-jade/20 border-jade/30', duration: '0:15 – 0:40' },
  { name: 'Fallout', color: 'bg-petal/20 border-petal/30', duration: '0:40 – 0:50' },
];

const VideoForge = () => {
  const [batchMode, setBatchMode] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl border border-accent/30 bg-accent/5">
        <Film className="w-5 h-5 text-accent" />
        <p className="text-sm text-muted-foreground">
          Video generation requires <span className="text-foreground font-medium">Kling or Veo</span> connection. Preview mode active with placeholder animations.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-foreground">Video Preview</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Batch Mode</span>
          <Switch checked={batchMode} onCheckedChange={setBatchMode} />
          <Layers className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="aspect-[9/16] max-h-[400px] bg-foreground/5 relative flex items-center justify-center">
          {previewing ? (
            <motion.div className="text-center space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {phases.map((phase, i) => (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 1.2, duration: 0.5 }}
                  className={`px-4 py-2 rounded-lg border ${phase.color}`}
                >
                  <p className="text-sm font-medium text-foreground">{phase.name}</p>
                  <p className="text-xs text-muted-foreground">{phase.duration}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Click preview to see section timing</p>
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setPreviewing(!previewing)}>
              <Play className="w-4 h-4" /> {previewing ? 'Reset' : 'Preview'}
            </Button>
            <Button className="flex-1" disabled>
              <Zap className="w-4 h-4" /> Generate Video
            </Button>
          </div>
        </CardContent>
      </Card>

      {batchMode && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Add scripts to generate multiple videos at once. Connect a video AI service to enable.</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default VideoForge;
