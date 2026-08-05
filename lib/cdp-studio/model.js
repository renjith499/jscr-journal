export const defaults = {
  name: "CDP_40MPa",
  fc: 40,
  E: 35220,
  nu: 0.2,
  density: 2400,
  ft: 3.5,
  Gf: 0.12,
  peak: 0.0022,
  ultimate: 0.008,
  dc: 0.72,
  dilation: 36,
  eccentricity: 0.1,
  fb0fc0: 1.16,
  k: 0.6667,
  viscosity: 0.0001,
};
export const estimates = (fc) => ({
  E: Math.round(22000 * Math.pow(fc / 10, 0.3)),
  ft: +(
    fc <= 50 ? 0.3 * Math.pow(fc, 2 / 3) : 2.12 * Math.log(1 + fc / 10)
  ).toFixed(3),
  Gf: +(0.073 * Math.pow(fc / 10, 0.18)).toFixed(3),
});
const f = (n, p = 6) => (Number.isFinite(n) ? n.toFixed(p) : "0");
function safe(candidate, oldD, x, s, E, oldP) {
  const a = x - oldP - 1e-10,
    e = s / E,
    max = a <= 0 ? 0 : a / (a + e),
    d = Math.max(oldD, Math.min(candidate, 0.985, max * 0.995));
  return { d, p: x - (d / Math.max(1e-12, 1 - d)) * e };
}
export function generate(i) {
  const warnings = [],
    n = (i.E * i.peak) / Math.max(1e-9, i.E * i.peak - i.fc),
    stressAt = (e) => {
      const r = e / i.peak;
      return (i.fc * n * r) / Math.max(1e-12, n - 1 + Math.pow(r, n));
    };
  let lo = 0,
    hi = i.peak;
  for (let q = 0; q < 60; q++) {
    const m = (lo + hi) / 2;
    if (stressAt(m) < 0.4 * i.fc) lo = m;
    else hi = m;
  }
  const ey = (lo + hi) / 2,
    yieldStress = 0.4 * i.fc,
    yieldInelasticStrain = ey - yieldStress / i.E,
    compression = [];
  let od = 0,
    op = 0;
  for (let q = 0; q < 28; q++) {
    const e = ey + ((i.ultimate - ey) * q) / 27,
      s = q ? stressAt(e) : yieldStress,
      // Abaqus defines the first compression-hardening row as the onset of
      // inelastic behavior and requires its crushing/inelastic strain to be
      // exactly zero. Rebase every subsequent coordinate to that yield row.
      x = q === 0 ? 0 : Math.max(0, e - s / i.E - yieldInelasticStrain),
      post = Math.max(0, (e - i.peak) / Math.max(1e-12, i.ultimate - i.peak)),
      z = safe(i.dc * Math.pow(post, 0.8), od, x, s, i.E, op);
    compression.push({ x, stress: s, damage: z.d, plastic: z.p });
    od = z.d;
    op = z.p;
  }
  const tension = [],
    w0 = i.Gf / i.ft,
    wf = -Math.log(0.01) * w0;
  od = 0;
  op = 0;
  for (let q = 0; q < 22; q++) {
    const x = (wf * q) / 21,
      s = i.ft * Math.exp(-x / w0),
      z = safe((0.9 * x) / wf, od, x / 25, s, i.E, op);
    tension.push({ x, stress: s, damage: z.d, plastic: z.p });
    od = z.d;
    op = z.p;
  }
  const check = (a, label) =>
    a.forEach((p, q) => {
      if (q && p.x <= a[q - 1].x)
        warnings.push(`${label} coordinates are not increasing.`);
      if (p.plastic < 0 || (q && p.plastic < a[q - 1].plastic - 1e-9))
        warnings.push(`${label} plastic strain is invalid.`);
    });
  check(compression, "Compression");
  check(tension, "Tension");
  if (compression[0].x !== 0)
    warnings.push("Compression first-yield strain must be zero.");
  if (compression[0].damage !== 0)
    warnings.push("Compression first-yield damage must be zero.");
  if (i.ultimate <= i.peak)
    warnings.push("Ultimate strain must exceed peak strain.");
  const rows = (a, get) =>
      a.map((p) => `${f(get(p))}, ${f(p.x, 8)}`).join("\n"),
    text = `** JSCR CDP Studio | N, mm, MPa, tonne\n*Material, name=${i.name.replace(/[^a-zA-Z0-9_-]/g, "_")}\n*Density\n${(i.density * 1e-12).toExponential(6)}\n*Elastic\n${f(i.E, 3)}, ${f(i.nu, 4)}\n*Concrete Damaged Plasticity\n${f(i.dilation, 4)}, ${f(i.eccentricity, 4)}, ${f(i.fb0fc0, 4)}, ${f(i.k, 4)}, ${f(i.viscosity, 6)}\n*Concrete Compression Hardening\n${rows(compression, (p) => p.stress)}\n*Concrete Compression Damage\n${rows(compression, (p) => p.damage)}\n*Concrete Tension Stiffening, type=DISPLACEMENT\n${rows(tension, (p) => p.stress)}\n*Concrete Tension Damage, type=DISPLACEMENT\n${rows(tension, (p) => p.damage)}\n`;
  return { compression, tension, warnings: [...new Set(warnings)], text };
}
