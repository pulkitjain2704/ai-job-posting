import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
  defaultHeaders: {
    // Required for PDF document parsing support
    'anthropic-beta': 'pdfs-2024-09-25',
  },
});

const PARSE_PROMPT = `You are extracting job posting information from a document.
The document is either a candidate's CV/Resume or a Job Description.

Extract the following fields. Return null for anything not found.
For salary: if it looks annual (lakhs, LPA, per annum, CTC) set salaryType="annual". If monthly (per month, /month, pm) set salaryType="monthly".

Return ONLY valid JSON, no markdown, no explanation:
{
  "documentType": "cv" or "jd",
  "jobTitle": null,
  "mandatorySkills": [],
  "optionalSkills": [],
  "experienceMin": null,
  "experienceMax": null,
  "salaryMin": null,
  "salaryMax": null,
  "salaryType": "annual",
  "location": null,
  "qualification": null
}`;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function parseDocument(file) {
  // Detect PDF by MIME type OR extension (some browsers report octet-stream)
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = !isPdf && (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif)$/i.test(file.name));

  let content;

  if (isPdf) {
    const base64 = await fileToBase64(file);
    content = [
      { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } },
      { type: 'text', text: PARSE_PROMPT },
    ];
  } else if (isImage) {
    const base64 = await fileToBase64(file);
    const mediaType = file.type === 'image/jpg' ? 'image/jpeg' : (file.type || 'image/jpeg');
    content = [
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
      { type: 'text', text: PARSE_PROMPT },
    ];
  } else {
    // Plain text / fallback
    const text = await fileToText(file);
    content = [{ type: 'text', text: `${PARSE_PROMPT}\n\nDocument:\n${text}` }];
  }

  // Retry up to 3 times on 529 overloaded errors
  let response;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await client.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content }],
      });
      break; // success
    } catch (err) {
      const is529 = err?.status === 529 || err?.message?.includes('overloaded');
      if (is529 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 2000 * (attempt + 1))); // 2s, 4s
        continue;
      }
      throw err;
    }
  }

  const raw = response.content[0].text.trim();
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Could not parse document response as JSON');
  }
}
