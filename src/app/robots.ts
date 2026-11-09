import type { MetadataRoute } from "next";
import { canIndexSite, canonicalOrigin } from "@/lib/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!canIndexSite || !canonicalOrigin) return { rules: { userAgent: "*", allow: "/", disallow: "/api/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: new URL("/sitemap.xml", canonicalOrigin).toString(), host: canonicalOrigin };
}
