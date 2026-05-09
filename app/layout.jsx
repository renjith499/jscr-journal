import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "EngiScholar | Engineering & Scientific Research Platform",
  description: "A GitHub-powered platform for scientific and engineering articles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
