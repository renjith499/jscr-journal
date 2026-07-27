"use client";

import { Trash2 } from "lucide-react";
import { axisHeading } from "@/lib/graph-digitizer/model";

export function PointTable({ dataset, calibration, onEditPoint, onDeletePoint }) {
  if (!dataset) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">Select or create a dataset to view its points.</p>;
  }

  const points = [...dataset.points].sort((a, b) => a.graphX - b.graphX);

  return (
    <div className="max-h-80 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-left text-xs">
        <thead className="sticky top-0 bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
          <tr>
            <th className="px-3 py-2 font-bold">#</th>
            <th className="px-3 py-2 font-bold">{axisHeading(calibration.xAxisName, calibration.xAxisUnit)}</th>
            <th className="px-3 py-2 font-bold">{axisHeading(calibration.yAxisName, calibration.yAxisUnit)}</th>
            <th className="px-3 py-2 font-bold">Pixel (x, y)</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {points.length === 0 && (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-slate-400">
                No points yet. Switch to "Add Points" mode and click on the curve.
              </td>
            </tr>
          )}
          {points.map((point, index) => (
            <tr key={point.pointId} className="text-slate-700 dark:text-slate-200">
              <td className="px-3 py-2 tabular-nums">{index + 1}</td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  step="any"
                  value={point.graphX}
                  onChange={(e) => onEditPoint(dataset.datasetId, point.pointId, { graphX: Number(e.target.value) })}
                  className="w-24 rounded border border-transparent bg-transparent px-1 py-0.5 tabular-nums hover:border-slate-200 focus:border-accent focus:outline-none dark:hover:border-slate-700"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="number"
                  step="any"
                  value={point.graphY}
                  onChange={(e) => onEditPoint(dataset.datasetId, point.pointId, { graphY: Number(e.target.value) })}
                  className="w-24 rounded border border-transparent bg-transparent px-1 py-0.5 tabular-nums hover:border-slate-200 focus:border-accent focus:outline-none dark:hover:border-slate-700"
                />
              </td>
              <td className="px-3 py-2 tabular-nums text-slate-400">
                {Math.round(point.pixelX)}, {Math.round(point.pixelY)}
              </td>
              <td className="px-3 py-2">
                <button type="button" onClick={() => onDeletePoint(dataset.datasetId, point.pointId)} className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
