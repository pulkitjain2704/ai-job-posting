import React, { useState, useRef } from 'react';
import OrbAnimation from './OrbAnimation.jsx';
import { useWhisperRecognition } from '../hooks/useWhisperRecognition.js';
import { parseDocument } from '../services/parseDocument.js';

const TIPS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7794" strokeWidth="1.75" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    text: 'Be specific in your search query. Add key skills, experience, and location',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7794" strokeWidth="1.75" strokeLinecap="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
      </svg>
    ),
    text: 'Upload your JD. Let AI extract skills to find the closest match.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7794" strokeWidth="1.75" strokeLinecap="round">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      </svg>
    ),
    text: 'Speak in Hindi or English. AI understands both languages naturally.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7794" strokeWidth="1.75" strokeLinecap="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    text: 'Review and edit the auto-filled form before posting your job.',
  },
];

// ── Smart cue detection ──────────────────────────────────────────────────────
const CUES = [
  {
    key: 'jobTitle',
    label: 'Job Title',
    icon: (c) => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    key: 'skills',
    label: 'Skills',
    icon: (c) => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    key: 'location',
    label: 'Location',
    icon: (c) => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    key: 'experience',
    label: 'Work Ex',
    icon: (c) => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    key: 'salary',
    label: 'Salary',
    icon: (c) => (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round">
        <line x1="6" y1="6" x2="18" y2="6" /><path d="M6 10h6a4 4 0 0 1 0 8H6l6.5-8" />
      </svg>
    ),
  },
];

function detectCues(text) {
  const t = text.toLowerCase();
  return {
    jobTitle: /\b(developer|engineer|designer|manager|analyst|architect|lead|senior|junior|intern|consultant|specialist|director|executive|programmer|devops|qa|tester|recruiter|sales|product|data|backend|frontend|fullstack|full.stack|cto|cfo|coo|ceo)\b/.test(t),
    skills: /\b(java|python|react|node|angular|vue|sql|aws|api|rest|css|html|javascript|typescript|android|ios|flutter|kotlin|swift|\.net|php|ruby|golang|docker|kubernetes|spring|django|mongodb|postgres|mysql|redis|kafka|microservices|agile|scrum|figma|photoshop)\b/.test(t),
    location: /\b(delhi|mumbai|bangalore|bengaluru|hyderabad|pune|chennai|kolkata|noida|gurgaon|gurugram|ahmedabad|remote|hybrid|onsite|work from home|wfh)\b/.test(t),
    experience: /\d+\s*[-–to]+\s*\d+\s*years?|\d+\+?\s*years?|\b(fresher|experienced|entry.level)\b/.test(t),
    salary: /\b(lpa|lakh|salary|ctc|pay|compensation|package)\b|₹|\b\d+\s*k\b/.test(t),
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function WelcomeScreen({ onStart }) {
  const [inputValue, setInputValue] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);   // { name, parsedData }
  const [isParsing, setIsParsing]     = useState(false);
  const [parseError, setParseError]   = useState(null);
  const fileInputRef = useRef(null);
  const detected = detectCues(inputValue);

  const { isListening, isTranscribing, isSupported, error, toggle, stop } = useWhisperRecognition({
    onResult: (text) => setInputValue((prev) => (prev ? prev + ' ' + text : text)),
    getPrompt: () => inputValue,
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';            // allow re-selecting same file
    setParseError(null);
    setIsParsing(true);
    try {
      const parsed = await parseDocument(file);
      setUploadedFile({ name: file.name, parsedData: parsed });
    } catch (err) {
      const msg = err?.message || String(err) || 'Unknown error';
      console.error('[parseDocument] raw error:', err);
      const friendly = msg.includes('API key') ? 'API key missing — check your .env file.'
        : msg.includes('overloaded') || err?.status === 529 ? 'AI is busy right now. Please try again in a moment.'
        : msg.includes('Could not parse') ? msg
        : `Could not parse document. Please try again.`;
      setParseError(friendly);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = () => {
    const text = inputValue.trim();
    const hasParsed = !!uploadedFile?.parsedData;
    // Allow submit if there's text OR a parsed document
    if (!text && !hasParsed) return;
    stop();
    onStart(text || 'I have uploaded a document.', uploadedFile?.parsedData || null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen max-w-[420px] mx-auto relative"
         style={{ background: '#f4f7ff', overflow: 'clip' }}>

      {/* Background gradient blob — outside flex flow */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-254px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '418px',
          height: '418px',
          borderRadius: '50%',
          filter: 'blur(81px)',
          opacity: 0.7,
          background: 'radial-gradient(circle, rgba(130,80,255,0.3) 0%, rgba(99,102,241,0.2) 40%, rgba(59,130,246,0.1) 70%, transparent 100%)',
        }}
      />

      <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="flex-shrink-0 bg-white flex items-center px-5 border-b border-[#dbdde6]/50"
           style={{ height: 56 }}>
        <button className="mr-3 text-[#465166]" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="font-bold text-[16px] text-[#465166]">Post a Job</span>
      </div>

      {/* Scrollable main body */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Orb + Greeting */}
        <div className="flex flex-col items-center pt-10 pb-6 px-4">
          <OrbAnimation state={isListening ? 'listening' : 'idle'} size="sm" />

          <div className="text-center mt-6">
            <p className="text-[18px] text-[#030088] mb-3">Hey, Rohit!</p>
            <h1
              className="text-[26px] font-semibold tracking-[-0.5px] leading-[1.25] text-gradient"
              style={{ maxWidth: 300 }}
            >
              Hello! Who do you want to hire?
            </h1>
          </div>
        </div>

        {/* Tips */}
        <div className="px-4 mb-6">
          <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-[#253858] opacity-80 mb-3">
            TIPS FOR YOU
          </p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {TIPS.map((tip, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3 flex-shrink-0 flex flex-col gap-2"
                style={{ width: 165, border: '1px solid #f0f2fa' }}
              >
                <div className="flex-shrink-0">{tip.icon}</div>
                <p className="text-[12px] text-[#42526e] leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Bottom input card */}
      <div className="flex-shrink-0 px-4 pb-8 relative z-10">
        <div
          className="bg-white rounded-xl p-4 flex flex-col"
          style={{ border: '1px solid #dbdde6', gap: 12 }}
        >
          {/* Uploaded file pill */}
          {(uploadedFile || isParsing) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-[8px]"
              style={{ background: '#f4f7ff', border: '1px solid #c7d2fe' }}>
              {isParsing ? (
                <>
                  <span className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin flex-shrink-0" />
                  <span className="text-[12px] text-[#6366f1] flex-1 truncate">Parsing document…</span>
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-[12px] text-[#4338ca] flex-1 truncate font-medium">{uploadedFile.name}</span>
                  {uploadedFile.parsedData?.documentType && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                      style={{ background: '#eef2ff', color: '#4f46e5' }}>
                      {uploadedFile.parsedData.documentType.toUpperCase()}
                    </span>
                  )}
                  <button type="button" onClick={() => setUploadedFile(null)}
                    className="flex-shrink-0 text-[#9ba3b5] hover:text-[#465166] text-[14px] leading-none">✕</button>
                </>
              )}
            </div>
          )}

          {/* Parse error */}
          {parseError && (
            <p className="text-[12px] text-red-500 px-1">{parseError}</p>
          )}

          {/* Extracted fields preview */}
          {uploadedFile?.parsedData && (() => {
            const d = uploadedFile.parsedData;
            const chips = [
              d.jobTitle && { label: d.jobTitle, color: '#4338ca', bg: '#eef2ff' },
              d.mandatorySkills?.length && { label: `${d.mandatorySkills.length} skills`, color: '#166534', bg: '#f0fdf4' },
              d.location && { label: d.location, color: '#0369a1', bg: '#f0f9ff' },
              (d.experienceMin != null) && { label: `${d.experienceMin}–${d.experienceMax ?? d.experienceMin} yrs`, color: '#92400e', bg: '#fffbeb' },
              (d.salaryMin != null) && { label: `₹${(d.salaryMin/100000).toFixed(1)}–${(d.salaryMax/100000).toFixed(1)}L`, color: '#581c87', bg: '#faf5ff' },
            ].filter(Boolean);
            return chips.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((c, i) => (
                  <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: c.bg, color: c.color }}>{c.label}</span>
                ))}
              </div>
            ) : null;
          })()}

          {/* Input row */}
          <div className="flex items-start gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
              <path fillRule="evenodd" clipRule="evenodd" d="M8.3779 4.87694C8.47857 4.57423 8.90817 4.57417 9.00876 4.87694C10.2302 8.56405 11.4613 9.79254 15.1582 11.0107C15.4621 11.111 15.4621 11.5394 15.1582 11.6396C11.4613 12.8577 10.2302 14.0858 9.00876 17.7724C8.90826 18.0756 8.47838 18.0756 8.3779 17.7724C7.15644 14.0854 5.92445 12.8578 2.22751 11.6396C1.92408 11.5393 1.92417 11.1112 2.22751 11.0107C5.92471 9.79257 7.15638 8.56388 8.3779 4.87694ZM14.4961 2.11327C14.5461 1.96219 14.7607 1.96213 14.8115 2.11327C15.4218 3.9564 16.0377 4.57113 17.8867 5.18065C18.0386 5.23036 18.0386 5.44456 17.8867 5.4951C16.0385 6.10379 15.4227 6.71856 14.8115 8.56249C14.7615 8.7137 14.5469 8.71364 14.4961 8.56249C13.8857 6.71943 13.2696 6.1046 11.4209 5.4951C11.2689 5.4454 11.2689 5.23117 11.4209 5.18065C13.2688 4.57199 13.8849 3.95711 14.4961 2.11327Z" fill="#3A4250" />
            </svg>
            <input
              value={inputValue}
              onChange={(e) => !isListening && !isTranscribing && setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isParsing ? 'Parsing document…' :
                uploadedFile ? 'Add any extra details (optional)' :
                isListening ? 'Recording… click End when done' :
                isTranscribing ? 'Transcribing…' :
                'Tell us who do you want to hire'
              }
              disabled={isParsing}
              className="flex-1 bg-transparent text-[14px] outline-none"
              style={{ color: '#253858', caretColor: '#6366f1' }}
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isParsing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[26px] text-[14px] transition-colors"
              style={uploadedFile
                ? { border: '1px solid #c7d2fe', background: '#eef2ff', color: '#4338ca' }
                : { border: '1px solid #dbdde6', background: '#fff', color: '#253858' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
              JD/CV
            </button>

            {isSupported && (
              <button
                onClick={toggle}
                disabled={isTranscribing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[26px] text-[14px] font-medium transition-all duration-200"
                style={
                  isListening
                    ? { background: '#e53e3e', color: '#fff', border: '1px solid #e53e3e' }
                    : isTranscribing
                    ? { background: '#f0f2fa', color: '#a0aec0', border: '1px solid #e2e8f0' }
                    : { background: '#fff', color: '#253858', border: '1px solid #dbdde6' }
                }
              >
                {isListening ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    End
                  </>
                ) : isTranscribing ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M9 22h6" />
                    </svg>
                    Talk
                  </>
                )}
              </button>
            )}

            {/* Send arrow — shown once there's text or a parsed doc, and not recording */}
            {(inputValue.trim() || uploadedFile?.parsedData) && !isListening && !isTranscribing && (
              <button
                onClick={handleSubmit}
                className="flex items-center justify-center w-10 h-10 rounded-full text-white transition-all duration-200 active:scale-95"
                style={{ background: '#253858' }}
                aria-label="Submit"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Fallback submit when speech API unavailable */}
            {!isSupported && (
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[26px] text-[14px] font-medium transition-all duration-200"
                style={
                  inputValue.trim()
                    ? { background: '#253858', color: '#fff', border: '1px solid #253858' }
                    : { background: '#f0f2fa', color: '#a0aec0', border: '1px solid #e2e8f0' }
                }
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {/* Smart cue chips — visible only while typing */}
        {inputValue.trim() && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar mt-3 px-1">
            {CUES.map(({ key, label, icon }) => {
              const active = detected[key];
              return (
                <div
                  key={key}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-300"
                  style={
                    active
                      ? { background: '#EEF2FF', color: '#4F46E5', border: '1.5px solid #C7D2FE' }
                      : { background: '#F8F9FA', color: '#9BA3B5', border: '1.5px solid #E9ECF0' }
                  }
                >
                  {icon(active ? '#4F46E5' : '#B0B8C8')}
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <p className="text-red-500 text-xs text-center mt-2">{error}</p>
        )}
      </div>

      </div>{/* end flex column */}
    </div>
  );
}
