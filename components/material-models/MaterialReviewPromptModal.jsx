"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { submitMaterialFeedback } from "@/lib/material-models/feedback";

const REVIEW_URL = "https://g.page/r/CQ1bDJ3g_c2vEBM/review";

export function MaterialReviewPromptModal({ email, source, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("idle");
  async function send() {
    if (!feedback.trim()) return onClose();
    setStatus("loading");
    try {
      await submitMaterialFeedback(feedback, email, source);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Star size={20} className="text-amber-400" fill="currentColor" /><h3 className="text-lg font-extrabold text-primary dark:text-white">Rate the Material Models tools</h3></div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400"><X size={18} /></button>
        </div>
        <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mb-4 block rounded-md bg-primary px-4 py-2.5 text-center text-sm font-bold text-white">Leave us a Google review</a>
        {status === "success" ? <p className="text-sm font-semibold text-emerald-700">Thanks — feedback sent.</p> : <>
          <label className="block"><span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Feedback (optional)</span><textarea rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" placeholder="What would make these material tools more useful?" /></label>
          {status === "error" && <p className="mt-2 text-xs font-semibold text-red-600">Could not send feedback. Please try again.</p>}
          <button type="button" onClick={send} disabled={status === "loading"} className="mt-3 w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-bold dark:border-slate-700">{status === "loading" ? "Sending..." : feedback.trim() ? "Send feedback" : "No thanks, close"}</button>
        </>}
      </div>
    </div>
  );
}
