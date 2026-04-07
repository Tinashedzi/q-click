import { useCallback, useRef, useState } from 'react';

interface UseSpeechOptions {
  onEnd?: () => void;
  voiceURI?: string;
}

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
};

export const useSpeech = (options?: UseSpeechOptions) => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    let selectedVoice: SpeechSynthesisVoice | undefined;

    if (options?.voiceURI) {
      selectedVoice = voices.find(v => v.voiceURI === options.voiceURI);
    }

    if (!selectedVoice) {
      selectedVoice =
        voices.find(v => v.lang.includes('en') && v.name.includes('Google UK English Female')) ||
        voices.find(v => v.lang.includes('en') && /female/i.test(v.name)) ||
        voices.find(v => v.lang.includes('en') && v.name.includes('Samantha')) ||
        voices.find(v => v.lang.includes('en') && v.name.includes('Google UK')) ||
        voices.find(v => v.lang.includes('en'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.pitch = 1.1;
    utterance.rate = 0.9;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      options?.onEnd?.();
    };
    utterance.onerror = () => {
      setSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [options?.onEnd, options?.voiceURI]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking };
};
