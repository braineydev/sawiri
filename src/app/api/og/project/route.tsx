import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";
import { getCaseStudyBySlug } from "@/lib/case-study/case-study-queries";

export const runtime = "nodejs";

function trustedPublicImage(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname === "images.unsplash.com") return true;
    if (url.hostname.endsWith(".supabase.co") && url.pathname.startsWith("/storage/v1/object/public/")) return true;
    const configured = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(configured && url.origin === new URL(configured).origin && url.pathname.startsWith("/storage/v1/object/public/"));
  } catch { return false; }
}

async function imageData(source: string) {
  if (!trustedPublicImage(source)) return null;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(4000), next: { revalidate: 3600 } });
    const type = response.headers.get("content-type")?.split(";")[0];
    const length = Number(response.headers.get("content-length") || 0);
    if (!response.ok || !type || !["image/jpeg", "image/png", "image/webp"].includes(type) || length > 4_000_000) return null;
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > 4_000_000) return null;
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `data:${type};base64,${btoa(binary)}`;
  } catch { return null; }
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") || "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const result = await getCaseStudyBySlug(slug);
  if (result.source !== "live" || !result.project || result.project.is_demo || !result.project.is_published) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const project = result.project;
  const photo = await imageData(project.hero_image_url);
  const output = new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "52px 64px", color: "#f1f0eb", background: "#171817", fontFamily: "Arial, sans-serif", position: "relative" }}>
      {photo && <img src={photo} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.43 }} />}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(23,24,23,.94),rgba(23,24,23,.38))" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 17, letterSpacing: "0.13em", color: "#e0ded5" }}><span>REEL ARCHER / PROJECT STUDY</span><span>{project.typology.toUpperCase()}</span></div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16 }}><span style={{ fontSize: 20, letterSpacing: "0.14em", color: "#d27a60" }}>{project.location.toUpperCase()} / {project.year}</span><span style={{ maxWidth: 1020, fontSize: project.title.length > 24 ? 68 : 82, letterSpacing: "-0.06em", lineHeight: 1.02 }}>{project.title}</span></div>
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", borderTop: "1px solid #c0bdb4", paddingTop: 18, fontSize: 15, letterSpacing: "0.12em", color: "#e0ded5" }}><span>ARCHITECTURAL PROJECT / {project.status.toUpperCase()}</span><span>AZ—PROJECT</span></div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" } },
  );
  return output;
}
