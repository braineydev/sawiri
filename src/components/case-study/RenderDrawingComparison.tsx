import type { CaseStudyProject } from "@/types/project";
import { ImageComparisonSlider } from "@/components/case-study/ImageComparisonSlider";

export function RenderDrawingComparison({ project }: { project: CaseStudyProject }) {
  if (!project.comparison_pairs.length) return null;
  return (
    <section className="case-comparisons" aria-labelledby="case-comparison-title">
      <div className="case-section-label mono"><span>04 / DESIGN & DOCUMENT</span><span>{String(project.comparison_pairs.length).padStart(2, "0")} MATCHED PAIRS</span></div>
      <h2 id="case-comparison-title">Intention<br /><em>meets precision.</em></h2>
      <div className="case-comparison-list">{project.comparison_pairs.map((pair) => <ImageComparisonSlider key={pair.id} pair={pair} title={project.title} />)}</div>
    </section>
  );
}
