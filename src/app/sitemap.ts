import type { MetadataRoute } from "next";
import { canIndexSite, canonicalOrigin } from "@/lib/seo/site-config";
import { getPortfolio } from "@/lib/portfolio/portfolio-queries";
import { parsePortfolioFilters } from "@/lib/portfolio/portfolio-filters";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = canonicalOrigin;
  if (!canIndexSite || !origin) return [];
  try {
    const archive = await getPortfolio(parsePortfolioFilters({}));
    if (archive.source !== "live" || archive.total === 0) return [];
  } catch {
    return [];
  }
  return [{ url: origin }];
}
