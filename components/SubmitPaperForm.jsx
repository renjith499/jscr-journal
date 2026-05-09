"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "@formspree/react";
import { AlertCircle, CheckCircle2, Link2, Mail, Send, ShieldCheck } from "lucide-react";

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
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [formspreeState, submitToFormspree] = useForm("xlgzppdd");

  const editorialEmail = "desyngoresearch@gmail.com";

  const abstractCount = useMemo(() => form.abstract.trim().split(/\s+/).filter(Boolean).length, [form.abstract]);

  useEffect(() => {
    if (formspreeState.succeeded) {
      setForm(initialForm);
      setStatus({
        state: "success",
        message: `Submission received. Details will be delivered to ${editorialEmail}.`,
      });
    } else if (formspreeState.errors) {
      setStatus({
        state: "error",
        message: "Submission could not be sent. Please check the form details and try again.",
      });
    }
  }, [formspreeState.errors, formspreeState.succeeded]);

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
    if (!form.manuscriptUrl.trim()) nextErrors.manuscriptUrl = "Provide a manuscript link.";
    if (!form.ethics) nextErrors.ethics = "Confirm the submission declaration.";
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ state: "idle", message: "" });
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus({ state: "loading", message: "Submitting manuscript details..." });

    await submitToFormspree({
      _subject: `JSCR Submission: ${form.title}`,
      destination: editorialEmail,
      article_title: form.title,
      article_type: form.articleType,
      category: form.category,
      authors: form.authors,
      corresponding_author: form.correspondingAuthor,
      email: form.email,
      contact_email: form.email,
      phone: form.phone,
      institution_or_organization: form.affiliation,
      orcid: form.orcid || "Not provided",
      doi_or_preprint: form.doi || "Not provided",
      keywords: form.keywords || "Not provided",
      manuscript_link: form.manuscriptUrl,
      pdf_link: form.pdfUrl || "Not provided",
      abstract: form.abstract || "Not provided",
      editorial_notes: form.comments || "None",
      open_access_requested: form.openAccess ? "Yes" : "No",
      previous_peer_review: form.peerReviewed ? "Yes" : "No",
      declaration_confirmed: form.ethics ? "Yes" : "No",
    });
  }

  const isSubmitting = status.state === "loading" || formspreeState.submitting;
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

      {status.state === "success" && (
        <div className="mx-6 mt-6 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          <CheckCircle2 className="mr-2 inline h-5 w-5" />
          {status.message}
        </div>
      )}

      {status.state === "error" && (
        <div className="mx-6 mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          <AlertCircle className="mr-2 inline h-5 w-5" />
          {status.message}
        </div>
      )}

      <div className="grid gap-6 p-6 lg:grid-cols-2">
        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Article title</span>
          <input name="article_title" className={fieldClass(errors.title)} value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Finite Element Analysis of FRP Cooling Towers" />
          {errors.title && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.title}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Article type</span>
          <select name="article_type" className={fieldClass()} value={form.articleType} onChange={(event) => updateField("articleType", event.target.value)}>
            {articleTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Research category</span>
          <select name="category" className={fieldClass()} value={form.category} onChange={(event) => updateField("category", event.target.value)}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>

        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Authors</span>
          <input name="authors" className={fieldClass(errors.authors)} value={form.authors} onChange={(event) => updateField("authors", event.target.value)} placeholder="Renjith R, A. Kumar, S. Menon" />
          {errors.authors && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.authors}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Corresponding author</span>
          <input name="corresponding_author" className={fieldClass(errors.correspondingAuthor)} value={form.correspondingAuthor} onChange={(event) => updateField("correspondingAuthor", event.target.value)} placeholder="Renjith R" />
          {errors.correspondingAuthor && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.correspondingAuthor}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Email</span>
          <input name="email" type="email" className={fieldClass(errors.email)} value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="author@example.com" />
          {errors.email && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.email}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Phone number</span>
          <input name="phone" type="tel" className={fieldClass(errors.phone)} value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91 98765 43210" />
          {errors.phone && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.phone}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Institution / organization</span>
          <input name="institution_or_organization" className={fieldClass(errors.affiliation)} value={form.affiliation} onChange={(event) => updateField("affiliation", event.target.value)} placeholder="Department, University / Organization" />
          {errors.affiliation && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.affiliation}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">ORCID</span>
          <input name="orcid" className={fieldClass()} value={form.orcid} onChange={(event) => updateField("orcid", event.target.value)} placeholder="0000-0000-0000-0000" />
        </label>

        <label className="lg:col-span-2">
          <span className="mb-2 flex items-center justify-between text-sm font-bold text-slate-700 dark:text-slate-200">
            Abstract / short summary
            <span className="text-xs font-semibold text-slate-500">{abstractCount} words</span>
          </span>
          <textarea name="abstract" rows={6} className={fieldClass(errors.abstract)} value={form.abstract} onChange={(event) => updateField("abstract", event.target.value)} placeholder="Summarize the paper briefly." />
          {errors.abstract && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.abstract}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Keywords</span>
          <input name="keywords" className={fieldClass(errors.keywords)} value={form.keywords} onChange={(event) => updateField("keywords", event.target.value)} placeholder="FEA, FRP, Cooling Tower, Composite Materials" />
          {errors.keywords && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.keywords}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">DOI / preprint link</span>
          <input name="doi_or_preprint" className={fieldClass()} value={form.doi} onChange={(event) => updateField("doi", event.target.value)} placeholder="10.1000/example or https://..." />
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Markdown / repository URL</span>
          <input name="manuscript_link" className={fieldClass(errors.manuscriptUrl)} value={form.manuscriptUrl} onChange={(event) => updateField("manuscriptUrl", event.target.value)} placeholder="https://github.com/.../articles/paper.md" />
          {errors.manuscriptUrl && <span className="mt-2 block text-xs font-semibold text-red-600">{errors.manuscriptUrl}</span>}
        </label>

        <label>
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">PDF URL</span>
          <input name="pdf_link" className={fieldClass()} value={form.pdfUrl} onChange={(event) => updateField("pdfUrl", event.target.value)} placeholder="https://..." />
        </label>

        <div className="lg:col-span-2 grid gap-4 rounded-md border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950 md:grid-cols-[auto_1fr]">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan-100 text-primary dark:bg-cyan-950 dark:text-cyan-100">
              <Link2 size={22} />
            </div>
            <div>
              <div className="font-bold text-primary dark:text-white">Manuscript link only</div>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Upload the manuscript to Google Drive, Dropbox, OneDrive, GitHub, or another repository and paste the share link above. No file upload is required on this website.</p>
            </div>
          </div>
          <div className="rounded-md border border-cyan-200 bg-white p-4 text-sm font-semibold leading-6 text-primary dark:border-cyan-900 dark:bg-slate-900 dark:text-cyan-100">
            Submissions are sent directly through the website form to the editorial inbox configured in Formspree.
          </div>
        </div>

        <label className="lg:col-span-2">
          <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Editorial notes</span>
          <textarea name="editorial_notes" rows={4} className={fieldClass()} value={form.comments} onChange={(event) => updateField("comments", event.target.value)} placeholder="Conflicts of interest, suggested reviewers, repository access notes, or special handling instructions." />
        </label>

        <div className="lg:col-span-2 grid gap-3 rounded-md border border-slate-200 p-4 dark:border-slate-700">
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input name="open_access_requested" type="checkbox" checked={form.openAccess} onChange={(event) => updateField("openAccess", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            Request open access publication consideration.
          </label>
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input name="previous_peer_review" type="checkbox" checked={form.peerReviewed} onChange={(event) => updateField("peerReviewed", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
            This manuscript has previous peer review history or preprint discussion.
          </label>
          <label className="flex items-start gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <input name="declaration_confirmed" type="checkbox" checked={form.ethics} onChange={(event) => updateField("ethics", event.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent" />
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
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Submitting..." : "Submit Paper"} <Send size={18} />
        </button>
      </div>
    </form>
  );
}
