// Import/export helpers: CSV parsing, CSV/XLSX/project (.json) download and upload.
import { createCalibration, createExternalDataset } from "./model";

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

export async function importExternalCsv(file, color) {
  const text = await readFileAsText(file);
  const rows = parseDelimitedRows(text);
  const name = file.name.replace(/\.(csv|txt|tsv)$/i, "");
  return createExternalDataset(name, color, rows);
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
  const xHead = calibration.xAxisName || "X";
  const yHead = calibration.yAxisName || "Y";
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

export async function exportProjectExcel(project) {
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

  const xHead = cal.xAxisName || "X";
  const yHead = cal.yAxisName || "Y";

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

  XLSX.writeFile(workbook, `${project.name || "project"}.xlsx`);
}
