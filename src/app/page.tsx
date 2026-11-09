import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { SignatureHero } from "@/components/hero/SignatureHero";
import { StudioIntroduction } from "@/components/storytelling/StudioIntroduction";
import { ShowreelExperience } from "@/components/showreel/ShowreelExperience";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PortfolioBrowser } from "@/components/portfolio/PortfolioBrowser";
import { StudioPage } from "@/components/studio/StudioPage";
import { InquiryConfigurator } from "@/components/inquiry/InquiryConfigurator";
import { ContactDirectLinks } from "@/components/contact/ContactDirectLinks";
import { CaseStudyCollection } from "@/components/case-study/CaseStudyCollection";
import { getPortfolio } from "@/lib/portfolio/portfolio-queries";
import { parsePortfolioFilters } from "@/lib/portfolio/portfolio-filters";
import { canIndexSite, canonicalOrigin, noIndexRobots, siteMetadata } from "@/lib/seo/site-config";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parsePortfolioFilters(params);
  const hasFilters = Object.values(params).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  const archive = canIndexSite ? await getPortfolio(filters) : null;
  const publiclyIndexable = canIndexSite && !hasFilters && archive?.source === "live" && archive.total > 0;
  return {
    title: { absolute: "Reel Archer | Architecture" },
    description: siteMetadata.description,
    alternates: publiclyIndexable && canonicalOrigin ? { canonical: canonicalOrigin } : undefined,
    openGraph: { type: "website", title: "Reel Archer | Architecture", description: siteMetadata.description },
    twitter: { card: "summary_large_image", title: "Reel Archer | Architecture", description: siteMetadata.description },
    robots: publiclyIndexable ? { index: true, follow: true } : noIndexRobots,
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const filters = parsePortfolioFilters(await searchParams);
  const result = await getPortfolio(filters);
  return (
    <main className="sawiri-opening">
      <Navigation />
      <SignatureHero />
      <StudioIntroduction />
      <ShowreelExperience />
      <section id="projects" className="portfolio-page" aria-label="Selected architectural projects">
        <PortfolioBrowser projects={result.projects} years={result.years} filters={filters} total={result.total} pageSize={result.pageSize} source={result.source} />
      </section>
      <CaseStudyCollection projects={result.projects} source={result.source} />
      <StudioPage />
      <section id="contact" className="contact-page" aria-label="Project inquiry and contact details">
        <InquiryConfigurator turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} />
        <ContactDirectLinks />
      </section>
      <SiteFooter context="STUDIO / PROJECTS / INQUIRY" />
    </main>
  );
}
