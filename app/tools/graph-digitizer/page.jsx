import { LineChart, Ruler, Table2 } from "lucide-react";
import { GraphDigitizerApp } from "@/components/graph-digitizer/GraphDigitizerApp";

export const metadata = {
  title: "Graph Digitizer | JSCR",
  description: "Extract data points from published graph images directly in the browser — calibrate axes, digitize curves, and export to CSV or Excel.",
};

export default function GraphDigitizerPage() {
  return (
    <main className="bg-paper dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Research Tools</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">
              Graph Digitizer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Recover numeric data from a figure in a paper. Upload the image, calibrate the axes, click along the
              curve, and export the digitized values — your graph image and points stay in your browser. We'll ask
              for an email once before your first export, just to understand how the tool gets used.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:pt-8">
            {[
              ["Calibrate", "Two clicks per axis maps pixels to real values.", Ruler],
              ["Digitize", "Click along a curve; drag or edit any point after.", Table2],
              ["Compare & export", "Overlay multiple curves and export CSV or Excel.", LineChart],
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
        <div className="mx-auto max-w-7xl">
          <GraphDigitizerApp />
        </div>
      </section>
    </main>
  );
}
