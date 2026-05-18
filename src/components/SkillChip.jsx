import React from 'react';

const STYLES = {
  mandatory: {
    background: '#eef2ff',
    color: '#4f46e5',
    border: '1px solid #c7d2fe',
  },
  optional: {
    background: '#f5f3ff',
    color: '#7c3aed',
    border: '1px solid #ddd6fe',
  },
};

export default function SkillChip({ skill, onRemove, variant = 'mandatory' }) {
  const style = STYLES[variant] || STYLES.mandatory;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium transition-colors duration-150"
      style={style}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="w-4 h-4 flex items-center justify-center rounded-full opacity-50 hover:opacity-100 transition-opacity"
          style={{ color: style.color }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l6 6M7 1L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
}
