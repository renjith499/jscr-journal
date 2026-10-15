import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

export const metadata = {
  title: "JSCR | Journal of Scientific Computing & Research",
  description: "A multidisciplinary scientific journal for engineering research, computational methods, technical studies, and reproducible analysis.",
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
