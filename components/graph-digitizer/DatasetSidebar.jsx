"use client";

import { useRef } from "react";
import { Download, Eye, EyeOff, FileUp, Plus, Trash2 } from "lucide-react";

function DatasetRow({ dataset, active, onSelect, onRename, onColorChange, onToggleVisible, onDelete, onExport }) {
  return (
    <div
      className={`rounded-md border p-2.5 transition ${
        active ? "border-accent bg-cyan-50 dark:bg-cyan-950/40" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={dataset.color}
          onChange={(e) => onColorChange(dataset.datasetId, e.target.value)}
          className="h-7 w-7 shrink-0 cursor-pointer rounded border border-slate-200 dark:border-slate-700"
        />
        <button type="button" onClick={() => onSelect(dataset.datasetId)} className="min-w-0 flex-1 text-left">
          <input
            value={dataset.name}
            onChange={(e) => onRename(dataset.datasetId, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full truncate bg-transparent text-sm font-bold text-primary outline-none dark:text-white"
          />
          <div className="text-xs text-slate-500 dark:text-slate-400">{dataset.points.length} pts</div>
        </button>
        <button type="button" onClick={() => onToggleVisible(dataset.datasetId)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
          {dataset.visible ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button type="button" onClick={() => onExport(dataset)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800" title="Export CSV">
          <Download size={15} />
        </button>
        <button type="button" onClick={() => onDelete(dataset.datasetId)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950" title="Delete">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

export function DatasetSidebar({
  datasets,
  externalDatasets,
  activeDatasetId,
  onSelect,
  onAdd,
  onRename,
  onColorChange,
  onToggleVisible,
  onDelete,
  onExportCsv,
  onImportExternal,
  onDeleteExternal,
  onToggleExternalVisible,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">Digitized Datasets</h3>
          <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-bold text-white hover:bg-accent">
            <Plus size={14} /> New
          </button>
        </div>
        <div className="space-y-2">
          {datasets.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">No datasets yet — create one to start digitizing.</p>}
          {datasets.map((dataset) => (
            <DatasetRow
              key={dataset.datasetId}
              dataset={dataset}
              active={dataset.datasetId === activeDatasetId}
              onSelect={onSelect}
              onRename={onRename}
              onColorChange={onColorChange}
              onToggleVisible={onToggleVisible}
              onDelete={onDelete}
              onExport={onExportCsv}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">External Comparison Data</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
          >
            <FileUp size={14} /> Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,.tsv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImportExternal(file);
              e.target.value = "";
            }}
          />
        </div>
        <div className="space-y-2">
          {externalDatasets.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Import a CSV/TXT (X,Y columns) to overlay reference or simulation data.</p>
          )}
          {externalDatasets.map((dataset) => (
            <div key={dataset.datasetId} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2.5 dark:border-slate-700 dark:bg-slate-900">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: dataset.color }} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold text-primary dark:text-white">{dataset.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{dataset.points.length} pts</div>
              </div>
              <button type="button" onClick={() => onToggleExternalVisible(dataset.datasetId)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                {dataset.visible ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
              <button type="button" onClick={() => onDeleteExternal(dataset.datasetId)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
