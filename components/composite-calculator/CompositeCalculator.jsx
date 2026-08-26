"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookmarkPlus,
  Calculator,
  CheckCircle2,
  Download,
  FlaskConical,
  Sigma,
} from "lucide-react";
import {
  abaqusText,
  calculateAllMethods,
  calculateComposite,
  defaults,
  METHODS,
} from "@/lib/composite-calculator/model";
import { addMaterial } from "@/lib/material-models/library-store";
import { MaterialDownloadGateModal } from "@/components/material-models/MaterialDownloadGateModal";
import { MaterialReviewPromptModal } from "@/components/material-models/MaterialReviewPromptModal";

const EMAIL_SESSION_KEY = "material_models_captured_email";
const REVIEW_SESSION_KEY = "material_models_review_shown";

const ISOTROPIC_GROUPS = [
  [
    "Elastic constants (enter any two)",
    [
      ["E", "Young's modulus E", "MPa"],
      ["G", "Shear modulus G", "MPa"],
      ["nu", "Poisson ratio ν", ""],
      ["K", "Bulk modulus K", "MPa"],
    ],
  ],
  [
    "Physical and thermal",
    [
      ["density", "Density ρ", "kg/m³"],
      ["alpha", "Thermal expansion α", "×10⁻⁶/K"],
      ["cp", "Specific heat cₚ", "J/(kg·K)"],
    ],
  ],
  [
    "Strength",
    [
      ["tensile", "Tensile yield/strength", "MPa"],
      ["compression", "Compressive yield/strength", "MPa"],
    ],
  ],
];

const ORTHOTROPIC_GROUPS = [
  [
    "Directional Young's moduli",
    [
      ["E1", "E₁", "MPa"],
      ["E2", "E₂", "MPa"],
      ["E3", "E₃", "MPa"],
    ],
  ],
  [
    "Directional shear moduli",
    [
      ["G12", "G₁₂", "MPa"],
      ["G13", "G₁₃", "MPa"],
      ["G23", "G₂₃", "MPa"],
    ],
  ],
  [
    "Major Poisson ratios",
    [
      ["nu12", "ν₁₂", ""],
      ["nu13", "ν₁₃", ""],
      ["nu23", "ν₂₃", ""],
    ],
  ],
  [
    "Direction-wise tensile yield/strength",
    [
      ["tensile1", "Direction 1", "MPa"],
      ["tensile2", "Direction 2", "MPa"],
      ["tensile3", "Direction 3", "MPa"],
    ],
  ],
  [
    "Direction-wise compressive yield/strength",
    [
      ["compression1", "Direction 1", "MPa"],
      ["compression2", "Direction 2", "MPa"],
      ["compression3", "Direction 3", "MPa"],
    ],
  ],
  [
    "Direction-wise thermal expansion",
    [
      ["alpha1", "α₁", "×10⁻⁶/K"],
      ["alpha2", "α₂", "×10⁻⁶/K"],
      ["alpha3", "α₃", "×10⁻⁶/K"],
    ],
  ],
  [
    "Physical and thermal",
    [
      ["density", "Density ρ", "kg/m³"],
      ["cp", "Specific heat cₚ", "J/(kg·K)"],
    ],
  ],
];

const OUTPUTS = [
  [
    "Engineering constants",
    [
      ["E1", "E₁", "MPa"],
      ["E2", "E₂", "MPa"],
      ["E3", "E₃", "MPa"],
      ["G12", "G₁₂", "MPa"],
      ["G13", "G₁₃", "MPa"],
      ["G23", "G₂₃", "MPa"],
      ["nu12", "ν₁₂", ""],
      ["nu13", "ν₁₃", ""],
      ["nu23", "ν₂₃", ""],
      ["nu21", "ν₂₁", ""],
    ],
  ],
  [
    "Direction-wise yield/strength estimates",
    [
      ["Xt", "Xₜ — tension, direction 1", "MPa"],
      ["Xc", "X꜀ — compression, direction 1", "MPa"],
      ["Yt", "Yₜ — tension, direction 2", "MPa"],
      ["Yc", "Y꜀ — compression, direction 2", "MPa"],
      ["Zt", "Zₜ — tension, direction 3", "MPa"],
      ["Zc", "Z꜀ — compression, direction 3", "MPa"],
    ],
  ],
  [
    "Density and thermal properties",
    [
      ["density", "Composite density", "kg/m³"],
      ["alpha1", "α₁", "×10⁻⁶/K"],
      ["alpha2", "α₂", "×10⁻⁶/K"],
      ["alpha3", "α₃", "×10⁻⁶/K"],
      ["cp", "Specific heat cₚ", "J/(kg·K)"],
      ["volumetricHeat", "Volumetric heat capacity", "J/(m³·K)"],
    ],
  ],
];

const COMPARISON_PROPERTIES = [
  ["E1", "E1 — axial modulus", "MPa"],
  ["E2", "E2 — transverse modulus", "MPa"],
  ["E3", "E3 — transverse modulus", "MPa"],
  ["G12", "G12 — in-plane shear modulus", "MPa"],
  ["G13", "G13 — shear modulus", "MPa"],
  ["G23", "G23 — transverse shear modulus", "MPa"],
  ["Xt", "Xt — direction-1 tensile yield/strength", "MPa"],
  ["Xc", "Xc — direction-1 compressive yield/strength", "MPa"],
  ["Yt", "Yt — direction-2 tensile yield/strength", "MPa"],
  ["Yc", "Yc — direction-2 compressive yield/strength", "MPa"],
  ["Zt", "Zt — direction-3 tensile yield/strength", "MPa"],
  ["Zc", "Zc — direction-3 compressive yield/strength", "MPa"],
];

function Field({ label, unit, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <div className="flex rounded-md border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <input
          type="number"
          step="any"
          value={value}
          placeholder="Optional"
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-sm outline-none"
        />
        {unit && (
          <span className="self-center pr-3 text-[10px] font-bold text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function ConstituentCard({ title, value, onChange, completed }) {
  const orthotropic = value.type === "orthotropic";
  const groups = orthotropic ? ORTHOTROPIC_GROUPS : ISOTROPIC_GROUPS;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-primary dark:text-white">
          {title}
        </h2>
        <select
          value={value.type || "isotropic"}
          onChange={(event) => onChange("type", event.target.value)}
          className="rounded-md border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-extrabold text-primary outline-none dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100"
        >
          <option value="isotropic">Isotropic</option>
          <option value="orthotropic">Orthotropic</option>
        </select>
      </div>
      {groups.map(([group, fields]) => (
        <div key={group} className="mb-5 last:mb-0">
          <h3 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            {group}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {fields.map(([key, label, unit]) => (
              <Field
                key={key}
                label={label}
                unit={unit}
                value={value[key]}
                onChange={(next) => onChange(key, next)}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        {orthotropic ? (
          <>
            <b>Orthotropic input:</b> missing directional values affect only
            dependent composite properties.
          </>
        ) : (
          <>
            <b>Elastic completion:</b>{" "}
            {completed.pair
              ? `using ${completed.pair}; inferred ${completed.inferred.join(", ") || "none"}.`
              : "enter any two of E, G, ν and K."}
          </>
        )}
      </div>
    </section>
  );
}

function format(value) {
  if (value === null) return "Not calculated";
  const a = Math.abs(value);
  return a !== 0 && (a >= 1e6 || a < 1e-3)
    ? value.toExponential(5)
    : value.toLocaleString(undefined, { maximumSignificantDigits: 7 });
}

function ComparisonBars({ comparisons, propertyKey, selectedMethod }) {
  const [, propertyLabel, unit] =
    COMPARISON_PROPERTIES.find(([key]) => key === propertyKey) ||
    COMPARISON_PROPERTIES[0];
  const values = comparisons.map(
    ({ model }) => model.properties[propertyKey].value,
  );
  const maximum = Math.max(
    0,
    ...values.filter((value) => Number.isFinite(value)),
  );
  return (
    <div
      className="space-y-3"
      role="img"
      aria-label={`${propertyLabel} comparison by homogenization method`}
    >
      {comparisons.map(({ method, label, model: compared }) => {
        const value = compared.properties[propertyKey].value;
        const width =
          value !== null && maximum > 0
            ? Math.max(1, (value / maximum) * 100)
            : 0;
        return (
          <div
            key={method}
            className="grid gap-1 sm:grid-cols-[220px_1fr_125px] sm:items-center"
          >
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {label}
            </span>
            <div className="h-7 overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
              {value !== null && (
                <div
                  className={`h-full rounded transition-[width] duration-300 ${method === selectedMethod ? "bg-primary" : "bg-cyan-500/60"}`}
                  style={{ width: `${width}%` }}
                />
              )}
            </div>
            <span className="font-mono text-xs text-slate-700 dark:text-slate-200">
              {value === null ? "Not available" : `${format(value)} ${unit}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function download(content, name, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function CompositeCalculator() {
  const [input, setInput] = useState(defaults);
  const [calculatedInput, setCalculatedInput] = useState(defaults);
  const [tab, setTab] = useState("results");
  const [comparisonProperty, setComparisonProperty] = useState("E2");
  const [capturedEmail, setCapturedEmail] = useState(() =>
    typeof window === "undefined"
      ? null
      : sessionStorage.getItem(EMAIL_SESSION_KEY),
  );
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [savedToLibrary, setSavedToLibrary] = useState(false);
  const pendingDownload = useRef(null);
  const model = useMemo(
    () => calculateComposite(calculatedInput),
    [calculatedInput],
  );
  const comparisons = useMemo(
    () => calculateAllMethods(calculatedInput),
    [calculatedInput],
  );
  const calculationPending = useMemo(
    () => JSON.stringify(input) !== JSON.stringify(calculatedInput),
    [input, calculatedInput],
  );
  const updateConstituent = (side, key, value) =>
    setInput((current) => ({
      ...current,
      [side]: { ...current[side], [key]: value },
    }));
  const csv = () => {
    const rows = [["Property", "Value", "Unit", "Equation", "Missing inputs"]];
    OUTPUTS.forEach(([, fields]) =>
      fields.forEach(([key, label, unit]) => {
        const item = model.properties[key];
        rows.push([
          label,
          item.value ?? "",
          unit,
          item.equation,
          item.missing.join("; "),
        ]);
      }),
    );
    return rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
  };
  const safeName = (calculatedInput.name || "Composite").replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
  const maybeReview = () => {
    if (sessionStorage.getItem(REVIEW_SESSION_KEY)) return;
    sessionStorage.setItem(REVIEW_SESSION_KEY, "1");
    setTimeout(() => setShowReview(true), 500);
  };
  const requireEmail = (action) => {
    if (capturedEmail) {
      action();
      maybeReview();
      return;
    }
    pendingDownload.current = action;
    setShowEmailGate(true);
  };
  const emailCaptured = (email) => {
    sessionStorage.setItem(EMAIL_SESSION_KEY, email);
    setCapturedEmail(email);
    setShowEmailGate(false);
    pendingDownload.current?.();
    pendingDownload.current = null;
    maybeReview();
  };
  const saveToLibrary = () => {
    addMaterial(
      "composite",
      calculatedInput.name || "Composite",
      calculatedInput,
    );
    setSavedToLibrary(true);
    setTimeout(() => setSavedToLibrary(false), 1500);
  };
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">
              Composite material name
            </span>
            <input
              value={input.name}
              onChange={(event) =>
                setInput((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-md border border-slate-200 px-3 py-2 font-mono text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <Field
            label="Fiber volume fraction"
            unit="%"
            value={input.fiberPercent}
            onChange={(value) =>
              setInput((current) => ({ ...current, fiberPercent: value }))
            }
          />
          <Field
            label="Void volume fraction"
            unit="%"
            value={input.voidPercent}
            onChange={(value) =>
              setInput((current) => ({ ...current, voidPercent: value }))
            }
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
          <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-primary dark:bg-cyan-950">
            Vf {(model.vf * 100).toFixed(2)}%
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Vm {(model.vm * 100).toFixed(2)}%
          </span>
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Vvoid {(model.vv * 100).toFixed(2)}%
          </span>
        </div>
      </section>
      <section className="rounded-xl border border-cyan-200 bg-cyan-50/40 p-5 dark:border-cyan-900 dark:bg-cyan-950/30">
        <div className="grid gap-4 lg:grid-cols-3">
          <label className="lg:col-span-2">
            <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">
              Homogenization method used for results and Abaqus export
            </span>
            <select
              value={input.method}
              onChange={(event) =>
                setInput((current) => ({ ...current, method: event.target.value }))
              }
              className="w-full rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm font-bold text-primary dark:border-cyan-900 dark:bg-slate-950 dark:text-white"
            >
              {Object.entries(METHODS).map(([key, item]) => (
                <option key={key} value={key}>{item.name}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-500">{METHODS[input.method].short}</p>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Halpin–Tsai ξ, transverse"
              value={input.halpinXiTransverse}
              onChange={(value) => setInput((current) => ({ ...current, halpinXiTransverse: value }))}
            />
            <Field
              label="Halpin–Tsai ξ, shear"
              value={input.halpinXiShear}
              onChange={(value) => setInput((current) => ({ ...current, halpinXiShear: value }))}
            />
          </div>
        </div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <ConstituentCard
          title="Fiber properties"
          value={input.fiber}
          completed={model.fiber}
          onChange={(key, value) => updateConstituent("fiber", key, value)}
        />
        <ConstituentCard
          title="Matrix properties"
          value={input.matrix}
          completed={model.matrix}
          onChange={(key, value) => updateConstituent("matrix", key, value)}
        />
      </div>
      <section className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-300 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-cyan-800 dark:bg-slate-900/95">
        <div>
          <p className="text-sm font-extrabold text-primary dark:text-white">
            {calculationPending
              ? "Inputs changed — calculate to update the results"
              : "Results are up to date"}
          </p>
          <p className="text-xs text-slate-500">
            The comparison chart and Abaqus export use the last calculated inputs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCalculatedInput(input);
            setTab("results");
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-extrabold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!calculationPending}
        >
          <Calculator size={18} />
          Calculate composite properties
        </button>
      </section>
      <nav className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
        {[
          ["results", "Effective properties"],
          ["compare", "Compare methods"],
          ["equations", "Equations & assumptions"],
          ["export", "Abaqus export"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-md px-4 py-2 text-sm font-bold ${tab === key ? "bg-primary text-white" : "text-slate-500"}`}
          >
            {label}
          </button>
        ))}
      </nav>
      {tab === "results" && (
        <div className="space-y-5">
          {OUTPUTS.map(([group, fields]) => (
            <section
              key={group}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="mb-4 text-lg font-extrabold text-primary dark:text-white">
                {group}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {fields.map(([key, label, unit]) => {
                  const item = model.properties[key];
                  return (
                    <article
                      key={key}
                      className={`rounded-lg border p-4 ${item.value === null ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" : "border-cyan-200 bg-cyan-50/50 dark:border-cyan-900 dark:bg-cyan-950/40"}`}
                    >
                      <p className="text-xs font-bold text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-xl font-extrabold text-primary dark:text-white">
                        {format(item.value)}{" "}
                        {item.value !== null && (
                          <span className="text-xs font-semibold text-slate-400">
                            {unit}
                          </span>
                        )}
                      </p>
                      {item.value === null && (
                        <p className="mt-2 text-[11px] leading-4 text-amber-700 dark:text-amber-300">
                          Missing: {item.missing.join(", ")}
                        </p>
                      )}
                      <p className="mt-2 text-[10px] leading-4 text-slate-500">
                        {item.equation}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
      {tab === "compare" && (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-5">
            <h2 className="text-lg font-extrabold text-primary dark:text-white">
              Elastic and yield/strength method comparison
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Yield/strength values are micromechanical screening estimates, not
              complete plastic stress–strain curves or failure criteria. “—”
              means the method is not applicable or an input is missing.
            </p>
            <label className="mt-5 block max-w-md">
              <span className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">
                Bar-chart property
              </span>
              <select
                value={comparisonProperty}
                onChange={(event) =>
                  setComparisonProperty(event.target.value)
                }
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              >
                {COMPARISON_PROPERTIES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt-5">
              <ComparisonBars
                comparisons={comparisons}
                propertyKey={comparisonProperty}
                selectedMethod={calculatedInput.method}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950">
                <tr>
                  <th className="px-4 py-3">Method</th>
                  {["E1", "E2", "E3", "G12", "G13", "G23", "nu12", "nu23"].map((key) => <th key={key} className="px-3 py-3">{key}</th>)}
                </tr>
              </thead>
              <tbody>
                {comparisons.map(({ method, label, model: compared }) => (
                  <tr key={method} className={`border-t border-slate-100 dark:border-slate-800 ${method === calculatedInput.method ? "bg-cyan-50/70 dark:bg-cyan-950/30" : ""}`}>
                    <th className="px-4 py-3 text-left text-xs font-extrabold text-primary dark:text-white">{label}</th>
                    {["E1", "E2", "E3", "G12", "G13", "G23", "nu12", "nu23"].map((key) => (
                      <td key={key} className="px-3 py-3 font-mono text-xs">{compared.properties[key].value === null ? "—" : format(compared.properties[key].value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {tab === "equations" && (
        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <div>
            <h2 className="text-xl font-extrabold text-primary dark:text-white">
              Model equations
            </h2>
            <p className="mt-2">
              Direction 1 is parallel to the continuous fibers. Constituents may
              independently be isotropic or orthotropic. Vₘ = 1 − V_f − V_void.
              Missing inputs are never replaced with arbitrary defaults.
            </p>
          </div>
          <EquationSection
            title="Isotropic constituent completion"
            equations={[
              "E = 2G(1 + ν)",
              "E = 3K(1 − 2ν)",
              "E = 9KG/(3K + G)",
              "ν = E/(2G) − 1",
              "ν = (3K − 2G)/[2(3K + G)]",
            ]}
          />
          <EquationSection
            title="Voigt–Reuss / Rule of Mixtures"
            equations={[
              "E₁ = V_fE₁f + VₘE₁m (Voigt / iso-strain)",
              "1/E₂ = V_f/E₂f + Vₘ/E₂m; 1/E₃ = V_f/E₃f + Vₘ/E₃m",
              "1/Gᵢⱼ = V_f/Gᵢⱼf + Vₘ/Gᵢⱼm for 12, 13 and 23",
              "νᵢⱼ = V_fνᵢⱼf + Vₘνᵢⱼm for 12, 13 and 23",
              "ν₂₁ = ν₁₂E₂/E₁",
            ]}
          />
          <EquationSection
            title="Alternative homogenization methods"
            equations={[
              "Hill: P_H = (P_V + P_R)/2",
              "Halpin–Tsai: P_c/P_m = (1 + ξηV_f)/(1 − ηV_f); η = (P_f/P_m − 1)/(P_f/P_m + ξ)",
              "Chamis: P_T = P_m/[1 − √V_f(1 − P_m/P_f)]",
              "Mori–Tanaka bulk: K = K_m + V_f(K_f−K_m)/[1 + V_m(K_f−K_m)/(K_m+4G_m/3)]",
              "Mori–Tanaka shear uses ζ_m = G_m(9K_m+8G_m)/[6(K_m+2G_m)]",
              "Mori–Tanaka output: E = 9KG/(3K+G); ν = (3K−2G)/[2(3K+G)]",
            ]}
          />
          <EquationSection
            title="Yield/strength screening estimates"
            equations={[
              "Voigt–Reuss: direct ROM in direction 1; inverse ROM in directions 2 and 3",
              "Hill: S_H = (S_V + S_R)/2",
              "Halpin–Tsai: S_c/S_m = (1 + ξηV_f)/(1 − ηV_f)",
              "Chamis: S_T = S_m/[1 − √V_f(1 − S_m/S_f)]",
              "Mori–Tanaka: no strength result from the present linear-elastic spherical-inclusion model",
              "These values estimate onset strength only; they do not define post-yield plastic hardening or damage evolution.",
            ]}
          />
          <EquationSection
            title="Density and thermal properties"
            equations={[
              "ρ_c = V_fρ_f + Vₘρₘ",
              "αᵢ = (V_fEᵢfαᵢf + VₘEᵢmαᵢm)/(V_fEᵢf + VₘEᵢm), i = 1,2,3",
              "w_i = V_iρ_i/ρ_c; c_p,c = w_fc_p,f + wₘc_p,m",
              "Volumetric heat capacity = ρ_cc_p,c",
            ]}
          />
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <b>Engineering limitation:</b> transverse modulus, shear modulus,
            strength and transverse CTE are sensitive to fiber geometry,
            interface quality, void morphology and processing. The displayed
            values are preliminary estimates, not certification data, plastic
            stress–strain laws or a progressive failure model.
          </div>
          <References />
        </section>
      )}
      {tab === "export" && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-primary dark:text-white">
                Abaqus engineering-constants card
              </h2>
              <p className="text-xs text-slate-500">
                N–mm–MPa–tonne–K units. Sections with missing inputs are omitted
                automatically.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveToLibrary}
                className="flex items-center gap-1.5 rounded-md border border-cyan-200 px-3 py-2 text-xs font-bold text-primary dark:border-cyan-800 dark:text-cyan-100"
              >
                <BookmarkPlus size={14} />
                {savedToLibrary ? "Added" : "Add to Library"}
              </button>
              <button
                onClick={() => requireEmail(() => download(csv(), `${safeName}_properties.csv`, "text/csv"))}
                className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold"
              >
                <Download size={14} />
                CSV
              </button>
              <button
                onClick={() =>
                  requireEmail(() => download(
                    abaqusText(calculatedInput, model),
                    `${safeName}.inp`,
                  ))
                }
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold text-white"
              >
                <Download size={14} />
                Abaqus .inp
              </button>
            </div>
          </div>
          <pre className="max-h-[560px] overflow-auto rounded-lg bg-slate-950 p-5 text-xs leading-6 text-cyan-100">
            {abaqusText(calculatedInput, model)}
          </pre>
        </section>
      )}
      <div
        className={`flex items-start gap-3 rounded-lg border p-4 text-sm ${model.warnings.length ? "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950 dark:text-amber-100" : "border-emerald-300 bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100"}`}
      >
        {model.warnings.length ? <AlertTriangle /> : <CheckCircle2 />}
        <div>
          <b>
            {model.warnings.length
              ? "Review input assumptions"
              : "Inputs are internally consistent"}
          </b>
          {model.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      </div>
      {showEmailGate && (
        <MaterialDownloadGateModal
          source="Composite Property Calculator"
          onSuccess={emailCaptured}
          onClose={() => {
            setShowEmailGate(false);
            pendingDownload.current = null;
          }}
        />
      )}
      {showReview && (
        <MaterialReviewPromptModal
          email={capturedEmail}
          source="Composite Property Calculator"
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}

function EquationSection({ title, equations }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-extrabold text-primary dark:text-white">
        <Sigma size={16} />
        {title}
      </h3>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {equations.map((equation) => (
          <code
            key={equation}
            className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-700 dark:bg-slate-950 dark:text-cyan-100"
          >
            {equation}
          </code>
        ))}
      </div>
    </div>
  );
}
function References() {
  return (
    <div>
      <h3 className="flex items-center gap-2 font-extrabold text-primary dark:text-white">
        <FlaskConical size={16} />
        References and implementation basis
      </h3>
      <ol className="mt-2 list-decimal space-y-2 pl-5">
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://doi.org/10.1002/pen.760160512"
            target="_blank"
            rel="noreferrer"
          >
            Halpin and Kardos, Polymer Engineering &amp; Science 16 (1976),
            344–352
          </a>{" "}
          — review and application basis of the Halpin–Tsai equations.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://doi.org/10.1088/0370-1298/65/5/307"
            target="_blank"
            rel="noreferrer"
          >
            R. Hill, Proceedings of the Physical Society A 65 (1952), 349–354
          </a>{" "}
          — Voigt–Reuss–Hill averaging.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://doi.org/10.1016/0001-6160(73)90064-3"
            target="_blank"
            rel="noreferrer"
          >
            Mori and Tanaka, Acta Metallurgica 21 (1973), 571–574
          </a>{" "}
          — average-field inclusion homogenization. This calculator implements
          its isotropic spherical-inclusion specialization.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://ntrs.nasa.gov/api/citations/19830011546/downloads/19830011546.pdf"
            target="_blank"
            rel="noreferrer"
          >
            C. C. Chamis, Simplified Composite Micromechanics, NASA TM-83320
            (1983)
          </a>{" "}
          — micromechanics relations for UD composite mechanical and thermal
          properties.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://doi.org/10.1016/S0266-3538(99)00128-1"
            target="_blank"
            rel="noreferrer"
          >
            Jacquet, Trivaudey and Varchon, Composites Science and Technology 60
            (2000), 345–350
          </a>{" "}
          — classical ROM behavior and limitations for transverse modulus.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://doi.org/10.1016/0020-7225(70)90066-2"
            target="_blank"
            rel="noreferrer"
          >
            Rosen and Hashin, International Journal of Engineering Science 8
            (1970), 157–173
          </a>{" "}
          — effective thermal expansion and specific heat of composites.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://docs.software.vt.edu/abaqusv2025/English/SIMACAEMATRefMap/simamat-c-linearelastic.htm"
            target="_blank"
            rel="noreferrer"
          >
            Abaqus 2025 documentation: Linear Elastic Behavior
          </a>{" "}
          — engineering constants, reciprocal Poisson ratios and stability
          requirements.
        </li>
        <li>
          <a
            className="font-bold text-accent underline"
            href="https://docs.software.vt.edu/abaqusv2025/English/SIMACAEMATRefMap/simamat-c-thermalexpan.htm"
            target="_blank"
            rel="noreferrer"
          >
            Abaqus documentation: Thermal Expansion
          </a>{" "}
          and{" "}
          <a
            className="font-bold text-accent underline"
            href="https://docs.software.vt.edu/abaqusv2025/English/SIMACAEMATRefMap/simamat-c-specificheat.htm"
            target="_blank"
            rel="noreferrer"
          >
            Specific Heat
          </a>
          .
        </li>
      </ol>
    </div>
  );
}
