import { ClipboardCheck, GitBranch, MailCheck } from "lucide-react";
import { SubmitPaperForm } from "@/components/SubmitPaperForm";

export const metadata = {
  title: "Submit Paper | JSCR",
  description: "Submit a scientific or engineering manuscript to JSCR.",
};

export default function SubmitPaperPage() {
  return (
    <main className="bg-paper dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">JSCR Editorial Portal</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">
              Submit a scientific or engineering manuscript
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Share article metadata, author details, abstract, keywords, and manuscript links for editorial screening and publication preparation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:pt-8">
            {[
              ["Metadata", "Structured article details for indexing.", ClipboardCheck],
              ["GitHub-ready", "Markdown and repository links supported.", GitBranch],
              ["Editorial email", "Creates a complete submission summary.", MailCheck],
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
                  <Icon size={22} />
                </div>
                <h2 className="text-base font-extrabold text-primary dark:text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <SubmitPaperForm />
        </div>
      </section>
    </main>
  );
}
