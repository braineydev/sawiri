import type { CaseStudyProject, Project, ProjectComparisonPair, ProjectGalleryAsset, ProjectGalleryLayout } from "@/types/project";

const layouts: ProjectGalleryLayout[] = ["full", "split", "portrait", "detail", "technical"];
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isHttps = (value: unknown): value is string => typeof value === "string" && value.startsWith("https://");

export function adaptGallery(value: unknown, projectTitle: string): ProjectGalleryAsset[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry, index) => {
    if (!isRecord(entry) || !isHttps(entry.url)) return [];
    const result: ProjectGalleryAsset = {
      url: entry.url,
      alt: typeof entry.alt === "string" ? entry.alt : `${projectTitle}, architectural image ${index + 1}`,
    };
    if (typeof entry.caption === "string" && entry.caption.trim()) result.caption = entry.caption.trim();
    if (layouts.includes(entry.layout as ProjectGalleryLayout)) result.layout = entry.layout as ProjectGalleryLayout;
    if (typeof entry.asset_type === "string" && entry.asset_type.trim()) result.asset_type = entry.asset_type.trim();
    if (entry.orientation === "portrait" || entry.orientation === "landscape" || entry.orientation === "square") result.orientation = entry.orientation;
    if (typeof entry.display_order === "number" && Number.isFinite(entry.display_order)) result.display_order = entry.display_order;
    return [result];
  }).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function adaptBlueprints(value: unknown): string[] {
  return Array.isArray(value) ? value.filter(isHttps) : [];
}

export function adaptComparisons(value: unknown): ProjectComparisonPair[] {
  if (!Array.isArray(value)) return [];
  const usedIds = new Set<string>();
  return value.flatMap((entry, index) => {
    if (!isRecord(entry) || !isHttps(entry.render_url) || !isHttps(entry.drawing_url) || entry.render_url === entry.drawing_url) return [];
    const requestedId = typeof entry.id === "string" && entry.id.trim() ? entry.id.trim() : `comparison-${index + 1}`;
    const id = usedIds.has(requestedId) ? `${requestedId}-${index + 1}` : requestedId;
    usedIds.add(id);
    const pair: ProjectComparisonPair = {
      id,
      render_url: entry.render_url,
      drawing_url: entry.drawing_url,
    };
    for (const key of ["caption", "render_label", "drawing_label", "render_alt", "drawing_alt"] as const) {
      if (typeof entry[key] === "string" && entry[key].trim()) pair[key] = entry[key].trim();
    }
    if (typeof entry.display_order === "number" && Number.isFinite(entry.display_order)) pair.display_order = entry.display_order;
    return [pair];
  }).sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
}

export function adaptProject(project: Project): CaseStudyProject {
  const rawCoordinates: unknown = project.coordinates;
  let coordinates: Project["coordinates"] = null;
  if (isRecord(rawCoordinates) && typeof rawCoordinates.lat === "number" && typeof rawCoordinates.lng === "number"
    && Number.isFinite(rawCoordinates.lat) && Number.isFinite(rawCoordinates.lng)
    && rawCoordinates.lat >= -90 && rawCoordinates.lat <= 90 && rawCoordinates.lng >= -180 && rawCoordinates.lng <= 180) {
    coordinates = { lat: rawCoordinates.lat, lng: rawCoordinates.lng };
  }
  const narrative = typeof project.architectural_narrative === "string" ? project.architectural_narrative.trim() : "";
  return {
    ...project,
    is_published: project.is_published === true,
    coordinates,
    year: Number.isInteger(project.year) && project.year >= 1800 && project.year <= 2200 ? project.year : 0,
    area_sqm: typeof project.area_sqm === "number" && Number.isFinite(project.area_sqm) && project.area_sqm > 0 ? project.area_sqm : null,
    hero_image_url: isHttps(project.hero_image_url) ? project.hero_image_url : "",
    hero_lqip: typeof project.hero_lqip === "string" && project.hero_lqip.startsWith("data:image/") ? project.hero_lqip : null,
    gallery_json: adaptGallery(project.gallery_json, project.title),
    blueprint_urls: adaptBlueprints(project.blueprint_urls),
    comparison_pairs: adaptComparisons(project.comparison_pairs),
    architectural_narrative: narrative,
  };
}
