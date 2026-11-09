"use client";

import { useMemo, useRef, useState } from "react";
import type { CaseStudyProject, ProjectGalleryAsset } from "@/types/project";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";
import { ProjectLightbox } from "@/components/case-study/ProjectLightbox";
import type { LightboxAsset } from "@/components/case-study/ProjectLightbox";

function layoutFor(asset: ProjectGalleryAsset, index: number, total: number) {
  if (asset.layout) return asset.layout;
  if (total === 1 || index % 5 === 0) return "full";
  if (index % 5 === 1 || index % 5 === 2) return "split";
  return index % 5 === 3 ? "detail" : "portrait";
}

export function ArchitecturalGallery({ project, assets }: { project: CaseStudyProject; assets: ProjectGalleryAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const lightboxAssets: LightboxAsset[] = useMemo(() => assets.map((asset, index) => ({ url: asset.url, alt: asset.alt, caption: asset.caption || `IMAGE ${String(index + 1).padStart(2, "0")}` })), [assets]);
  if (!assets.length) return null;

  return (
    <section className="case-gallery" aria-labelledby={`case-gallery-title-${project.slug}`}>
      <div className="case-section-label mono"><span>02 / SPATIAL SEQUENCE</span><span>{String(assets.length).padStart(2, "0")} IMAGES</span></div>
      <h2 id={`case-gallery-title-${project.slug}`} className="case-gallery-heading">A closer<br /><em>look.</em></h2>
      <div className="case-gallery-grid">
        {assets.map((asset, index) => {
          const layout = layoutFor(asset, index, assets.length);
          return (
            <figure className={`case-gallery-item case-gallery-item--${layout}`} key={`${asset.url}-${index}`}>
              <button type="button" className="case-gallery-open" onClick={(event) => { trigger.current = event.currentTarget; setActiveIndex(index); }} aria-label={`Open image ${index + 1}: ${asset.alt}`}>
                <span className="case-gallery-frame"><PortfolioImage src={asset.url} alt={asset.alt} sizes="(max-width: 700px) 94vw, 72vw" /></span>
                <span className="case-gallery-index mono">{String(index + 1).padStart(2, "0")} / OPEN IMAGE</span>
              </button>
              {asset.caption && <figcaption className="case-gallery-caption">{asset.caption}</figcaption>}
            </figure>
          );
        })}
      </div>
      <ProjectLightbox title={project.title} assets={lightboxAssets} activeIndex={activeIndex} onChange={setActiveIndex} onClose={() => { setActiveIndex(null); requestAnimationFrame(() => trigger.current?.focus()); }} />
    </section>
  );
}
