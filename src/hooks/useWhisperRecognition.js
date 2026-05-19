import { useState, useRef, useCallback, useEffect } from 'react';

// Pick a MIME type the browser actually supports
function getSupportedMimeType() {
  const types = ['audio/webm', 'audio/ogg', 'audio/mp4', ''];
  return types.find((t) => !t || MediaRecorder.isTypeSupported(t)) ?? '';
}

// Default prompt written in Hinglish (Roman script) so Whisper always
// transcribes in Roman script — even when the speaker uses Hindi words.
// This prevents Devanagari output regardless of the spoken language.
const DEFAULT_PROMPT = 'Teen saal ka experience chahiye. Salary pachas hajar per month. Delhi mein job. Java developer hire karna hai. Skills aur location batao.';

export function useWhisperRecognition({ onResult, getPrompt } = {}) {
  const [isListening, setIsListening]     = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSupported, setIsSupported]     = useState(false);
  const [error, setError]                 = useState(null);
  const recorderRef = useRef(null);
  const streamRef   = useRef(null);
  const chunksRef   = useRef([]);

  useEffect(() => {
    setIsSupported(!!(navigator.mediaDevices?.getUserMedia));
    return () => stopStream();
  }, []);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  const start = useCallback(async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY ||
        import.meta.env.VITE_OPENAI_API_KEY === 'your_openai_key_here') {
      setError('OpenAI API key not set. Add VITE_OPENAI_API_KEY to your .env file.');
      return;
    }

    setError(null);
    chunksRef.current = [];

    // Stop TTS so audio session is free
    window.speechSynthesis?.cancel();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      const recorderOptions = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, recorderOptions);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onerror = (e) => {
        console.error('[Whisper] recorder error:', e);
        setError(`Recording error: ${e.error?.message ?? 'unknown'}`);
        stopStream();
        setIsListening(false);
      };

      recorder.onstop = async () => {
        stopStream();
        setIsListening(false);

        if (chunksRef.current.length === 0) {
          setError('No audio was captured. Check your microphone is not muted.');
          return;
        }

        const effectiveMime = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: effectiveMime });
        chunksRef.current = [];

        // Strip codec info (e.g. "audio/webm;codecs=opus") for extension lookup
        const baseMime = effectiveMime.split(';')[0].trim();
        // iOS Safari records audio/mp4 — send as .m4a which Whisper handles reliably
        const ext = baseMime.includes('ogg') ? 'ogg'
          : baseMime.includes('mp4') || baseMime.includes('m4a') || baseMime.includes('aac') ? 'm4a'
          : 'webm';

        setIsTranscribing(true);
        try {
          const form = new FormData();
          form.append('file', blob, `audio.${ext}`);
          form.append('model', 'whisper-1');
          // Prompt helps Whisper stay in the correct language.
          // Use whatever the user has already typed; fall back to the English default.
          const userContext = getPrompt?.()?.trim();
          const prompt = `${DEFAULT_PROMPT}${userContext ? ' ' + userContext : ''}`;
          form.append('prompt', prompt);

          const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: { Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}` },
            body: form,
          });

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error?.message || `HTTP ${res.status}`);
          }

          const data = await res.json();
          if (data.text?.trim()) onResult?.(data.text.trim());
          else setError('No speech detected. Please try again.');
        } catch (err) {
          console.error('[Whisper] transcription error:', err);
          setError(`Transcription failed: ${err.message}`);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250);
      setIsListening(true);
    } catch (err) {
      console.error('[Whisper] getUserMedia error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone access denied. Allow mic access in browser settings and reload.');
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a mic and try again.');
      } else {
        setError(`Mic error: ${err.message}`);
      }
      setIsListening(false);
    }
  }, [onResult]);

  const stop = useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop(); // triggers onstop → stopStream
    } else {
      stopStream();
      setIsListening(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  return { isListening, isTranscribing, isSupported, error, start, stop, toggle };
}
