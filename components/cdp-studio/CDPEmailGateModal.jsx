"use client";

import { X } from "lucide-react";
import { DownloadAccountLogin } from "@/components/auth/DownloadAccountLogin";

export function CDPEmailGateModal({ onAuthenticated, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-primary dark:text-white">Account required for material downloads</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Register with your email, verify it, and sign in to download CDP material files. Your material inputs and CDP tables remain on your device.
            </p>
          </div>
          <button type="button" onClick={onClose} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <DownloadAccountLogin onAuthenticated={onAuthenticated} required />
      </div>
    </div>
  );
}
