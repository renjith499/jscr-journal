"use client";

import { useRef } from "react";
import { Download, Eye, EyeOff, FileDown, FileUp, Plus, Scan, Sparkles, Trash2 } from "lucide-react";

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
  onShowAll,
  onRename,
  onColorChange,
  onToggleVisible,
  onDelete,
  onExportCsv,
  onImportExternal,
  onDownloadTemplate,
  onDeleteExternal,
  onToggleExternalVisible,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">Digitized Datasets</h3>
          <div className="flex items-center gap-2">
            {datasets.length > 1 && (
              <button
                type="button"
                onClick={onShowAll}
                title="Show every curve on the canvas again"
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
              >
                <Scan size={14} /> Show all
              </button>
            )}
            <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1.5 text-xs font-bold text-white hover:bg-accent">
              <Plus size={14} /> New
            </button>
          </div>
        </div>
        {datasets.length > 1 && (
          <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
            Selecting a curve shows only its points on the canvas — use the eye icon or "Show all" to bring others back.
          </p>
        )}
        <div className="space-y-2">
          {datasets.length === 0 && (
            <div className="flex flex-col items-start gap-2 rounded-md border-2 border-dashed border-accent/50 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950/40">
              <p className="flex items-center gap-1.5 text-sm font-bold text-primary dark:text-white">
                <Sparkles size={15} className="text-accent" /> No curve yet
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Create a curve first, then switch to "Add Points" to start clicking on the graph.
              </p>
              <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-accent"
              >
                <Plus size={14} /> Create Curve
              </button>
            </div>
          )}
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
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">External Comparison Data</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onDownloadTemplate}
              title="Download a template file in the expected X,Y format"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
            >
              <FileDown size={14} /> Template
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300"
            >
              <FileUp size={14} /> Import Data
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,.tsv,.xlsx,.xls"
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
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Import a CSV or Excel file (X in the first column, Y in the second — a header row is fine) to overlay
              reference or simulation data. Not sure of the format? Grab the template above.
            </p>
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
