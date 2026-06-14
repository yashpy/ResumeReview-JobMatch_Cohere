"use client";

import { ChangeEvent, useMemo, useState } from 'react';

type AnalysisResult = {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

const STOPWORDS = new Set([
  'the','and','for','with','that','this','from','you','are','your','will','have','has','had','our','their','they','them','not','but','can','all','any','job','role','team','skills','skill','experience','years','year','able','ability','using','use','used','working','work','build','built','design','designed','responsible','responsibilities','requirements','about','into','across','including','etc','a','an','to','of','in','on','at','as','is','it','be','by','or','we'
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
  const coverage = overlaps.length / Math.max(new Set(jobTokens).size, 1);
  const score = Math.min(98, Math.max(40, Math.round(coverage * 100 + 20)));

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
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Resume Review + Job Match</h1>
            <p className="mt-2 text-slate-300">Upload your resume PDF, paste a job description, and generate a fit analysis.</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Status</p>
            <p className="mt-1 text-sm text-white">Vercel-ready</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <label className="block text-sm font-semibold text-slate-200">Upload resume PDF</label>
            <input type="file" accept="application/pdf" onChange={handleUpload} className="mt-3 block w-full text-sm text-slate-300" />
            {loading && <p className="mt-3 text-sm text-cyan-300">Extracting resume text...</p>}
            <label className="mt-6 block text-sm font-semibold text-slate-200">Extracted resume text</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="mt-3 h-[26rem] w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Resume text will appear here, or paste manually."
            />
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <label className="block text-sm font-semibold text-slate-200">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-3 h-[26rem] w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Paste the job description here..."
            />
            <button
              onClick={handleAnalyze}
              className="mt-5 inline-flex items-center rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Analyze match
            </button>
            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          </section>
        </div>

        {result && (
          <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-white">Results</h2>
                <p className="mt-2 text-slate-400">Actionable feedback based on keyword overlap and coverage.</p>
              </div>
              <div className="rounded-2xl bg-cyan-400/10 px-5 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Match score</p>
                <p className="text-4xl font-bold text-cyan-300">{result.score}%</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="font-semibold text-white">Strengths</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.strengths.length ? result.strengths.map((item) => <li key={item}>• {item}</li>) : <li>No clear keyword overlap yet.</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <h3 className="font-semibold text-white">Gaps</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {result.gaps.length ? result.gaps.map((item) => <li key={item}>• {item}</li>) : <li>Few obvious keyword gaps.</li>}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
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
