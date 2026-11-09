import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NextProject as NextProjectRecord } from "@/lib/case-study/case-study-queries";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export function NextProjectTransition({ project }: { project: NextProjectRecord | null }) {
  if (!project) {
    return <section className="next-project next-project--archive page-gutter"><span className="mono">END OF CURRENT ARCHIVE</span><Link href="/projects">RETURN TO PROJECT INDEX <ArrowUpRight size={16} /></Link></section>;
  }
  return (
    <section className="next-project page-gutter" aria-label="Next project">
      <div className="next-project-intro mono"><span>NEXT / {String(project.display_order).padStart(2, "0")}</span><span>CONTINUE THROUGH THE ARCHIVE</span></div>
      <Link href={`/projects/${project.slug}`} className="next-project-link" prefetch={false}>
        <span className="next-project-image"><PortfolioImage src={project.hero_image_url} alt={`${project.title}, project preview`} sizes="(max-width: 700px) 92vw, 58vw" lqip={project.hero_lqip} /></span>
        <span className="next-project-copy"><span className="mono">NEXT PROJECT / {project.location}</span><span className="next-project-title">{project.title}</span><span className="next-project-action mono">OPEN PROJECT <ArrowUpRight size={15} /></span></span>
      </Link>
    </section>
  );
}
