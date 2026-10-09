export const MATERIAL_REFERENCES = [
  {
    id: "hexcel-im7",
    title: "HexTow IM7 Carbon Fiber product data sheet",
    publisher: "Hexcel Corporation",
    url: "https://www.hexcel.com/wp-content/uploads/2026/01/IM7_HexTow_DataSheet.pdf",
    note: "Longitudinal tensile modulus, strength, failure strain and density.",
  },
  {
    id: "im7-rtm6",
    title: "IM7 fiber and RTM6 epoxy thermo-elastic property table",
    publisher: "Albany Engineered Composites, Abaqus Users' Conference paper",
    url: "https://www.imechanica.org/sites/default/files/Bayraktar_AlbanyEngComp_Final_2232012.pdf",
    note: "Directional IM7 and RTM6 constituent constants used for micromechanical modelling.",
  },
  {
    id: "dupont-kevlar",
    title: "Kevlar fibre physical-property table",
    publisher: "Toray DuPont",
    url: "https://www.td-net.co.jp/kevlar/data/",
    note: "Kevlar 49 yarn density, tensile modulus, strength and elongation.",
  },
  {
    id: "agy-glass",
    title: "Glass fiber product information",
    publisher: "AGY",
    url: "https://www.agy.com/wp-content/uploads/2025/07/AGY_LGlass_SS_v5.pdf",
    note: "E-glass density, fiber modulus and coefficient of thermal expansion.",
  },
  {
    id: "dtu-epoxy",
    title: "Mechanical properties of an epoxy matrix material",
    publisher: "Technical University of Denmark",
    url: "https://backend.orbit.dtu.dk/ws/portalfiles/portal/244570959/Koutsos_2015_The_influence_of_the_mechanical_properties_of_the_matrix_material_on_the_compression_strength_of_unidirectional_comp_2_annotated.pdf",
    note: "Measured epoxy modulus and tensile strength; the source stresses that matrix response is nonlinear and pressure sensitive.",
  },
  {
    id: "basf-pa66",
    title: "Ultramid A3K product data sheet",
    publisher: "BASF",
    url: "https://download.basf.com/p1/8a8082587fd4b608017fd64108ab6d3b/en/ULTRAMID%3Csup%3E%C2%AE%3Csup%3E_A3K_Product_Data_Sheet_Asia_PacificEurope_English.pdf",
    note: "Dry PA66 density, tensile modulus, yield stress, yield strain, CTE and specific heat.",
  },
  {
    id: "journal-gfrp-constituents",
    title: "Mechanical Behavior of GFRP Laminates Exposed to Thermal and Moist Environmental Conditions",
    publisher: "Polymers (peer-reviewed, open access)",
    url: "https://doi.org/10.3390/polym14081523",
    note: "Table 1 reports E-glass and epoxy stiffness, tensile strength, density and Poisson's ratio.",
  },
  {
    id: "journal-glass-review",
    title: "Manufacturing Technologies of Carbon/Glass Fiber-Reinforced Polymer Composites and Their Properties",
    publisher: "Polymers (peer-reviewed review, open access)",
    url: "https://doi.org/10.3390/polym13213721",
    note: "Comparative glass-fiber density, modulus, strength, Poisson ratio, shear modulus and thermal data.",
  },
  {
    id: "journal-epoxy-plasticity",
    title: "Investigation of Epoxy Resin under Uniaxial, Biaxial, and Triaxial Quasi-Static Loads",
    publisher: "Journal of Engineering Mechanics",
    url: "https://doi.org/10.1061/JENMDT.EMENG-7905",
    note: "Experimental evidence of pressure-sensitive, viscoelastic and irreversible plastic response in epoxy resin.",
  },
  {
    id: "journal-fiber-comparison",
    title: "Impact Testing and Modelling of Composite Laminate Panels for Off-Road Racing Vehicle Belly Guards",
    publisher: "Journal of Composites Science",
    url: "https://doi.org/10.3390/jcs7100440",
    note: "Published comparative orthotropic datasets for glass, aramid, carbon and UHMWPE reinforcements.",
  },
];

const blankOrthotropic = {
  E1: "", E2: "", E3: "", G12: "", G13: "", G23: "",
  nu12: "", nu13: "", nu23: "", density: "", cp: "",
  tensile1: "", tensile2: "", tensile3: "",
  compression1: "", compression2: "", compression3: "",
  alpha1: "", alpha2: "", alpha3: "",
};

export const MATERIAL_PRESETS = [
  {
    id: "im7-carbon",
    name: "Hexcel IM7 carbon fiber",
    family: "Carbon fiber",
    recommendedRole: "fiber",
    referenceIds: ["hexcel-im7", "im7-rtm6"],
    note: "Transversely isotropic engineering approximation. Longitudinal strength and density are manufacturer values; transverse constants follow the cited micromechanics property table.",
    properties: {
      ...blankOrthotropic,
      type: "orthotropic",
      E1: 276000, E2: 23100, E3: 23100,
      G12: 27600, G13: 27600, G23: 8884.62,
      nu12: 0.35, nu13: 0.35, nu23: 0.3,
      density: 1780, tensile1: 5670,
      alpha1: -0.4, alpha2: 6, alpha3: 6,
    },
    plasticity: null,
    plasticityNote: "Not supplied: continuous carbon fiber is treated as elastic-brittle, not metal-plastic.",
  },
  {
    id: "kevlar49",
    name: "DuPont Kevlar 49 aramid fiber",
    family: "Aramid fiber",
    recommendedRole: "fiber",
    referenceIds: ["dupont-kevlar", "journal-fiber-comparison"],
    note: "Only directly published yarn-direction properties are populated; unavailable transverse constants remain blank.",
    properties: {
      ...blankOrthotropic,
      type: "orthotropic", E1: 112400, density: 1440, tensile1: 3000,
    },
    plasticity: null,
    plasticityNote: "Not supplied: Kevlar 49 yarn data describe rupture without a validated Abaqus plastic-hardening table.",
  },
  {
    id: "e-glass",
    name: "AGY E-glass fiber",
    family: "Glass fiber",
    recommendedRole: "fiber",
    referenceIds: ["agy-glass", "journal-gfrp-constituents", "journal-glass-review"],
    note: "Isotropic E-glass approximation using the cited peer-reviewed constituent table, with thermal data cross-checked against AGY and the review article.",
    properties: {
      type: "isotropic", E: 72500, G: "", nu: 0.25, K: "",
      density: 2570, tensile: 2350, compression: "", alpha: 5.4, cp: 810,
    },
    plasticity: null,
    plasticityNote: "Not supplied: reinforcement glass is treated as elastic-brittle.",
  },
  {
    id: "rtm6-epoxy",
    name: "RTM6-type epoxy matrix",
    family: "Epoxy",
    recommendedRole: "matrix",
    referenceIds: ["im7-rtm6", "dtu-epoxy", "journal-epoxy-plasticity"],
    note: "Representative room-temperature epoxy values from the cited experimental and micromechanical studies; verify against the exact cure cycle and resin batch.",
    properties: {
      type: "isotropic", E: 3106.2, G: "", nu: 0.4, K: "",
      density: 1200, tensile: 70.67, compression: "", alpha: 60, cp: "",
    },
    plasticity: null,
    plasticityNote: "Not prefilled: the cited epoxy is pressure-sensitive; a single von Mises curve would not be source-faithful.",
  },
  {
    id: "prime27-epoxy",
    name: "Prime 27 LV epoxy resin",
    family: "Epoxy",
    recommendedRole: "matrix",
    referenceIds: ["journal-gfrp-constituents", "journal-epoxy-plasticity"],
    note: "Peer-reviewed constituent values for the tested resin system. Cure, moisture and temperature can materially change these properties.",
    properties: {
      type: "isotropic", E: 3300, G: "", nu: 0.36, K: "",
      density: 1020, tensile: 69.9, compression: "", alpha: "", cp: "",
    },
    plasticity: null,
    plasticityNote: "Not prefilled: no source-faithful true-stress/equivalent-plastic-strain table is reported for this exact cured system.",
  },
  {
    id: "basf-pa66",
    name: "BASF Ultramid A3K PA66 (dry, 23°C)",
    family: "Polymer",
    recommendedRole: "matrix",
    referenceIds: ["basf-pa66"],
    note: "Typical dry-condition product values. Poisson's ratio is left blank because it is not reported in the cited sheet.",
    properties: {
      type: "isotropic", E: 3000, G: "", nu: "", K: "",
      density: 1130, tensile: 85, compression: "", alpha: 98, cp: 1700,
    },
    plasticity: {
      rows: [{ stress: 85, strain: 0 }],
      hill: { R11: "", R22: "", R33: "", R12: "", R13: "", R23: "" },
    },
    plasticityNote: "One-point perfect-plasticity approximation using BASF's published dry yield stress. Add validated true-stress/plastic-strain data for hardening.",
  },
];

export function referencesFor(preset) {
  return preset.referenceIds
    .map((id) => MATERIAL_REFERENCES.find((reference) => reference.id === id))
    .filter(Boolean);
}
