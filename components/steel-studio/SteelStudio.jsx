"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Clipboard, Download, TriangleAlert } from "lucide-react";
import { defaults, gradePresets, generate } from "@/lib/steel-studio/model";
import { abaqusLibraryFileName, generateAbaqus2020Library } from "@/lib/steel-studio/abaqus-library";
import { SteelEmailGateModal } from "./SteelEmailGateModal";
import { SteelReviewPromptModal } from "./SteelReviewPromptModal";

const EMAIL_SESSION_KEY = "steel_captured_email";
const REVIEW_SHOWN_SESSION_KEY = "steel_review_shown";

function Field({ label, value, onChange, unit }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      <div className="flex rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <input
          className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm outline-none"
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {unit && <span className="self-center pr-3 text-[10px] font-bold text-slate-400">{unit}</span>}
      </div>
    </label>
  );
}

function Plot({ points }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const g = c?.getContext("2d");
    if (!g || !points.length) return;
    const w = c.width;
    const h = c.height;
    const p = 48;
    const xm = Math.max(...points.map((v) => v.x)) || 1;
    const ym = Math.max(...points.map((v) => v.stress)) || 1;
    g.clearRect(0, 0, w, h);
    g.strokeStyle = "#dbe3e8";
    g.fillStyle = "#64748b";
    g.font = "11px monospace";
    // The canvas 2D context persists across redraws (same element), and the
    // axis-label fillText below sets textAlign="center" — without resetting
    // it here, every redraw after the first center-clips these y-axis labels.
    g.textAlign = "left";
    for (let q = 0; q < 5; q++) {
      const y = 18 + ((h - 58) * q) / 4;
      g.beginPath();
      g.moveTo(p, y);
      g.lineTo(w - 12, y);
      g.stroke();
      g.fillText((ym * (1 - q / 4)).toFixed(0), 3, y + 4);
    }
    g.strokeStyle = "#e45b35";
    g.lineWidth = 3;
    g.beginPath();
    points.forEach((v, q) => {
      const x = p + (v.x / xm) * (w - p - 12);
      const y = 18 + (1 - v.stress / ym) * (h - 58);
      q ? g.lineTo(x, y) : g.moveTo(x, y);
    });
    g.stroke();
    g.fillStyle = "#64748b";
    g.textAlign = "center";
    g.fillText("True plastic strain", w / 2, h - 8);
  }, [points]);
  return <canvas ref={ref} width="560" height="260" className="h-64 w-full" />;
}

export function SteelStudio() {
  const [i, setI] = useState(defaults);
  const [projectName, setProjectName] = useState("Steel_Project");
  const [view, setView] = useState("curves");
  const [copied, setCopied] = useState(false);
  const [capturedEmail, setCapturedEmail] = useState(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem(EMAIL_SESSION_KEY)
  );
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const pendingDownloadRef = useRef(null);

  const m = useMemo(() => generate(i), [i]);
  const set = (k, v) => setI((x) => ({ ...x, [k]: v }));

  function applyPreset(key) {
    const preset = gradePresets.find((g) => g.key === key);
    if (!preset) return;
    setI((x) => ({ ...x, name: `Steel_${preset.key}`, fy: preset.fy, fu: preset.fu, elongation: preset.elongation, E: preset.E, nu: preset.nu, density: preset.density }));
  }

  function save(content, fileName, type = "text/plain") {
    const a = document.createElement("a");
    const url = URL.createObjectURL(new Blob([content], { type }));
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  const download = () => save(m.text, `${i.name}.inp`);
  const downloadLibrary = () =>
    save(generateAbaqus2020Library(i, m, projectName), abaqusLibraryFileName(projectName), "application/octet-stream");

  function maybePromptReview() {
    if (typeof window === "undefined" || sessionStorage.getItem(REVIEW_SHOWN_SESSION_KEY)) return;
    sessionStorage.setItem(REVIEW_SHOWN_SESSION_KEY, "1");
    setTimeout(() => setShowReviewPrompt(true), 500);
  }

  function requireEmailThen(downloadAction) {
    if (capturedEmail) {
      downloadAction();
      maybePromptReview();
      return;
    }
    pendingDownloadRef.current = downloadAction;
    setShowEmailGate(true);
  }

  function handleEmailCaptured(email) {
    sessionStorage.setItem(EMAIL_SESSION_KEY, email);
    setCapturedEmail(email);
    setShowEmailGate(false);
    pendingDownloadRef.current?.();
    pendingDownloadRef.current = null;
    maybePromptReview();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Material input</p>
          <h2 className="font-extrabold text-primary dark:text-white">{i.name}</h2>
        </div>

        <label className="mb-3 block text-xs font-bold text-slate-500">
          Grade preset
          <select
            defaultValue=""
            onChange={(e) => applyPreset(e.target.value)}
            className="mt-1 w-full rounded-md border px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="" disabled>
              Choose a typical grade…
            </option>
            {gradePresets.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        <p className="mb-4 text-[11px] leading-4 text-slate-400">
          Presets are nominal starting values, not certified test data — replace with your mill certificate where accuracy matters.
        </p>

        <label className="mb-4 block text-xs font-bold text-slate-500">
          Material name
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-950"
            value={i.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Yield strength (fy)" value={i.fy} unit="MPa" onChange={(v) => set("fy", v)} />
          <Field label="Ultimate strength (fu)" value={i.fu} unit="MPa" onChange={(v) => set("fu", v)} />
          <Field label="Elongation at UTS" value={i.elongation} unit="%" onChange={(v) => set("elongation", v)} />
          <Field label="Elastic modulus" value={i.E} unit="MPa" onChange={(v) => set("E", v)} />
          <Field label="Poisson ratio" value={i.nu} onChange={(v) => set("nu", v)} />
          <Field label="Density" value={i.density} unit="kg/m³" onChange={(v) => set("density", v)} />
        </div>
        <p className="mt-3 text-[11px] leading-4 text-slate-400">
          "Elongation at UTS" is the uniform (necking) strain, not the total elongation-at-fracture on a mill
          certificate — see the Method tab.
        </p>
      </aside>

      <section className="min-w-0">
        <div className="mb-5 flex gap-2 rounded-lg border bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
          {[
            ["curves", "Response curve"],
            ["card", "Abaqus card"],
            ["method", "Method"],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              className={`rounded-md px-4 py-2 text-sm font-bold ${view === k ? "bg-primary text-white" : "text-slate-500"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {view === "curves" && (
          <article className="rounded-lg border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-extrabold text-primary dark:text-white">Isotropic hardening curve</h3>
            <p className="text-xs text-slate-500">Hollomon power law, fit via Considère's necking criterion</p>
            <Plot points={m.hardening} />
          </article>
        )}

        {view === "card" && (
          <div className="rounded-lg border bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex justify-between">
              <div>
                <h3 className="font-extrabold">Abaqus input card</h3>
                <p className="text-xs text-slate-500">N–mm–MPa–tonne unit system</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(m.text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }}
                  className="flex items-center gap-1 rounded-md border px-3 py-2 text-xs font-bold"
                >
                  <Clipboard size={14} />
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => requireEmailThen(download)}
                  className="flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-bold text-white"
                >
                  <Download size={14} />
                  Download .inp
                </button>
              </div>
            </div>
            <pre className="max-h-[620px] overflow-auto rounded-md bg-slate-950 p-5 text-xs leading-6 text-cyan-100">{m.text}</pre>
            <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950">
              <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
                <label className="block text-xs font-bold text-slate-600 dark:text-cyan-100">
                  Material name
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:border-cyan-800 dark:bg-slate-950 dark:text-white"
                    value={i.name}
                    onChange={(event) => set("name", event.target.value)}
                    placeholder="Steel_S355"
                  />
                </label>
                <label className="block flex-1 text-xs font-bold text-slate-600 dark:text-cyan-100">
                  CAE / project name
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:border-cyan-800 dark:bg-slate-950 dark:text-white"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Steel_Project"
                  />
                </label>
                <button
                  onClick={() => requireEmailThen(downloadLibrary)}
                  className="flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2.5 text-xs font-bold text-white sm:col-span-2 sm:justify-self-end"
                >
                  <Download size={14} />
                  Download .lib
                </button>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-cyan-100">
                Additional Abaqus 2020 material-library export. In Property, open the Material Library tab and add
                the generated material to your model. The library filename uses the project name; the material name
                remains <b>{i.name}</b>. Unlike the CDP Calculator's library export, this format hasn't been
                verified against a CAE-created reference file yet — test-import it before relying on it.
              </p>
            </div>
          </div>
        )}

        {view === "method" && (
          <div className="rounded-lg border bg-white p-6 leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <h3 className="text-xl font-extrabold text-primary dark:text-white">Model basis and limits</h3>
            <p className="mt-3">
              Yield and ultimate engineering stresses are converted to true stress using σ_true = σ_eng·(1 + ε_eng).
              The plastic-strain exponent n of the Hollomon hardening law σ = K·ε_p^n is fixed by Considère's
              necking criterion — for a power-law material, true plastic strain at UTS equals n — and K is then
              solved so the curve passes exactly through the UTS point. The first table row is pinned to the true
              yield stress at zero plastic strain, matching Abaqus's required convention, and the rest of the curve
              is clamped to be non-decreasing.
            </p>
            <p className="mt-3">
              The table stops at UTS (onset of necking). Behavior beyond that point is not generated, since
              post-necking softening is strongly mesh-dependent and usually needs an explicit damage/fracture model,
              not pure isotropic hardening.
            </p>
            <div className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
              This produces a starting-point isotropic elastic–plastic card, not a substitute for a calibrated tensile
              test. "Elongation at UTS" must be the uniform elongation — using a total elongation-at-fracture value
              from a certificate will overstate ductility and shift the whole curve.
            </div>
          </div>
        )}

        <div
          className={`mt-5 flex items-center gap-3 rounded-lg border p-4 text-sm ${m.warnings.length ? "border-amber-300 bg-amber-50 text-amber-900" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`}
        >
          {m.warnings.length ? <TriangleAlert /> : <CheckCircle2 />}
          <div>
            <b>{m.warnings.length ? "Review required" : "Ready to export"}</b>
            <p>{m.warnings[0] || "Abaqus coordinate and monotonicity checks pass."}</p>
          </div>
        </div>
      </section>

      {showEmailGate && (
        <SteelEmailGateModal
          onSuccess={handleEmailCaptured}
          onClose={() => {
            setShowEmailGate(false);
            pendingDownloadRef.current = null;
          }}
        />
      )}
      {showReviewPrompt && <SteelReviewPromptModal email={capturedEmail} onClose={() => setShowReviewPrompt(false)} />}
    </div>
  );
}
