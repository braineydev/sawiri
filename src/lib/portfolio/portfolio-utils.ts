import type { PortfolioProject, Project } from "@/types/project";

export function safeGallery(value: unknown): Project["gallery_json"] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const candidate = entry as Record<string, unknown>;
    if (typeof candidate.url !== "string" || !candidate.url.startsWith("https://")) return [];
    return [{ url: candidate.url, alt: typeof candidate.alt === "string" ? candidate.alt : "Architectural project image" }];
  });
}

export function safeProject(project: PortfolioProject): PortfolioProject {
  return {
    ...project,
    hero_lqip: typeof project.hero_lqip === "string" && project.hero_lqip.startsWith("data:image/") ? project.hero_lqip : null,
    gallery_json: safeGallery(project.gallery_json),
    area_sqm: Number.isFinite(project.area_sqm) ? project.area_sqm : null,
    year: Number.isFinite(project.year) ? project.year : 0,
    hero_image_url: typeof project.hero_image_url === "string" ? project.hero_image_url : "",
  };
}

export function formatArea(area: number | null) {
  return area !== null && Number.isFinite(area) && area > 0 ? `${new Intl.NumberFormat("en").format(area)} m²` : "—";
}
