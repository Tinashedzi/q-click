// src/hooks/useSpeech.ts
import { useState, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, []);

  const speak = useCallback((text: string, rate = 0.9, pitch = 1.0, voiceURI?: string) => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    // Cancel any ongoing speech (barge‑in capability)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    if (voiceURI) {
      const voices = window.speechSynthesis.getVoices();
      const selected = voices.find(v => v.voiceURI === voiceURI);
      if (selected) utterance.voice = selected;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, stop, isSpeaking, isSupported };
};
