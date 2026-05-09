import { CheckCircle2, ChevronRight, FileText } from "lucide-react";

export function HeroSection() {
  return (
    <section id="home" className="bg-paper dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1fr_0.86fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-white px-3 py-1.5 text-sm font-bold text-primary shadow-sm dark:border-cyan-900 dark:bg-slate-900 dark:text-cyan-100">
            <CheckCircle2 size={16} className="text-accent" />
            GitHub-powered engineering publishing
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl lg:text-6xl">
            Engineering & Scientific Research Platform
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Publish, explore, and discover high-quality scientific and technical articles.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#articles" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent">
              Explore Articles <ChevronRight size={18} />
            </a>
            <a href="/submit-paper" className="inline-flex items-center justify-center gap-2 rounded-md border border-primary/25 bg-white px-6 py-3.5 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent dark:bg-slate-900 dark:text-white">
              Submit Paper <FileText size={18} />
            </a>
          </div>
        </div>

        <div className="relative min-h-[360px] rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="absolute inset-5 rounded-md contour-lines" />
          <div className="relative flex h-full min-h-[320px] flex-col justify-between rounded-md border border-white/60 p-5">
            <div className="grid grid-cols-3 gap-3">
              {["Markdown", "REST API", "Versioned"].map((label, index) => (
                <div key={label} className="rounded-md bg-white/85 p-3 shadow-sm backdrop-blur dark:bg-slate-950/75">
                  <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${62 + index * 12}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <svg viewBox="0 0 520 260" className="mx-auto mt-4 h-56 w-full max-w-xl" aria-hidden="true">
              <defs>
                <linearGradient id="surface" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1E3A5F" stopOpacity="0.36" />
                </linearGradient>
              </defs>
              <path d="M34 202 C92 110, 156 238, 222 130 C286 26, 348 200, 486 82 L486 230 L34 230 Z" fill="url(#surface)" />
              <path d="M34 202 C92 110, 156 238, 222 130 C286 26, 348 200, 486 82" fill="none" stroke="#1E3A5F" strokeWidth="4" />
              <path d="M42 222 L490 222 M76 182 L448 182 M110 142 L408 142 M150 102 L370 102" stroke="#00B4D8" strokeWidth="1.5" opacity="0.45" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
