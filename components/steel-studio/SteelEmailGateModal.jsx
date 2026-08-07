"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { submitSteelUsageEmail } from "@/lib/steel-studio/feedback";

export function SteelEmailGateModal({ onSuccess, onClose }) {
  const [email, setEmail] = useState("");
  const [usage, setUsage] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus({ state: "error", message: "Enter a valid email address." });
      return;
    }
    setStatus({ state: "loading", message: "" });
    try {
      await submitSteelUsageEmail(email, usage);
      onSuccess(email);
    } catch {
      setStatus({ state: "error", message: "Couldn't send that — check your connection and try again." });
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-primary dark:text-white">One quick thing before you export</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Your material inputs and hardening tables stay in your browser — they are never uploaded. We ask for an email once per visit so we understand who is using this tool and how.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-primary dark:text-cyan-200">
              Interested in research or industry collaboration? Tell us about your work below and we can connect with you.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <label>
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Email address</span>
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          <label>
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">What are you modelling? (optional)</span>
            <input value={usage} onChange={(event) => setUsage(event.target.value)} placeholder="e.g. steel frame using Abaqus 2020" className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white" />
          </label>
          {status.state === "error" && <p className="text-xs font-semibold text-red-600">{status.message}</p>}
          <button type="submit" disabled={status.state === "loading"} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60">
            {status.state === "loading" ? "Sending..." : "Continue to export"}
          </button>
        </form>
      </div>
    </div>
  );
}
