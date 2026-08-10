import { useCallback, useEffect, useRef, useState } from 'react';

interface Options {
  /** ms of silence before the transcript is committed */
  pauseThreshold?: number;
  onCommit?: (text: string) => void;
  onSpeechStart?: () => void;
}

/**
 * Cross-platform speech recognition (Chrome/Edge desktop, Android, iOS Safari).
 * Android forcibly ends recognition after each utterance, so we auto-restart
 * until the user stops or a silence pause commits the transcript.
 */
export const useSpeechRecognition = (options?: Options) => {
  const { pauseThreshold, onCommit, onSpeechStart } = options ?? {};

  const supported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);
  const isMobile =
    typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const threshold = pauseThreshold ?? (isMobile ? 3500 : 2500);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');

  const recRef = useRef<any>(null);
  const finalRef = useRef('');
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wantListening = useRef(false);
  const spokeRef = useRef(false);
  const commitRef = useRef(onCommit);
  const startRef = useRef(onSpeechStart);

  useEffect(() => {
    commitRef.current = onCommit;
    startRef.current = onSpeechStart;
  }, [onCommit, onSpeechStart]);

  const clearSilence = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = null;
  };

  const commit = useCallback(() => {
    clearSilence();
    const text = finalRef.current.trim();
    finalRef.current = '';
    setInterim('');
    if (text) {
      setTranscript(text);
      commitRef.current?.(text);
    }
  }, []);

  const stopListening = useCallback(() => {
    wantListening.current = false;
    clearSilence();
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setIsListening(false);
    commit();
  }, [commit]);

  const startListening = useCallback(() => {
    if (!supported || wantListening.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = navigator.language || 'en-US';
    rec.interimResults = true;
    // Android ignores/mishandles continuous mode — we restart manually instead.
    rec.continuous = !isAndroid;
    rec.maxAlternatives = 1;

    rec.onresult = (event: any) => {
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalRef.current += res[0].transcript + ' ';
        else interimText += res[0].transcript;
      }
      if (!spokeRef.current) {
        spokeRef.current = true;
        startRef.current?.();
      }
      setInterim(interimText);
      clearSilence();
      silenceTimer.current = setTimeout(() => {
        if (finalRef.current.trim()) {
          commit();
          stopListening();
        }
      }, threshold);
    };

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        wantListening.current = false;
        setIsListening(false);
      }
    };

    rec.onend = () => {
      if (wantListening.current) {
        // Android / mobile cut us off mid-session: restart quietly.
        try {
          rec.start();
          return;
        } catch {
          /* fall through */
        }
      }
      setIsListening(false);
      commit();
    };

    recRef.current = rec;
    wantListening.current = true;
    spokeRef.current = false;
    finalRef.current = '';
    setTranscript('');
    setInterim('');
    try {
      rec.start();
      setIsListening(true);
    } catch {
      wantListening.current = false;
    }
  }, [supported, isAndroid, threshold, commit, stopListening]);

  useEffect(() => () => {
    wantListening.current = false;
    clearSilence();
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  return { supported, isListening, transcript, interim, startListening, stopListening, resetTranscript };
};

export default useSpeechRecognition;
