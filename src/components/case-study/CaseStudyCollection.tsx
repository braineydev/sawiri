import type { CaseStudyProject } from "@/types/project";
import type { CaseStudySource } from "@/lib/case-study/case-study-queries";
import { CaseStudySection } from "@/components/case-study/CaseStudySection";

export function CaseStudyCollection({ projects, source }: { projects: CaseStudyProject[]; source: CaseStudySource }) {
  return projects.map((project, index) => (
    <CaseStudySection
      key={project.id}
      project={project}
      source={source}
      nextProject={projects.length > 1 ? projects[(index + 1) % projects.length] : null}
    />
  ));
}
