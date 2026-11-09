import { Navigation } from "@/components/navigation/Navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { CaseStudyProject } from "@/types/project";
import type { CaseStudySource, NextProject as NextProjectRecord } from "@/lib/case-study/case-study-queries";
import { CaseStudySection } from "@/components/case-study/CaseStudySection";

export function CaseStudyPage({ project, source, nextProject }: { project: CaseStudyProject; source: CaseStudySource; nextProject: NextProjectRecord | null }) {
  return <main><Navigation /><CaseStudySection project={project} source={source} nextProject={nextProject} /><SiteFooter context={project.is_demo ? "DEMONSTRATION CASE STUDY" : "PROJECT ARCHIVE / CASE STUDY"} /></main>;
}
