"use client";

import { ChangeEvent, useMemo, useState } from 'react';

type AnalysisResult = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

const STOPWORDS = new Set([
  'the','and','for','with','that','this','from','you','are','your','will','have','has','had','our','their','they','them','not','but','can','all','any','job','role','team','skills','skill','experience','years','year','able','ability','using','use','used','working','work','build','built','design','designed','responsible','responsibilities','requirements','about','into','across','across','including','including','etc','a','an','to','of','in','on','at','as','is','it','be','by','or','we'
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.#\-\s]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function analyze(resume: string, job: string): AnalysisResult {
  const resumeTokens = tokenize(resume);
  const jobTokens = tokenize(job);
  const resumeSet = new Set(resumeTokens);

  const overlaps = unique(jobTokens.filter((token) => resumeSet.has(token)));
  const gaps = unique(jobTokens.filter((token) => !resumeSet.has(token))).slice(0, 12);

  const score = Math.min(98, Math.round((overlaps.length / Math.max(jobTokens.length, 1)) * 100 + 25));

  return {
    score,
    strengths: overlaps.slice(0, 10),
    gaps,
    suggestions: [
      'Mirror the most relevant keywords from the job description in your summary and experience bullets.',
      'Add one quantified impact statement for each major project or internship.',
      'Highlight technologies that directly match the role, especially backend, cloud, and AI tooling if relevant.',
    ],
  };
}

async function extractPdfText(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/extract-resume', { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Failed to extract PDF text');
  const data = await res.json();
  return data.text as string;
}

export default function AnalyzePage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const canAnalyze = useMemo(() => resumeText.trim().length > 0 && jobDescription.trim().length > 0, [resumeText, jobDescription]);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const text = await extractPdfText(file);
      setResumeText(text);
    } catch {
      setError('Could not read the PDF. Please try another resume file.');
    } finally {
      setLoading(false);
    }
  }

  function handleAnalyze() {
    setError('');
    if (!canAnalyze) {
      setError('Please provide both a resume and a job description.');
      return;
    }
    setResult(analyze(resumeText, jobDescription));
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-white">Resume Review + Job Match</h1>
        <p className="mt-2 text-slate-300">Upload your resume PDF, paste a job description, and generate a fit analysis.</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="block text-sm font-semibold text-slate-200">Upload resume PDF</label>
            <input type="file" accept="application/pdf" onChange={handleUpload} className="mt-3 block w-full text-sm text-slate-300" />
            {loading && <p className="mt-3 text-sm text-cyan-300">Extracting resume text...</p>}
            <label className="mt-6 block text-sm font-semibold text-slate-200">Extracted resume text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="mt-3 h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none"
              placeholder="Resume text will appear here, or paste manually."
            />
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <label className="block text-sm font-semibold text-slate-200">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-3 h-72 w-full rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none"
              placeholder="Paste the job description here..."
            />
            <button
              onClick={handleAnalyze}
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Analyze match
            </button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </section>
        </div>

        {result && (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Results</h2>
            <p className="mt-3 text-lg text-cyan-300">Match score: {result.score}%</p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-white">Strengths</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.strengths.length ? result.strengths.map((item) => <li key={item}>• {item}</li>) : <li>No clear keyword overlap yet.</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">Gaps</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.gaps.length ? result.gaps.map((item) => <li key={item}>• {item}</li>) : <li>Few obvious keyword gaps.</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-white">Suggestions</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.suggestions.map((item) => <li key={item}>• {item}</li>)}
                </ul>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
