const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
};

export default nextConfig;
