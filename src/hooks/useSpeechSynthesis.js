import { useState, useCallback, useRef } from 'react';
import { detectConversationLanguage } from '../utils/detectLanguage.js';

// ElevenLabs voice ID — override via VITE_ELEVENLABS_VOICE_ID in .env
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID || 'Ms9OTvWb99V6DwRHZn6q';

/**
 * Detect language of a single text string for TTS purposes.
 * Wraps detectConversationLanguage by treating the text as a single user message.
 */
function detectLanguage(text) {
  return detectConversationLanguage([{ role: 'user', content: text }]);
}

async function buildAudio(text) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey || apiKey === 'your_elevenlabs_key_here') {
    throw new Error('ElevenLabs API key not set. Add VITE_ELEVENLABS_API_KEY to your .env file.');
  }

  const lang = detectLanguage(text);

  // English → 'en' for clean native pronunciation.
  // Hinglish → omit language_code so ElevenLabs code-switches naturally
  // between Hindi and English within the same sentence.
  const languageCode = lang === 'english' ? 'en' : undefined;

  const body = {
    text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.45,
      similarity_boost: 0.80,
      style: 0.0,
      use_speaker_boost: true,
    },
    ...(languageCode && { language_code: languageCode }),
  };

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail?.message || err.detail || `HTTP ${res.status}`);
  }

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  return { audio: new Audio(url), url };
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);

  const isSupported = typeof window !== 'undefined';

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  // Fetch TTS audio without playing — returns a prepared { audio, url } object.
  // Call this as early as possible so it's ready when you want to play.
  const fetchAudio = useCallback((text) => {
    if (!text) return Promise.resolve(null);
    return buildAudio(text).catch((err) => {
      console.error('[TTS] fetch failed:', err.message);
      return null;
    });
  }, []);

  // Play a pre-fetched { audio, url } object immediately.
  // Returns a Promise that resolves when the audio finishes (or fails).
  const playReady = useCallback(({ audio, url }) => {
    stop();
    setIsSpeaking(true);
    audioRef.current = audio;

    return new Promise((resolve) => {
      const cleanup = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
        audioRef.current = null;
        resolve();
      };
      audio.onended = cleanup;
      audio.onerror = cleanup;
      audio.play().catch(cleanup);
    });
  }, [stop]);

  // Convenience: fetch + play in one call (used for manual Play button taps)
  const speak = useCallback(async (text) => {
    if (!text) return;
    stop();
    setIsSpeaking(true);
    const prepared = await buildAudio(text).catch((err) => {
      console.error('[TTS] speak failed:', err.message);
      return null;
    });
    if (prepared) playReady(prepared);
    else setIsSpeaking(false);
  }, [stop, playReady]);

  const prefetch = useCallback(() => {}, []);

  return { isSpeaking, isSupported, speak, stop, fetchAudio, playReady, prefetch };
}
