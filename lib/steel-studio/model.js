export const defaults = {
  name: "Steel_S355",
  fy: 355,
  fu: 470,
  elongation: 15,
  E: 200000,
  nu: 0.3,
  density: 7850,
};

// Typical nominal properties per structural steel grade. "elongation" here is
// the *uniform* elongation at UTS (the strain the Considère power-law fit
// needs), which is smaller than the total elongation-at-fracture usually
// printed on a mill certificate — treat these as starting points, not
// certified values.
export const gradePresets = [
  { key: "IS2062_E250", label: "IS 2062 E250 (mild steel)", fy: 250, fu: 410, elongation: 18, E: 200000, nu: 0.3, density: 7850 },
  { key: "ASTM_A36", label: "ASTM A36", fy: 250, fu: 400, elongation: 18, E: 200000, nu: 0.3, density: 7850 },
  { key: "S355", label: "S355 (EN 10025-2)", fy: 355, fu: 470, elongation: 15, E: 200000, nu: 0.3, density: 7850 },
  { key: "A992_GR50", label: "ASTM A992 Grade 50", fy: 345, fu: 450, elongation: 14, E: 200000, nu: 0.3, density: 7850 },
  { key: "Q235B", label: "Q235B", fy: 235, fu: 375, elongation: 20, E: 200000, nu: 0.3, density: 7850 },
  { key: "SS304", label: "Stainless 304", fy: 215, fu: 505, elongation: 35, E: 193000, nu: 0.3, density: 8000 },
];

const f = (n, p = 6) => (Number.isFinite(n) ? n.toFixed(p) : "0");

// Converts engineering yield/ultimate/uniform-elongation into an Abaqus
// isotropic-hardening *PLASTIC table using a Hollomon power law (sigma =
// K * eps_p^n) whose exponent n is fixed by Considere's necking criterion —
// n equals the true plastic strain at UTS. The curve is anchored to the true
// yield stress at zero plastic strain (Abaqus's required first row) and
// clamped to be non-decreasing out to UTS; nothing beyond necking is
// generated since post-UTS softening is highly mesh-dependent.
export function generate(i) {
  const warnings = [];
  const eu = i.elongation / 100;

  if (i.fu <= i.fy) warnings.push("Ultimate strength must exceed yield strength.");
  if (eu <= 0) warnings.push("Elongation at UTS must be greater than zero.");
  if (i.nu <= 0 || i.nu >= 0.5) warnings.push("Poisson's ratio should be between 0 and 0.5.");

  const sigmaY = i.fy * (1 + i.fy / i.E);
  const sigmaU = i.fu * (1 + eu);
  const epsUTotalTrue = Math.log(1 + eu);
  const epsUPlastic = epsUTotalTrue - sigmaU / i.E;

  if (epsUPlastic <= 0) {
    warnings.push("Computed plastic strain at UTS is not positive — elongation is too small for this E and fu.");
  }

  const n = Math.max(epsUPlastic, 1e-6);
  const K = sigmaU / Math.pow(n, n);

  const steps = 24;
  const hardening = [{ x: 0, stress: sigmaY }];
  let prevStress = sigmaY;
  for (let q = 1; q <= steps; q++) {
    const ep = n * (q / steps);
    const raw = K * Math.pow(ep, n);
    const stress = Math.max(raw, prevStress);
    hardening.push({ x: ep, stress });
    prevStress = stress;
  }

  hardening.forEach((p, q) => {
    if (q && p.x <= hardening[q - 1].x) warnings.push("Plastic strain values are not strictly increasing.");
    if (q && p.stress < hardening[q - 1].stress) warnings.push("Stress values must not decrease under isotropic hardening.");
  });

  const rows = hardening.map((p) => `${f(p.stress, 4)}, ${f(p.x, 8)}`).join("\n");
  const cleanName = i.name.replace(/[^a-zA-Z0-9_-]/g, "_");
  const text = `** JSCR Steel Studio | N, mm, MPa, tonne\n*Material, name=${cleanName}\n*Density\n${(i.density * 1e-12).toExponential(6)}\n*Elastic, type=ISOTROPIC\n${f(i.E, 3)}, ${f(i.nu, 4)}\n*Plastic, hardening=ISOTROPIC\n${rows}\n`;

  return { hardening, warnings: [...new Set(warnings)], text, sigmaY, sigmaU, epsUPlastic: n };
}
