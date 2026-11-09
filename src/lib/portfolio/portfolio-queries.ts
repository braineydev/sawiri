import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoProjects } from "@/data/projects";
import type { PortfolioProject, Project, ProjectStatus, ProjectTypology } from "@/types/project";
import type { PortfolioFilters, PortfolioSort } from "@/lib/portfolio/portfolio-filters";
import { safeProject } from "@/lib/portfolio/portfolio-utils";

export const PORTFOLIO_PAGE_SIZE = 12;
export type ProjectSource = "live" | "local" | "error";
export type PortfolioResult = {
  projects: PortfolioProject[];
  years: number[];
  source: ProjectSource;
  error?: string;
  total: number;
  page: number;
  pageSize: number;
};

const columns = "id,slug,title,location,year,area_sqm,typology,status,hero_image_url,hero_lqip,gallery_json,architectural_narrative,featured,display_order,is_demo";

function filterLocalProjects(filters: PortfolioFilters) {
  const term = filters.q.toLocaleLowerCase();
  const filtered = demoProjects.filter((project) =>
    (filters.typology === "All" || project.typology === filters.typology) &&
    (filters.status === "All" || project.status === filters.status) &&
    (filters.year === null || project.year === filters.year) &&
    (!term || project.title.toLocaleLowerCase().includes(term) || project.location.toLocaleLowerCase().includes(term)),
  );

  const comparators: Record<PortfolioSort, (a: Project, b: Project) => number> = {
    featured: (a, b) => Number(b.featured) - Number(a.featured) || a.display_order - b.display_order || a.id.localeCompare(b.id),
    newest: (a, b) => b.year - a.year || a.display_order - b.display_order || a.id.localeCompare(b.id),
    oldest: (a, b) => a.year - b.year || a.display_order - b.display_order || a.id.localeCompare(b.id),
    "area-desc": (a, b) => (b.area_sqm ?? -1) - (a.area_sqm ?? -1) || a.display_order - b.display_order || a.id.localeCompare(b.id),
    "area-asc": (a, b) => (a.area_sqm ?? Number.MAX_SAFE_INTEGER) - (b.area_sqm ?? Number.MAX_SAFE_INTEGER) || a.display_order - b.display_order || a.id.localeCompare(b.id),
  };
  return filtered.sort(comparators[filters.sort]);
}

function searchPattern(value: string) {
  return value.replace(/[,%()_*]/g, " ").replace(/\s+/g, " ").trim();
}

function demoResult(filters: PortfolioFilters, source: ProjectSource, error?: string): PortfolioResult {
  const all = filterLocalProjects(filters);
  const start = (filters.page - 1) * PORTFOLIO_PAGE_SIZE;
  return {
    projects: all.slice(start, start + PORTFOLIO_PAGE_SIZE),
    years: [...new Set(demoProjects.map((project) => project.year))].sort((a, b) => b - a),
    source,
    error,
    total: all.length,
    page: filters.page,
    pageSize: PORTFOLIO_PAGE_SIZE,
  };
}

function fallbackResult(filters: PortfolioFilters, error?: string): PortfolioResult {
  return demoResult(filters, error ? "error" : "local", error ? "The project archive is temporarily unavailable." : undefined);
}

const getPortfolioByKey = cache(async (filterKey: string): Promise<PortfolioResult> => {
  const filters = JSON.parse(filterKey) as PortfolioFilters;
  let supabase;
  try {
    supabase = await createClient();
  } catch {
    return fallbackResult(filters, "Supabase client initialization failed");
  }
  if (!supabase) return fallbackResult(filters);

  try {
    const offset = (filters.page - 1) * PORTFOLIO_PAGE_SIZE;
    let query = supabase.from("projects").select(columns, { count: "exact" }).eq("is_published", true).eq("is_demo", false);
    if (filters.typology !== "All") query = query.eq("typology", filters.typology as ProjectTypology);
    if (filters.status !== "All") query = query.eq("status", filters.status as ProjectStatus);
    if (filters.year !== null) query = query.eq("year", filters.year);
    if (filters.q) {
      const pattern = searchPattern(filters.q);
      if (pattern) query = query.or(`title.ilike.%${pattern}%,location.ilike.%${pattern}%`);
    }

    const sorted = query
      .order(filters.sort === "newest" ? "year" : filters.sort === "oldest" ? "year" : filters.sort.startsWith("area-") ? "area_sqm" : "featured", {
        ascending: filters.sort === "oldest" || filters.sort === "area-asc",
        nullsFirst: false,
      })
      .order("display_order", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + PORTFOLIO_PAGE_SIZE - 1);

    const [projectResult, yearResult] = await Promise.all([
      sorted,
      supabase.from("projects").select("year").eq("is_published", true).eq("is_demo", false).order("year", { ascending: false }).limit(2000),
    ]);
    if (projectResult.error) return fallbackResult(filters, projectResult.error.message);
    if (yearResult.error) return fallbackResult(filters, yearResult.error.message);

    const years = [...new Set((yearResult.data ?? []).map((row) => row.year).filter((year): year is number => Number.isInteger(year)))];
    if (years.length === 0) return demoResult(filters, "local");

    return {
      projects: ((projectResult.data ?? []) as PortfolioProject[]).map(safeProject),
      years,
      source: "live",
      total: projectResult.count ?? 0,
      page: filters.page,
      pageSize: PORTFOLIO_PAGE_SIZE,
    };
  } catch {
    return fallbackResult(filters, "Project query failed");
  }
});

export function getPortfolio(filters: PortfolioFilters): Promise<PortfolioResult> {
  const key = JSON.stringify({ q: filters.q, typology: filters.typology, status: filters.status, year: filters.year, sort: filters.sort, page: filters.page });
  return getPortfolioByKey(key);
}
