const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const canonicalOrigin = (() => {
  if (!configuredUrl) return null;
  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
})();

const vercelHost = process.env.VERCEL_URL;
export const metadataOrigin = canonicalOrigin
  ?? (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const canIndexSite = process.env.VERCEL_ENV === "production"
  && process.env.SAWIRI_INDEXING_ENABLED === "true"
  && canonicalOrigin !== null;

export const siteMetadata = {
  name: "Reel Archer",
  description: "Architectural project studies, studio notes, and project inquiries from Reel Archer.",
};

export const noIndexRobots = { index: false, follow: false } as const;
