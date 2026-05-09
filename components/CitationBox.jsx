"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Quote } from "lucide-react";
import { generateApaCitation, generateBibtex } from "@/lib/citations";

export function CitationBox({ article }) {
  const [format, setFormat] = useState("apa");
  const [copied, setCopied] = useState(false);
  const citation = useMemo(() => format === "apa" ? generateApaCitation(article) : generateBibtex(article), [article, format]);

  async function copyCitation() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section id="citation" className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-xl font-extrabold text-primary dark:text-white"><Quote size={20} /> Citation</h3>
        <div className="flex rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          {["apa", "bibtex"].map((item) => (
            <button key={item} onClick={() => setFormat(item)} className={`rounded px-3 py-1.5 text-xs font-extrabold uppercase ${format === item ? "bg-primary text-white" : "text-slate-600 dark:text-slate-300"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{citation}</pre>
      <button onClick={copyCitation} className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-accent">
        {copied ? <Check size={17} /> : <Clipboard size={17} />} {copied ? "Copied" : "Copy citation"}
      </button>
    </section>
  );
}
