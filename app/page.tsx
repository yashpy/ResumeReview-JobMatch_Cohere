import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">Cohere Project</p>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-6xl">
          Resume Review + Job Match Copilot
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Upload a resume, paste a job description, and receive a practical match score,
          keyword gaps, and rewritten bullet suggestions powered by semantic analysis.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/analyze"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Start analysis
          </Link>
          <a
            href="https://www.cohere.com/"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-500"
          >
            Learn about Cohere
          </a>
        </div>
      </section>
    </main>
  );
}
