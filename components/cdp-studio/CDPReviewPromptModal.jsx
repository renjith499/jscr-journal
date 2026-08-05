"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { submitCDPFeedback } from "@/lib/cdp-studio/feedback";

const GOOGLE_REVIEW_URL = "https://g.page/r/CQ1bDJ3g_c2vEBM/review";

export function CDPReviewPromptModal({ email, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState({ state: "idle" });

  async function handleSend() {
    if (!feedback.trim()) return onClose();
    setStatus({ state: "loading" });
    try {
      await submitCDPFeedback(feedback, email);
      setStatus({ state: "success" });
    } catch {
      setStatus({ state: "error" });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star className="text-amber-400" size={20} fill="currentColor" />
            <h3 className="text-lg font-extrabold text-primary dark:text-white">Enjoying the CDP Calculator?</h3>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close"><X size={18} /></button>
        </div>
        <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer" className="mb-4 block rounded-md bg-primary px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-accent">Leave us a Google review</a>
        {status.state === "success" ? (
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Thanks — feedback sent.</p>
        ) : (
          <>
            <label>
              <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Feedback (optional)</span>
              <textarea rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="What worked, what did not, or what would make this more useful?" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
            </label>
            {status.state === "error" && <p className="mt-2 text-xs font-semibold text-red-600">Couldn't send feedback. Please try again.</p>}
            <button type="button" onClick={handleSend} disabled={status.state === "loading"} className="mt-3 w-full rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-300">
              {status.state === "loading" ? "Sending..." : feedback.trim() ? "Send feedback" : "No thanks, close"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
