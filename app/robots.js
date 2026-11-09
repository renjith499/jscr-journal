export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account", "/auth", "/md"],
    },
    sitemap: "https://www.jscr.in/sitemap.xml",
    host: "https://www.jscr.in",
  };
}
