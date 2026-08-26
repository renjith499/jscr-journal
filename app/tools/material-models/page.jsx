import Link from "next/link";
import { ArrowRight, Atom, Boxes, Building2, Calculator } from "lucide-react";
import { MaterialLibraryPanel } from "@/components/material-models/MaterialLibraryPanel";

export const metadata = {
  title: "Material Models | JSCR",
  description:
    "Generate CDP, steel and composite material definitions and combine saved materials into an Abaqus library.",
};

const tools = [
  {
    title: "CDP Calculator",
    href: "/tools/cdp-calculator",
    text: "Generate and validate Abaqus Concrete Damaged Plasticity material cards.",
    Icon: Building2,
  },
  {
    title: "Steel Calculator",
    href: "/tools/steel-calculator",
    text: "Generate isotropic elastic-plastic steel properties and hardening data.",
    Icon: Calculator,
  },
  {
    title: "Composite Property Calculator",
    href: "/tools/composite-property-calculator",
    text: "Compare homogenization methods and export orthotropic engineering constants.",
    Icon: Boxes,
  },
];

export default function MaterialModelsPage() {
  return (
    <main className="min-h-[75vh] bg-paper px-5 py-16 dark:bg-slate-950 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100"><Atom size={34} /></div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Tools for Research</p>
            <h1 className="mt-1 text-4xl font-extrabold text-primary dark:text-white">Material Models</h1>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Create, compare and export engineering material definitions from one workspace. Save materials locally and combine CDP, steel and composite models into one Abaqus material library.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tools.map(({ title, href, text, Icon }) => (
            <Link key={title} href={href} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-accent dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100"><Icon size={24} /></div>
              <h2 className="mt-5 text-xl font-extrabold text-primary dark:text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              <span className="mt-5 flex items-center gap-2 text-sm font-extrabold text-accent">Open calculator <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
        <MaterialLibraryPanel />
      </div>
    </main>
  );
}
