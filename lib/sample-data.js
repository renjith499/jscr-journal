const sampleContent = `
## Introduction

Cooling towers manufactured from fibre-reinforced polymers require careful assessment of stiffness, stability, thermal exposure, and wind-induced response. This study presents a finite-element framework for evaluating their structural performance.

## Methodology

The structural response is evaluated using orthotropic material properties, shell discretization, representative support conditions, and combined gravity and wind loading. The governing response is expressed as:

$$
K(u, T)u = f, \\quad R(\\theta)=\\|u_{FEA}-u_{ROM}\\|_2 + \\lambda\\Omega(\\theta)
$$

## Verification

Mesh convergence and equilibrium checks are used to verify the numerical solution. Stress and displacement trends are compared across progressively refined models.

## Results

The analysis identifies critical shell regions, deformation patterns, and the sensitivity of global response to laminate stiffness and boundary conditions.

## References

1. Hughes, T. J. R. The Finite Element Method.
2. Quarteroni, A. Reduced Basis Methods for Partial Differential Equations.
`;

export const fallbackArticles = [
  {
    slug: "fea-analysis",
    title: "Finite Element Analysis of FRP Cooling Towers",
    authors: ["Renjith R", "A. Kumar"],
    date: "2026-05-01",
    lastUpdated: "2026-05-04T10:30:00Z",
    category: "FEA",
    abstract: "This paper investigates the structural response of FRP cooling towers using finite element modeling, composite laminate properties, and wind load combinations.",
    keywords: ["FEA", "FRP", "Cooling Tower"],
    thumbnail: "",
    doi: "10.1000/example",
    pdfUrl: "",
    content: sampleContent,
    headings: [
      { depth: 2, text: "Introduction", id: "introduction" },
      { depth: 2, text: "Methodology", id: "methodology" },
      { depth: 2, text: "Reproducible Code", id: "reproducible-code" },
      { depth: 2, text: "Results", id: "results" },
      { depth: 2, text: "References", id: "references" },
    ],
    sourcePath: "articles/fea-analysis.md",
    rawMarkdownUrl: "#",
    downloadMarkdownUrl: "#",
    githubUrl: "#",
    versionUrl: "#",
    commitSha: "sample",
  },
  {
    slug: "cfd-study",
    title: "CFD Study of Turbulent Flow in Compact Heat Exchanger Channels",
    authors: ["S. Rao", "M. Patel"],
    date: "2026-04-18",
    lastUpdated: "2026-04-20T08:15:00Z",
    category: "CFD",
    abstract: "A comparative CFD study of turbulence models for pressure drop and heat transfer prediction in compact engineering channels.",
    keywords: ["CFD", "Turbulence", "Heat Transfer"],
    thumbnail: "",
    doi: "10.1000/cfd-study",
    pdfUrl: "",
    content: sampleContent,
    headings: [
      { depth: 2, text: "Introduction", id: "introduction" },
      { depth: 2, text: "Methodology", id: "methodology" },
      { depth: 2, text: "Results", id: "results" },
    ],
    sourcePath: "articles/cfd-study.md",
    rawMarkdownUrl: "#",
    downloadMarkdownUrl: "#",
    githubUrl: "#",
    versionUrl: "#",
    commitSha: "sample",
  },
  {
    slug: "robotics-paper",
    title: "Model Predictive Control for Redundant Robotic Manipulators",
    authors: ["J. Hart", "N. Kumar"],
    date: "2026-03-12",
    lastUpdated: "2026-03-18T11:00:00Z",
    category: "Robotics",
    abstract: "A real-time control architecture for redundant robotic arms in constrained engineering assembly environments.",
    keywords: ["Robotics", "MPC", "Automation"],
    thumbnail: "",
    doi: "10.1000/robotics-paper",
    pdfUrl: "",
    content: sampleContent,
    headings: [
      { depth: 2, text: "Introduction", id: "introduction" },
      { depth: 2, text: "Methodology", id: "methodology" },
      { depth: 2, text: "Results", id: "results" },
    ],
    sourcePath: "articles/robotics-paper.md",
    rawMarkdownUrl: "#",
    downloadMarkdownUrl: "#",
    githubUrl: "#",
    versionUrl: "#",
    commitSha: "sample",
  },
];
