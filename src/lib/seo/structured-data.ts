import type { CaseStudyProject } from "@/types/project";
import { canIndexSite, canonicalOrigin, siteMetadata } from "@/lib/seo/site-config";

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function siteJsonLd() {
  if (!canIndexSite || !canonicalOrigin) return null;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${canonicalOrigin}/#organization`, name: siteMetadata.name, url: canonicalOrigin },
      { "@type": "WebSite", "@id": `${canonicalOrigin}/#website`, name: siteMetadata.name, url: canonicalOrigin, publisher: { "@id": `${canonicalOrigin}/#organization` } },
    ],
  };
}

export function projectJsonLd(project: CaseStudyProject) {
  if (!canIndexSite || !canonicalOrigin || project.is_demo || !project.is_published) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${canonicalOrigin}/projects/${encodeURIComponent(project.slug)}#project`,
    name: project.title,
    description: project.architectural_narrative || undefined,
    url: `${canonicalOrigin}/projects/${encodeURIComponent(project.slug)}`,
    image: project.hero_image_url || undefined,
    genre: project.typology,
    publisher: { "@id": `${canonicalOrigin}/#organization` },
  };
}
