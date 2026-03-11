import { useCallback, useRef } from 'react';

export const useSpeech = () => {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(v => v.lang.includes('en') && v.name.includes('Google UK')) ||
      voices.find(v => v.lang.includes('en'));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.1;   // slightly higher – friendly
    utterance.rate = 0.9;    // slower – calming
    utterance.volume = 1;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
  }, []);

  const isSpeaking = () => window.speechSynthesis?.speaking ?? false;

  return { speak, stop, isSpeaking };
};
