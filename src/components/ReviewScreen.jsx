import React, { useState } from 'react';

// Broad category chips shown to recruiter
const QUALIFICATIONS = ['10th', '12th', 'Diploma', 'Graduate', 'Post Graduate', 'Any'];

// Map specific degrees → their broad category (for chip highlighting)
const SPECIFIC_TO_BROAD = {
  'B.Tech / BE': 'Graduate', 'BCA': 'Graduate', 'B.Sc': 'Graduate',
  'B.Com': 'Graduate', 'BA': 'Graduate', 'B.Pharma': 'Graduate', 'MBBS': 'Graduate',
  'LLB': 'Graduate', 'BBA': 'Graduate', 'B.Arch': 'Graduate',
  'MBA': 'Post Graduate', 'M.Tech': 'Post Graduate', 'M.Sc': 'Post Graduate',
  'CA': 'Post Graduate', 'MCA': 'Post Graduate', 'MA': 'Post Graduate',
};

// Returns the broad chip to highlight for any qualification string
function toBroad(qual) {
  if (!qual || qual === 'Any') return 'Any';
  if (QUALIFICATIONS.includes(qual)) return qual;
  return SPECIFIC_TO_BROAD[qual] || 'Graduate';
}

// Returns true if the value is a specific degree (not a broad chip)
function isSpecific(qual) {
  return !!qual && !QUALIFICATIONS.includes(qual);
}
const EXP_OPTIONS    = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10+'];

const INDUSTRY_OPTIONS = [
  'FMCG', 'Retail', 'Manufacturing', 'Automobile', 'Distribution',
  'IT/Software', 'Healthcare', 'Real Estate', 'Finance', 'Telecom',
  'Banking', 'Pharma', 'E-commerce', 'Electronics', 'Education',
];


/* ── shared label ─────────────────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <p className="text-[16px] font-semibold leading-6" style={{ color: '#041533' }}>
      {children}
    </p>
  );
}

/* ── single-line text input ───────────────────────────────────────────────── */
function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 px-4 text-[14px] rounded-[4px] outline-none placeholder-[#bcc4d3]"
      style={{ background: '#fff', border: '1px solid #dbdde6', color: '#253858', caretColor: '#6366f1' }}
    />
  );
}

/* ── skills box ───────────────────────────────────────────────────────────── */
function SkillsBox({ mandatory, optional, onAddMandatory, onRemoveMandatory, onAddOptional, onRemoveOptional }) {
  const [input, setInput] = useState('');
  const [mode, setMode]   = useState('mandatory');

  const handleAdd = () => {
    const s = input.trim();
    if (!s) return;
    if (mode === 'mandatory' && !mandatory.includes(s)) onAddMandatory(s);
    if (mode === 'optional'  && !optional.includes(s))  onAddOptional(s);
    setInput('');
  };

  return (
    <div className="w-full rounded-[4px] p-3 flex flex-col gap-3"
      style={{ border: '1px solid #dbdde6', background: '#fff' }}>
      <div className="flex gap-2">
        {['mandatory', 'optional'].map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className="px-3 py-1 rounded-full text-[12px] font-medium transition-all"
            style={mode === m
              ? { background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe' }
              : { background: '#f8f9fa', color: '#9ba3b5', border: '1px solid #e9ecf0' }}>
            {m === 'mandatory' ? 'Mandatory' : 'Optional'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 min-h-[28px]">
        {(mode === 'mandatory' ? mandatory : optional).map((s) => (
          <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-full text-[13px] font-medium"
            style={mode === 'mandatory'
              ? { background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }
              : { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
            {s}
            <button type="button" className="ml-0.5 opacity-60 hover:opacity-100 text-[11px]"
              onClick={() => mode === 'mandatory' ? onRemoveMandatory(s) : onRemoveOptional(s)}>✕</button>
          </span>
        ))}
        {(mode === 'mandatory' ? mandatory : optional).length === 0 && (
          <span className="text-[13px]" style={{ color: '#bcc4d3' }}>
            {mode === 'mandatory' ? 'No mandatory skills yet' : 'No optional skills yet'}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid #f1f3f8' }}>
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); handleAdd(); } }}
          placeholder="Add skill, press Enter"
          className="flex-1 text-[13px] bg-transparent outline-none placeholder-[#bcc4d3]"
          style={{ color: '#253858' }} />
        <button type="button" onClick={handleAdd}
          className="text-[12px] font-semibold shrink-0" style={{ color: '#4f46e5' }}>
          + Add
        </button>
      </div>
    </div>
  );
}

/* ── experience range ─────────────────────────────────────────────────────── */
function ExperienceRange({ min, max, onMinChange, onMaxChange }) {
  return (
    <div className="flex items-center gap-2">
      <select value={min ?? 0} onChange={(e) => onMinChange(Number(e.target.value))}
        className="flex-1 h-11 px-3 text-[14px] rounded-[4px] outline-none appearance-none"
        style={{ background: '#fff', border: '1px solid #dbdde6', color: '#253858' }}>
        {EXP_OPTIONS.map((o) => (
          <option key={o} value={o === '10+' ? 10 : Number(o)}>
            {o === '0' ? 'Fresher' : `${o} yr${o !== '1' ? 's' : ''}`}
          </option>
        ))}
      </select>
      <span className="text-[13px] shrink-0" style={{ color: '#6b7794' }}>to</span>
      <select value={max ?? 3} onChange={(e) => onMaxChange(Number(e.target.value))}
        className="flex-1 h-11 px-3 text-[14px] rounded-[4px] outline-none appearance-none"
        style={{ background: '#fff', border: '1px solid #dbdde6', color: '#253858' }}>
        {EXP_OPTIONS.slice(1).map((o) => (
          <option key={o} value={o === '10+' ? 10 : Number(o)}>
            {o === '10+' ? '10+ yrs' : `${o} yr${o !== '1' ? 's' : ''}`}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── salary range ─────────────────────────────────────────────────────────── */
function SalaryRange({ min, max, onMinChange, onMaxChange }) {
  return (
    <div className="flex items-center gap-2">
      {[['min', min, onMinChange, 'e.g. 300000'], ['max', max, onMaxChange, 'e.g. 400000']].map(([key, val, setter, ph], i) => (
        <React.Fragment key={key}>
          {i === 1 && <span className="text-[13px] shrink-0" style={{ color: '#6b7794' }}>to</span>}
          <div className="flex-1 flex items-center h-11 rounded-[4px] overflow-hidden"
            style={{ border: '1px solid #dbdde6', background: '#fff' }}>
            <div className="flex items-center justify-center h-full px-2.5"
              style={{ borderRight: '1px solid #dbdde6', background: '#f8f9fa' }}>
              <span className="text-[13px]" style={{ color: '#6b7794' }}>₹</span>
            </div>
            <input type="number" value={val ?? ''} placeholder={ph}
              onChange={(e) => setter(Number(e.target.value) || 0)}
              className="flex-1 px-3 text-[14px] outline-none"
              style={{ color: '#253858', background: '#fff' }} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── perks & benefits ─────────────────────────────────────────────────────── */
function PerksSection({ perks, onChange }) {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput]         = useState('');

  const remove = (p) => onChange(perks.filter(x => x !== p));
  const addCustom = () => {
    const s = input.trim();
    if (s && !perks.includes(s)) onChange([...perks, s]);
    setInput(''); setShowInput(false);
  };

  return (
    <div className="flex flex-col gap-3">
      {perks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {perks.map(p => (
            <span key={p} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium"
              style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
              {p}
              <button type="button" onClick={() => remove(p)} className="ml-0.5 text-[11px] opacity-60 hover:opacity-100">✕</button>
            </span>
          ))}
        </div>
      )}
      {showInput ? (
        <div className="flex items-center gap-2">
          <input autoFocus value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') setShowInput(false); }}
            placeholder="Type perk name"
            className="flex-1 h-9 px-3 text-[13px] rounded-[4px] outline-none"
            style={{ border: '1px solid #dbdde6', color: '#253858' }} />
          <button type="button" onClick={addCustom}
            className="px-3 h-9 rounded-[4px] text-[13px] font-medium text-white"
            style={{ background: '#4f46e5' }}>Add</button>
          <button type="button" onClick={() => setShowInput(false)}
            className="text-[12px]" style={{ color: '#9ba3b5' }}>Cancel</button>
        </div>
      ) : (
        <button type="button" onClick={() => setShowInput(true)}
          className="self-start text-[13px] font-medium" style={{ color: '#4f46e5' }}>
          + Add something else
        </button>
      )}
    </div>
  );
}

/* ── industry section ─────────────────────────────────────────────────────── */
function IndustrySection({ selected, onChange }) {
  const [showInput, setShowInput] = useState(false);
  const [input, setInput]         = useState('');

  const add    = (i) => { if (!selected.includes(i)) onChange([...selected, i]); };
  const remove = (i) => onChange(selected.filter(x => x !== i));
  const addCustom = () => {
    const s = input.trim();
    if (s && !selected.includes(s)) onChange([...selected, s]);
    setInput(''); setShowInput(false);
  };

  const suggestions = INDUSTRY_OPTIONS.filter(i => !selected.includes(i)).slice(0, 5);

  return (
    <div className="flex flex-col gap-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(i => (
            <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] font-medium"
              style={{ background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
              {i}
              <button type="button" onClick={() => remove(i)} className="ml-0.5 text-[11px] opacity-60 hover:opacity-100">✕</button>
            </span>
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map(s => (
            <button key={s} type="button" onClick={() => add(s)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[13px] transition-all"
              style={{ background: '#fff', color: '#6b7794', border: '1px solid #dbdde6' }}>
              <span style={{ color: '#6366f1' }}>+</span> {s}
            </button>
          ))}
        </div>
      )}
      {showInput ? (
        <div className="flex items-center gap-2">
          <input autoFocus value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') setShowInput(false); }}
            placeholder="Type industry name"
            className="flex-1 h-9 px-3 text-[13px] rounded-[4px] outline-none"
            style={{ border: '1px solid #dbdde6', color: '#253858' }} />
          <button type="button" onClick={addCustom}
            className="px-3 h-9 rounded-[4px] text-[13px] font-medium text-white"
            style={{ background: '#4f46e5' }}>Add</button>
          <button type="button" onClick={() => setShowInput(false)}
            className="text-[12px]" style={{ color: '#9ba3b5' }}>Cancel</button>
        </div>
      ) : (
        <button type="button" onClick={() => setShowInput(true)}
          className="self-start text-[13px] font-medium" style={{ color: '#4f46e5' }}>
          + Add something else
        </button>
      )}
    </div>
  );
}

/* ── screening questions ──────────────────────────────────────────────────── */
function ScreeningQuestions({ questions, onChange }) {
  const add = () =>
    onChange([...questions, { question: '', idealAnswer: 'Yes', mustHave: true }]);

  const update = (i, key, val) => {
    const updated = [...questions];
    updated[i] = { ...updated[i], [key]: val };
    onChange(updated);
  };

  const remove = (i) => onChange(questions.filter((_, idx) => idx !== i));
  const isYesNo = (answer) => answer === 'Yes' || answer === 'No';

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q, i) => (
        <div key={i} className="rounded-[8px] p-4 flex flex-col gap-3"
          style={{ background: '#fff', border: '1px solid #e8eaf2' }}>
          <div className="flex items-start gap-2">
            <span className="text-[13px] font-bold shrink-0 pt-0.5" style={{ color: '#465166' }}>
              Q{i + 1}.
            </span>
            <input value={q.question}
              onChange={e => update(i, 'question', e.target.value)}
              placeholder="Enter screening question"
              className="flex-1 text-[13px] bg-transparent outline-none border-b pb-0.5"
              style={{ color: '#253858', borderColor: '#e8eaf2', caretColor: '#6366f1' }} />
            <button type="button" onClick={() => remove(i)}
              className="shrink-0 opacity-40 hover:opacity-80 text-[20px] leading-none"
              style={{ color: '#465166' }}>⋮</button>
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wide"
                style={{ color: '#9ba3b5' }}>Ideal answer</span>
              {isYesNo(q.idealAnswer) ? (
                <div className="flex gap-1.5 items-center">
                  {['Yes', 'No'].map(opt => (
                    <button key={opt} type="button" onClick={() => update(i, 'idealAnswer', opt)}
                      className="px-4 py-1.5 rounded-full text-[13px] font-medium transition-all"
                      style={q.idealAnswer === opt
                        ? { background: '#eef2ff', color: '#4338ca', border: '1.5px solid #6366f1' }
                        : { background: '#fff', color: '#6b7794', border: '1px solid #dbdde6' }}>
                      {opt}
                    </button>
                  ))}
                  <button type="button" onClick={() => update(i, 'idealAnswer', '')}
                    className="px-2.5 py-1 rounded-full text-[11px]"
                    style={{ color: '#9ba3b5', border: '1px solid #e9ecf0' }}>
                    Text
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input value={q.idealAnswer}
                    onChange={e => update(i, 'idealAnswer', e.target.value)}
                    placeholder="Expected answer"
                    className="w-32 h-8 px-3 text-[13px] rounded-[4px] outline-none"
                    style={{ border: '1px solid #dbdde6', color: '#253858' }} />
                  <button type="button" onClick={() => update(i, 'idealAnswer', 'Yes')}
                    className="px-2.5 py-1 rounded-full text-[11px]"
                    style={{ color: '#9ba3b5', border: '1px solid #e9ecf0' }}>
                    Yes/No
                  </button>
                </div>
              )}
            </div>

            <button type="button" onClick={() => update(i, 'mustHave', !q.mustHave)}
              className="flex items-center gap-1.5 text-[12px] font-medium shrink-0"
              style={{ color: q.mustHave ? '#4338ca' : '#9ba3b5' }}>
              <span className="flex items-center justify-center w-4 h-4 rounded"
                style={{
                  background: q.mustHave ? '#4338ca' : '#fff',
                  border: `1.5px solid ${q.mustHave ? '#4338ca' : '#cbd5e1'}`,
                }}>
                {q.mustHave && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              Must-have criteria
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={add}
        className="self-start text-[13px] font-medium" style={{ color: '#4f46e5' }}>
        + Add screening question
      </button>
    </div>
  );
}

/* ── job description ──────────────────────────────────────────────────────── */
function JobDescription({ value, onChange }) {
  const wordCount = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const MAX_WORDS = 250;

  const applyFormat = (tag) => {
    const textarea = document.getElementById('jd-textarea');
    if (!textarea) return;
    const { selectionStart: s, selectionEnd: e, value: v } = textarea;
    const selected = v.slice(s, e);
    if (!selected) return;
    let result;
    if (tag === 'b')  result = v.slice(0, s) + `**${selected}**` + v.slice(e);
    else if (tag === 'i')  result = v.slice(0, s) + `_${selected}_` + v.slice(e);
    else if (tag === 'u')  result = v.slice(0, s) + `__${selected}__` + v.slice(e);
    else if (tag === 'ul') {
      const lines = selected.split('\n').map(l => `• ${l.replace(/^[•\-]\s?/, '')}`).join('\n');
      result = v.slice(0, s) + lines + v.slice(e);
    }
    if (result !== undefined) onChange(result);
  };

  return (
    <div className="w-full rounded-[4px] overflow-hidden"
      style={{ border: '1px solid #dbdde6', background: '#fff' }}>
      <div className="flex items-center gap-1 px-3 py-2"
        style={{ borderBottom: '1px solid #f0f2fa' }}>
        {[
          { tag: 'b',  label: 'B',  extra: { fontWeight: 'bold' } },
          { tag: 'i',  label: 'I',  extra: { fontStyle: 'italic' } },
          { tag: 'u',  label: 'U',  extra: { textDecoration: 'underline' } },
          { tag: 'ul', label: '≡',  extra: {} },
        ].map(({ tag, label, extra }) => (
          <button key={tag} type="button" onClick={() => applyFormat(tag)}
            className="w-7 h-7 flex items-center justify-center rounded text-[13px] hover:bg-[#f0f2fa] transition-colors"
            style={{ color: '#465166', ...extra }}>
            {label}
          </button>
        ))}
      </div>
      <textarea
        id="jd-textarea"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a job description..."
        rows={7}
        className="w-full px-4 py-3 text-[14px] leading-[22px] resize-none outline-none placeholder-[#bcc4d3]"
        style={{ color: '#253858', background: 'transparent', caretColor: '#6366f1' }}
      />
      <div className="flex justify-end px-4 pb-2">
        <span className="text-[12px]"
          style={{ color: wordCount > MAX_WORDS ? '#ef4444' : '#9ba3b5' }}>
          {wordCount}/{MAX_WORDS}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════ main screen ══════════════════════════════ */
export default function ReviewScreen({ jobData, onSubmit, onBack }) {
  const [form, setForm] = useState({
    jobTitle:           jobData.jobTitle           || '',
    mandatorySkills:    jobData.mandatorySkills     || [],
    optionalSkills:     jobData.optionalSkills      || [],
    experienceMin:      jobData.experienceMin       ?? 0,
    experienceMax:      jobData.experienceMax       ?? 3,
    salaryMin:          jobData.salaryMin           ?? 0,
    salaryMax:          jobData.salaryMax           ?? 0,
    salaryType:         jobData.salaryType          || 'annual',
    location:           jobData.location            || '',
    qualification:      jobData.qualification       || 'Any',
    perks:              jobData.perks               || [],
    industry:           jobData.industry            || [],
    screeningQuestions: jobData.screeningQuestions  || [],
    jobDescription:     jobData.jobDescription      || '',
  });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="h-screen max-w-[420px] mx-auto flex flex-col relative"
      style={{ background: '#f4f7ff', overflow: 'clip' }}>
      {/* Bottom gradient blob */}
      <div className="absolute pointer-events-none"
        style={{
          bottom: '-254px', left: '50%', transform: 'translateX(-50%)',
          width: '418px', height: '418px', borderRadius: '50%',
          filter: 'blur(81px)', opacity: 0.7,
          background: 'radial-gradient(circle, rgba(130,80,255,0.3) 0%, rgba(99,102,241,0.2) 40%, rgba(59,130,246,0.1) 70%, transparent 100%)',
        }} />

      {/* Header */}
      <div className="flex-shrink-0 bg-white flex items-center px-5 z-10 relative"
        style={{ height: 56, borderBottom: '1px solid rgba(219,221,230,0.5)' }}>
        <button onClick={onBack} className="mr-3 text-[#465166]" aria-label="Back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span className="font-bold text-[16px] text-[#465166]">Review your job posting</span>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar z-10 flex flex-col gap-6">

        {/* Job title */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Job title</FieldLabel>
          <TextInput value={form.jobTitle} onChange={(v) => set('jobTitle', v)} placeholder="e.g. Sales Manager" />
        </div>

        {/* Skills */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Skills required for this job</FieldLabel>
          <SkillsBox
            mandatory={form.mandatorySkills}
            optional={form.optionalSkills}
            onAddMandatory={(s) => set('mandatorySkills', [...form.mandatorySkills, s])}
            onRemoveMandatory={(s) => set('mandatorySkills', form.mandatorySkills.filter(x => x !== s))}
            onAddOptional={(s) => set('optionalSkills', [...form.optionalSkills, s])}
            onRemoveOptional={(s) => set('optionalSkills', form.optionalSkills.filter(x => x !== s))}
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Job location</FieldLabel>
          <TextInput value={form.location} onChange={(v) => set('location', v)} placeholder="e.g. Delhi, Mumbai" />
        </div>

        {/* Work experience */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Work experience</FieldLabel>
          <ExperienceRange
            min={form.experienceMin} max={form.experienceMax}
            onMinChange={(v) => set('experienceMin', v)}
            onMaxChange={(v) => set('experienceMax', v)}
          />
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-3">
          <FieldLabel>{form.salaryType === 'monthly' ? 'Salary per month' : 'Salary per year'}</FieldLabel>
          <SalaryRange
            min={form.salaryMin} max={form.salaryMax}
            onMinChange={(v) => set('salaryMin', v)}
            onMaxChange={(v) => set('salaryMax', v)}
          />
        </div>

        {/* Perks & benefits */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Perks &amp; benefits</FieldLabel>
          <PerksSection perks={form.perks} onChange={(v) => set('perks', v)} />
        </div>

        {/* Qualification */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Candidate's qualification</FieldLabel>
          {/* Broad category chips */}
          <div className="flex flex-wrap gap-2">
            {QUALIFICATIONS.map((q) => (
              <button key={q} type="button"
                onClick={() => {
                  // If switching away from Graduate/PostGrad, clear the specific degree too
                  const currentBroad = toBroad(form.qualification);
                  if (q !== currentBroad) set('qualification', q);
                  else set('qualification', q); // re-select broad clears specific
                }}
                className="px-4 py-2 rounded-full text-[13px] font-medium transition-all"
                style={toBroad(form.qualification) === q
                  ? { background: '#4f46e5', color: '#fff', border: '1px solid #4f46e5' }
                  : { background: '#fff', color: '#6b7794', border: '1px solid #dbdde6' }}>
                {q}
              </button>
            ))}
          </div>
          {/* Specific degree input — shown when Graduate or Post Graduate is selected */}
          {(toBroad(form.qualification) === 'Graduate' || toBroad(form.qualification) === 'Post Graduate') && (
            <TextInput
              value={isSpecific(form.qualification) ? form.qualification : ''}
              onChange={(v) => {
                const broad = toBroad(form.qualification);
                set('qualification', v.trim() || broad);
              }}
              placeholder={`Specific degree, e.g. ${toBroad(form.qualification) === 'Graduate' ? 'B.Tech / BE, MBBS, LLB…' : 'MBA, M.Tech, CA…'}`}
            />
          )}
        </div>

        {/* Industry */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Candidate's industry you are looking to hire from</FieldLabel>
          <IndustrySection selected={form.industry} onChange={(v) => set('industry', v)} />
        </div>

        {/* Screening questions */}
        <div className="flex flex-col gap-3">
          <div>
            <FieldLabel>Screening questions</FieldLabel>
            <p className="text-[12px] mt-1" style={{ color: '#9ba3b5' }}>
              Questions asked to candidates when they apply
            </p>
          </div>
          <ScreeningQuestions
            questions={form.screeningQuestions}
            onChange={(v) => set('screeningQuestions', v)}
          />
        </div>

        {/* Job description */}
        <div className="flex flex-col gap-3">
          <FieldLabel>Job description</FieldLabel>
          <JobDescription value={form.jobDescription} onChange={(v) => set('jobDescription', v)} />
        </div>

        <div className="h-4" />
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 bg-white flex items-center justify-between px-5 z-10 relative"
        style={{ height: 84, borderTop: '1px solid rgba(219,221,230,0.5)' }}>
        <button onClick={onBack} className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: '#6b7794' }}>
          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
            <img src="/orb.gif" alt="AI" className="w-full h-full object-cover" draggable={false} />
          </div>
          Need help?
        </button>
        <button onClick={() => onSubmit(form)}
          className="flex items-center justify-center px-6 h-11 rounded-xl font-semibold text-[14px] text-white transition-all active:scale-[0.97]"
          style={{ background: '#265df5', minWidth: 149 }}>
          Post job
        </button>
      </div>
    </div>
  );
}
