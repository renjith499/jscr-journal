"use client";

import { useRef, useState } from "react";
import { Download, FileSpreadsheet, FolderOpen, ImagePlus, Save } from "lucide-react";
import {
  createDataset,
  createProject,
  graphToPixel,
  pixelToGraph,
  sortedPoints,
  validateCalibration,
} from "@/lib/graph-digitizer/model";
import { nextPaletteColor } from "@/lib/graph-digitizer/palette";
import {
  downloadDatasetCsv,
  downloadProjectJson,
  exportProjectExcel,
  importExternalCsv,
  loadProjectJsonFile,
  readFileAsDataUrl,
} from "@/lib/graph-digitizer/io";
import { Toolbar } from "./Toolbar";
import { DigitizerCanvas } from "./DigitizerCanvas";
import { CalibrationPanel } from "./CalibrationPanel";
import { DatasetSidebar } from "./DatasetSidebar";
import { PointTable } from "./PointTable";
import { ComparisonChart, toChartLabel } from "./ComparisonChart";

function loadImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = dataUrl;
  });
}

export function GraphDigitizerApp() {
  const [project, setProject] = useState(() => createProject("Untitled Project"));
  const [activeDatasetId, setActiveDatasetId] = useState(null);
  const [mode, setMode] = useState("pan");
  const [armedField, setArmedField] = useState(null);

  const imageInputRef = useRef(null);
  const projectInputRef = useRef(null);

  const activeDataset = project.datasets.find((d) => d.datasetId === activeDatasetId) || null;

  function recalculateCalibration(nextCalibration, projectDatasets) {
    const isCalibrated = validateCalibration(nextCalibration);
    const calibration = { ...nextCalibration, isCalibrated };
    const datasets = isCalibrated
      ? projectDatasets.map((dataset) => ({
          ...dataset,
          points: dataset.points.map((point) => {
            const { x, y } = pixelToGraph(calibration, point.pixelX, point.pixelY);
            return { ...point, graphX: x, graphY: y };
          }),
        }))
      : projectDatasets;
    return { calibration, datasets };
  }

  async function handleImageFile(file) {
    if (!file) return;
    if (project.imageDataUrl && (project.datasets.length || project.calibration.isCalibrated)) {
      const confirmed = window.confirm("Loading a new image clears the current calibration and datasets. Continue?");
      if (!confirmed) return;
    }
    const dataUrl = await readFileAsDataUrl(file);
    const { width, height } = await loadImageDimensions(dataUrl);
    setProject((current) => ({
      ...createProject(current.name),
      imageDataUrl: dataUrl,
      imageWidth: width,
      imageHeight: height,
    }));
    setActiveDatasetId(null);
    setMode("calibrate");
  }

  function handleAddDataset() {
    const colorIndex = project.datasets.length + project.externalDatasets.length;
    const dataset = createDataset(`Curve ${project.datasets.length + 1}`, nextPaletteColor(colorIndex));
    setProject((current) => ({ ...current, datasets: [...current.datasets, dataset] }));
    setActiveDatasetId(dataset.datasetId);
    if (project.imageDataUrl) setMode("add");
  }

  function updateDataset(datasetId, updater) {
    setProject((current) => ({
      ...current,
      datasets: current.datasets.map((d) => (d.datasetId === datasetId ? updater(d) : d)),
    }));
  }

  function handleArmField(field) {
    setMode("calibrate");
    setArmedField(field);
  }

  function handlePickCalibrationPixel(field, x, y) {
    setProject((current) => {
      const nextCal = {
        ...current.calibration,
        [field]: { ...current.calibration[field], px: x, py: y },
      };
      const { calibration, datasets } = recalculateCalibration(nextCal, current.datasets);
      return { ...current, calibration, datasets };
    });
    setArmedField(null);
  }

  function handleCalibrationValueChange(field, value) {
    setProject((current) => {
      const nextCal = { ...current.calibration, [field]: { ...current.calibration[field], value } };
      const { calibration, datasets } = recalculateCalibration(nextCal, current.datasets);
      return { ...current, calibration, datasets };
    });
  }

  function handleAxisLabelChange(key, value) {
    setProject((current) => ({ ...current, calibration: { ...current.calibration, [key]: value } }));
  }

  function handleAddPoint(imgX, imgY) {
    if (!activeDatasetId) return;
    const { x, y } = pixelToGraph(project.calibration, imgX, imgY);
    updateDataset(activeDatasetId, (dataset) => ({
      ...dataset,
      points: sortedPoints([
        ...dataset.points,
        { pointId: `pt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, pixelX: imgX, pixelY: imgY, graphX: x, graphY: y },
      ]),
    }));
  }

  function handleMovePoint(datasetId, pointId, imgX, imgY) {
    const { x, y } = pixelToGraph(project.calibration, imgX, imgY);
    updateDataset(datasetId, (dataset) => ({
      ...dataset,
      points: dataset.points.map((p) => (p.pointId === pointId ? { ...p, pixelX: imgX, pixelY: imgY, graphX: x, graphY: y } : p)),
    }));
  }

  function handleDeletePoint(datasetId, pointId) {
    updateDataset(datasetId, (dataset) => ({ ...dataset, points: dataset.points.filter((p) => p.pointId !== pointId) }));
  }

  function handleEditPoint(datasetId, pointId, patch) {
    updateDataset(datasetId, (dataset) => ({
      ...dataset,
      points: sortedPoints(
        dataset.points.map((p) => {
          if (p.pointId !== pointId) return p;
          const merged = { ...p, ...patch };
          const { x, y } = graphToPixel(project.calibration, merged.graphX, merged.graphY);
          return project.calibration.isCalibrated ? { ...merged, pixelX: x, pixelY: y } : merged;
        })
      ),
    }));
  }

  function handleDeleteDataset(datasetId) {
    setProject((current) => ({ ...current, datasets: current.datasets.filter((d) => d.datasetId !== datasetId) }));
    if (activeDatasetId === datasetId) setActiveDatasetId(null);
  }

  async function handleImportExternal(file) {
    const colorIndex = project.datasets.length + project.externalDatasets.length;
    const dataset = await importExternalCsv(file, nextPaletteColor(colorIndex));
    setProject((current) => ({ ...current, externalDatasets: [...current.externalDatasets, dataset] }));
  }

  async function handleLoadProject(file) {
    const data = await loadProjectJsonFile(file);
    setProject(data);
    setActiveDatasetId(data.datasets[0]?.datasetId || null);
    setMode(data.calibration.isCalibrated ? "add" : "calibrate");
  }

  const chartLabels = toChartLabel(project.calibration);
  const chartSeries = [
    ...project.datasets.map((d) => ({ id: d.datasetId, name: d.name, color: d.color, visible: d.visible, points: d.points.map((p) => ({ id: p.pointId, x: p.graphX, y: p.graphY })) })),
    ...project.externalDatasets.map((d) => ({ id: d.datasetId, name: d.name, color: d.color, visible: d.visible, points: d.points.map((p) => ({ id: p.pointId, x: p.graphX, y: p.graphY })) })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <input
          value={project.name}
          onChange={(e) => setProject((current) => ({ ...current, name: e.target.value }))}
          className="min-w-[180px] flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-primary outline-none focus:border-accent focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        <button onClick={() => imageInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300">
          <ImagePlus size={16} /> Upload Image
        </button>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageFile(e.target.files?.[0])} />

        <button onClick={() => projectInputRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300">
          <FolderOpen size={16} /> Open Project
        </button>
        <input
          ref={projectInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleLoadProject(file);
            e.target.value = "";
          }}
        />

        <button onClick={() => downloadProjectJson(project)} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-accent hover:text-accent dark:border-slate-700 dark:text-slate-300">
          <Save size={16} /> Save Project
        </button>
        <button onClick={() => exportProjectExcel(project)} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-bold text-white hover:bg-accent">
          <FileSpreadsheet size={16} /> Export Excel
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Toolbar mode={mode} onModeChange={setMode} disabled={!project.imageDataUrl} />
          <DigitizerCanvas
            imageDataUrl={project.imageDataUrl}
            imageWidth={project.imageWidth}
            imageHeight={project.imageHeight}
            calibration={project.calibration}
            datasets={project.datasets}
            mode={mode}
            armedCalibrationField={armedField}
            onPickCalibrationPixel={handlePickCalibrationPixel}
            onAddPoint={handleAddPoint}
            onMovePoint={handleMovePoint}
            onDeletePoint={handleDeletePoint}
          />
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">
                {activeDataset ? `Points — ${activeDataset.name}` : "Points"}
              </h3>
              {activeDataset && (
                <button
                  onClick={() => downloadDatasetCsv(activeDataset, project.calibration)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-accent dark:text-slate-400"
                >
                  <Download size={13} /> CSV
                </button>
              )}
            </div>
            <PointTable dataset={activeDataset} calibration={project.calibration} onEditPoint={handleEditPoint} onDeletePoint={handleDeletePoint} />
          </div>
        </div>

        <div className="space-y-4">
          <CalibrationPanel
            calibration={project.calibration}
            armedField={mode === "calibrate" ? armedField : null}
            onArmField={handleArmField}
            onValueChange={handleCalibrationValueChange}
            onAxisLabelChange={handleAxisLabelChange}
          />
          <DatasetSidebar
            datasets={project.datasets}
            externalDatasets={project.externalDatasets}
            activeDatasetId={activeDatasetId}
            onSelect={(id) => {
              setActiveDatasetId(id);
              if (mode === "pan" || mode === "calibrate") setMode("add");
            }}
            onAdd={handleAddDataset}
            onRename={(id, name) => updateDataset(id, (d) => ({ ...d, name }))}
            onColorChange={(id, color) => updateDataset(id, (d) => ({ ...d, color }))}
            onToggleVisible={(id) => updateDataset(id, (d) => ({ ...d, visible: !d.visible }))}
            onDelete={handleDeleteDataset}
            onExportCsv={(dataset) => downloadDatasetCsv(dataset, project.calibration)}
            onImportExternal={handleImportExternal}
            onDeleteExternal={(id) => setProject((current) => ({ ...current, externalDatasets: current.externalDatasets.filter((d) => d.datasetId !== id) }))}
            onToggleExternalVisible={(id) =>
              setProject((current) => ({
                ...current,
                externalDatasets: current.externalDatasets.map((d) => (d.datasetId === id ? { ...d, visible: !d.visible } : d)),
              }))
            }
          />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-primary dark:text-white">Comparison Chart</h3>
        <ComparisonChart series={chartSeries} xLabel={chartLabels.xLabel} yLabel={chartLabels.yLabel} />
      </div>
    </div>
  );
}
