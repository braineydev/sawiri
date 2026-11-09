import type { CaseStudyProject } from "@/types/project";
import type { NextProject as NextProjectRecord, CaseStudySource } from "@/lib/case-study/case-study-queries";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { StickyProjectRail } from "@/components/case-study/StickyProjectRail";
import { ProjectNarrative } from "@/components/case-study/ProjectNarrative";
import { ArchitecturalGallery } from "@/components/case-study/ArchitecturalGallery";
import { BlueprintGallery } from "@/components/case-study/BlueprintGallery";
import { RenderDrawingComparison } from "@/components/case-study/RenderDrawingComparison";
import { ProjectConclusion } from "@/components/case-study/ProjectConclusion";
import { NextProjectTransition } from "@/components/case-study/NextProjectTransition";

export function CaseStudySection({ project, source, nextProject }: { project: CaseStudyProject; source: CaseStudySource; nextProject: NextProjectRecord | null }) {
  const gallery = project.gallery_json.filter((asset) => asset.url !== project.hero_image_url);
  return (
    <section className="case-study-page" id={`project-${project.slug}`} aria-labelledby={`case-title-${project.slug}`}>
      <CaseStudyHero project={project} source={source} titleId={`case-title-${project.slug}`} />
      <div className="case-study-body page-gutter">
        <StickyProjectRail project={project} />
        <div className="case-study-sequence">
          <ProjectNarrative project={project} />
          <ArchitecturalGallery project={project} assets={gallery} />
          <BlueprintGallery project={project} />
          <RenderDrawingComparison project={project} />
          <ProjectConclusion project={project} />
        </div>
      </div>
      <NextProjectTransition project={nextProject} />
    </section>
  );
}
