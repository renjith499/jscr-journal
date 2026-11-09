import { ImageResponse } from "next/og";

export const alt = "JSCR engineering research tools and scientific journal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px", background: "linear-gradient(135deg, #082f49, #164e63)", color: "white" }}>
      <div style={{ display: "flex", fontSize: 34, letterSpacing: 6, color: "#67e8f9", fontWeight: 700 }}>JSCR</div>
      <div style={{ display: "flex", marginTop: 24, maxWidth: 980, fontSize: 66, lineHeight: 1.08, fontWeight: 800 }}>Engineering Research Tools &amp; Scientific Articles</div>
      <div style={{ display: "flex", marginTop: 30, fontSize: 30, color: "#cbd5e1" }}>CDP Calculator · Material Models · Graph Digitizer</div>
      <div style={{ display: "flex", marginTop: 52, fontSize: 25, color: "#a5f3fc" }}>www.jscr.in</div>
    </div>,
    size,
  );
}
