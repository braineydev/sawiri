import type { ProjectStatus, ProjectTypology } from "@/types/project";

export type PortfolioView = "editorial" | "ledger";
export type PortfolioSort = "featured" | "newest" | "oldest" | "area-desc" | "area-asc";

export type PortfolioFilters = {
  q: string;
  typology: ProjectTypology | "All";
  status: ProjectStatus | "All";
  year: number | null;
  sort: PortfolioSort;
  view: PortfolioView;
  page: number;
};

export const typologies: ProjectTypology[] = ["Residential", "Commercial", "Cultural", "Interior", "Urban"];
export const statuses: ProjectStatus[] = ["Completed", "In Progress", "Concept"];
export const sortOptions: { value: PortfolioSort; label: string }[] = [
  { value: "featured", label: "Featured first" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "area-desc", label: "Largest area" },
  { value: "area-asc", label: "Smallest area" },
];

type SearchParams = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export function parsePortfolioFilters(params: SearchParams): PortfolioFilters {
  const rawType = first(params.typology);
  const rawStatus = first(params.status);
  const rawYear = Number(first(params.year));
  const rawPage = Number(first(params.page));
  const rawSort = first(params.sort) as PortfolioSort;
  const rawView = first(params.view) as PortfolioView;

  return {
    q: (first(params.q) ?? "").trim().slice(0, 100),
    typology: rawType && typologies.includes(rawType as ProjectTypology) ? rawType as ProjectTypology : "All",
    status: rawStatus && statuses.includes(rawStatus as ProjectStatus) ? rawStatus as ProjectStatus : "All",
    year: Number.isInteger(rawYear) && rawYear >= 1800 && rawYear <= 2200 ? rawYear : null,
    sort: sortOptions.some((option) => option.value === rawSort) ? rawSort : "featured",
    view: rawView === "ledger" ? "ledger" : "editorial",
    page: Number.isInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 10000) : 1,
  };
}
