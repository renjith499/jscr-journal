// Import/export helpers: CSV parsing, CSV/XLSX/project (.json) download and upload.
import { axisHeading, createCalibration, createExternalDataset } from "./model";
import { compareCurves } from "./comparison";

export function parseDelimitedRows(text) {
  const delimiter = text.includes("\t") ? "\t" : ",";
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const rows = [];
  for (const line of lines) {
    const cells = line.split(delimiter).map((cell) => cell.trim());
    const x = Number(cells[0]);
    const y = Number(cells[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) rows.push([x, y]);
  }
  return rows;
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export async function parseExcelRows(file) {
  const XLSX = await import("xlsx");
  const buffer = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true });

  const parsed = [];
  for (const row of rows) {
    const x = Number(row?.[0]);
    const y = Number(row?.[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) parsed.push([x, y]);
  }
  return parsed;
}

export async function importExternalDataset(file, color) {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);
  const rows = isExcel ? await parseExcelRows(file) : parseDelimitedRows(await readFileAsText(file));
  const name = file.name.replace(/\.(csv|txt|tsv|xlsx|xls)$/i, "");
  return createExternalDataset(name, color, rows);
}

export async function downloadExternalDataTemplate() {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const rows = [
    ["X", "Y"],
    [0, 0],
    [1, 2.5],
    [2, 5.1],
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), "Data");
  XLSX.writeFile(workbook, "graph-digitizer-import-template.xlsx");
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadDatasetCsv(dataset, calibration) {
  const xHead = axisHeading(calibration.xAxisName, calibration.xAxisUnit);
  const yHead = axisHeading(calibration.yAxisName, calibration.yAxisUnit);
  const header = ["point_id", "pixel_x", "pixel_y", xHead, yHead].join(",");
  const lines = dataset.points.map((p) =>
    [p.pointId, p.pixelX ?? "", p.pixelY ?? "", p.graphX, p.graphY].join(",")
  );
  const csv = [header, ...lines].join("\n");
  triggerDownload(new Blob([csv], { type: "text/csv" }), `${dataset.name || "dataset"}.csv`);
}

export function downloadProjectJson(project) {
  const json = JSON.stringify(project, null, 2);
  triggerDownload(new Blob([json], { type: "application/json" }), `${project.name || "project"}.gdp.json`);
}

export async function loadProjectJsonFile(file) {
  const text = await readFileAsText(file);
  const data = JSON.parse(text);
  data.calibration = { ...createCalibration(), ...data.calibration };
  data.datasets = data.datasets || [];
  data.externalDatasets = data.externalDatasets || [];
  return data;
}

function buildComparisonSeries(project) {
  const toSeries = (d) => ({ id: d.datasetId, name: d.name, color: d.color, visible: d.visible, points: d.points.map((p) => ({ x: p.graphX, y: p.graphY })) });
  return [...project.datasets.map(toSeries), ...project.externalDatasets.map(toSeries)];
}

export async function exportProjectExcel(project, options = {}) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();
  const cal = project.calibration;

  const metaRows = [
    ["Project", project.name],
    ["Created", project.createdAt],
    ["X Axis", `${cal.xAxisName} (${cal.xAxisUnit || "-"})`],
    ["Y Axis", `${cal.yAxisName} (${cal.yAxisUnit || "-"})`],
    ["Calibrated", cal.isCalibrated ? "Yes" : "No"],
    ["X start", `${cal.xStart.px}px = ${cal.xStart.value}`],
    ["X end", `${cal.xEnd.px}px = ${cal.xEnd.value}`],
    ["Y start", `${cal.yStart.py}px = ${cal.yStart.value}`],
    ["Y end", `${cal.yEnd.py}px = ${cal.yEnd.value}`],
    ["Digitized datasets", project.datasets.length],
    ["External datasets", project.externalDatasets.length],
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(metaRows), "Metadata");

  const xHead = axisHeading(cal.xAxisName, cal.xAxisUnit);
  const yHead = axisHeading(cal.yAxisName, cal.yAxisUnit);

  project.datasets.forEach((dataset, index) => {
    const rows = [
      ["point_id", "pixel_x", "pixel_y", xHead, yHead],
      ...dataset.points.map((p) => [p.pointId, p.pixelX, p.pixelY, p.graphX, p.graphY]),
    ];
    const sheetName = `${index + 1}_${dataset.name}`.slice(0, 31).replace(/[\\/?*[\]:]/g, "-");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), sheetName || `Dataset ${index + 1}`);
  });

  if (project.externalDatasets.length) {
    const rows = [["dataset", xHead, yHead]];
    project.externalDatasets.forEach((ds) => {
      ds.points.forEach((p) => rows.push([ds.name, p.graphX, p.graphY]));
    });
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), "External Data");
  }

  const summaryRows = [
    ["Dataset", "Type", "Color", "Points", "Visible"],
    ...project.datasets.map((d) => [d.name, "Digitized", d.color, d.points.length, d.visible ? "Yes" : "No"]),
    ...project.externalDatasets.map((d) => [d.name, "External", d.color, d.points.length, d.visible ? "Yes" : "No"]),
  ];
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summaryRows), "Summary");

  const series = buildComparisonSeries(project);
  const eligible = series.filter((s) => s.visible && s.points.length >= 2);
  if (eligible.length >= 2) {
    const reference = eligible.find((s) => s.id === options.referenceId) || eligible[0];
    const comparisons = eligible.filter((s) => s.id !== reference.id);
    const results = comparisons.map((curve) => ({ curve, ...compareCurves(reference, curve) }));

    const summarySheet = [
      ["Reference curve", reference.name],
      [],
      ["Curve", "RMSE", "MAE", "Max Abs Error", `Mean % Error`, "Area Error", "Similarity %", "Points Compared", "Points Skipped"],
      ...results.map(({ curve, summary }) => [
        curve.name, summary.rmse, summary.mae, summary.maxAbsError, summary.meanPctError, summary.areaError, summary.similarity, summary.compared, summary.skipped,
      ]),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summarySheet), "Comparison Summary");

    const pointRows = [
      ["Curve", xHead, `${yHead} (reference)`, `${yHead} (interpolated)`, "Error", "Absolute Error", "% Error", "Status"],
      ...results.flatMap(({ curve, rows }) => rows.map((row) => [curve.name, row.x, row.yRef, row.yInterp, row.error, row.absError, row.pctError, row.status])),
    ];
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(pointRows), "Comparison Points");
  }

  XLSX.writeFile(workbook, `${project.name || "project"}.xlsx`);
}
