import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { canIndexSite, canonicalOrigin } from "@/lib/seo/site-config";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = canonicalOrigin;
  if (!canIndexSite || !origin) return [];
  const routes: MetadataRoute.Sitemap = ["/", "/projects", "/studio", "/contact"].map((path) => ({ url: new URL(path, origin).toString() }));
  try {
    const supabase = await createClient();
    if (!supabase) return routes;
    const { data, error } = await supabase.from("projects").select("slug,updated_at,is_published,is_demo").eq("is_published", true).eq("is_demo", false).order("display_order", { ascending: true }).limit(50000);
    if (error || !data) return routes;
    for (const project of data) {
      if (!slugPattern.test(project.slug)) continue;
      const timestamp = Date.parse(project.updated_at);
      routes.push({ url: new URL(`/projects/${encodeURIComponent(project.slug)}`, origin).toString(), ...(Number.isFinite(timestamp) ? { lastModified: new Date(timestamp) } : {}) });
    }
  } catch {
    return routes;
  }
  return routes;
}
