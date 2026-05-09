# EngiScholar GitHub-Powered Journal

Professional scientific article website built with Next.js, React, Tailwind CSS, GitHub REST API, `react-markdown`, `gray-matter`, syntax highlighting, and KaTeX equations.

## GitHub Content Backend

Configure the repository used as the article CMS by creating `.env.local`:

```env
NEXT_PUBLIC_GITHUB_OWNER=your-github-user-or-org
NEXT_PUBLIC_GITHUB_REPO=your-article-repository
NEXT_PUBLIC_GITHUB_BRANCH=main
NEXT_PUBLIC_GITHUB_ARTICLES_DIR=articles
NEXT_PUBLIC_GITHUB_ASSETS_DIR=assets
GITHUB_TOKEN=
```

`GITHUB_TOKEN` is optional for public repositories, but recommended on Vercel to increase API limits. Keep it server-side only.

## Repository Structure

```txt
articles/
  fea-analysis.md
  cfd-study.md
  robotics-paper.md
assets/
  images/
  figures/
  graphs/
  pdf/
```

## Article Frontmatter

````md
---
title: "Finite Element Analysis of FRP Cooling Towers"
authors: ["Renjith R", "A. Kumar"]
date: "2026-05-01"
category: "FEA"
abstract: "This paper investigates the structural response of FRP cooling towers."
keywords: ["FEA", "FRP", "Cooling Tower"]
thumbnail: "/assets/images/fea1.jpg"
pdf: "/assets/pdf/fea-analysis.pdf"
doi: "10.1000/example"
---

## Introduction

Article content here.

Inline equation: $\\sigma = E\\epsilon$

Display equation:

$$
K u = f
$$

```python
print("syntax highlighting")
```
````

## Admin Workflow

1. Add or edit Markdown files in the configured GitHub repository under `articles/`.
2. Store figures, graphs, thumbnails, and PDFs under `assets/`.
3. Commit to the configured branch.
4. The website fetches repository contents, parses frontmatter, renders Markdown, and updates listings automatically.

## Development

```bash
npm install
npm run dev
npm run build
npm run start
```

## Deployment

Vercel is the primary target. Set the same environment variables in Vercel project settings.

For GitHub Pages static export, set:

```env
GITHUB_PAGES=true
```

Then run `npm run build`. Static export works best when the article repository is public and available at build time.
