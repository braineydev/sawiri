"use client";

import { useState, type CSSProperties } from "react";
import type { ProjectComparisonPair } from "@/types/project";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export function ImageComparisonSlider({ pair, title }: { pair: ProjectComparisonPair; title: string }) {
  const [position, setPosition] = useState(54);
  const style = { "--comparison-position": `${position}%` } as CSSProperties;
  return (
    <figure className="case-comparison">
      <div className="case-comparison-frame" style={style}>
        <PortfolioImage src={pair.drawing_url} alt={pair.drawing_alt || `${title}, paired architectural drawing`} sizes="(max-width: 700px) 94vw, 72vw" className="case-comparison-drawing" />
        <div className="case-comparison-render"><PortfolioImage src={pair.render_url} alt={pair.render_alt || `${title}, paired architectural visualization`} sizes="(max-width: 700px) 94vw, 72vw" /></div>
        <span className="case-comparison-divider" aria-hidden="true"><i>+</i></span>
        <span className="case-comparison-label case-comparison-label--render mono">{pair.render_label || "RENDER"}</span>
        <span className="case-comparison-label case-comparison-label--drawing mono">{pair.drawing_label || "DRAWING"}</span>
        <input className="case-comparison-range" type="range" min="0" max="100" step="1" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label={`${title} render and drawing comparison`} aria-valuetext={`${position}% render, ${100 - position}% drawing`} />
      </div>
      {pair.caption && <figcaption className="case-comparison-caption">{pair.caption}</figcaption>}
      <p className="case-comparison-instruction mono">DRAG, TAP OR USE THE ARROW KEYS TO COMPARE</p>
    </figure>
  );
}
