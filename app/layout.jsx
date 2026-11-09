import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  metadataBase: new URL("https://www.jscr.in"),
  title: {
    default: "JSCR | Engineering Research Tools and Scientific Journal",
    template: "%s | JSCR",
  },
  description: "Open engineering research tools for Abaqus material modelling, Concrete Damaged Plasticity, composite properties and graph digitization, alongside peer-reviewed scientific articles.",
  applicationName: "JSCR",
  authors: [{ name: "Journal of Scientific Computing & Research", url: "https://www.jscr.in" }],
  creator: "Journal of Scientific Computing & Research",
  publisher: "Journal of Scientific Computing & Research",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "JSCR",
    title: "JSCR | Engineering Research Tools and Scientific Journal",
    description: "Engineering research tools for Abaqus CDP material modelling, composite properties and graph digitization.",
    locale: "en_IN",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "JSCR engineering research tools and scientific journal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSCR | Engineering Research Tools and Scientific Journal",
    description: "Engineering research tools for Abaqus CDP material modelling, composite properties and graph digitization.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.jscr.in/#organization",
                  name: "Journal of Scientific Computing & Research",
                  alternateName: "JSCR",
                  url: "https://www.jscr.in",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.jscr.in/#website",
                  url: "https://www.jscr.in",
                  name: "JSCR",
                  alternateName: "Journal of Scientific Computing & Research",
                  publisher: { "@id": "https://www.jscr.in/#organization" },
                  inLanguage: "en-IN",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
