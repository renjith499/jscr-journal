import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Gamepad2,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Research Tools | JSCR",
  description:
    "Browser-based tools for extracting research data and preparing engineering models.",
};

const categories = [
  {
    title: "Data Extraction",
    text: "Recover usable numeric data from published evidence.",
    tools: [
      {
        title: "Graph Digitizer",
        href: "/tools/graph-digitizer",
        text: "Recover numerical datasets from published graph images with calibrated axes, multiple curves and CSV or Excel export.",
        Icon: ScanSearch,
      },
    ],
  },
  {
    title: "Engineering Models",
    text: "Generate auditable engineering properties and ready-to-use Abaqus material cards from transparent equations.",
    tools: [
      {
        title: "Material Models",
        href: "/tools/material-models",
        text: "Open one material-model workspace for CDP, steel and composite calculators, saved materials, and combined Abaqus downloads.",
        Icon: Atom,
      },
    ],
  },
  {
    title: "Learning & Outreach",
    text: "Interactive lessons that make core concepts approachable for younger students.",
    tools: [
      {
        title: "Mahi's Vault",
        href: "/tools/mahis-vault",
        text: "A cinematic platformer for young learners: solve arithmetic gates, time temple traps, and collect Data Cores that teach the history and generations of computers.",
        Icon: Gamepad2,
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <main className="min-h-[75vh] bg-paper px-5 py-16 dark:bg-slate-950 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">
          JSCR Research Platform
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-primary dark:text-white sm:text-5xl">
          Tools for Research
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Practical browser-based utilities for turning published evidence into
          usable data and preparing reproducible engineering models.
        </p>
        {categories.map((category) => (
          <div key={category.title} className="mt-12 first:mt-10">
            <h2 className="text-xl font-extrabold text-primary dark:text-white">
              {category.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {category.text}
            </p>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              {category.tools.map(({ title, href, text, Icon }) => (
                <Link
                  key={title}
                  href={href}
                  className="group rounded-xl border border-slate-200 bg-white p-7 shadow-card transition hover:-translate-y-1 hover:border-accent dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
                      <Icon size={27} />
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-extrabold tracking-wider text-slate-500 dark:bg-slate-800">
                      {category.title.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="mt-7 text-2xl font-extrabold text-primary dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
                    {text}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-extrabold text-accent">
                    Open tool{" "}
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-12 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <ShieldCheck className="text-accent" />
          <span>
            Research files and calculations stay in your browser unless a tool
            explicitly says otherwise.
          </span>
        </div>
      </div>
    </main>
  );
}
