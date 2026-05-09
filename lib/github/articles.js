import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { githubApiUrl, githubBlobUrl, githubHeaders, githubRawUrl, getGithubConfig, isGithubConfigured } from "./config";

const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function fromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function toCache(key, value) {
  cache.set(key, { time: Date.now(), value });
  return value;
}

function slugFromFilename(name) {
  return name.replace(/\.mdx?$/i, "").toLowerCase();
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function normalizeAssetPath(path, config) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith("/images/")) return path;
  return githubRawUrl(path, config);
}

function extractHeadings(markdown) {
  const slugger = new GithubSlugger();
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[#*_`]/g, "").trim();
      return {
        depth: match[1].length,
        text,
        id: slugger.slug(text),
      };
    })
    .filter(Boolean);
}

function parseArticle(file, markdown, config) {
  const parsed = matter(markdown);
  const data = parsed.data;
  const slug = slugFromFilename(file.name);
  const sourcePath = file.path || `${config.articlesDir}/${file.name}`;
  const pdfPath = data.pdf || data.pdfUrl || data.attachment || "";

  return {
    slug,
    sourcePath,
    rawMarkdownUrl: githubRawUrl(sourcePath, config),
    githubUrl: githubBlobUrl(sourcePath, config),
    downloadMarkdownUrl: githubRawUrl(sourcePath, config),
    title: data.title || slug,
    authors: normalizeArray(data.authors),
    date: data.date || "",
    lastUpdated: file.lastUpdated || data.lastUpdated || "",
    category: data.category || "Research",
    abstract: data.abstract || "",
    keywords: normalizeArray(data.keywords),
    thumbnail: normalizeAssetPath(data.thumbnail, config),
    doi: data.doi || "",
    pdfUrl: normalizeAssetPath(pdfPath, config),
    content: parsed.content,
    headings: extractHeadings(parsed.content),
    commitSha: file.sha || "",
    versionUrl: file.html_url || githubBlobUrl(sourcePath, config),
  };
}

async function fetchJson(url, config, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...githubHeaders(config),
      ...(options.headers || {}),
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchText(url) {
  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) {
    throw new Error(`Markdown request failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function fetchLastCommit(path, config) {
  try {
    const commits = await fetchJson(
      githubApiUrl(`/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(config.branch)}&per_page=1`, config),
      config
    );
    return commits?.[0]?.commit?.committer?.date || "";
  } catch {
    return "";
  }
}

export async function getArticles() {
  const config = getGithubConfig();
  const cacheKey = `articles:${config.owner}/${config.repo}/${config.branch}/${config.articlesDir}`;
  const cached = fromCache(cacheKey);
  if (cached) return cached;

  if (!isGithubConfigured(config)) {
    return { ok: false, articles: [], error: "GitHub repository is not configured." };
  }

  try {
    const contents = await fetchJson(
      githubApiUrl(`/contents/${config.articlesDir}?ref=${encodeURIComponent(config.branch)}`, config),
      config
    );
    const markdownFiles = contents.filter((item) => item.type === "file" && /\.mdx?$/i.test(item.name));

    const articles = await Promise.all(
      markdownFiles.map(async (file) => {
        const [markdown, lastUpdated] = await Promise.all([
          fetchText(file.download_url || githubRawUrl(file.path, config)),
          fetchLastCommit(file.path, config),
        ]);
        return parseArticle({ ...file, lastUpdated }, markdown, config);
      })
    );

    const sorted = articles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return toCache(cacheKey, { ok: true, articles: sorted, error: "" });
  } catch (error) {
    return { ok: false, articles: [], error: error.message };
  }
}

export async function getArticleBySlug(slug) {
  const list = await getArticles();
  if (!list.ok) return { ok: false, article: null, error: list.error };
  const article = list.articles.find((item) => item.slug === slug);
  if (!article) return { ok: false, article: null, error: "Article not found." };
  return { ok: true, article, error: "" };
}
