"use client";

import { useMemo, useRef, useState } from "react";
import type { CaseStudyProject } from "@/types/project";
import { ProjectLightbox } from "@/components/case-study/ProjectLightbox";
import type { LightboxAsset } from "@/components/case-study/ProjectLightbox";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export function BlueprintGallery({ project }: { project: CaseStudyProject }) {
  const assets: LightboxAsset[] = useMemo(() => project.blueprint_urls.map((url, index) => ({ url, alt: `Architectural drawing for ${project.title}, drawing ${index + 1}`, caption: `DRAWING ${String(index + 1).padStart(2, "0")}`, kind: "drawing" as const })), [project.blueprint_urls, project.title]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  if (!assets.length) return null;
  return (
    <section className="case-blueprints" aria-labelledby={`case-blueprint-title-${project.slug}`}>
      <div className="case-section-label mono"><span>03 / DRAWING ARCHIVE</span><span>{String(assets.length).padStart(2, "0")} FILES</span></div>
      <h2 id={`case-blueprint-title-${project.slug}`}>The technical<br /><em>record.</em></h2>
      <div className="case-blueprint-grid">
        {assets.map((asset, index) => <figure className="case-blueprint-item" key={asset.url}>
          <button type="button" onClick={(event) => { trigger.current = event.currentTarget; setActiveIndex(index); }} aria-label={`Inspect architectural drawing ${index + 1}`}>
            <span className="case-blueprint-frame"><PortfolioImage src={asset.url} alt={asset.alt} sizes="(max-width: 700px) 88vw, 42vw" className="case-blueprint-image" /></span>
            <span className="case-blueprint-label mono">{asset.caption} / OPEN DRAWING</span>
          </button>
        </figure>)}
      </div>
      <ProjectLightbox title={project.title} assets={assets} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => { setActiveIndex(null); requestAnimationFrame(() => trigger.current?.focus()); }} />
    </section>
  );
}
