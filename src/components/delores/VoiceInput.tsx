import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import DeloresAvatar from './DeloresAvatar';

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
}

/**
 * Voice input button that toggles listening state.
 * For now uses Web Speech API (browser-native). 
 * Falls back gracefully if unavailable.
 */
const VoiceInput = ({ onTranscript }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const toggleListening = useCallback(() => {
    if (!supported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const result = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(result);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        onTranscript?.(transcript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    setIsListening(true);
    setTranscript('');
    recognition.start();
  }, [isListening, supported, transcript, onTranscript]);

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={toggleListening}
        className="relative p-2 rounded-full transition-colors"
        whileTap={{ scale: 0.95 }}
        title={supported ? (isListening ? 'Stop listening' : 'Speak to Delores') : 'Voice input not supported'}
      >
        <div className="relative">
          {isListening ? (
            <MicOff className="w-5 h-5 text-destructive relative z-10" />
          ) : (
            <Mic className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors relative z-10" />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground italic"
          >
            {transcript || 'Listening…'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInput;
