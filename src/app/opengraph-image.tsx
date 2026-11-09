import { ImageResponse } from "next/og";

export const alt = "Reel Archer — architectural project studies and studio notes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 68px", color: "#f1f0eb", background: "#171817", fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, letterSpacing: "0.14em", color: "#bdbbb2" }}><span>REEL ARCHER / ARCHITECTURE</span><span>SPATIAL STUDIES</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
        <div style={{ width: 4, height: 230, background: "#a64d38" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}><span style={{ fontSize: 76, letterSpacing: "-0.07em" }}>Architecture</span><span style={{ fontSize: 70, fontStyle: "italic", color: "#c7b9a9", fontFamily: "Georgia, serif" }}>in the in-between.</span></div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #555650", paddingTop: 20, fontSize: 15, letterSpacing: "0.12em", color: "#bdbbb2" }}><span>PROJECTS / STUDIO / INQUIRY</span><span>AZ—01</span></div>
      <div style={{ position: "absolute", right: 95, top: 150, width: 260, height: 380, border: "1px solid #555650", borderRadius: "48% 48% 0 0", opacity: 0.75 }} />
    </div>,
    { ...size },
  );
}
