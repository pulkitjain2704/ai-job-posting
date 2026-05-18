import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SuccessScreen({ jobData, onReset, onShare }) {
  useEffect(() => {
    // Burst from both sides
    const fire = (originX, angle) =>
      confetti({
        particleCount: 60,
        spread: 70,
        angle,
        origin: { x: originX, y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
        scalar: 1.1,
        gravity: 1.2,
      });

    const t = setTimeout(() => {
      fire(0.1, 60);
      fire(0.9, 120);
      setTimeout(() => {
        fire(0.15, 70);
        fire(0.85, 110);
      }, 250);
    }, 100);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-screen max-w-[420px] mx-auto relative overflow-hidden" style={{ background: '#f4f7ff' }}>
      {/* Dark scrim */}
      <div className="absolute inset-0" style={{ background: 'rgba(1,12,30,0.65)' }} />

      {/* Bottom sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 animate-slide-up"
        style={{ background: '#fff', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-[71px] h-[5px] rounded-full" style={{ background: '#dbdde6' }} />
        </div>

        {/* Content */}
        <div className="px-4 pt-4 pb-10 flex flex-col gap-5">
          {/* Title */}
          <div className="flex items-center gap-2">
            <p className="font-bold text-[20px] leading-[1.6]" style={{ color: '#253858' }}>
              Your job is now posted!
            </p>
            <span className="text-[28px] leading-none">🎉</span>
          </div>

          {/* Share section */}
          <div className="flex flex-col gap-3">
            <p className="font-medium text-[14px] leading-[1.5]" style={{ color: '#42526e' }}>
              Share it with your network
            </p>

            {/* Share card — tapping opens native share sheet */}
            <button
              onClick={onShare}
              className="flex items-center gap-3 p-4 rounded-[8px] w-full text-left transition-all active:scale-[0.98]"
              style={{ border: '0.5px solid #dbdde6', background: '#fff' }}
            >
              <div
                className="flex-shrink-0 w-[50px] h-[50px] rounded-[30px] flex items-center justify-center"
                style={{ border: '1px solid #e7e7f1', background: '#f4f7ff' }}
              >
                {/* Share icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-[16px] leading-[20px]" style={{ color: '#121224' }}>
                  Hiring for {jobData.jobTitle || 'this role'}
                </p>
                <p className="font-medium text-[14px] leading-[18px]" style={{ color: '#474d6a' }}>
                  Tap to share with your network
                </p>
              </div>
              {/* Chevron */}
              <svg className="ml-auto flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ba3b5" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Post new job CTA */}
          <button
            onClick={onReset}
            className="w-full h-11 rounded-xl font-semibold text-[14px] text-white transition-all active:scale-[0.98]"
            style={{ background: '#265df5' }}
          >
            Post a new job
          </button>
        </div>
      </div>
    </div>
  );
}
