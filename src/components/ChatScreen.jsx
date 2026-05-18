import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useWhisperRecognition } from '../hooks/useWhisperRecognition.js';

// ── Sparkle icon ────────────────────────────────────────────────────────────
function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.3779 4.87694C8.47857 4.57423 8.90817 4.57417 9.00876 4.87694C10.2302 8.56405 11.4613 9.79254 15.1582 11.0107C15.4621 11.111 15.4621 11.5394 15.1582 11.6396C11.4613 12.8577 10.2302 14.0858 9.00876 17.7724C8.90826 18.0756 8.47838 18.0756 8.3779 17.7724C7.15644 14.0854 5.92445 12.8578 2.22751 11.6396C1.92408 11.5393 1.92417 11.1112 2.22751 11.0107C5.92471 9.79257 7.15638 8.56388 8.3779 4.87694ZM14.4961 2.11327C14.5461 1.96219 14.7607 1.96213 14.8115 2.11327C15.4218 3.9564 16.0377 4.57113 17.8867 5.18065C18.0386 5.23036 18.0386 5.44456 17.8867 5.4951C16.0385 6.10379 15.4227 6.71856 14.8115 8.56249C14.7615 8.7137 14.5469 8.71364 14.4961 8.56249C13.8857 6.71943 13.2696 6.1046 11.4209 5.4951C11.2689 5.4454 11.2689 5.23117 11.4209 5.18065C13.2688 4.57199 13.8849 3.95711 14.4961 2.11327Z" fill="#3A4250" />
    </svg>
  );
}

// ── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message, onSpeak, isLast }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-start gap-[10px] animate-slide-up w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Orb avatar only on the latest AI message — no spacer for older ones */}
      {!isUser && isLast && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden mt-1">
          <img src="/orb.gif" alt="AI" className="w-full h-full object-cover" draggable={false} />
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
        style={{ maxWidth: isUser ? '75%' : 'calc(100% - 40px)' }}>
        <div
          className="px-4 py-3 text-[14px] leading-[21px] text-[#42526e]"
          style={isUser
            ? { background: '#fff', borderRadius: '16px 16px 4px 16px' }
            : { background: '#fff', borderRadius: '4px 16px 16px 16px' }}
        >
          {message.text}
        </div>
        {!isUser && isLast && onSpeak && (
          <button
            onClick={() => onSpeak(message.text)}
            className="flex items-center gap-1 px-1 py-0.5 text-[#9ba3b5] hover:text-[#6b7794] text-[11px] transition-colors ml-1"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            Play
          </button>
        )}
      </div>
    </div>
  );
}

// ── Job suggestion cards ─────────────────────────────────────────────────────
function JobSuggestionCards({ cards, onSelect, onNothingResonating, disabled }) {
  const [selected, setSelected] = useState(null);

  const handleCardClick = (card) => {
    if (disabled) return;
    setSelected(card.id);
  };

  const handleAction = (action) => {
    if (disabled || !selected) return;
    const card = cards.find((c) => c.id === selected);
    if (card) onSelect(card, action);
  };

  return (
    <div className="flex flex-col gap-2 mt-1 ml-9">
      {/* Cards grid */}
      <div className="flex flex-col gap-2">
        {cards.map((card) => {
          const isSelected = selected === card.id;
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              disabled={disabled}
              className="text-left px-3.5 py-3 rounded-xl transition-all active:scale-[0.98]"
              style={
                isSelected
                  ? { background: '#4f46e5', border: '1.5px solid #4f46e5' }
                  : { background: '#fff', border: '1.5px solid #e0e4ef' }
              }
            >
              <p
                className="font-semibold text-[13px] leading-snug"
                style={{ color: isSelected ? '#fff' : '#253858' }}
              >
                {card.title}
              </p>
              <p
                className="text-[11px] mt-0.5 line-clamp-1"
                style={{ color: isSelected ? 'rgba(255,255,255,0.75)' : '#6b7794' }}
              >
                {card.mandatorySkills.slice(0, 3).join(' · ')}
              </p>
            </button>
          );
        })}
      </div>

      {/* Action buttons — appear after a card is selected */}
      {selected && (
        <div className="flex gap-2 mt-1 animate-fade-in">
          <button
            onClick={() => handleAction('prefill')}
            disabled={disabled}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all active:scale-95"
            style={{ background: '#253858', color: '#fff' }}
          >
            Pre-fill details
          </button>
          <button
            onClick={() => handleAction('edit')}
            disabled={disabled}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium transition-all active:scale-95"
            style={{ background: '#fff', color: '#253858', border: '1.5px solid #dbdde6' }}
          >
            Edit details
          </button>
        </div>
      )}

      {/* Nothing resonating */}
      {!selected && (
        <button
          onClick={onNothingResonating}
          disabled={disabled}
          className="self-start text-[12px] mt-0.5 transition-colors"
          style={{ color: '#9ba3b5' }}
        >
          I don't find anything resonating →
        </button>
      )}
    </div>
  );
}

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-[10px] animate-fade-in">
      <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden mt-1">
        <img src="/orb.gif" alt="AI" className="w-full h-full object-cover" draggable={false} />
      </div>
      <div className="px-4 py-3 bg-white rounded-[4px_16px_16px_16px] flex items-center gap-1" style={{ borderRadius: '4px 16px 16px 16px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#a0aec0]"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main ChatScreen ───────────────────────────────────────────────────────────
export default function ChatScreen({ messages, isLoading, onSendMessage, onSpeak, onReview, hasJobData, onBack, onJobSelect, onNothingResonating }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const { isListening, isTranscribing, isSupported, error: micError, toggle, stop } = useWhisperRecognition({
    onResult: (text) => setInputValue((prev) => (prev ? prev + ' ' + text : text)),
    // Give Whisper the current input as context so it stays in the right language
    getPrompt: () => inputValue,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    stop();
    setInputValue('');
    onSendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  // Index of the last assistant message
  const lastAssistantIdx = messages.reduce((last, m, i) => m.role === 'assistant' ? i : last, -1);

  return (
    <div className="h-screen max-w-[420px] mx-auto relative" style={{ background: '#f4f7ff', overflow: 'clip' }}>
      {/* Background blob */}
      <div className="absolute pointer-events-none" style={{
        bottom: '-254px', left: '50%', transform: 'translateX(-50%)',
        width: '418px', height: '418px', borderRadius: '50%',
        filter: 'blur(81px)', opacity: 0.7,
        background: 'radial-gradient(circle, rgba(130,80,255,0.3) 0%, rgba(99,102,241,0.2) 40%, rgba(59,130,246,0.1) 70%, transparent 100%)',
      }} />

      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 bg-white flex items-center px-5 z-10"
          style={{ height: 56, borderBottom: '1px solid rgba(219,221,230,0.5)' }}>
          <button onClick={onBack} className="mr-3 text-[#465166]" aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="font-bold text-[16px] text-[#465166] flex-1">Post a Job</span>
          {hasJobData && onReview && (
            <button
              onClick={onReview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95"
              style={{ background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
              </svg>
              Review job posting
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 no-scrollbar z-10">
          {messages.map((msg, i) => {
            // Show orb only on last AI message — and only when NOT loading
            // (while loading, the TypingIndicator carries the orb instead)
            const isLast = i === lastAssistantIdx && !isLoading;
            const showCards = isLast && msg.suggestCards?.length > 0;
            return (
              <React.Fragment key={i}>
                <MessageBubble
                  message={msg}
                  onSpeak={isLast ? onSpeak : null}
                  isLast={isLast}
                />
                {showCards && (
                  <JobSuggestionCards
                    cards={msg.suggestCards}
                    onSelect={onJobSelect}
                    onNothingResonating={onNothingResonating}
                    disabled={isLoading}
                  />
                )}
              </React.Fragment>
            );
          })}
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 px-4 pt-2 z-10" style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>
          {micError && <p className="text-red-500 text-xs text-center mb-2 px-2">{micError}</p>}
          <div className="bg-white rounded-xl p-4 flex flex-col gap-4" style={{ border: '1px solid #dbdde6' }}>
            <div className="flex items-center gap-2">
              <SparkleIcon />
              <input
                value={inputValue}
                onChange={(e) => !isListening && !isTranscribing && setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Recording…' : isTranscribing ? 'Transcribing…' : 'Type or speak'}
                disabled={isLoading || isTranscribing}
                className="flex-1 bg-transparent text-[14px] outline-none text-[#253858]"
                style={{ caretColor: '#6366f1' }}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              {inputValue.trim() && !isListening && !isTranscribing && (
                <button onClick={handleSubmit} disabled={isLoading}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95"
                  style={{ background: '#253858', color: '#fff' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
              {isSupported && (
                <button onClick={toggle} disabled={isLoading || isTranscribing}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-95"
                  style={isListening
                    ? { background: '#e53e3e', color: '#fff' }
                    : isTranscribing
                    ? { background: '#f0f2fa', color: '#a0aec0', border: '1px solid #e2e8f0' }
                    : { background: '#fff', color: '#6b7794', border: '1px solid #dbdde6' }}>
                  {isListening ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  ) : isTranscribing ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                      <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M9 22h6" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
