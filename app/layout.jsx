import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "JSCR | Journal of Scientific Computing & Research",
  description: "A professional GitHub-powered scientific publishing platform for engineering and computational research.",
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
