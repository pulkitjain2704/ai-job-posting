import React from 'react';

export default function LoadingScreen({ stage = 'creating' }) {
  const isCreating = stage === 'creating';

  const text = isCreating
    ? 'Creating a custom job posting form for you'
    : 'Auto-filling your job posting form';

  // Stage 1: indicator 10px, Stage 2: indicator 20px (out of 40px base)
  const indicatorWidth = isCreating ? 10 : 20;

  return (
    <div
      className="h-screen max-w-[420px] mx-auto flex flex-col relative"
      style={{ background: '#f4f7ff', overflow: 'clip' }}
    >
      {/* Bottom purple gradient blob */}
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
          background:
            'radial-gradient(circle, rgba(130,80,255,0.3) 0%, rgba(99,102,241,0.2) 40%, rgba(59,130,246,0.1) 70%, transparent 100%)',
        }}
      />

      {/* Header */}
      <div
        className="flex-shrink-0 bg-white flex items-center px-5 z-10 relative"
        style={{ height: 56, borderBottom: '1px solid rgba(219,221,230,0.5)' }}
      >
        <button className="mr-3 text-[#465166]" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="font-bold text-[16px] text-[#465166]">Post a Job</span>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 z-10 px-8">
        {/* Orb in light-blue circle */}
        <div
          className="relative flex items-center justify-center rounded-full overflow-hidden"
          style={{ width: 80, height: 80, background: '#edf4ff' }}
        >
          <img
            src="/orb.gif"
            alt="Loading"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Text + progress */}
        <div className="flex flex-col gap-5 items-center" style={{ width: 299 }}>
          {/* Gradient headline */}
          <p
            className="text-[26px] font-medium text-center leading-snug"
            style={{
              letterSpacing: '-0.5px',
              background: 'linear-gradient(167.434deg, rgb(18, 18, 36) 8.2459%, rgb(4, 0, 187) 93.928%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {text}
          </p>

          {/* Step progress pill */}
          <div className="relative h-[4px] rounded-full" style={{ width: 40, background: '#cac2f8' }}>
            <div
              className="absolute left-0 top-0 h-full rounded-full"
              style={{
                width: indicatorWidth,
                background: '#051ed5',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
