"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FileArchive, FileText, Mail, Send, ShieldCheck, UploadCloud } from "lucide-react";

const categories = ["FEA", "CFD", "Composite Materials", "Robotics", "Renewable Energy", "Mathematics", "AI in Engineering"];
const articleTypes = ["Research Article", "Technical Report", "Review Paper", "Case Study", "Short Communication"];

const initialForm = {
  title: "",
  articleType: "Research Article",
  category: "FEA",
  authors: "",
  correspondingAuthor: "",
  email: "",
  phone: "",
  affiliation: "",
  orcid: "",
  abstract: "",
  keywords: "",
  doi: "",
  manuscriptUrl: "",
  pdfUrl: "",
  comments: "",
  manuscriptFileName: "",
  supplementaryFileNames: "",
  openAccess: true,
  peerReviewed: false,
  ethics: false,
};

function fieldClass(hasError) {
  return [
    "w-full rounded-md border bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400",
    "focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-cyan-950",
    hasError ? "border-red-300" : "border-slate-200 dark:border-slate-700",
  ].join(" ");
}

export function SubmitPaperForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const editorialEmail = "desyngoresearch@gmail.com";

  const abstractCount = useMemo(() => form.abstract.trim().split(/\s+/).filter(Boolean).length, [form.abstract]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Article title is required.";
    if (!form.authors.trim()) nextErrors.authors = "Add all author names.";
    if (!form.correspondingAuthor.trim()) nextErrors.correspondingAuthor = "Corresponding author is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Use a valid email address.";
    if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";
    if (!form.affiliation.trim()) nextErrors.affiliation = "Institution or organization is required.";
    if (form.abstract.trim() && abstractCount < 25) nextErrors.abstract = "Abstract should be at least 25 words if provided.";
    if (!form.manuscriptFileName && !form.manuscriptUrl.trim()) nextErrors.manuscriptFileName = "Select a manuscript file or provide a manuscript URL.";
    if (!form.ethics) nextErrors.ethics = "Confirm the submission declaration.";
    return nextErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const body = [
      "New JSCR manuscript submission",
      "",
      `Title: ${form.title}`,
      `Article type: ${form.articleType}`,
      `Category: ${form.category}`,
      `Authors: ${form.authors}`,
      `Corresponding author: ${form.correspondingAuthor}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Affiliation: ${form.affiliation}`,
      `ORCID: ${form.orcid || "Not provided"}`,
      `DOI / preprint: ${form.doi || "Not provided"}`,
      `Keywords: ${form.keywords || "Not provided"}`,
      `Open access: ${form.openAccess ? "Yes" : "No"}`,
      `Peer reviewed previously: ${form.peerReviewed ? "Yes" : "No"}`,
      `Markdown / repository URL: ${form.manuscriptUrl || "Not provided"}`,
      `PDF URL: ${form.pdfUrl || "Not provided"}`,
      `Selected manuscript file: ${form.manuscriptFileName || "Not selected"}`,
      `Selected supplementary files: ${form.supplementaryFileNames || "Not selected"}`,
      "",
      "Abstract:",
      form.abstract || "Not provided",
      "",
      "Notes:",
      form.comments || "None",
      "",
      "Please attach the selected manuscript, figures, and any supplementary files before sending this email.",
    ].join("\n");

    const mailto = `mailto:${editorialEmail}?subject=${encodeURIComponent(`JSCR Submission: ${form.title}`)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    window.location.href = mailto;
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Manuscript Submission</p>
            <h2 className="mt-2 text-2xl font-extrabold text-primary dark:text-white">Submit Paper</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm font-bold text-primary dark:border-cyan-900 dark:bg-slate-900 dark:text-cyan-100">
            <ShieldCheck size={17} className="text-accent" />
            Editorial screening form
          </div>
        </div>
      </div>

      {submitted && (
        <div className="mx-6 mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <CheckCircle2 className="mr-2 inline h-5 w-5" />
          Submission details prepared. Your email client should open with the completed manuscript summary.
        </div>
      )}

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Article title</span>
          <input className={fieldClass(errors.title)} value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Finite Element Analysis of FRP Cooling Towers" />
          {errors.title && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.title}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Article type</span>
          <select className={fieldClass()} value={form.articleType} onChange={(event) => updateField("articleType", event.target.value)}>
            {articleTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Research category</span>
          <select className={fieldClass()} value={form.category} onChange={(event) => updateField("category", event.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>

        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Authors</span>
          <input className={fieldClass(errors.authors)} value={form.authors} onChange={(event) => updateField("authors", event.target.value)} placeholder="Renjith R, A. Kumar, S. Menon" />
          {errors.authors && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.authors}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Corresponding author</span>
          <input className={fieldClass(errors.correspondingAuthor)} value={form.correspondingAuthor} onChange={(event) => updateField("correspondingAuthor", event.target.value)} placeholder="Renjith R" />
          {errors.correspondingAuthor && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.correspondingAuthor}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
          <input type="email" className={fieldClass(errors.email)} value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="author@example.com" />
          {errors.email && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.email}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Phone number</span>
          <input type="tel" className={fieldClass(errors.phone)} value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91 98765 43210" />
          {errors.phone && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.phone}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Institution / organization</span>
          <input className={fieldClass(errors.affiliation)} value={form.affiliation} onChange={(event) => updateField("affiliation", event.target.value)} placeholder="Department, University / Organization" />
          {errors.affiliation && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.affiliation}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">ORCID</span>
          <input className={fieldClass()} value={form.orcid} onChange={(event) => updateField("orcid", event.target.value)} placeholder="0000-0000-0000-0000" />
        </label>

        <label className="lg:col-span-2">
          <span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
            Abstract / short summary
            <span className="text-xs font-semibold text-slate-500">{abstractCount} words</span>
          </span>
          <textarea rows={6} className={fieldClass(errors.abstract)} value={form.abstract} onChange={(event) => updateField("abstract", event.target.value)} placeholder="Summarize the paper briefly." />
          {errors.abstract && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.abstract}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Keywords</span>
          <input className={fieldClass(errors.keywords)} value={form.keywords} onChange={(event) => updateField("keywords", event.target.value)} placeholder="FEA, FRP, Cooling Tower, Composite Materials" />
          {errors.keywords && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.keywords}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">DOI / preprint link</span>
          <input className={fieldClass()} value={form.doi} onChange={(event) => updateField("doi", event.target.value)} placeholder="10.1000/example or https://..." />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Markdown / repository URL</span>
          <input className={fieldClass()} value={form.manuscriptUrl} onChange={(event) => updateField("manuscriptUrl", event.target.value)} placeholder="https://github.com/.../articles/paper.md" />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">PDF URL</span>
          <input className={fieldClass()} value={form.pdfUrl} onChange={(event) => updateField("pdfUrl", event.target.value)} placeholder="https://..." />
        </label>

        <div className="lg:col-span-2 grid gap-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-2">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
              <UploadCloud size={22} />
            </div>
            <div>
              <div className="font-bold text-primary dark:text-white">Manuscript files</div>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Select manuscript files here. The generated email will include file names; attach the files before sending.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-primary shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <FileText size={18} />
              {form.manuscriptFileName || "Manuscript"}
              <input
                type="file"
                className="sr-only"
                accept=".doc,.docx,.md,.pdf"
                onChange={(event) => updateField("manuscriptFileName", event.target.files?.[0]?.name || "")}
              />
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-3 text-sm font-bold text-primary shadow-sm transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-white">
              <FileArchive size={18} />
              Supplement
              <input
                type="file"
                className="sr-only"
                multiple
                onChange={(event) => updateField("supplementaryFileNames", Array.from(event.target.files || []).map((file) => file.name).join(", "))}
              />
            </label>
          </div>
          {errors.manuscriptFileName && <span className="text-xs font-semibold text-red-600 md:col-span-2">{errors.manuscriptFileName}</span>}
        </div>

        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Editorial notes</span>
          <textarea rows={4} className={fieldClass()} value={form.comments} onChange={(event) => updateField("comments", event.target.value)} placeholder="Conflicts of interest, suggested reviewers, repository access notes, or special handling instructions." />
        </label>

        <div className="lg:col-span-2 grid gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-700">
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.openAccess} onChange={(event) => updateField("openAccess", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            Request open access publication consideration.
          </label>
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.peerReviewed} onChange={(event) => updateField("peerReviewed", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            This manuscript has previous peer review history or preprint discussion.
          </label>
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input type="checkbox" checked={form.ethics} onChange={(event) => updateField("ethics", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            I confirm this submission is original, all authors approve submission, and any conflicts are disclosed.
          </label>
          {errors.ethics && <span className="text-xs font-semibold text-red-600">{errors.ethics}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <Mail size={18} className="text-accent" />
          Submissions route to {editorialEmail}
        </div>
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent">
          Prepare Submission <Send size={18} />
        </button>
      </div>
    </form>
  );
}
