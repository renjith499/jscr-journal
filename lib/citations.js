export function formatAuthors(authors = []) {
  if (!authors.length) return "Unknown author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
  return `${authors.slice(0, -1).join(", ")}, and ${authors.at(-1)}`;
}

export function generateApaCitation(article) {
  const year = article.date ? new Date(article.date).getFullYear() : "n.d.";
  const doi = article.doi ? ` https://doi.org/${article.doi}` : "";
  return `${formatAuthors(article.authors)}. (${year}). ${article.title}. JSCR Research Platform.${doi}`;
}

export function generateBibtex(article) {
  const year = article.date ? new Date(article.date).getFullYear() : "";
  const key = `${(article.authors?.[0] || "article").split(" ").at(-1)}${year}`.replace(/[^a-z0-9]/gi, "");
  return `@article{${key},
  title={${article.title}},
  author={${(article.authors || []).join(" and ")}},
  year={${year}},
  doi={${article.doi || ""}},
  url={${article.rawMarkdownUrl || ""}}
}`;
}
