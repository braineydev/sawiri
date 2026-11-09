import type { CaseStudyProject } from "@/types/project";
import { formatArea } from "@/lib/portfolio/portfolio-utils";

function coordinateLabel(project: CaseStudyProject) {
  const coordinates = project.coordinates;
  if (!coordinates || !Number.isFinite(coordinates.lat) || !Number.isFinite(coordinates.lng)
    || coordinates.lat < -90 || coordinates.lat > 90 || coordinates.lng < -180 || coordinates.lng > 180) return null;
  return `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`;
}

export function StickyProjectRail({ project }: { project: CaseStudyProject }) {
  const facts: [string, string | null][] = [
    ["PROJECT", project.title || null],
    ["LOCATION", project.location || null],
    ["YEAR", project.year > 0 ? String(project.year) : null],
    ["AREA", project.area_sqm ? formatArea(project.area_sqm) : null],
    ["TYPOLOGY", project.typology || null],
    ["STATUS", project.status || null],
    ["COORDINATES", coordinateLabel(project)],
  ];

  return (
    <aside className="case-spec-rail" id="project-information" aria-label="Project specifications">
      <div className="case-spec-sticky">
        <div className="case-section-label mono"><span>PROJECT DATA</span><span>{String(project.display_order).padStart(2, "0")}</span></div>
        <dl>{facts.filter((fact): fact is [string, string] => Boolean(fact[1])).map(([label, value]) => <div className="case-spec-row" key={label}><dt className="mono">{label}</dt><dd>{value}</dd></div>)}</dl>
        {project.coordinates && <p className="case-coordinate-note mono">REFERENCE COORDINATES SUPPLIED WITH THIS RECORD. EXACT SITE POSITION IS NOT VERIFIED.</p>}
        {project.is_demo && <p className="case-demo-note mono">DEMONSTRATION PROJECT / PROVISIONAL CONTENT</p>}
      </div>
    </aside>
  );
}
