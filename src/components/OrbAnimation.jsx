import React from 'react';

export default function OrbAnimation({ state = 'idle', size = 'md' }) {
  const isActive = state === 'listening' || state === 'speaking';

  const dim  = size === 'sm' ? 80  : size === 'xs' ? 56  : 128;
  const core = size === 'sm' ? 72  : size === 'xs' ? 48  : 112;

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: dim, height: dim }}
    >
      {/* Outer glow when active */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full animate-orb-ring"
          style={{
            background: 'transparent',
            boxShadow: '0 0 24px rgba(99,102,241,0.45), 0 0 48px rgba(192,132,252,0.25)',
          }}
        />
      )}

      {/* GIF orb */}
      <img
        src="/orb.gif"
        alt="orb"
        draggable={false}
        style={{
          width: core,
          height: core,
          borderRadius: '50%',
          objectFit: 'cover',
          transform: isActive ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.5s ease',
          filter: state === 'thinking'
            ? 'brightness(0.8) saturate(1.4)'
            : isActive
              ? 'brightness(1.1) saturate(1.2)'
              : 'none',
        }}
      />

      {/* State overlays */}

      {/* Sound wave bars when speaking */}
      {state === 'speaking' && (
        <div className="absolute inset-0 flex items-center justify-center gap-[3px]" style={{ zIndex: 10 }}>
          {[12, 20, 26, 20, 12].map((h, i) => (
            <div
              key={i}
              className="sound-wave-bar rounded-full"
              style={{ width: '3px', height: `${h}px`, background: 'rgba(255,255,255,0.8)', transformOrigin: 'center' }}
            />
          ))}
        </div>
      )}

      {/* Mic icon when listening */}
      {state === 'listening' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 10 }}>
          <svg width={core * 0.3} height={core * 0.3} viewBox="0 0 24 24" fill="none">
            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="rgba(255,255,255,0.9)" />
            <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 19v3M9 22h6" stroke="rgba(255,255,255,0.9)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div className="absolute inset-0 flex items-center justify-center gap-1" style={{ zIndex: 10 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-white/80"
                 style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
