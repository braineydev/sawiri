"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { StudioMethod } from "@/config/studio.config";

export function MethodologyTimeline({ stages }: { stages: readonly StudioMethod[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-method-stage]"));
    if (!nodes.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const index = nodes.indexOf(visible.target as HTMLElement);
      if (index >= 0) setActive(index);
    }, { rootMargin: "-32% 0px -48% 0px", threshold: [0, 0.25, 0.5] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [stages.length]);

  if (!stages.length) return null;
  const selectStage = (index: number) => {
    setActive(index);
    document.getElementById(`method-stage-${index}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  };

  return (
    <section className="studio-method page-gutter" aria-labelledby="method-heading">
      <div className="studio-section-head"><p className="mono">03 / HOW A PROJECT MAY UNFOLD</p><h2 id="method-heading">A sequence of<br /><em>questions.</em></h2></div>
      <div className="method-layout">
        <nav className="method-nav" aria-label="Methodology stages">
          {stages.map((stage, index) => <button key={stage.id} type="button" className={index === active ? "method-nav-item is-active" : "method-nav-item"} aria-current={index === active ? "step" : undefined} onClick={() => selectStage(index)}>
            <span className="mono">{stage.id}</span><span>{stage.title}</span><i aria-hidden="true" />
          </button>)}
        </nav>
        <div className="method-stages">
          {stages.map((stage, index) => <article id={`method-stage-${index}`} data-method-stage key={stage.id} className={`method-stage${index === active ? " is-active" : ""}`}>
            <p className="mono">STAGE {stage.id} / {String(index + 1).padStart(2, "0")}</p>
            <h3>{stage.title}</h3><p className="method-summary">{stage.summary}</p><p className="method-detail">{stage.detail}</p>
            {stage.image && <figure><Image src={stage.image} alt={stage.imageAlt ?? ""} width={1200} height={800} sizes="(max-width: 800px) 100vw, 55vw" /><figcaption className="mono">STUDY / {stage.id}</figcaption></figure>}
          </article>)}
        </div>
      </div>
      <p className="studio-disclosure mono">PROVISIONAL METHODOLOGY / FOR CONTENT REVIEW</p>
    </section>
  );
}
