import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-cyan-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
          <span className="h-2 w-2 rounded-full bg-cyan-300" />
          Built for Cohere and Vercel
        </div>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-white md:text-7xl">
          Resume Review + Job Match Copilot
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
          Upload a resume, paste a job description, and get a clean, actionable analysis with
          match scoring, keyword gaps, and rewrite suggestions.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/analyze"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
          >
            Start analysis
          </Link>
          <div className="rounded-xl border border-slate-700 bg-white/5 px-6 py-3 text-slate-200">
            Deploy-ready Next.js app
          </div>
        </div>
      </section>
    </main>
  );
}
