import { getArticles } from "@/lib/github/articles";
import { fallbackArticles } from "@/lib/sample-data";

const baseUrl = "https://www.jscr.in";

const pages = [
  ["", "weekly", 1],
  ["/tools", "weekly", 0.9],
  ["/tools/material-models", "weekly", 0.9],
  ["/tools/cdp-calculator", "weekly", 1],
  ["/tools/steel-calculator", "monthly", 0.8],
  ["/tools/composite-property-calculator", "monthly", 0.9],
  ["/tools/graph-digitizer", "monthly", 0.9],
  ["/submit-paper", "monthly", 0.6],
  ["/learn", "monthly", 0.6],
  ["/learn/mahis-vault", "monthly", 0.5],
];

export default async function sitemap() {
  const result = await getArticles();
  const articles = result.ok && result.articles.length ? result.articles : fallbackArticles;
  const now = new Date();

  return [
    ...pages.map(([path, changeFrequency, priority]) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.lastUpdated || article.date || now,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
