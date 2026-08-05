"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const CAL_FIELDS = [
  { field: "xStart", label: "X1" },
  { field: "xEnd", label: "X2" },
  { field: "yStart", label: "Y1" },
  { field: "yEnd", label: "Y2" },
];

const MAGNIFIER_MODES = new Set(["calibrate", "add", "move"]);
const MAGNIFIER_SIZE = 176;
const MAGNIFIER_FACTOR = 4.5;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function SceneContent({ imageDataUrl, imageWidth, imageHeight, calibration, datasets, markerScale, mode, selectedCalibrationField, onCalibrationPointerDown, onPointPointerDown }) {
  return (
    <>
      <image href={imageDataUrl} x={0} y={0} width={imageWidth} height={imageHeight} />

      {CAL_FIELDS.map(({ field, label }) => {
        const point = calibration[field];
        if (point.px === null || point.px === undefined || point.py === null || point.py === undefined) return null;
        return (
          <g key={field} transform={`translate(${point.px} ${point.py})`} onClick={(event) => event.stopPropagation()} onPointerDown={onCalibrationPointerDown ? (event) => onCalibrationPointerDown(event, field) : undefined} style={onCalibrationPointerDown ? { cursor: "move" } : undefined}>
            <circle r={13 * markerScale} fill="transparent" />
            <line x1={-8 * markerScale} y1={0} x2={8 * markerScale} y2={0} stroke={selectedCalibrationField === field ? "#e45b35" : "#00B4D8"} strokeWidth={2 * markerScale} />
            <line x1={0} y1={-8 * markerScale} x2={0} y2={8 * markerScale} stroke={selectedCalibrationField === field ? "#e45b35" : "#00B4D8"} strokeWidth={2 * markerScale} />
            <circle r={3 * markerScale} fill={selectedCalibrationField === field ? "#e45b35" : "#00B4D8"} stroke="#fff" strokeWidth={1.5 * markerScale} />
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
              onPointerDown={onPointPointerDown ? (event) => onPointPointerDown(event, dataset.datasetId, point.pointId) : undefined}
              style={onPointPointerDown ? { cursor: mode === "move" ? "grab" : mode === "delete" ? "not-allowed" : "default" } : undefined}
            />
          ))
        )}
    </>
  );
}

export function DigitizerCanvas({
  imageDataUrl,
  imageWidth,
  imageHeight,
  calibration,
  datasets,
  mode,
  armedCalibrationField,
  selectedCalibrationField,
  onPickCalibrationPixel,
  onSelectCalibrationPoint,
  onMoveCalibrationPoint,
  onAddPoint,
  onMovePoint,
  onDeletePoint,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [view, setView] = useState({ zoom: 1, pan: { x: 0, y: 0 } });
  const [hoverPos, setHoverPos] = useState(null);
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

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return undefined;

    // React attaches onWheel as a passive listener, so preventDefault() inside it
    // silently fails. Attach natively with { passive: false } so Ctrl/Cmd+Scroll
    // can actually stop the browser's own page/pinch zoom and drive ours instead.
    function onWheelNative(event) {
      if (!(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      const rect = svgEl.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      const current = viewRef.current;
      const imgX = (mouseX - current.pan.x) / current.zoom;
      const imgY = (mouseY - current.pan.y) / current.zoom;
      const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
      const nextZoom = clamp(current.zoom * factor, 0.05, 40);
      setView({
        zoom: nextZoom,
        pan: { x: mouseX - imgX * nextZoom, y: mouseY - imgY * nextZoom },
      });
    }

    svgEl.addEventListener("wheel", onWheelNative, { passive: false });
    return () => svgEl.removeEventListener("wheel", onWheelNative);
  }, [imageDataUrl]);

  function handleBackgroundClick(event) {
    if (!imageDataUrl) return;
    const { x, y } = clientToImage(event.clientX, event.clientY);
    if (mode === "calibrate" && armedCalibrationField) {
      onPickCalibrationPixel(armedCalibrationField, x, y);
      svgRef.current?.focus();
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

  function handleCalibrationPointerDown(event, field) {
    event.stopPropagation();
    if (mode !== "calibrate") return;
    onSelectCalibrationPoint(field);
    dragRef.current = { kind: "calibration", field };
    event.currentTarget.setPointerCapture(event.pointerId);
    svgRef.current?.focus();
  }

  function handlePointerMove(event) {
    if (imageDataUrl && MAGNIFIER_MODES.has(mode)) {
      setHoverPos(clientToImage(event.clientX, event.clientY));
    }
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
    } else if (drag.kind === "calibration") {
      const { x, y } = clientToImage(event.clientX, event.clientY);
      onMoveCalibrationPoint(drag.field, x, y);
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  const markerScale = 1 / view.zoom;
  const cursorClass =
    mode === "pan" ? "cursor-grab" : mode === "delete" ? "cursor-not-allowed" : mode === "view" ? "cursor-default" : "cursor-crosshair";

  const showMagnifier = imageDataUrl && hoverPos && MAGNIFIER_MODES.has(mode);
  const magZoom = view.zoom * MAGNIFIER_FACTOR;
  const magHalf = MAGNIFIER_SIZE / 2;
  const magMarkerScale = 1 / magZoom;

  function handleKeyDown(event) {
    if (mode !== "calibrate" || !selectedCalibrationField) return;
    const point = calibration[selectedCalibrationField];
    if (point?.px === null || point?.py === null) return;
    const direction = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 10 : 1;
    onMoveCalibrationPoint(
      selectedCalibrationField,
      clamp(point.px + direction[0] * step, 0, imageWidth),
      clamp(point.py + direction[1] * step, 0, imageHeight),
    );
  }

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
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="h-full w-full touch-none select-none"
          onClick={handleBackgroundClick}
          onPointerDown={handleBackgroundPointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => {
            handlePointerUp();
            setHoverPos(null);
          }}
        >
          <g transform={`translate(${view.pan.x} ${view.pan.y}) scale(${view.zoom})`}>
            <SceneContent
              imageDataUrl={imageDataUrl}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
              calibration={calibration}
              datasets={datasets}
              markerScale={markerScale}
              mode={mode}
              selectedCalibrationField={selectedCalibrationField}
              onCalibrationPointerDown={handleCalibrationPointerDown}
              onPointPointerDown={handlePointPointerDown}
            />
          </g>
        </svg>
      )}

      {showMagnifier && (
        <div
          className="pointer-events-none fixed right-6 top-24 z-50 overflow-hidden rounded-full border-2 border-accent bg-slate-200 shadow-card dark:bg-slate-800"
          style={{ width: MAGNIFIER_SIZE, height: MAGNIFIER_SIZE }}
        >
          <svg width={MAGNIFIER_SIZE} height={MAGNIFIER_SIZE}>
            <g transform={`translate(${magHalf} ${magHalf}) scale(${magZoom}) translate(${-hoverPos.x} ${-hoverPos.y})`}>
              <SceneContent
                imageDataUrl={imageDataUrl}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
                calibration={calibration}
                datasets={datasets}
                markerScale={magMarkerScale}
                mode={mode}
              />
            </g>
            <line x1={0} y1={magHalf} x2={MAGNIFIER_SIZE} y2={magHalf} stroke="#00B4D8" strokeWidth={1} opacity={0.85} />
            <line x1={magHalf} y1={0} x2={magHalf} y2={MAGNIFIER_SIZE} stroke="#00B4D8" strokeWidth={1} opacity={0.85} />
          </svg>
        </div>
      )}

      <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:bg-slate-950/90 dark:text-slate-300">
        {Math.round(view.zoom * 100)}% <span className="font-normal text-slate-400">· Ctrl+Scroll to zoom</span>
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
