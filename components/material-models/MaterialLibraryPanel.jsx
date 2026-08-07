"use client";

import { useEffect, useState } from "react";
import { Boxes, Download, Info, Trash2 } from "lucide-react";
import { listMaterials, removeMaterial } from "@/lib/material-models/library-store";
import { generate as generateCDP } from "@/lib/cdp-studio/model";
import { generateAbaqus2020Library as cdpLibrary, abaqusLibraryFileName as cdpLibraryFileName } from "@/lib/cdp-studio/abaqus-library";
import { generate as generateSteel } from "@/lib/steel-studio/model";
import { generateAbaqus2020Library as steelLibrary, abaqusLibraryFileName as steelLibraryFileName } from "@/lib/steel-studio/abaqus-library";

const KIND_LABEL = { cdp: "CDP", steel: "Steel" };

function saveFile(content, fileName, type = "text/plain") {
  const a = document.createElement("a");
  const url = URL.createObjectURL(new Blob([content], { type }));
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function materialCard(entry) {
  if (entry.kind === "cdp") return generateCDP(entry.inputs);
  return generateSteel(entry.inputs);
}

function downloadInp(entry) {
  const model = materialCard(entry);
  saveFile(model.text, `${entry.inputs.name}.inp`);
}

function downloadLib(entry) {
  const model = materialCard(entry);
  const projectName = entry.inputs.name;
  if (entry.kind === "cdp") {
    saveFile(cdpLibrary(entry.inputs, model, projectName), cdpLibraryFileName(projectName), "application/octet-stream");
  } else {
    saveFile(steelLibrary(entry.inputs, model, projectName), steelLibraryFileName(projectName), "application/octet-stream");
  }
}

export function MaterialLibraryPanel() {
  const [materials, setMaterials] = useState([]);
  const [showAllNote, setShowAllNote] = useState(false);

  useEffect(() => {
    setMaterials(listMaterials());
  }, []);

  function handleRemove(id) {
    removeMaterial(id);
    setMaterials(listMaterials());
  }

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Boxes className="text-accent" size={20} />
          <h3 className="text-lg font-extrabold text-primary dark:text-white">Your Material Library</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowAllNote(true)}
          disabled={materials.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download size={14} /> Download all materials
        </button>
      </div>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        Materials you save from the CDP or Steel Calculator with "Add to Library" show up here — saved locally in
        your browser, nothing is uploaded.
      </p>

      {showAllNote && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
          <Info size={15} className="mt-0.5 shrink-0" />
          <span>
            Bundling multiple materials into one Abaqus library file needs a verified multi-material .lib format,
            which isn't confirmed yet. Each material below can still be downloaded individually as .inp or .lib.
          </span>
        </div>
      )}

      {materials.length === 0 ? (
        <p className="mt-5 text-sm text-slate-400">No materials saved yet.</p>
      ) : (
        <div className="mt-5 space-y-2">
          {materials.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-primary dark:bg-cyan-950 dark:text-cyan-100">
                    {KIND_LABEL[entry.kind] || entry.kind}
                  </span>
                  <span className="truncate font-bold text-primary dark:text-white">{entry.inputs.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Saved {new Date(entry.savedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadInp(entry)}
                  className="rounded-md border px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
                >
                  .inp
                </button>
                <button
                  type="button"
                  onClick={() => downloadLib(entry)}
                  className="rounded-md border px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
                >
                  .lib
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(entry.id)}
                  className="rounded-md p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  aria-label="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
