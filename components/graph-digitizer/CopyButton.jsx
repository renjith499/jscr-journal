"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { copyRowsToClipboard } from "@/lib/graph-digitizer/clipboard";

export function CopyButton({ headers, rows, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => new Set(headers.map((_, i) => i)));

  async function copyColumns(indices) {
    if (indices.length === 0) return;
    const sortedIndices = [...indices].sort((a, b) => a - b);
    await copyRowsToClipboard(
      sortedIndices.map((i) => headers[i]),
      rows.map((row) => sortedIndices.map((i) => row[i]))
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function toggleColumn(index) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={() => copyColumns(headers.map((_, i) => i))}
        className="inline-flex items-center gap-1 rounded-l-md text-xs font-bold text-slate-500 hover:text-accent dark:text-slate-400"
      >
        {copied ? <Check size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={13} />}
        {copied ? "Copied" : label}
      </button>
      {headers.length > 1 && (
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-label="Choose columns to copy"
          title="Choose columns to copy"
          className="ml-0.5 rounded p-0.5 text-slate-400 hover:text-accent dark:text-slate-500"
        >
          <ChevronDown size={13} />
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-md border border-slate-200 bg-white p-2 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">Columns to copy</p>
            <div className="max-h-40 space-y-1 overflow-auto">
              {headers.map((header, index) => (
                <label key={header + index} className="flex items-center gap-2 rounded px-1 py-0.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800">
                  <input
                    type="checkbox"
                    checked={selected.has(index)}
                    onChange={() => toggleColumn(index)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span className="truncate">{header}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                copyColumns([...selected]);
                setOpen(false);
              }}
              disabled={selected.size === 0}
              className="mt-2 w-full rounded-md bg-primary px-2 py-1.5 text-xs font-bold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Copy selected
            </button>
          </div>
        </>
      )}
    </div>
  );
}
