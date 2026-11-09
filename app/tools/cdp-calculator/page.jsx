import { Calculator, FileDown, LineChart, ShieldCheck } from "lucide-react";
import { CDPStudio } from "@/components/cdp-studio/CDPStudio";

const canonicalUrl = "https://www.jscr.in/tools/cdp-calculator";

export const metadata = {
  title: "Abaqus CDP Calculator – Concrete Damaged Plasticity",
  description: "Free Abaqus Concrete Damaged Plasticity (CDP) calculator. Generate compression hardening, tension stiffening, damage parameters and validated Abaqus material input tables.",
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    url: canonicalUrl,
    title: "Abaqus CDP Calculator – Concrete Damaged Plasticity",
    description: "Generate and validate Concrete Damaged Plasticity material data for Abaqus, including compression, tension and damage tables.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "JSCR Abaqus CDP Calculator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Abaqus CDP Calculator – Concrete Damaged Plasticity",
    description: "Generate validated Abaqus Concrete Damaged Plasticity material data in your browser.",
    images: ["/twitter-image"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${canonicalUrl}#application`,
      name: "Abaqus CDP Calculator",
      alternateName: "Concrete Damaged Plasticity Calculator",
      url: canonicalUrl,
      applicationCategory: "ScientificApplication",
      applicationSubCategory: "Finite Element Material Modelling",
      operatingSystem: "Any operating system with a modern web browser",
      browserRequirements: "JavaScript enabled",
      isAccessibleForFree: true,
      description: "A browser-based calculator for generating and validating Abaqus Concrete Damaged Plasticity material input data.",
      featureList: ["Concrete compression hardening data", "Concrete tension stiffening data", "Compression and tension damage variables", "Abaqus input-file export", "Abaqus material-library export"],
      provider: { "@id": "https://www.jscr.in/#organization" },
      inLanguage: "en-IN",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://www.jscr.in" },
        { "@type": "ListItem", position: 2, name: "Research Tools", item: "https://www.jscr.in/tools" },
        { "@type": "ListItem", position: 3, name: "Material Models", item: "https://www.jscr.in/tools/material-models" },
        { "@type": "ListItem", position: 4, name: "CDP Calculator", item: canonicalUrl },
      ],
    },
  ],
};

export default function CDPCalculatorPage() {
  return (
    <main className="bg-paper dark:bg-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Tools for Research</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-primary dark:text-white sm:text-5xl">Abaqus Concrete Damaged Plasticity (CDP) Calculator</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Build an auditable Abaqus Concrete Damaged Plasticity material definition. Inspect compression and tension response, catch invalid plastic-strain tables, and export a ready-to-use material input card.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:pt-8">
            {[["Calculate", "Generate constitutive curves from measured concrete properties.", Calculator], ["Inspect", "Review response plots and Abaqus validation checks.", LineChart], ["Export", "Download a consistent N–mm–MPa material card.", FileDown]].map(([title, text, Icon]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100"><Icon size={22} /></div>
                <h2 className="font-extrabold text-primary dark:text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 text-sm text-primary dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100"><ShieldCheck size={20} /><span>Calculations run locally in your browser. No material data is uploaded.</span></div>
          <CDPStudio />
        </div>
      </section>
      <section className="border-t border-slate-200 bg-white px-5 py-14 dark:border-slate-800 dark:bg-slate-900 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-extrabold text-primary dark:text-white">What the Abaqus CDP calculator generates</h2>
          <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">The calculator converts concrete material inputs into the tabular data required by the Abaqus Concrete Damaged Plasticity model. It prepares concrete compression hardening, concrete tension stiffening, compression damage and tension damage data while checking the strain definitions expected by Abaqus.</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"><h3 className="font-extrabold text-primary dark:text-white">CDP material verification</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Review stress–strain and damage curves before export. The validation checks help identify non-monotonic tables, invalid damage values and incorrect first-yield inelastic or cracking strains.</p></div>
            <div className="rounded-lg border border-slate-200 p-6 dark:border-slate-700"><h3 className="font-extrabold text-primary dark:text-white">Abaqus-ready exports</h3><p className="mt-2 leading-7 text-slate-600 dark:text-slate-300">Export an Abaqus input material card or material-library file after signing in with a verified account. The generated values use a consistent N–mm–MPa unit system.</p></div>
          </div>
          <h2 className="mt-10 text-2xl font-extrabold text-primary dark:text-white">How to use the CDP material data</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-7 text-slate-600 dark:text-slate-300">
            <li>Enter the concrete elastic and strength properties and review the generated response.</li>
            <li>Check the compression, tension and damage tables for physically consistent behaviour.</li>
            <li>Download the material definition and import or include it in the Abaqus model.</li>
            <li>Calibrate the model against appropriate experimental results before using it in predictive analysis.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
