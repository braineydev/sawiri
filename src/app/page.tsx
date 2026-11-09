import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { SignatureHero } from "@/components/hero/SignatureHero";
import { StudioIntroduction } from "@/components/storytelling/StudioIntroduction";
import { ShowreelExperience } from "@/components/showreel/ShowreelExperience";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { canIndexSite, canonicalOrigin, noIndexRobots, siteMetadata } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: { absolute: "Reel Archer | Architecture" },
  description: siteMetadata.description,
  alternates: canIndexSite && canonicalOrigin ? { canonical: canonicalOrigin } : undefined,
  openGraph: { type: "website", title: "Reel Archer | Architecture", description: siteMetadata.description },
  twitter: { card: "summary_large_image", title: "Reel Archer | Architecture", description: siteMetadata.description },
  robots: canIndexSite ? { index: true, follow: true } : noIndexRobots,
};

export default function HomePage() {
  return (
    <main className="azin-opening">
      <Navigation />
      <SignatureHero />
      <StudioIntroduction />
      <ShowreelExperience />
      <SiteFooter context="PROVISIONAL OPENING SEQUENCE / 01" />
    </main>
  );
}
