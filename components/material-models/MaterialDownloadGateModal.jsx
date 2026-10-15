"use client";

import { X } from "lucide-react";
import { DownloadAccountLogin } from "@/components/auth/DownloadAccountLogin";

export function MaterialDownloadGateModal({ onAuthenticated, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-primary dark:text-white">Account required for material downloads</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Register with your email, verify it, and sign in to download material models. Your material inputs remain on your device.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>
        <DownloadAccountLogin onAuthenticated={onAuthenticated} required />
      </div>
    </div>
  );
}
