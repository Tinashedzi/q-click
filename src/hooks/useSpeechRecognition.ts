// src/hooks/useSpeechRecognition.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  pauseThreshold?: number;  // milliseconds of silence before finalizing (default 1500)
  interimResults?: boolean;
  lang?: string;
}

export const useSpeechRecognition = ({
  pauseThreshold = 1500,
  interimResults = true,
  lang = 'en-US',
}: UseSpeechRecognitionOptions = {}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const pauseTimeoutRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;          // keep listening for pauses
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => {
      setIsListening(true);
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscriptRef.current.trim()) {
        setTranscript(finalTranscriptRef.current);
      }
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + final;
        setTranscript(finalTranscriptRef.current);
      }
      setInterimTranscript(interim);

      // Reset pause timer every time the user speaks
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      
      if (final || interim) {
        pauseTimeoutRef.current = setTimeout(() => {
          if (finalTranscriptRef.current.trim()) {
            recognition.stop();   // user has paused – finalize and send
          }
        }, pauseThreshold);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [pauseThreshold, interimResults, lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      finalTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      recognitionRef.current.start();
    } catch (err) {
      console.warn('Could not start recognition:', err);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {}
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  }, []);

  const resetTranscript = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};