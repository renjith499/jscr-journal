"use client";

import { useEffect, useMemo } from "react";
import { Info } from "lucide-react";
import { compareCurves, COMPARISON_METHOD_NOTES } from "@/lib/graph-digitizer/comparison";
import { CopyButton } from "./CopyButton";

function fmt(value, digits = 4) {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function CurveComparisonPanel({ series, xLabel, yLabel, referenceId, onReferenceChange }) {
  const eligible = series.filter((s) => s.visible && s.points.length >= 2);

  const activeReferenceId = eligible.some((s) => s.id === referenceId) ? referenceId : eligible[0]?.id;
  const reference = eligible.find((s) => s.id === activeReferenceId);
  const comparisonCurves = eligible.filter((s) => s.id !== activeReferenceId);

  useEffect(() => {
    if (activeReferenceId && activeReferenceId !== referenceId) onReferenceChange(activeReferenceId);
  }, [activeReferenceId, referenceId, onReferenceChange]);

  const results = useMemo(() => {
    if (!reference) return [];
    return comparisonCurves.map((curve) => ({ curve, ...compareCurves(reference, curve) }));
  }, [reference, comparisonCurves]);

  if (eligible.length < 2) return null;

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">Curve Comparison — Error Metrics</h3>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
          Reference curve
          <select
            value={activeReferenceId}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-primary outline-none focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            {eligible.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Summary</p>
        <CopyButton
          headers={["Curve", "RMSE", "MAE", "Max Abs Error", "Area Error", "Similarity %", "Points Compared", "Points Skipped"]}
          rows={results.map(({ curve, summary }) => [curve.name, summary.rmse, summary.mae, summary.maxAbsError, summary.areaError, summary.similarity, summary.compared, summary.skipped])}
        />
      </div>
      <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2 font-bold">Curve</th>
              <th className="px-3 py-2 font-bold">RMSE</th>
              <th className="px-3 py-2 font-bold">MAE</th>
              <th className="px-3 py-2 font-bold">Max Abs Error</th>
              <th className="px-3 py-2 font-bold">Area Error</th>
              <th className="px-3 py-2 font-bold">Similarity %</th>
              <th className="px-3 py-2 font-bold">Points (compared/skipped)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map(({ curve, summary }) => (
              <tr key={curve.id} className="text-slate-700 dark:text-slate-200">
                <td className="px-3 py-2 font-bold">
                  <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ backgroundColor: curve.color }} />
                  {curve.name}
                </td>
                <td className="px-3 py-2 tabular-nums">{fmt(summary.rmse)}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(summary.mae)}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(summary.maxAbsError)}</td>
                <td className="px-3 py-2 tabular-nums">{fmt(summary.areaError)}</td>
                <td className="px-3 py-2 tabular-nums">{summary.similarity === null ? "—" : `${fmt(summary.similarity, 1)}%`}</td>
                <td className="px-3 py-2 tabular-nums">
                  {summary.compared} / {summary.skipped}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Point-wise</p>
        <CopyButton
          headers={["Curve", xLabel, `${yLabel} (ref)`, `${yLabel} (interp.)`, "Error", "Abs Error", "Status"]}
          rows={results.flatMap(({ curve, rows }) => rows.map((row) => [curve.name, row.x, row.yRef, row.yInterp, row.error, row.absError, row.status]))}
        />
      </div>
      <div className="max-h-64 overflow-auto rounded-md border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-3 py-2 font-bold">Curve</th>
              <th className="px-3 py-2 font-bold">{xLabel}</th>
              <th className="px-3 py-2 font-bold">{yLabel} (ref)</th>
              <th className="px-3 py-2 font-bold">{yLabel} (interp.)</th>
              <th className="px-3 py-2 font-bold">Error</th>
              <th className="px-3 py-2 font-bold">Abs Error</th>
              <th className="px-3 py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.flatMap(({ curve, rows }) =>
              rows.map((row, index) => (
                <tr key={`${curve.id}-${index}`} className="text-slate-600 dark:text-slate-300">
                  <td className="px-3 py-1.5 font-semibold">{curve.name}</td>
                  <td className="px-3 py-1.5 tabular-nums">{fmt(row.x)}</td>
                  <td className="px-3 py-1.5 tabular-nums">{fmt(row.yRef)}</td>
                  <td className="px-3 py-1.5 tabular-nums">{fmt(row.yInterp)}</td>
                  <td className="px-3 py-1.5 tabular-nums">{fmt(row.error)}</td>
                  <td className="px-3 py-1.5 tabular-nums">{fmt(row.absError)}</td>
                  <td className="px-3 py-1.5">{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        <p className="mb-1 flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
          <Info size={13} /> How this is calculated
        </p>
        <ul className="list-disc space-y-0.5 pl-5">
          {COMPARISON_METHOD_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
