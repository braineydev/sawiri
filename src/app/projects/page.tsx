import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { PortfolioBrowser } from "@/components/portfolio/PortfolioBrowser";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getPortfolio } from "@/lib/portfolio/portfolio-queries";
import { parsePortfolioFilters } from "@/lib/portfolio/portfolio-filters";
import { canIndexSite, canonicalOrigin, noIndexRobots } from "@/lib/seo/site-config";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const filters = parsePortfolioFilters(params);
  const hasFilters = Object.values(params).some((value) => Array.isArray(value) ? value.length > 0 : Boolean(value));
  const archive = canIndexSite ? await getPortfolio(filters) : null;
  const publiclyIndexable = canIndexSite && !hasFilters && archive?.source === "live" && archive.total > 0;
  return {
    title: "Projects",
    description: "Explore published architectural project studies in the Reel Archer archive.",
    alternates: publiclyIndexable && canonicalOrigin ? { canonical: new URL("/projects", canonicalOrigin).toString() } : undefined,
    openGraph: { type: "website", title: "Projects | Reel Archer", description: "Explore published architectural project studies in the Reel Archer archive." },
    twitter: { card: "summary_large_image", title: "Projects | Reel Archer", description: "Explore published architectural project studies in the Reel Archer archive." },
    robots: publiclyIndexable ? { index: true, follow: true } : noIndexRobots,
  };
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const filters = parsePortfolioFilters(await searchParams);
  const result = await getPortfolio(filters);

  return (
    <main className="portfolio-page">
      <Navigation />
      <PortfolioBrowser
        key={filters.q}
        projects={result.projects}
        years={result.years}
        filters={filters}
        total={result.total}
        pageSize={result.pageSize}
        source={result.source}
      />
      <SiteFooter context={`PROJECT ARCHIVE / ${result.source === "live" ? "LIVE" : "DEMONSTRATION"}`} />
    </main>
  );
}
