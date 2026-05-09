export function getGithubConfig() {
  return {
    owner: process.env.NEXT_PUBLIC_GITHUB_OWNER || "",
    repo: process.env.NEXT_PUBLIC_GITHUB_REPO || "",
    branch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
    articlesDir: process.env.NEXT_PUBLIC_GITHUB_ARTICLES_DIR || "articles",
    assetsDir: process.env.NEXT_PUBLIC_GITHUB_ASSETS_DIR || "assets",
    token: process.env.GITHUB_TOKEN || "",
  };
}

export function isGithubConfigured(config = getGithubConfig()) {
  return Boolean(config.owner && config.repo);
}

export function githubHeaders(config = getGithubConfig()) {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (config.token) {
    headers.Authorization = `Bearer ${config.token}`;
  }

  return headers;
}

export function githubApiUrl(path, config = getGithubConfig()) {
  return `https://api.github.com/repos/${config.owner}/${config.repo}${path}`;
}

export function githubRawUrl(path, config = getGithubConfig()) {
  const normalizedPath = path.replace(/^\/+/, "");
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${normalizedPath}`;
}

export function githubBlobUrl(path, config = getGithubConfig()) {
  const normalizedPath = path.replace(/^\/+/, "");
  return `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}/${normalizedPath}`;
}
