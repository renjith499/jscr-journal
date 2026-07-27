"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CAL_FIELDS = [
  { field: "xStart", label: "X1" },
  { field: "xEnd", label: "X2" },
  { field: "yStart", label: "Y1" },
  { field: "yEnd", label: "Y2" },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function DigitizerCanvas({
  imageDataUrl,
  imageWidth,
  imageHeight,
  calibration,
  datasets,
  mode,
  armedCalibrationField,
  onPickCalibrationPixel,
  onAddPoint,
  onMovePoint,
  onDeletePoint,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [view, setView] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const dragRef = useRef(null);

  const fitToWindow = useCallback(() => {
    const container = containerRef.current;
    if (!container || !imageWidth || !imageHeight) return;
    const rect = container.getBoundingClientRect();
    const zoom = Math.min(rect.width / imageWidth, rect.height / imageHeight) * 0.95;
    const pan = {
      x: (rect.width - imageWidth * zoom) / 2,
      y: (rect.height - imageHeight * zoom) / 2,
    };
    setView({ zoom, pan });
  }, [imageWidth, imageHeight]);

  useEffect(() => {
    fitToWindow();
  }, [fitToWindow, imageDataUrl]);

  function clientToImage(clientX, clientY) {
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = clientX - rect.left;
    const svgY = clientY - rect.top;
    return {
      x: (svgX - view.pan.x) / view.zoom,
      y: (svgY - view.pan.y) / view.zoom,
    };
  }

  function handleWheel(event) {
    if (!imageDataUrl) return;
    event.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const imgX = (mouseX - view.pan.x) / view.zoom;
    const imgY = (mouseY - view.pan.y) / view.zoom;
    const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    const nextZoom = clamp(view.zoom * factor, 0.05, 40);
    setView({
      zoom: nextZoom,
      pan: { x: mouseX - imgX * nextZoom, y: mouseY - imgY * nextZoom },
    });
  }

  function handleBackgroundClick(event) {
    if (!imageDataUrl) return;
    const { x, y } = clientToImage(event.clientX, event.clientY);
    if (mode === "calibrate" && armedCalibrationField) {
      onPickCalibrationPixel(armedCalibrationField, x, y);
    } else if (mode === "add") {
      onAddPoint(x, y);
    }
  }

  function handleBackgroundPointerDown(event) {
    if (mode !== "pan" || !imageDataUrl) return;
    dragRef.current = { kind: "pan", startX: event.clientX, startY: event.clientY, startPan: view.pan };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointPointerDown(event, datasetId, pointId) {
    event.stopPropagation();
    if (mode === "delete") {
      onDeletePoint(datasetId, pointId);
      return;
    }
    if (mode !== "move") return;
    dragRef.current = { kind: "point", datasetId, pointId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.kind === "pan") {
      setView((current) => ({
        ...current,
        pan: {
          x: drag.startPan.x + (event.clientX - drag.startX),
          y: drag.startPan.y + (event.clientY - drag.startY),
        },
      }));
    } else if (drag.kind === "point") {
      const { x, y } = clientToImage(event.clientX, event.clientY);
      onMovePoint(drag.datasetId, drag.pointId, x, y);
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  const markerScale = 1 / view.zoom;
  const cursorClass =
    mode === "pan" ? "cursor-grab" : mode === "delete" ? "cursor-not-allowed" : mode === "view" ? "cursor-default" : "cursor-crosshair";

  return (
    <div
      ref={containerRef}
      data-testid="graph-digitizer-canvas"
      className={`relative h-[60vh] min-h-[420px] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 ${cursorClass}`}
    >
      {!imageDataUrl && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-400 dark:text-slate-500">
          Upload a graph image to begin
        </div>
      )}
      {imageDataUrl && (
        <svg
          ref={svgRef}
          className="h-full w-full touch-none select-none"
          onWheel={handleWheel}
          onClick={handleBackgroundClick}
          onPointerDown={handleBackgroundPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <g transform={`translate(${view.pan.x} ${view.pan.y}) scale(${view.zoom})`}>
            <image href={imageDataUrl} x={0} y={0} width={imageWidth} height={imageHeight} />

            {CAL_FIELDS.map(({ field, label }) => {
              const point = calibration[field];
              if (point.px === null || point.px === undefined || point.py === null || point.py === undefined) return null;
              return (
                <g key={field} transform={`translate(${point.px} ${point.py})`}>
                  <line x1={-8 * markerScale} y1={0} x2={8 * markerScale} y2={0} stroke="#00B4D8" strokeWidth={2 * markerScale} />
                  <line x1={0} y1={-8 * markerScale} x2={0} y2={8 * markerScale} stroke="#00B4D8" strokeWidth={2 * markerScale} />
                  <circle r={3 * markerScale} fill="#00B4D8" stroke="#fff" strokeWidth={1.5 * markerScale} />
                  <text x={10 * markerScale} y={-10 * markerScale} fontSize={12 * markerScale} fill="#00B4D8" fontWeight="bold">
                    {label}
                  </text>
                </g>
              );
            })}

            {datasets
              .filter((d) => d.visible)
              .map((dataset) =>
                dataset.points.map((point) => (
                  <circle
                    key={point.pointId}
                    cx={point.pixelX}
                    cy={point.pixelY}
                    r={5 * markerScale}
                    fill={dataset.color}
                    stroke="#fff"
                    strokeWidth={2 * markerScale}
                    onPointerDown={(event) => handlePointPointerDown(event, dataset.datasetId, point.pointId)}
                    style={{ cursor: mode === "move" ? "grab" : mode === "delete" ? "not-allowed" : "default" }}
                  />
                ))
              )}
          </g>
        </svg>
      )}

      <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950/90 dark:text-slate-300">
        {Math.round(view.zoom * 100)}%
      </div>
      <button
        type="button"
        onClick={fitToWindow}
        className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2.5 py-1 text-xs font-bold text-primary shadow-sm hover:bg-white dark:bg-slate-950/90 dark:text-cyan-200"
      >
        Fit
      </button>
    </div>
  );
}
