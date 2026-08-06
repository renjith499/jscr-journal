"use client";

import { useMemo, useRef, useState } from "react";
import { axisHeading } from "@/lib/graph-digitizer/model";
import { CATEGORICAL_PALETTE, CHART_CHROME } from "@/lib/graph-digitizer/palette";
import { niceTicks, formatTick } from "@/lib/graph-digitizer/ticks";
import { compareCurves } from "@/lib/graph-digitizer/comparison";
import { useIsDarkMode } from "./useIsDarkMode";

const WIDTH = 760;
const HEIGHT = 420;
const PAD = { top: 20, right: 24, bottom: 48, left: 64 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

function darkVariant(hex) {
  const entry = CATEGORICAL_PALETTE.find((c) => c.light.toLowerCase() === hex?.toLowerCase());
  return entry ? entry.dark : hex;
}

export function ComparisonChart({ series, xLabel, yLabel, referenceId }) {
  const isDark = useIsDarkMode();
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);
  const [showInterpolated, setShowInterpolated] = useState(true);

  const visibleSeries = series.filter((s) => s.visible && s.points.length > 0);
  const reference = visibleSeries.find((s) => s.id === referenceId) || visibleSeries[0];
  const interpolatedSeries = useMemo(() => {
    if (!reference || reference.points.length < 2) return [];
    return visibleSeries
      .filter((item) => item.id !== reference.id && item.points.length >= 2)
      .map((item) => ({
        ...item,
        points: compareCurves(reference, item).rows
          .filter((row) => row.yInterp !== null)
          .map((row, index) => ({
            id: `interp-${item.id}-${index}`,
            x: row.x,
            y: row.yInterp,
            interpolated: true,
          })),
      }));
  }, [reference, visibleSeries]);

  const { xDomain, yDomain } = useMemo(() => {
    const allX = visibleSeries.flatMap((s) => s.points.map((p) => p.x));
    const allY = visibleSeries.flatMap((s) => s.points.map((p) => p.y));
    if (!allX.length) return { xDomain: niceTicks(0, 1), yDomain: niceTicks(0, 1) };
    return {
      xDomain: niceTicks(Math.min(...allX), Math.max(...allX)),
      yDomain: niceTicks(Math.min(...allY), Math.max(...allY)),
    };
  }, [visibleSeries]);

  function xScale(v) {
    return PAD.left + ((v - xDomain.min) / (xDomain.max - xDomain.min || 1)) * PLOT_W;
  }
  function yScale(v) {
    return PAD.top + (1 - (v - yDomain.min) / (yDomain.max - yDomain.min || 1)) * PLOT_H;
  }

  function handleMouseMove(event) {
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const my = ((event.clientY - rect.top) / rect.height) * HEIGHT;

    let closest = null;
    let closestDist = 18;
    visibleSeries.forEach((s) => {
      s.points.forEach((p) => {
        const dx = xScale(p.x) - mx;
        const dy = yScale(p.y) - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < closestDist) {
          closestDist = dist;
          closest = { series: s, point: p, sx: xScale(p.x), sy: yScale(p.y) };
        }
      });
    });
    if (showInterpolated) {
      interpolatedSeries.forEach((s) => {
        s.points.forEach((p) => {
          const dx = xScale(p.x) - mx;
          const dy = yScale(p.y) - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) {
            closestDist = dist;
            closest = { series: s, point: p, sx: xScale(p.x), sy: yScale(p.y), interpolated: true };
          }
        });
      });
    }
    setHover(closest);
  }

  if (!visibleSeries.length) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm font-semibold text-slate-400 dark:border-slate-700 dark:text-slate-500">
        Digitize or import at least one visible dataset to see the comparison chart.
      </div>
    );
  }

  return (
    <div className="gd-viz rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
      <style>{`
        .gd-viz { --gd-surface: ${CHART_CHROME.surfaceLight}; --gd-text-primary: ${CHART_CHROME.textPrimaryLight};
          --gd-text-secondary: ${CHART_CHROME.textSecondaryLight}; --gd-muted: ${CHART_CHROME.mutedLight};
          --gd-grid: ${CHART_CHROME.gridLight}; --gd-baseline: ${CHART_CHROME.baselineLight}; }
        .dark .gd-viz { --gd-surface: ${CHART_CHROME.surfaceDark}; --gd-text-primary: ${CHART_CHROME.textPrimaryDark};
          --gd-text-secondary: ${CHART_CHROME.textSecondaryDark}; --gd-muted: ${CHART_CHROME.mutedDark};
          --gd-grid: ${CHART_CHROME.gridDark}; --gd-baseline: ${CHART_CHROME.baselineDark}; }
      `}</style>

      <div className="mb-2 flex justify-end">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          <input
            type="checkbox"
            checked={showInterpolated}
            onChange={(event) => {
              setShowInterpolated(event.target.checked);
              if (!event.target.checked && hover?.interpolated) setHover(null);
            }}
            className="h-3.5 w-3.5 accent-amber-600"
          />
          Show interpolated points
        </label>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        style={{ background: "var(--gd-surface)" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
      >
        {yDomain.ticks.map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={yScale(tick)} y2={yScale(tick)} stroke="var(--gd-grid)" strokeWidth={1} />
            <text x={PAD.left - 8} y={yScale(tick)} dy={4} textAnchor="end" fontSize={11} fill="var(--gd-muted)">
              {formatTick(tick)}
            </text>
          </g>
        ))}
        {xDomain.ticks.map((tick) => (
          <g key={`x-${tick}`}>
            <text x={xScale(tick)} y={HEIGHT - PAD.bottom + 18} textAnchor="middle" fontSize={11} fill="var(--gd-muted)">
              {formatTick(tick)}
            </text>
          </g>
        ))}

        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="var(--gd-baseline)" strokeWidth={1} />
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} stroke="var(--gd-baseline)" strokeWidth={1} />

        <text x={(PAD.left + WIDTH - PAD.right) / 2} y={HEIGHT - 6} textAnchor="middle" fontSize={12} fontWeight="700" fill="var(--gd-text-secondary)">
          {xLabel}
        </text>
        <text
          x={16}
          y={(PAD.top + HEIGHT - PAD.bottom) / 2}
          textAnchor="middle"
          fontSize={12}
          fontWeight="700"
          fill="var(--gd-text-secondary)"
          transform={`rotate(-90 16 ${(PAD.top + HEIGHT - PAD.bottom) / 2})`}
        >
          {yLabel}
        </text>

        {visibleSeries.map((s) => {
          const color = isDark ? darkVariant(s.color) : s.color;
          const sorted = [...s.points].sort((a, b) => a.x - b.x);
          const path = sorted.map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(p.x)} ${yScale(p.y)}`).join(" ");
          return (
            <g key={s.id}>
              <path d={path} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              {sorted.map((p) => (
                <circle
                  key={p.id ?? `${p.x}-${p.y}`}
                  cx={xScale(p.x)}
                  cy={yScale(p.y)}
                  r={hover?.point === p ? 6 : 4}
                  fill={color}
                  stroke="var(--gd-surface)"
                  strokeWidth={2}
                />
              ))}
            </g>
          );
        })}

        {showInterpolated && interpolatedSeries.map((s) =>
          s.points.map((p) => {
            const size = hover?.point === p ? 6 : 4.5;
            return (
              <rect
                key={p.id}
                x={xScale(p.x) - size}
                y={yScale(p.y) - size}
                width={size * 2}
                height={size * 2}
                rx={1}
                fill={isDark ? "#fbbf24" : "#d97706"}
                opacity={0.55}
                stroke="var(--gd-surface)"
                strokeWidth={1.5}
                transform={`rotate(45 ${xScale(p.x)} ${yScale(p.y)})`}
              />
            );
          }),
        )}

        {hover && (
          <g>
            <line x1={hover.sx} x2={hover.sx} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="var(--gd-muted)" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
          </g>
        )}
      </svg>

      {hover && (
        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
          <span className={hover.interpolated ? "h-2.5 w-2.5 rotate-45 rounded-[1px] bg-amber-600 dark:bg-amber-400" : "h-2.5 w-2.5 rounded-full"} style={hover.interpolated ? undefined : { backgroundColor: isDark ? darkVariant(hover.series.color) : hover.series.color }} />
          {hover.series.name}{hover.interpolated ? " (interpolated)" : ""}: {formatTick(hover.point.x)}, {formatTick(hover.point.y)}
        </div>
      )}

      {visibleSeries.length >= 2 && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          {visibleSeries.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="h-2.5 w-4 rounded-full" style={{ backgroundColor: isDark ? darkVariant(s.color) : s.color }} />
              {s.name}
            </div>
          ))}
        </div>
      )}
      {showInterpolated && interpolatedSeries.some((item) => item.points.length) && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300">
          <span className="font-bold text-primary dark:text-white">Point type:</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-500" />Original sampled point</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rotate-45 rounded-[1px] bg-amber-600 opacity-[0.55] dark:bg-amber-400" />Interpolated comparison point (55% opacity)</span>
        </div>
      )}
    </div>
  );
}

export function toChartLabel(calibration) {
  return {
    xLabel: axisHeading(calibration.xAxisName, calibration.xAxisUnit),
    yLabel: axisHeading(calibration.yAxisName, calibration.yAxisUnit),
  };
}
