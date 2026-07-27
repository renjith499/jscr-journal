// Core data model for the browser Graph Digitizer.
// A direct port of the desktop app's calibration.py / models.py math:
// a two-point-per-axis linear mapping between pixel space and graph space.

let idCounter = 0;
export function makeId(prefix = "id") {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

// Each calibration point is captured from a single click on the image, so it
// carries the full (px, py) location (for drawing the marker) plus the known
// graph value. Only the axis-relevant coordinate (px for X points, py for Y
// points) feeds the linear transform below — the other is display-only.
function emptyCalPoint(value) {
  return { px: null, py: null, value };
}

export function createCalibration() {
  return {
    xStart: emptyCalPoint(0),
    xEnd: emptyCalPoint(1),
    yStart: emptyCalPoint(0),
    yEnd: emptyCalPoint(1),
    xAxisName: "X",
    xAxisUnit: "",
    yAxisName: "Y",
    yAxisUnit: "",
    isCalibrated: false,
  };
}

export function axisHeading(name, unit) {
  const trimmedName = (name || "").trim() || "Axis";
  const trimmedUnit = (unit || "").trim();
  return trimmedUnit ? `${trimmedName} (${trimmedUnit})` : trimmedName;
}

export function validateCalibration(calibration) {
  const { xStart, xEnd, yStart, yEnd } = calibration;
  if ([xStart.px, xEnd.px, yStart.py, yEnd.py].some((v) => v === null || v === undefined)) return false;
  const xPixelsDiffer = Math.abs(xEnd.px - xStart.px) > 0.1;
  const yPixelsDiffer = Math.abs(yEnd.py - yStart.py) > 0.1;
  const xValuesDiffer = Math.abs(xEnd.value - xStart.value) > 0.0001;
  const yValuesDiffer = Math.abs(yEnd.value - yStart.value) > 0.0001;
  return xPixelsDiffer && yPixelsDiffer && xValuesDiffer && yValuesDiffer;
}

export function pixelToGraph(calibration, pixelX, pixelY) {
  if (!calibration.isCalibrated) return { x: pixelX, y: pixelY };
  const { xStart, xEnd, yStart, yEnd } = calibration;

  const xScale = (xEnd.value - xStart.value) / (xEnd.px - xStart.px);
  const yScale = (yEnd.value - yStart.value) / (yEnd.py - yStart.py);

  return {
    x: xStart.value + (pixelX - xStart.px) * xScale,
    y: yStart.value + (pixelY - yStart.py) * yScale,
  };
}

export function graphToPixel(calibration, graphX, graphY) {
  if (!calibration.isCalibrated) return { x: graphX, y: graphY };
  const { xStart, xEnd, yStart, yEnd } = calibration;

  const xScale = (xEnd.px - xStart.px) / (xEnd.value - xStart.value);
  const yScale = (yEnd.py - yStart.py) / (yEnd.value - yStart.value);

  return {
    x: xStart.px + (graphX - xStart.value) * xScale,
    y: yStart.py + (graphY - yStart.value) * yScale,
  };
}

export function createPoint(pixelX, pixelY, graphX, graphY) {
  return {
    pointId: makeId("pt"),
    pixelX,
    pixelY,
    graphX,
    graphY,
  };
}

export function createDataset(name, color) {
  return {
    datasetId: makeId("ds"),
    name,
    color,
    visible: true,
    points: [],
  };
}

export function sortedPoints(points) {
  return [...points].sort((a, b) => a.graphX - b.graphX);
}

export function createExternalDataset(name, color, rows) {
  return {
    datasetId: makeId("ext"),
    name,
    color,
    visible: true,
    source: "imported",
    points: rows.map(([x, y]) => ({ pointId: makeId("ept"), graphX: x, graphY: y })),
  };
}

export function createProject(name) {
  return {
    name,
    projectId: makeId("proj"),
    imageDataUrl: null,
    imageWidth: 0,
    imageHeight: 0,
    calibration: createCalibration(),
    datasets: [],
    externalDatasets: [],
    plotSettings: {
      title: "Graph Comparison",
      xLabel: "X Axis",
      yLabel: "Y Axis",
    },
    createdAt: new Date().toISOString(),
  };
}
