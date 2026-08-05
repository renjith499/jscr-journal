"use client";

import { CheckCircle2, MapPin } from "lucide-react";

const ROWS = [
  { field: "xStart", label: "X start", coordKey: "px", unitKey: "xAxisName" },
  { field: "xEnd", label: "X end", coordKey: "px", unitKey: "xAxisName" },
  { field: "yStart", label: "Y start", coordKey: "py", unitKey: "yAxisName" },
  { field: "yEnd", label: "Y end", coordKey: "py", unitKey: "yAxisName" },
];

function inputClass() {
  return "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-cyan-950";
}

export function CalibrationPanel({ calibration, armedField, onArmField, onValueChange, onAxisLabelChange }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">Axis Calibration</h3>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
            calibration.isCalibrated
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
          }`}
        >
          <CheckCircle2 size={13} />
          {calibration.isCalibrated ? "Calibrated" : "Not calibrated"}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <label>
          <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">X axis name</span>
          <input className={inputClass()} value={calibration.xAxisName} onChange={(e) => onAxisLabelChange("xAxisName", e.target.value)} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">X unit</span>
          <input className={inputClass()} value={calibration.xAxisUnit} onChange={(e) => onAxisLabelChange("xAxisUnit", e.target.value)} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Y axis name</span>
          <input className={inputClass()} value={calibration.yAxisName} onChange={(e) => onAxisLabelChange("yAxisName", e.target.value)} />
        </label>
        <label>
          <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">Y unit</span>
          <input className={inputClass()} value={calibration.yAxisUnit} onChange={(e) => onAxisLabelChange("yAxisUnit", e.target.value)} />
        </label>
      </div>

      <div className="space-y-2">
        {ROWS.map(({ field, label, coordKey }) => {
          const point = calibration[field];
          const isArmed = armedField === field;
          const hasPixel = point[coordKey] !== null && point[coordKey] !== undefined;
          return (
            <div key={field} className="grid grid-cols-[auto_1fr_1fr] items-center gap-2">
              <button
                type="button"
                onClick={() => onArmField(field)}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-bold transition ${
                  isArmed
                    ? "border-accent bg-cyan-50 text-accent dark:bg-cyan-950"
                    : hasPixel
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                }`}
              >
                <MapPin size={13} />
                {label}
              </button>
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                {hasPixel ? `pixel ${point[coordKey].toFixed(2)}` : isArmed ? "click on image…" : "not set"}
              </div>
              <input
                type="number"
                step="any"
                placeholder="value"
                className={inputClass()}
                value={point.value}
                onChange={(e) => onValueChange(field, Number(e.target.value))}
              />
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
        Click a button above, then click the matching reference point on the image. Enter the true axis value for
        each point on the right. Point selection advances automatically from X start to X end, Y start and Y end.
        The point just placed receives arrow-key control immediately; control transfers automatically when the next
        point is created. Click an existing marker to select it. Arrow keys nudge by 0.1 pixel for high precision
        (Shift + arrow moves 1 pixel).
      </p>
    </div>
  );
}
