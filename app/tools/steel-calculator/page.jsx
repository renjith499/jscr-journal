import { Calculator, FileDown, LineChart, ShieldCheck } from "lucide-react";
import { SteelStudio } from "@/components/steel-studio/SteelStudio";

export const metadata = {
  title: "Steel Calculator | JSCR",
  description: "Generate and validate Abaqus isotropic elastic-plastic steel material cards in the browser.",
};

export default function SteelCalculatorPage() {
  return (
    <main className="bg-paper dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Tools for Research</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">Steel Calculator</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Build an auditable Abaqus isotropic elastic-plastic steel material definition. Enter yield strength,
              ultimate strength and elongation — or pick a typical grade — and get a validated *ELASTIC/*PLASTIC
              card ready to paste into an input file.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:pt-8">
            {[
              ["Calculate", "Convert engineering properties into a true-stress hardening curve.", Calculator],
              ["Inspect", "Review the response plot and Abaqus validation checks.", LineChart],
              ["Export", "Download a consistent N–mm–MPa material card.", FileDown],
            ].map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
                  <Icon size={22} />
                </div>
                <h2 className="font-extrabold text-primary dark:text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-primary dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100">
            <ShieldCheck size={20} />
            <span>Calculations run locally in your browser. No material data is uploaded.</span>
          </div>
          <SteelStudio />
        </div>
      </section>
    </main>
  );
}
