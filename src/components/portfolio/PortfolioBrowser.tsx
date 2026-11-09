"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { PortfolioProject, ProjectStatus, ProjectTypology } from "@/types/project";
import type { PortfolioFilters, PortfolioSort, PortfolioView } from "@/lib/portfolio/portfolio-filters";
import { sortOptions, statuses, typologies } from "@/lib/portfolio/portfolio-filters";
import { formatArea, safeProject } from "@/lib/portfolio/portfolio-utils";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import Link from "next/link";

type Props = {
  projects: PortfolioProject[];
  years: number[];
  filters: PortfolioFilters;
  total: number;
  pageSize: number;
  source: "live" | "local" | "error";
};

function makeUrl(current: PortfolioFilters, updates: Partial<PortfolioFilters>) {
  const next = { ...current, ...updates };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.typology !== "All") params.set("typology", next.typology);
  if (next.status !== "All") params.set("status", next.status);
  if (next.year !== null) params.set("year", String(next.year));
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.view !== "editorial") params.set("view", next.view);
  if (next.page > 1) params.set("page", String(next.page));
  const query = params.toString();
  return query ? `/?${query}#projects` : "/#projects";
}

function ProjectFacts({ project }: { project: PortfolioProject }) {
  return (
    <dl className="project-index-facts">
      <div><dt>PLACE</dt><dd>{project.location || "—"}</dd></div>
      <div><dt>TYPE</dt><dd>{project.typology || "—"}</dd></div>
      <div><dt>YEAR</dt><dd>{project.year > 0 ? project.year : "—"}</dd></div>
      <div><dt>AREA</dt><dd>{formatArea(project.area_sqm)}</dd></div>
    </dl>
  );
}

function ProjectCard({ project: rawProject, index, onOpen }: { project: PortfolioProject; index: number; onOpen: (project: PortfolioProject, trigger: HTMLButtonElement) => void }) {
  const project = safeProject(rawProject);
  const layout = project.featured ? "featured" : index % 3 === 1 ? "portrait" : index % 3 === 2 ? "wide" : "standard";
  const desktopColumnWidths = [66, 33, 42, 50, 42, 58];
  const imageSizes = `(max-width: 700px) 92vw, (max-width: 1050px) 47vw, ${desktopColumnWidths[index % desktopColumnWidths.length]}vw`;
  return (
    <article className={`project-index-card project-index-card--${layout}`}>
      <Link className="project-index-open" href={`/#project-${project.slug}`} prefetch={false} aria-label={`Scroll to case study: ${project.title}`} data-cursor="view">
        <span className="project-index-image">
          <PortfolioImage src={project.hero_image_url} alt={project.gallery_json[0]?.alt ?? `${project.title}, architectural project image`} sizes={imageSizes} lqip={project.hero_lqip} />
          <span className="project-index-image-number mono">{String((index + 1)).padStart(2, "0")} / {project.featured ? "FEATURED" : "PROJECT"}</span>
          <span className="project-index-open-label mono">OPEN PROJECT <ArrowUpRight size={14} /></span>
        </span>
        <span className="project-index-heading">
          <span className="project-index-number mono">{String((index + 1)).padStart(2, "0")}</span>
          <span className="project-index-title">{project.title}</span>
          <span className="project-index-status mono"><i aria-hidden="true" />{project.status || "—"}</span>
        </span>
      </Link>
      <button className="project-index-preview mono" type="button" onClick={(event) => onOpen(project, event.currentTarget)}>QUICK PREVIEW <ArrowUpRight size={12} /></button>
      <ProjectFacts project={project} />
      {project.is_demo && <span className="project-demo-label mono">DEMO PROJECT</span>}
    </article>
  );
}

function ProjectPreview({ project, onClose }: { project: PortfolioProject | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const images = useMemo(() => project ? [{ url: project.hero_image_url, alt: project.gallery_json[0]?.alt ?? `${project.title}, architectural view` }, ...project.gallery_json].filter((item, index, list) => item.url && list.findIndex((candidate) => candidate.url === item.url) === index) : [], [project]);

  useEffect(() => {
    if (project && dialog.current && !dialog.current.open) {
      setImageIndex(0);
      dialog.current.showModal();
    }
  }, [project]);

  const move = (step: number) => setImageIndex((current) => (current + step + images.length) % images.length);
  if (!project) return null;
  const current = images[imageIndex];

  return (
    <dialog ref={dialog} className="project-preview-dialog" aria-labelledby="project-preview-title" onClose={onClose}>
      <div className="project-preview-shell">
        <header className="project-preview-toolbar mono">
          <span>PROJECT STUDY / {project.is_demo ? "DEMONSTRATION" : "REEL ARCHER ARCHIVE"}</span>
          <span>{String(imageIndex + 1).padStart(2, "0")} — {String(Math.max(images.length, 1)).padStart(2, "0")}</span>
          <button type="button" onClick={() => dialog.current?.close()} autoFocus aria-label="Close project preview">CLOSE <X size={17} /></button>
        </header>
        <div className="project-preview-content">
          <div className="project-preview-image">
            {current ? <PortfolioImage key={current.url} src={current.url} alt={current.alt} sizes="(max-width: 800px) 100vw, 66vw" lqip={project.hero_lqip} /> : <span className="portfolio-image-fallback mono">IMAGE UNAVAILABLE</span>}
            {images.length > 1 && <><button type="button" className="project-preview-arrow project-preview-prev" onClick={() => move(-1)} aria-label="Previous project image"><ArrowLeft /></button><button type="button" className="project-preview-arrow project-preview-next" onClick={() => move(1)} aria-label="Next project image"><ArrowRight /></button></>}
            <span className="project-preview-image-caption mono">{String(imageIndex + 1).padStart(2, "0")} / IMAGE SEQUENCE</span>
          </div>
          <aside className="project-preview-info">
            <span className="eyebrow mono">{project.is_demo ? "DEMONSTRATION PROJECT" : "SELECTED PROJECT"} / {project.typology}</span>
            <h2 id="project-preview-title">{project.title}</h2>
            <ProjectFacts project={project} />
            {project.architectural_narrative && <p className="project-preview-narrative">{project.architectural_narrative}</p>}
            <Link className="project-preview-link mono" href={`/#project-${project.slug}`} prefetch={false} onClick={() => dialog.current?.close()}>ENTER CASE STUDY <ArrowUpRight size={14} /></Link>
            {project.is_demo && <p className="project-preview-disclosure mono">DEMONSTRATION RECORD — NOT A REEL ARCHER COMMISSION</p>}
          </aside>
        </div>
        <footer className="project-preview-footer mono"><span>{project.location}</span><span>{project.status}</span><span>{project.slug}</span></footer>
      </div>
    </dialog>
  );
}

export function PortfolioBrowser({ projects, years, filters, total, pageSize, source }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.q);
  const [preview, setPreview] = useState<PortfolioProject | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (filters.page - 1) * pageSize + 1 : 0;
  const end = Math.min(filters.page * pageSize, total);
  const hasFilters = Boolean(filters.q || filters.typology !== "All" || filters.status !== "All" || filters.year !== null);

  useEffect(() => {
    if (search === filters.q) return;
    const timer = window.setTimeout(() => router.replace(makeUrl(filters, { q: search.trim(), page: 1 }), { scroll: false }), 320);
    return () => window.clearTimeout(timer);
  }, [search, filters, router]);
  useEffect(() => {
    if (filters.page > pageCount) router.replace(makeUrl(filters, { page: pageCount }), { scroll: false });
  }, [filters, pageCount, router]);

  const navigate = (updates: Partial<PortfolioFilters>, replace = false) => {
    const url = makeUrl(filters, updates);
    if (replace) router.replace(url, { scroll: false });
    else router.push(url, { scroll: false });
  };
  const clearFilters = () => {
    setSearch("");
    navigate({ q: "", typology: "All", status: "All", year: null, sort: "featured", page: 1 });
  };
  const openPreview = (project: PortfolioProject, element: HTMLButtonElement) => {
    trigger.current = element;
    setPreview(project);
  };
  const closePreview = () => {
    setPreview(null);
    requestAnimationFrame(() => trigger.current?.focus());
  };

  return (
    <>
      <section className="portfolio-intro page-gutter">
        <div className="portfolio-intro-top mono"><span>REEL ARCHER / PROJECT ARCHIVE</span><span>INDEX 01 — {String(Math.max(total, 1)).padStart(2, "0")}</span></div>
        <div className="portfolio-intro-main">
          <div><p className="eyebrow mono">SELECTED WORKS / {source === "live" ? "LIVE ARCHIVE" : "PROVISIONAL ARCHIVE"}</p><h1>Spaces.<br /><em>Ideas. Matter.</em></h1></div>
          <div className="portfolio-intro-aside"><p>A changing collection of places, questions and material studies.</p><span className="portfolio-total mono"><b>{String(total).padStart(2, "0")}</b> {total === 1 ? "PROJECT" : "PROJECTS"} IN VIEW</span></div>
        </div>
        <div className="portfolio-intro-bottom mono"><span>DRAWN FROM PLACE / LIGHT / USE</span><a href="#project-collection">EXPLORE THE ARCHIVE <ArrowDown size={13} /></a></div>
      </section>

      <section className="portfolio-collection page-gutter" id="project-collection" aria-label="Project archive">
        <div className="portfolio-source-note mono" data-source={source}>
          <span className="portfolio-source-indicator" aria-hidden="true" />
          {source === "live" ? "LIVE SUPABASE PROJECTS" : source === "local" ? "LOCAL DEMONSTRATION DATA" : "DATABASE ERROR / DEMONSTRATION FALLBACK"}
          {source === "error" && <span className="portfolio-source-error">The project database could not be reached. Demonstration records are shown.</span>}
        </div>
        <div className="portfolio-controls">
          <label className="portfolio-search mono"><span>FIND A PROJECT</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Title or place" aria-label="Search projects by title or location" /></label>
          <label className="portfolio-select mono"><span>TYPOLOGY</span><select value={filters.typology} onChange={(event) => navigate({ typology: event.target.value as ProjectTypology | "All", page: 1 })}><option value="All">All types</option>{typologies.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          <label className="portfolio-select mono"><span>STATUS</span><select value={filters.status} onChange={(event) => navigate({ status: event.target.value as ProjectStatus | "All", page: 1 })}><option value="All">All status</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>
          <label className="portfolio-select mono"><span>YEAR</span><select value={filters.year ?? "all"} onChange={(event) => navigate({ year: event.target.value === "all" ? null : Number(event.target.value), page: 1 })}><option value="all">All years</option>{years.map((year) => <option key={year} value={year}>{year}</option>)}</select></label>
          <label className="portfolio-select portfolio-sort mono"><span>ORDER</span><select value={filters.sort} onChange={(event) => navigate({ sort: event.target.value as PortfolioSort, page: 1 })}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        </div>
        <div className="portfolio-collection-bar mono"><span>{start}—{end} / {total} RECORDS</span><div className="portfolio-views" role="group" aria-label="Portfolio view">
          <button type="button" onClick={() => navigate({ view: "editorial" as PortfolioView })} aria-pressed={filters.view === "editorial"}>EDITORIAL</button>
          <button type="button" onClick={() => navigate({ view: "ledger" as PortfolioView })} aria-pressed={filters.view === "ledger"}>LEDGER</button>
        </div></div>
        {hasFilters && <div className="portfolio-active-filters mono"><span>FILTERED VIEW</span>{filters.q && <button type="button" onClick={() => { setSearch(""); navigate({ q: "", page: 1 }); }}>“{filters.q}” <X size={12} aria-hidden="true" /></button>}{filters.typology !== "All" && <button type="button" onClick={() => navigate({ typology: "All", page: 1 })}>{filters.typology} <X size={12} aria-hidden="true" /></button>}{filters.status !== "All" && <button type="button" onClick={() => navigate({ status: "All", page: 1 })}>{filters.status} <X size={12} aria-hidden="true" /></button>}{filters.year !== null && <button type="button" onClick={() => navigate({ year: null, page: 1 })}>{filters.year} <X size={12} aria-hidden="true" /></button>}<button className="portfolio-clear" type="button" onClick={clearFilters}>CLEAR ALL</button></div>}

        {total === 0 ? (
          <div className="portfolio-empty"><span className="mono">{source === "live" && !hasFilters ? "ARCHIVE / 00" : "NO MATCHES / 00"}</span><h2>{source === "live" && !hasFilters ? "The archive is\ntaking shape." : "No projects\nfound here."}</h2><p>{source === "live" && !hasFilters ? "Published projects will appear here when they are ready to be shared." : "Try another term or clear the selected filters to return to the full archive."}</p>{hasFilters && <button type="button" onClick={clearFilters}>CLEAR THE SELECTION <ArrowUpRight size={14} /></button>}</div>
        ) : filters.view === "ledger" ? (
          <div className="project-ledger-wrap" role="region" aria-label="Technical project ledger" tabIndex={0}>
            <table className="project-ledger"><thead><tr><th scope="col">NO.</th><th scope="col">PROJECT</th><th scope="col">LOCATION</th><th scope="col">TYPOLOGY</th><th scope="col">YEAR</th><th scope="col">AREA</th><th scope="col">STATUS</th></tr></thead><tbody>{projects.map((project, index) => <tr key={project.id}><td className="mono">{String(start + index).padStart(2, "0")}</td><th scope="row"><span className="ledger-project-links"><Link href={`/#project-${project.slug}`}>{project.title}</Link><button type="button" onClick={(event) => openPreview(project, event.currentTarget)} aria-label={`Quick preview: ${project.title}`}>PREVIEW</button></span>{project.is_demo && <small className="mono">DEMO PROJECT</small>}</th><td>{project.location || "—"}</td><td>{project.typology || "—"}</td><td className="mono">{project.year > 0 ? project.year : "—"}</td><td className="mono">{formatArea(project.area_sqm)}</td><td><span className="ledger-status"><i aria-hidden="true" />{project.status || "—"}</span></td></tr>)}</tbody></table>
          </div>
        ) : (
          <div className="project-index-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={start + index - 1} onOpen={openPreview} />)}</div>
        )}

        {pageCount > 1 && <nav className="portfolio-pagination mono" aria-label="Project pages"><button type="button" disabled={filters.page <= 1} onClick={() => navigate({ page: filters.page - 1 })}><ArrowLeft size={14} /> PREVIOUS</button><span>PAGE {String(filters.page).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span><button type="button" disabled={filters.page >= pageCount} onClick={() => navigate({ page: filters.page + 1 })}>NEXT <ArrowRight size={14} /></button></nav>}
      </section>
      <ProjectPreview project={preview} onClose={closePreview} />
    </>
  );
}
