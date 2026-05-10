"use client";

import { useMemo, useState } from "react";
import { Check, Clipboard, Download, FileCode2, Plus, Trash2 } from "lucide-react";

const categories = ["FEA", "CFD", "Composite Materials", "Robotics", "Renewable Energy", "Mathematics", "AI in Engineering"];

const initialArticle = {
  title: "",
  authors: "",
  date: new Date().toISOString().slice(0, 10),
  category: "FEA",
  abstract: "",
  keywords: "",
  thumbnail: "/images/cad-engineering-design.jpg",
  doi: "",
  pdf: "/pdfs/article-file.pdf",
  introduction: "",
  methodology: "",
  results: "",
  conclusion: "",
  references: "",
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "new-jscr-article";
}

function frontmatterArray(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `"${item.replaceAll('"', '\\"')}"`)
    .join(", ");
}

function clean(value) {
  return value.replaceAll('"', '\\"').trim();
}

function buildMarkdown(article, sections) {
  const bodySections = sections
    .filter((section) => section.heading.trim() || section.content.trim())
    .map((section) => `## ${section.heading.trim() || "Section"}\n\n${section.content.trim() || "Add section content here."}`)
    .join("\n\n");

  const references = article.references
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => `${index + 1}. ${line.replace(/^\d+\.\s*/, "")}`)
    .join("\n");

  return `---\ntitle: "${clean(article.title) || "Untitled JSCR Article"}"\nauthors: [${frontmatterArray(article.authors)}]\ndate: "${article.date}"\ncategory: "${article.category}"\nabstract: "${clean(article.abstract)}"\nkeywords: [${frontmatterArray(article.keywords)}]\nthumbnail: "${clean(article.thumbnail)}"\ndoi: "${clean(article.doi)}"\npdf: "${clean(article.pdf)}"\n---\n\n# ${article.title.trim() || "Untitled JSCR Article"}\n\n## Introduction\n\n${article.introduction.trim() || "Add introduction here."}\n\n## Methodology\n\n${article.methodology.trim() || "Add methodology here."}\n\n## Results and Discussion\n\n${article.results.trim() || "Add results and discussion here."}\n\n${bodySections ? `${bodySections}\n\n` : ""}## Conclusion\n\n${article.conclusion.trim() || "Add conclusion here."}\n\n## References\n\n${references || "1. Add reference here."}\n`;
}

function inputClass() {
  return "w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-950";
}

export function MarkdownBuilder() {
  const [article, setArticle] = useState(initialArticle);
  const [sections, setSections] = useState([]);
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => slugify(article.title), [article.title]);
  const markdown = useMemo(() => buildMarkdown(article, sections), [article, sections]);

  function updateField(name, value) {
    setArticle((current) => ({ ...current, [name]: value }));
  }

  function addSection() {
    setSections((current) => [...current, { id: crypto.randomUUID(), heading: "New Section", content: "" }]);
  }

  function updateSection(id, field, value) {
    setSections((current) => current.map((section) => (section.id === id ? { ...section, [field]: value } : section)));
  }

  function removeSection(id) {
    setSections((current) => current.filter((section) => section.id !== id));
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function downloadMarkdown() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Article Markdown Builder</p>
          <h2 className="mt-2 text-2xl font-extrabold text-primary dark:text-white">Create upload-ready JSCR markdown</h2>
          <div className="mt-4 grid gap-2 rounded-md border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-primary dark:border-cyan-900 dark:bg-slate-900 dark:text-cyan-100">
            <p>Upload generated markdown files to <span className="font-extrabold">articles/</span>.</p>
            <p>Upload article images to <span className="font-extrabold">public/images/</span> and use paths like <span className="font-extrabold">/images/figure.png</span>.</p>
            <p>Upload PDFs to <span className="font-extrabold">public/pdfs/</span> and use paths like <span className="font-extrabold">/pdfs/article.pdf</span>.</p>
          </div>
        </div>

        <div className="grid gap-5 p-6">
          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Article title</span>
            <input className={inputClass()} value={article.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Finite Element Analysis of FRP Cooling Towers" />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Authors, separated by commas</span>
            <input className={inputClass()} value={article.authors} onChange={(event) => updateField("authors", event.target.value)} placeholder="Renjith R, A. Kumar" />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Date</span>
              <input type="date" className={inputClass()} value={article.date} onChange={(event) => updateField("date", event.target.value)} />
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Category</span>
              <select className={inputClass()} value={article.category} onChange={(event) => updateField("category", event.target.value)}>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </label>
          </div>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Abstract</span>
            <textarea rows={5} className={inputClass()} value={article.abstract} onChange={(event) => updateField("abstract", event.target.value)} placeholder="Short summary of the paper." />
          </label>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Keywords, separated by commas</span>
            <input className={inputClass()} value={article.keywords} onChange={(event) => updateField("keywords", event.target.value)} placeholder="FEA, FRP, Cooling Tower" />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Thumbnail path</span>
              <input className={inputClass()} value={article.thumbnail} onChange={(event) => updateField("thumbnail", event.target.value)} placeholder="/images/cad-engineering-design.jpg" />
              <span className="mt-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Use /images/file-name.ext after uploading the image to public/images.</span>
            </label>
            <label>
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">DOI</span>
              <input className={inputClass()} value={article.doi} onChange={(event) => updateField("doi", event.target.value)} placeholder="10.1000/example" />
            </label>
          </div>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">PDF path or URL</span>
            <input className={inputClass()} value={article.pdf} onChange={(event) => updateField("pdf", event.target.value)} placeholder="/pdfs/article.pdf" />
            <span className="mt-2 block text-xs font-semibold text-slate-500 dark:text-slate-400">Use /pdfs/file-name.pdf after uploading the PDF to public/pdfs. Leave blank if no PDF is available.</span>
          </label>

          {[
            ["introduction", "Introduction"],
            ["methodology", "Methodology"],
            ["results", "Results and Discussion"],
            ["conclusion", "Conclusion"],
          ].map(([name, label]) => (
            <label key={name}>
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
              <textarea rows={5} className={inputClass()} value={article[name]} onChange={(event) => updateField(name, event.target.value)} placeholder={`Write ${label.toLowerCase()} content here.`} />
            </label>
          ))}

          <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-extrabold text-primary dark:text-white">Additional sections</h3>
              <button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">
                <Plus size={16} /> Add Section
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
                  <div className="mb-3 flex gap-3">
                    <input className={inputClass()} value={section.heading} onChange={(event) => updateSection(section.id, "heading", event.target.value)} />
                    <button type="button" onClick={() => removeSection(section.id)} className="rounded-md border border-red-200 px-3 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950" aria-label="Remove section">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <textarea rows={4} className={inputClass()} value={section.content} onChange={(event) => updateSection(section.id, "content", event.target.value)} placeholder="Section content." />
                </div>
              ))}
            </div>
          </div>

          <label>
            <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">References, one per line</span>
            <textarea rows={6} className={inputClass()} value={article.references} onChange={(event) => updateField("references", event.target.value)} placeholder="Author, A. Paper title. Journal, Year." />
          </label>
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Output file</p>
                <h3 className="mt-1 font-extrabold text-primary dark:text-white">articles/{slug}.md</h3>
              </div>
              <FileCode2 className="text-accent" />
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <button type="button" onClick={copyMarkdown} className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-4 py-3 text-sm font-bold text-primary transition hover:border-accent hover:text-accent dark:border-slate-700 dark:text-white">
              {copied ? <Check size={18} /> : <Clipboard size={18} />} {copied ? "Copied" : "Copy"}
            </button>
            <button type="button" onClick={downloadMarkdown} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent">
              <Download size={18} /> Download
            </button>
          </div>
          <textarea readOnly value={markdown} className="h-[720px] w-full resize-none border-0 border-t border-slate-200 bg-slate-950 p-5 font-mono text-xs leading-6 text-cyan-50 outline-none dark:border-slate-800" />
        </div>
      </aside>
    </div>
  );
}
