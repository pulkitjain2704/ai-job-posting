import React, { useState, useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ChatScreen from './components/ChatScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ReviewScreen from './components/ReviewScreen.jsx';
import SuccessScreen from './components/SuccessScreen.jsx';
import { sendMessage } from './services/claudeApi.js';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis.js';
import { getTemplatesByTitles } from './data/jobTemplates.js';

// App states
const STATE = {
  WELCOME: 'welcome',
  CHAT: 'chat',
  LOADING_CREATING: 'loading-creating',
  LOADING_FILLING: 'loading-filling',
  REVIEW: 'review',
  SUCCESS: 'success',
};

const EMPTY_JOB = {
  jobTitle: null,
  mandatorySkills: [],
  optionalSkills: [],
  experienceMin: null,
  experienceMax: null,
  salaryMin: null,
  salaryMax: null,
  salaryType: 'annual',
  location: null,
  qualification: null,
  perks: [],
  industry: [],
  screeningQuestions: [],
  jobDescription: null,
};

export default function App() {
  const [appState, setAppState] = useState(STATE.WELCOME);
  const [displayMessages, setDisplayMessages] = useState([]);
  const [apiHistory, setApiHistory] = useState([]);
  const [jobData, setJobData] = useState(EMPTY_JOB);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [orbState, setOrbState] = useState('idle');
  const [error, setError] = useState(null);
  const [hasReachedReview, setHasReachedReview] = useState(false);

  const { isSpeaking, speak, stop: stopSpeech, fetchAudio, playReady } = useSpeechSynthesis();

  // Sync orb state with speaking
  useEffect(() => {
    if (isSpeaking) {
      setOrbState('speaking');
    } else if (appState === STATE.CHAT && !isLoadingAI) {
      setOrbState('idle');
    }
  }, [isSpeaking, appState, isLoadingAI]);

  const processAIResponse = useCallback(async (userText, currentHistory, preFilledData = null) => {
    setIsLoadingAI(true);
    setOrbState('thinking');
    stopSpeech();

    try {
      const newHistory = [
        ...currentHistory,
        { role: 'user', content: userText },
      ];

      // audioPromise starts fetching TTS as soon as the message text is
      // available in the stream — runs in parallel with rest of Claude response.
      let audioPromise = null;

      const result = await sendMessage(newHistory, (earlyText) => {
        audioPromise = fetchAudio(earlyText);
      }, preFilledData);

      const { message, jobData: extractedData, complete, suggestJobs, suggestedTitles } = result;
      // Merge: EMPTY_JOB < preFilledData < Claude's extracted data (Claude wins on non-null values)
      const cleanExtracted = Object.fromEntries(
        Object.entries(extractedData).filter(([, v]) => v !== null && !(Array.isArray(v) && v.length === 0))
      );
      const mergedJobData = { ...EMPTY_JOB, ...(preFilledData || {}), ...cleanExtracted };

      // Resolve job suggestion cards if Claude flagged this as a vague role
      const suggestCards = (suggestJobs && suggestedTitles?.length)
        ? getTemplatesByTitles(suggestedTitles)
        : null;

      // Wait for audio (it's been fetching in parallel — usually already done)
      const prepared = audioPromise ? await audioPromise : null;

      // Show message + play audio at the exact same moment
      setApiHistory([
        ...newHistory,
        { role: 'assistant', content: JSON.stringify(result) },
      ]);

      setDisplayMessages((prev) => [
        ...prev,
        { role: 'assistant', text: message, jobData: mergedJobData, suggestCards },
      ]);

      setJobData(mergedJobData);
      setIsLoadingAI(false);

      const audioDone = prepared ? playReady(prepared) : Promise.resolve();

      if (complete) {
        // Wait for TTS to finish, then transition to loading screens
        audioDone.then(() => {
          setTimeout(() => {
            setAppState(STATE.LOADING_CREATING);
            setTimeout(() => {
              setAppState(STATE.LOADING_FILLING);
              setTimeout(() => {
                setAppState(STATE.REVIEW);
              }, 2200);
            }, 2200);
          }, 500);
        });
      } else {
        setOrbState('idle');
      }
    } catch (err) {
      setIsLoadingAI(false);
      setOrbState('idle');
      console.error('[processAIResponse] error:', err?.status, err?.message, err);

      const errorMsg =
        err.message?.includes('API key')
          ? 'API key missing. Please add VITE_ANTHROPIC_API_KEY to your .env file.'
          : err?.status === 529 || err?.message?.includes('overloaded')
          ? 'AI is overloaded right now. Please wait a moment and try again.'
          : err?.status === 400
          ? `Bad request: ${err.message}`
          : `Something went wrong (${err?.status || 'unknown'}). Please try again.`;

      setError(errorMsg);
      setDisplayMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `⚠️ ${errorMsg}`, jobData: EMPTY_JOB },
      ]);
    }
  }, [speak, stopSpeech]);

  // Initial message from welcome screen
  // preFilledData: parsed CV/JD fields (or null) from WelcomeScreen upload
  const handleStart = useCallback(
    async (text, preFilledData) => {
      setError(null);
      setAppState(STATE.CHAT);

      // Merge pre-filled fields into jobData so ReviewScreen shows them immediately
      if (preFilledData) {
        setJobData((prev) => ({ ...prev, ...preFilledData }));
      }

      const userMessage = { role: 'user', text };
      setDisplayMessages([userMessage]);

      await processAIResponse(text, [], preFilledData);
    },
    [processAIResponse]
  );

  // Follow-up messages in chat
  const handleSendMessage = useCallback(
    async (text) => {
      setError(null);
      setDisplayMessages((prev) => [...prev, { role: 'user', text }]);
      await processAIResponse(text, apiHistory);
    },
    [processAIResponse, apiHistory]
  );

  // Called when user selects a job card and taps "Pre-fill" or "Edit details"
  const handleJobSelect = useCallback(
    async (template, action) => {
      // Build a rich user message that tells Claude exactly what was chosen
      const prefillNote = `Mandatory Skills: ${template.mandatorySkills.join(', ')}${template.optionalSkills?.length ? `\nOptional Skills: ${template.optionalSkills.join(', ')}` : ''}\nQualification: ${template.qualification}`;

      let userText;
      if (action === 'prefill') {
        userText = `I want to hire a ${template.title}. Here are the standard details:\n${prefillNote}\nPlease use these details and only ask me about the remaining fields (experience, salary, location) one at a time.`;
      } else {
        userText = `I want to hire a ${template.title} but want to customise the details. Suggested defaults:\n${prefillNote}\nPlease ask me what I'd like to change, then proceed with the remaining questions.`;
      }

      // What the user sees is a clean short label, not the big injected text
      const displayText = action === 'prefill'
        ? `${template.title} — Pre-fill details`
        : `${template.title} — Edit details`;

      // Merge template data so ReviewScreen already has it
      const preFilledData = {
        jobTitle: template.title,
        mandatorySkills: template.mandatorySkills,
        optionalSkills: template.optionalSkills || [],
        qualification: template.qualification,
        industry: template.industry || [],
      };

      setError(null);
      setDisplayMessages((prev) => [...prev, { role: 'user', text: displayText }]);
      await processAIResponse(userText, apiHistory, preFilledData);
    },
    [processAIResponse, apiHistory]
  );

  // Called when user taps "I don't find anything resonating"
  const handleNothingResonating = useCallback(
    async () => {
      const userText = 'None of these match. Let me describe the role instead.';
      setError(null);
      setDisplayMessages((prev) => [...prev, { role: 'user', text: userText }]);
      await processAIResponse(userText, apiHistory);
    },
    [processAIResponse, apiHistory]
  );

  const handleSpeak = useCallback(
    (text) => {
      if (isSpeaking) {
        stopSpeech();
      } else {
        speak(text);
      }
    },
    [isSpeaking, speak, stopSpeech]
  );

  const handleSubmit = useCallback((finalJobData) => {
    setAppState(STATE.SUCCESS);
    console.log('Job posted:', finalJobData);
  }, []);

  // --- Render ---

  if (appState === STATE.WELCOME) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (appState === STATE.CHAT) {
    return (
      <ChatScreen
        messages={displayMessages}
        isLoading={isLoadingAI}
        orbState={orbState}
        onSendMessage={handleSendMessage}
        onSpeak={handleSpeak}
        onReview={() => setAppState(STATE.REVIEW)}
        hasJobData={hasReachedReview}
        onBack={() => setAppState(STATE.WELCOME)}
        onJobSelect={handleJobSelect}
        onNothingResonating={handleNothingResonating}
      />
    );
  }

  if (appState === STATE.LOADING_CREATING) {
    return <LoadingScreen stage="creating" />;
  }

  if (appState === STATE.LOADING_FILLING) {
    return <LoadingScreen stage="filling" />;
  }

  if (appState === STATE.REVIEW) {
    if (!hasReachedReview) setHasReachedReview(true);
    return <ReviewScreen jobData={jobData} onSubmit={handleSubmit} onBack={() => setAppState(STATE.CHAT)} />;
  }

  if (appState === STATE.SUCCESS) {
    const handleReset = () => {
      setAppState(STATE.WELCOME);
      setDisplayMessages([]);
      setApiHistory([]);
      setJobData(EMPTY_JOB);
      setHasReachedReview(false);
      setError(null);
    };

    const handleShare = async () => {
      const title = `Hiring for ${jobData.jobTitle || 'a new role'}`;
      const text = `We're hiring! Check out this job opportunity: ${jobData.jobTitle || 'Open position'}${jobData.location ? ` in ${jobData.location}` : ''}.`;
      if (navigator.share) {
        try {
          await navigator.share({ title, text });
        } catch (_) {}
      }
    };

    return <SuccessScreen jobData={jobData} onReset={handleReset} onShare={handleShare} />;
  }

  return null;
}
