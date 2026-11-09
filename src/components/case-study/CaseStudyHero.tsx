import { ArrowDown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { CaseStudyProject } from "@/types/project";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export function CaseStudyHero({ project, source }: { project: CaseStudyProject; source: "live" | "local" | "error" }) {
  return (
    <section className="case-hero" aria-labelledby="case-title">
      <div className="case-hero-image">
        {project.hero_image_url ? <PortfolioImage src={project.hero_image_url} alt={project.gallery_json.find((asset) => asset.url === project.hero_image_url)?.alt ?? `${project.title}, architectural project image`} sizes="100vw" lqip={project.hero_lqip} preload /> : <span className="portfolio-image-fallback mono">PROJECT IMAGE UNAVAILABLE</span>}
        <div className="case-hero-shade" />
        <span className="case-hero-coordinate mono">{project.coordinates ? `REF. ${project.coordinates.lat.toFixed(4)} / ${project.coordinates.lng.toFixed(4)}` : "REEL ARCHER / PROJECT ARCHIVE"}</span>
      </div>
      <div className="case-hero-inner page-gutter">
        <div className="case-hero-top mono"><Link href="/projects"><ArrowLeft size={13} /> ALL PROJECTS</Link><span>{project.is_demo || source !== "live" ? "DEMONSTRATION RECORD" : "SELECTED PROJECT"}</span></div>
        <div className="case-hero-title-block">
          <p className="eyebrow mono">{String(project.display_order).padStart(2, "0")} / {project.typology} {project.year > 0 ? `/ ${project.year}` : ""}</p>
          <h1 id="case-title">{project.title}</h1>
          <p className="case-hero-location">{project.location}</p>
        </div>
        <div className="case-hero-bottom mono"><span>{project.is_demo ? "DEMONSTRATION PROJECT / NOT A REEL ARCHER COMMISSION" : "ARCHITECTURAL CASE STUDY"}</span><a href="#project-information">EXPLORE THE PROJECT <ArrowDown size={13} /></a></div>
      </div>
    </section>
  );
}
