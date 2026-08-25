export const defaults = {
  name: "UD_Carbon_Epoxy",
  method: "rom",
  halpinXiTransverse: 2,
  halpinXiShear: 1,
  fiberPercent: 60,
  voidPercent: 0,
  fiber: {
    type: "isotropic",
    E: 230000,
    G: "",
    nu: 0.2,
    K: "",
    density: 1800,
    tensile: 3500,
    compression: 1800,
    alpha: -0.5,
    cp: 710,
    E1: "",
    E2: "",
    E3: "",
    G12: "",
    G13: "",
    G23: "",
    nu12: "",
    nu13: "",
    nu23: "",
    tensile1: "",
    tensile2: "",
    tensile3: "",
    compression1: "",
    compression2: "",
    compression3: "",
    alpha1: "",
    alpha2: "",
    alpha3: "",
  },
  matrix: {
    type: "isotropic",
    E: 3500,
    G: "",
    nu: 0.35,
    K: "",
    density: 1200,
    tensile: 70,
    compression: 120,
    alpha: 55,
    cp: 1100,
    E1: "",
    E2: "",
    E3: "",
    G12: "",
    G13: "",
    G23: "",
    nu12: "",
    nu13: "",
    nu23: "",
    tensile1: "",
    tensile2: "",
    tensile3: "",
    compression1: "",
    compression2: "",
    compression3: "",
    alpha1: "",
    alpha2: "",
    alpha3: "",
  },
};

const valid = (value) =>
  value !== "" && value !== null && Number.isFinite(Number(value));
const positive = (value) => valid(value) && Number(value) > 0;
const n = (value) => Number(value);
const close = (a, b) =>
  Math.abs(a - b) <= Math.max(1e-8, 0.01 * Math.max(Math.abs(a), Math.abs(b)));

export function completeIsotropic(source, label = "Constituent") {
  const p = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [
      key,
      valid(value) ? n(value) : null,
    ]),
  );
  for (const key of [
    "E",
    "G",
    "nu",
    "K",
    "density",
    "tensile",
    "compression",
    "alpha",
    "cp",
  ])
    if (!(key in p)) p[key] = null;
  const supplied = { E: p.E, G: p.G, nu: p.nu, K: p.K };
  const warnings = [];
  let pair = null;
  if (positive(p.E) && positive(p.G)) pair = "EG";
  else if (positive(p.E) && valid(p.nu)) pair = "Enu";
  else if (positive(p.E) && positive(p.K)) pair = "EK";
  else if (positive(p.G) && valid(p.nu)) pair = "Gnu";
  else if (positive(p.G) && positive(p.K)) pair = "GK";
  else if (positive(p.K) && valid(p.nu)) pair = "Knu";

  let derived = null;
  if (pair === "EG")
    derived = {
      E: p.E,
      G: p.G,
      nu: p.E / (2 * p.G) - 1,
      K: (p.E * p.G) / (3 * (3 * p.G - p.E)),
    };
  if (pair === "Enu")
    derived = {
      E: p.E,
      nu: p.nu,
      G: p.E / (2 * (1 + p.nu)),
      K: p.E / (3 * (1 - 2 * p.nu)),
    };
  if (pair === "EK")
    derived = {
      E: p.E,
      K: p.K,
      nu: (3 * p.K - p.E) / (6 * p.K),
      G: (3 * p.E * p.K) / (9 * p.K - p.E),
    };
  if (pair === "Gnu")
    derived = {
      G: p.G,
      nu: p.nu,
      E: 2 * p.G * (1 + p.nu),
      K: (2 * p.G * (1 + p.nu)) / (3 * (1 - 2 * p.nu)),
    };
  if (pair === "GK")
    derived = {
      G: p.G,
      K: p.K,
      E: (9 * p.K * p.G) / (3 * p.K + p.G),
      nu: (3 * p.K - 2 * p.G) / (2 * (3 * p.K + p.G)),
    };
  if (pair === "Knu")
    derived = {
      K: p.K,
      nu: p.nu,
      E: 3 * p.K * (1 - 2 * p.nu),
      G: (3 * p.K * (1 - 2 * p.nu)) / (2 * (1 + p.nu)),
    };

  if (derived) {
    for (const key of ["E", "G", "nu", "K"]) {
      if (supplied[key] !== null && !close(supplied[key], derived[key]))
        warnings.push(
          `${label}: supplied ${key} is inconsistent with the isotropic pair used (${pair}).`,
        );
      if (p[key] === null) p[key] = derived[key];
    }
  }
  if (p.nu !== null && (p.nu <= -1 || p.nu >= 0.5))
    warnings.push(
      `${label}: isotropic Poisson ratio must be between -1 and 0.5.`,
    );
  for (const key of ["E", "G", "K"])
    if (p[key] !== null && p[key] <= 0)
      warnings.push(`${label}: ${key} must be positive.`);
  return {
    ...p,
    pair,
    warnings,
    inferred: ["E", "G", "nu", "K"].filter(
      (key) => supplied[key] === null && p[key] !== null,
    ),
  };
}

export function normalizeConstituent(source, label = "Constituent") {
  if (source.type !== "orthotropic") {
    const iso = completeIsotropic(source, label);
    return {
      ...iso,
      type: "isotropic",
      E1: iso.E,
      E2: iso.E,
      E3: iso.E,
      G12: iso.G,
      G13: iso.G,
      G23: iso.G,
      nu12: iso.nu,
      nu13: iso.nu,
      nu23: iso.nu,
      tensile1: iso.tensile,
      tensile2: iso.tensile,
      tensile3: iso.tensile,
      compression1: iso.compression,
      compression2: iso.compression,
      compression3: iso.compression,
      alpha1: iso.alpha,
      alpha2: iso.alpha,
      alpha3: iso.alpha,
    };
  }
  const keys = [
    "E1",
    "E2",
    "E3",
    "G12",
    "G13",
    "G23",
    "nu12",
    "nu13",
    "nu23",
    "density",
    "tensile1",
    "tensile2",
    "tensile3",
    "compression1",
    "compression2",
    "compression3",
    "alpha1",
    "alpha2",
    "alpha3",
    "cp",
  ];
  const p = Object.fromEntries(
    keys.map((key) => [key, valid(source[key]) ? n(source[key]) : null]),
  );
  const warnings = [];
  for (const key of ["E1", "E2", "E3", "G12", "G13", "G23"])
    if (p[key] !== null && p[key] <= 0)
      warnings.push(`${label}: ${key} must be positive.`);
  for (const key of ["nu12", "nu13", "nu23"])
    if (p[key] !== null && Math.abs(p[key]) >= 1)
      warnings.push(`${label}: ${key} is outside the usual admissible range.`);
  return { ...p, type: "orthotropic", pair: null, inferred: [], warnings };
}

const result = (value, equation, missing = []) => ({
  value: Number.isFinite(value) ? value : null,
  equation,
  missing,
});
const need = (items, equation, calculate) => {
  const missing = items
    .filter(([, value]) => !valid(value))
    .map(([name]) => name);
  return missing.length
    ? result(null, equation, missing)
    : result(calculate(), equation);
};
const voigt = (a, b, vf, vm) => vf * a + vm * b;
const reuss = (a, b, vf, vm) => 1 / (vf / a + vm / b);

export const METHODS = {
  rom: {
    name: "Voigt–Reuss",
    short: "Voigt axial and Reuss transverse lower-bound estimates",
  },
  hill: {
    name: "Voigt–Reuss–Hill",
    short: "Arithmetic mean of the Voigt and Reuss elastic estimates",
  },
  halpinTsai: {
    name: "Halpin–Tsai",
    short: "Semi-empirical reinforcement model with user-defined shape parameters",
  },
  chamis: {
    name: "Chamis",
    short: "Simplified micromechanics model for aligned continuous fibers",
  },
  moriTanaka: {
    name: "Mori–Tanaka (spherical inclusions)",
    short: "Isotropic matrix with dispersed isotropic spherical inclusions",
  },
};

const halpinTsai = (pf, pm, fraction, xi) => {
  const ratio = pf / pm;
  const eta = (ratio - 1) / (ratio + xi);
  return pm * (1 + xi * eta * fraction) / (1 - eta * fraction);
};

const chamis = (pf, pm, fraction) =>
  pm / (1 - Math.sqrt(fraction) * (1 - pm / pf));

function calculateCompositeLegacy(input) {
  const fiber = completeIsotropic(input.fiber, "Fiber");
  const matrix = completeIsotropic(input.matrix, "Matrix");
  const vf = Math.max(0, n(input.fiberPercent) / 100);
  const vv = Math.max(0, n(input.voidPercent) / 100);
  const vm = 1 - vf - vv;
  const warnings = [...fiber.warnings, ...matrix.warnings];
  if (vf < 0 || vv < 0 || vm < 0)
    warnings.push("Fiber plus void volume fraction cannot exceed 100%.");
  if (vv > 0)
    warnings.push(
      "Voids reduce the occupied matrix fraction and are assigned zero density and stiffness; detailed void morphology is not represented.",
    );
  const two = (key, label, equation, fn) =>
    need(
      [
        [`fiber ${label}`, fiber[key]],
        [`matrix ${label}`, matrix[key]],
      ],
      equation,
      () => fn(fiber[key], matrix[key]),
    );

  const E1 = two("E", "E", "E₁ = V_f E_f + V_m E_m", (a, b) =>
    voigt(a, b, vf, vm),
  );
  const E2 = two("E", "E", "1/E₂ = V_f/E_f + V_m/E_m", (a, b) =>
    reuss(a, b, vf, vm),
  );
  const G12 = two("G", "G", "1/G₁₂ = V_f/G_f + V_m/G_m", (a, b) =>
    reuss(a, b, vf, vm),
  );
  const nu12 = two("nu", "ν", "ν₁₂ = V_f ν_f + V_m ν_m", (a, b) =>
    voigt(a, b, vf, vm),
  );
  const density = two("density", "density", "ρ_c = V_f ρ_f + V_m ρ_m", (a, b) =>
    voigt(a, b, vf, vm),
  );
  const Xt = two(
    "tensile",
    "tensile strength",
    "X_t = V_f σ_ft + V_m σ_mt",
    (a, b) => voigt(a, b, vf, vm),
  );
  const Xc = two(
    "compression",
    "compression strength",
    "X_c = V_f σ_fc + V_m σ_mc",
    (a, b) => voigt(a, b, vf, vm),
  );
  const Yt = two(
    "tensile",
    "tensile strength",
    "1/Y_t = V_f/σ_ft + V_m/σ_mt",
    (a, b) => reuss(a, b, vf, vm),
  );
  const Yc = two(
    "compression",
    "compression strength",
    "1/Y_c = V_f/σ_fc + V_m/σ_mc",
    (a, b) => reuss(a, b, vf, vm),
  );
  const alpha1 = need(
    [
      ["fiber E", fiber.E],
      ["matrix E", matrix.E],
      ["fiber CTE", fiber.alpha],
      ["matrix CTE", matrix.alpha],
    ],
    "α₁ = (V_f E_f α_f + V_m E_m α_m)/(V_f E_f + V_m E_m)",
    () =>
      (vf * fiber.E * fiber.alpha + vm * matrix.E * matrix.alpha) /
      (vf * fiber.E + vm * matrix.E),
  );
  const alpha2 = two("alpha", "CTE", "α₂ = α₃ = V_f α_f + V_m α_m", (a, b) =>
    voigt(a, b, vf, vm),
  );
  const cp = need(
    [
      ["fiber density", fiber.density],
      ["matrix density", matrix.density],
      ["fiber specific heat", fiber.cp],
      ["matrix specific heat", matrix.cp],
    ],
    "c_p,c = w_f c_p,f + w_m c_p,m; w_i = V_iρ_i/ρ_c",
    () => {
      const rho = vf * fiber.density + vm * matrix.density;
      return (
        (vf * fiber.density * fiber.cp + vm * matrix.density * matrix.cp) / rho
      );
    },
  );
  const nu21 =
    E1.value !== null && E2.value !== null && nu12.value !== null
      ? result((nu12.value * E2.value) / E1.value, "ν₂₁ = ν₁₂ E₂/E₁")
      : result(null, "ν₂₁ = ν₁₂ E₂/E₁", ["E₁, E₂ or ν₁₂"]);
  const volumetricHeat =
    density.value !== null && cp.value !== null
      ? result(density.value * cp.value, "C_v = ρ_c c_p,c")
      : result(null, "C_v = ρ_c c_p,c", ["density or specific heat"]);

  const properties = {
    E1,
    E2,
    E3: { ...E2, equation: "E₃ = E₂ (transverse isotropy assumption)" },
    G12,
    G13: { ...G12, equation: "G₁₃ = G₁₂ (transverse isotropy assumption)" },
    G23: {
      ...G12,
      equation: "1/G₂₃ = V_f/G_f + V_m/G_m (inverse ROM estimate)",
    },
    nu12,
    nu13: { ...nu12, equation: "ν₁₃ = ν₁₂ (transverse isotropy assumption)" },
    nu23: { ...nu12, equation: "ν₂₃ = V_f ν_f + V_m ν_m (ROM estimate)" },
    nu21,
    density,
    Xt,
    Xc,
    Yt,
    Yc,
    Zt: { ...Yt, equation: "Z_t = Y_t" },
    Zc: { ...Yc, equation: "Z_c = Y_c" },
    alpha1,
    alpha2,
    alpha3: { ...alpha2, equation: "α₃ = α₂" },
    cp,
    volumetricHeat,
  };
  if (E1.value && E2.value && G12.value && nu12.value !== null) {
    const nu13 = nu12.value,
      nu23 = nu12.value;
    const nu31 = (nu13 * E2.value) / E1.value,
      nu32 = nu23;
    const stability =
      1 -
      nu12.value * nu21.value -
      nu23 * nu32 -
      nu31 * nu13 -
      2 * nu21.value * nu32 * nu13;
    if (!(stability > 0))
      warnings.push(
        "The estimated engineering constants fail the orthotropic stability check; review the input data and model assumptions.",
      );
  }
  return {
    fiber,
    matrix,
    vf,
    vm,
    vv,
    properties,
    warnings: [...new Set(warnings)],
  };
}

export function calculateAllMethods(input) {
  return Object.keys(METHODS).map((method) => ({
    method,
    label: METHODS[method].name,
    model: calculateComposite(input, method),
  }));
}

export function calculateComposite(input, requestedMethod) {
  const fiber = normalizeConstituent(input.fiber, "Fiber");
  const matrix = normalizeConstituent(input.matrix, "Matrix");
  const method = METHODS[requestedMethod || input.method]
    ? requestedMethod || input.method
    : "rom";
  const vf = Math.max(0, n(input.fiberPercent) / 100);
  const vv = Math.max(0, n(input.voidPercent) / 100);
  const vm = 1 - vf - vv;
  const warnings = [...fiber.warnings, ...matrix.warnings];
  if (vm < 0)
    warnings.push("Fiber plus void volume fraction cannot exceed 100%.");
  if (vv > 0)
    warnings.push(
      "The simple mixture model does not represent void shape, distribution or interaction explicitly.",
    );
  if (
    method === "moriTanaka" &&
    (fiber.type !== "isotropic" || matrix.type !== "isotropic")
  )
    warnings.push(
      "Mori–Tanaka spherical-inclusion calculation requires isotropic inclusion and matrix inputs.",
    );

  const two = (key, label, equation, fn) =>
    need(
      [
        [`fiber ${label}`, fiber[key]],
        [`matrix ${label}`, matrix[key]],
      ],
      equation,
      () => fn(fiber[key], matrix[key]),
    );
  const elasticMix = (key, label, direction, family) => {
    const missing = [
      [`fiber ${label}`, fiber[key]],
      [`matrix ${label}`, matrix[key]],
    ]
      .filter(([, value]) => !valid(value))
      .map(([name]) => name);
    if (missing.length)
      return result(null, `${METHODS[method].name}: ${label}`, missing);
    const a = fiber[key];
    const b = matrix[key];
    if (method === "hill")
      return result(
        (voigt(a, b, vf, vm) + reuss(a, b, vf, vm)) / 2,
        `${label}_H = (${label}_V + ${label}_R)/2`,
      );
    if (method === "halpinTsai" && direction !== "axial") {
      const enteredXi =
        family === "shear" ? input.halpinXiShear : input.halpinXiTransverse;
      const xi = Math.max(
        0.000001,
        valid(enteredXi) ? n(enteredXi) : family === "shear" ? 1 : 2,
      );
      return result(
        halpinTsai(a, b, vf, xi),
        `${label} = ${label}_m(1 + ξηV_f)/(1 − ηV_f), ξ = ${xi}`,
      );
    }
    if (method === "chamis" && direction !== "axial")
      return result(
        chamis(a, b, vf),
        `${label} = ${label}_m/[1 − √V_f(1 − ${label}_m/${label}_f)]`,
      );
    const useVoigt = direction === "axial" || family === "poisson";
    return result(
      useVoigt ? voigt(a, b, vf, vm) : reuss(a, b, vf, vm),
      useVoigt
        ? `${label} = V_f${label}_f + V_m${label}_m`
        : `1/${label} = V_f/${label}_f + V_m/${label}_m`,
    );
  };

  let E1, E2, E3, G12, G13, G23, nu12, nu13, nu23;
  if (method === "moriTanaka") {
    const mtMissing =
      fiber.type === "isotropic" && matrix.type === "isotropic"
        ? [
            ["fiber bulk modulus", fiber.K],
            ["fiber shear modulus", fiber.G],
            ["matrix bulk modulus", matrix.K],
            ["matrix shear modulus", matrix.G],
          ]
            .filter(([, value]) => !positive(value))
            .map(([name]) => name)
        : ["isotropic constituent properties"];
    if (mtMissing.length) {
      const unavailable = result(
        null,
        "Mori–Tanaka isotropic spherical-inclusion model",
        mtMissing,
      );
      E1 = E2 = E3 = G12 = G13 = G23 = nu12 = nu13 = nu23 = unavailable;
    } else {
      const occupied = vf + vm;
      const c = occupied > 0 ? vf / occupied : 0;
      const km = matrix.K;
      const gm = matrix.G;
      const kf = fiber.K;
      const gf = fiber.G;
      const k =
        km +
        (c * (kf - km)) /
          (1 + ((1 - c) * (kf - km)) / (km + (4 * gm) / 3));
      const zeta = (gm * (9 * km + 8 * gm)) / (6 * (km + 2 * gm));
      const g =
        gm +
        (c * (gf - gm)) /
          (1 + ((1 - c) * (gf - gm)) / (gm + zeta));
      const e = (9 * k * g) / (3 * k + g);
      const nu = (3 * k - 2 * g) / (2 * (3 * k + g));
      const ee = result(
        e,
        "Mori–Tanaka spherical inclusions: E = 9KG/(3K + G)",
      );
      const gg = result(g, "Mori–Tanaka spherical-inclusion shear modulus");
      const nn = result(nu, "ν = (3K − 2G)/[2(3K + G)]");
      E1 = E2 = E3 = ee;
      G12 = G13 = G23 = gg;
      nu12 = nu13 = nu23 = nn;
    }
  } else {
    E1 = elasticMix("E1", "E1", "axial", "young");
    E2 = elasticMix("E2", "E2", "transverse", "young");
    E3 = elasticMix("E3", "E3", "transverse", "young");
    G12 = elasticMix("G12", "G12", "transverse", "shear");
    G13 = elasticMix("G13", "G13", "transverse", "shear");
    G23 = elasticMix("G23", "G23", "transverse", "shear");
    nu12 = elasticMix("nu12", "ν12", "axial", "poisson");
    nu13 = elasticMix("nu13", "ν13", "axial", "poisson");
    nu23 = elasticMix("nu23", "ν23", "axial", "poisson");
  }
  const axial = (key, label, equation) =>
    two(key, label, equation, (a, b) => voigt(a, b, vf, vm));
  const transverse = (key, label, equation) =>
    two(key, label, equation, (a, b) => reuss(a, b, vf, vm));
  const density = two("density", "density", "ρ_c = V_fρ_f + V_mρ_m", (a, b) =>
    voigt(a, b, vf, vm),
  );
  const Xt = axial(
    "tensile1",
    "direction-1 tensile strength",
    "X_t = V_fX_tf + V_mX_tm",
  );
  const Xc = axial(
    "compression1",
    "direction-1 compression strength",
    "X_c = V_fX_cf + V_mX_cm",
  );
  const Yt = transverse(
    "tensile2",
    "direction-2 tensile strength",
    "1/Y_t = V_f/Y_tf + V_m/Y_tm",
  );
  const Yc = transverse(
    "compression2",
    "direction-2 compression strength",
    "1/Y_c = V_f/Y_cf + V_m/Y_cm",
  );
  const Zt = transverse(
    "tensile3",
    "direction-3 tensile strength",
    "1/Z_t = V_f/Z_tf + V_m/Z_tm",
  );
  const Zc = transverse(
    "compression3",
    "direction-3 compression strength",
    "1/Z_c = V_f/Z_cf + V_m/Z_cm",
  );
  const thermal = (direction) =>
    need(
      [
        [`fiber E${direction}`, fiber[`E${direction}`]],
        [`matrix E${direction}`, matrix[`E${direction}`]],
        [`fiber α${direction}`, fiber[`alpha${direction}`]],
        [`matrix α${direction}`, matrix[`alpha${direction}`]],
      ],
      `α${direction} = (V_fE${direction}fα${direction}f + V_mE${direction}mα${direction}m)/(V_fE${direction}f + V_mE${direction}m)`,
      () =>
        (vf * fiber[`E${direction}`] * fiber[`alpha${direction}`] +
          vm * matrix[`E${direction}`] * matrix[`alpha${direction}`]) /
        (vf * fiber[`E${direction}`] + vm * matrix[`E${direction}`]),
    );
  const alpha1 = thermal(1),
    alpha2 = thermal(2),
    alpha3 = thermal(3);
  const cp = need(
    [
      ["fiber density", fiber.density],
      ["matrix density", matrix.density],
      ["fiber specific heat", fiber.cp],
      ["matrix specific heat", matrix.cp],
    ],
    "c_p,c = w_fc_p,f + w_mc_p,m; w_i = V_iρ_i/ρ_c",
    () =>
      (vf * fiber.density * fiber.cp + vm * matrix.density * matrix.cp) /
      (vf * fiber.density + vm * matrix.density),
  );
  const reciprocal = (major, transverseE, axialE, equation) =>
    major.value !== null && transverseE.value !== null && axialE.value !== null
      ? result((major.value * transverseE.value) / axialE.value, equation)
      : result(null, equation, ["major Poisson ratio or associated moduli"]);
  const nu21 = reciprocal(nu12, E2, E1, "ν₂₁ = ν₁₂E₂/E₁");
  const volumetricHeat =
    density.value !== null && cp.value !== null
      ? result(density.value * cp.value, "C_v = ρ_cc_p,c")
      : result(null, "C_v = ρ_cc_p,c", ["density or specific heat"]);
  const properties = {
    E1,
    E2,
    E3,
    G12,
    G13,
    G23,
    nu12,
    nu13,
    nu23,
    nu21,
    density,
    Xt,
    Xc,
    Yt,
    Yc,
    Zt,
    Zc,
    alpha1,
    alpha2,
    alpha3,
    cp,
    volumetricHeat,
  };

  if (
    [E1, E2, E3, G12, G13, G23, nu12, nu13, nu23].every(
      (item) => item.value !== null,
    )
  ) {
    const nu31 = (nu13.value * E3.value) / E1.value;
    const nu32 = (nu23.value * E3.value) / E2.value;
    const stability =
      1 -
      nu12.value * nu21.value -
      nu23.value * nu32 -
      nu31 * nu13.value -
      2 * nu21.value * nu32 * nu13.value;
    if (!(stability > 0))
      warnings.push(
        "The estimated engineering constants fail the orthotropic stability check.",
      );
  }
  return {
    method,
    fiber,
    matrix,
    vf,
    vm,
    vv,
    properties,
    warnings: [...new Set(warnings)],
  };
}

const fmt = (value) =>
  Number(value)
    .toPrecision(8)
    .replace(/\.?0+$/, "");
export function abaqusText(input, model) {
  const p = model.properties;
  const cleanName = String(input.name || "Composite").replace(
    /[^a-zA-Z0-9_-]/g,
    "_",
  );
  const lines = [
    `** JSCR Composite Property Calculator`,
    `** Method: ${METHODS[model.method]?.name || METHODS.rom.name}`,
    `** Consistent units: N, mm, MPa, tonne, K`,
    `*Material, name=${cleanName}`,
  ];
  if (p.density.value !== null)
    lines.push("*Density", fmt(p.density.value * 1e-12));
  const elastic = [
    p.E1,
    p.E2,
    p.E3,
    p.nu12,
    p.nu13,
    p.nu23,
    p.G12,
    p.G13,
    p.G23,
  ];
  if (elastic.every((item) => item.value !== null))
    lines.push(
      "*Elastic, type=ENGINEERING CONSTANTS",
      elastic
        .slice(0, 8)
        .map((item) => fmt(item.value))
        .join(", "),
      fmt(elastic[8].value),
    );
  if ([p.alpha1, p.alpha2, p.alpha3].every((item) => item.value !== null))
    lines.push(
      "*Expansion, type=ORTHO",
      [p.alpha1, p.alpha2, p.alpha3]
        .map((item) => fmt(item.value * 1e-6))
        .join(", "),
    );
  if (p.cp.value !== null) lines.push("*Specific Heat", fmt(p.cp.value * 1e6));
  lines.push("** Estimated strengths (not an Abaqus failure criterion)");
  for (const [key, label] of [
    ["Xt", "X_t"],
    ["Xc", "X_c"],
    ["Yt", "Y_t"],
    ["Yc", "Y_c"],
    ["Zt", "Z_t"],
    ["Zc", "Z_c"],
  ])
    if (p[key].value !== null)
      lines.push(`** ${label} = ${fmt(p[key].value)} MPa`);
  return lines.join("\n") + "\n";
}
