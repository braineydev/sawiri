import type { CaseStudyProject } from "@/types/project";

export function ProjectNarrative({ project }: { project: CaseStudyProject }) {
  if (!project.architectural_narrative) return null;
  return (
    <section className="case-narrative" aria-labelledby={`case-narrative-title-${project.slug}`}>
      <div className="case-section-label mono"><span>01 / PROJECT NOTE</span><span>ARCHITECTURAL NARRATIVE</span></div>
      <h2 id={`case-narrative-title-${project.slug}`}>The project,<br /><em>in its own words.</em></h2>
      <p className="case-narrative-copy">{project.architectural_narrative}</p>
      {project.is_demo && <span className="case-narrative-disclosure mono">DEMONSTRATION COPY</span>}
    </section>
  );
}
