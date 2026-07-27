"use client";

import { Crosshair, Hand, MousePointer2, Ruler, Trash2 } from "lucide-react";

const MODES = [
  { id: "pan", label: "Pan", icon: Hand, hint: "Drag to pan, scroll to zoom" },
  { id: "calibrate", label: "Calibrate", icon: Ruler, hint: "Set the four axis reference points" },
  { id: "add", label: "Add Points", icon: Crosshair, hint: "Click on the curve to digitize points" },
  { id: "move", label: "Move", icon: MousePointer2, hint: "Drag existing points" },
  { id: "delete", label: "Delete", icon: Trash2, hint: "Click a point to remove it" },
];

export function Toolbar({ mode, onModeChange, disabled }) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map(({ id, label, icon: Icon, hint }) => (
        <button
          key={id}
          type="button"
          title={hint}
          disabled={disabled}
          onClick={() => onModeChange(id)}
          className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            mode === id
              ? "border-primary bg-primary text-white shadow-card"
              : "border-slate-200 bg-white text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
