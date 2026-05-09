"use client";

export default function Error({ error, reset }) {
  return (
    <main className="bg-paper py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-5">
        <div className="rounded-lg border border-red-200 bg-white p-8 shadow-card dark:border-red-900 dark:bg-slate-900">
          <h1 className="text-2xl font-extrabold text-primary dark:text-white">Article platform error</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{error?.message || "The content could not be loaded."}</p>
          <button onClick={reset} className="mt-6 rounded-md bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-accent">
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
