import type { CaseStudyProject } from "@/types/project";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export function ProjectConclusion({ project }: { project: CaseStudyProject }) {
  const image = project.gallery_json.at(-1);
  const src = image?.url || project.hero_image_url;
  if (!src) return null;
  return (
    <section className="case-conclusion" aria-label={`${project.title} closing image`}>
      <div className="case-conclusion-image">
        <PortfolioImage src={src} alt={image?.alt ?? `${project.title}, closing architectural view`} sizes="(max-width: 760px) 100vw, 72vw" lqip={project.hero_lqip} />
        <span className="case-conclusion-caption mono">END OF STUDY / {project.slug.toUpperCase()}</span>
      </div>
      <p className="mono">{project.location} {project.year > 0 ? `/ ${project.year}` : ""}</p>
    </section>
  );
}
