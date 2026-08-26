"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { submitMaterialUsageEmail } from "@/lib/material-models/feedback";

export function MaterialDownloadGateModal({ source, onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [usage, setUsage] = useState("");
  const [status, setStatus] = useState("idle");

  async function submit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setStatus("invalid");
    setStatus("loading");
    try {
      await submitMaterialUsageEmail(email, usage, source);
      onSuccess(email);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-primary dark:text-white">One quick thing before downloading</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your material inputs stay in this browser and are not uploaded. We ask for an email once per session to understand how researchers use these tools.
            </p>
            <p className="mt-2 text-sm font-semibold text-primary dark:text-cyan-200">
              Interested in research or industry collaboration? Tell us about your work below.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Email address</span>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">What are you modelling? (optional)</span>
            <input value={usage} onChange={(event) => setUsage(event.target.value)} placeholder="e.g. composite laminate in Abaqus" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          {(status === "invalid" || status === "error") && <p className="text-xs font-semibold text-red-600">{status === "invalid" ? "Enter a valid email address." : "Could not send. Check your connection and try again."}</p>}
          <button type="submit" disabled={status === "loading"} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">{status === "loading" ? "Sending..." : "Continue to download"}</button>
        </form>
      </div>
    </div>
  );
}
