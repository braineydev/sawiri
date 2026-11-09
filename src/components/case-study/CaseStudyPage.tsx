import type { CaseStudyProject } from "@/types/project";
import type { CaseStudySource, NextProject as NextProjectRecord } from "@/lib/case-study/case-study-queries";
import { Navigation } from "@/components/navigation/Navigation";
import { CaseStudyHero } from "@/components/case-study/CaseStudyHero";
import { StickyProjectRail } from "@/components/case-study/StickyProjectRail";
import { ProjectNarrative } from "@/components/case-study/ProjectNarrative";
import { ArchitecturalGallery } from "@/components/case-study/ArchitecturalGallery";
import { BlueprintGallery } from "@/components/case-study/BlueprintGallery";
import { RenderDrawingComparison } from "@/components/case-study/RenderDrawingComparison";
import { ProjectConclusion } from "@/components/case-study/ProjectConclusion";
import { NextProjectTransition } from "@/components/case-study/NextProjectTransition";
import { SiteFooter } from "@/components/layout/SiteFooter";

export function CaseStudyPage({ project, source, nextProject }: { project: CaseStudyProject; source: CaseStudySource; nextProject: NextProjectRecord | null }) {
  const gallery = project.gallery_json.filter((asset) => asset.url !== project.hero_image_url);
  return (
    <main className="case-study-page">
      <Navigation />
      <CaseStudyHero project={project} source={source} />
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
      <SiteFooter context={project.is_demo ? "DEMONSTRATION CASE STUDY" : "PROJECT ARCHIVE / CASE STUDY"} />
    </main>
  );
}
