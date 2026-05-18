import { useState, useEffect, useRef, useCallback } from 'react';

const LANG_FALLBACKS = ['hi-IN', 'en-IN', ''];

export function useSpeechRecognition({ onResult, onInterimResult } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const langIndexRef = useRef(0);
  const stoppedByUserRef = useRef(false);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SR);
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const startWithLang = useCallback(
    (langIndex) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        setError('Speech recognition not supported in this browser.');
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      stoppedByUserRef.current = false;
      const recognition = new SR();
      recognitionRef.current = recognition;

      const lang = LANG_FALLBACKS[langIndex] ?? '';
      recognition.lang = lang;
      recognition.continuous = true;    // keep recording until user clicks End
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        langIndexRef.current = langIndex;
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript && onInterimResult) onInterimResult(interimTranscript);
        if (finalTranscript && onResult) onResult(finalTranscript.trim());
      };

      recognition.onerror = (event) => {
        // aborted = we called stop/abort intentionally — not an error
        if (event.error === 'aborted') {
          setIsListening(false);
          return;
        }

        if (event.error === 'no-speech') {
          setIsListening(false);
          return;
        }

        if (event.error === 'not-allowed') {
          setError('Microphone access denied. Please allow mic access in your browser settings and try again.');
          setIsListening(false);
          return;
        }

        if (event.error === 'language-not-supported') {
          const nextIndex = langIndex + 1;
          if (nextIndex < LANG_FALLBACKS.length) {
            setTimeout(() => startWithLang(nextIndex), 50);
            return;
          }
        }

        if (event.error === 'network') {
          setError('Voice needs internet access to Google\'s servers. Check your connection or use text input.');
          setIsListening(false);
          return;
        }

        setError(`Speech error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      recognition.onend = () => {
        // With continuous=true, onend only fires when we call stop() or on error
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch {
        setError('Failed to start speech recognition. Please try again.');
        setIsListening(false);
      }
    },
    [onResult, onInterimResult]
  );

  const start = useCallback(() => startWithLang(0), [startWithLang]);

  const stop = useCallback(() => {
    stoppedByUserRef.current = true;
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  return { isListening, isSupported, error, start, stop, toggle };
}
