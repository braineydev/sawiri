import { ArrowDownRight } from "lucide-react";
import { HeroFrameSequence } from "@/components/hero/HeroFrameSequence";

export function StudioIntroduction() {
  return (
    <section id="studio-introduction" className="studio-introduction page-gutter" aria-labelledby="introduction-title">
      <div className="section-heading" data-scroll-reveal><span className="eyebrow mono">02 / INTRODUCTION</span><span className="section-count mono">A PROVISIONAL POINT OF VIEW</span></div>
      <div className="introduction-layout">
        <div className="introduction-image-wrap" data-cursor="explore" data-scroll-reveal>
          <HeroFrameSequence startFrame={56} endFrame={83} className="sequence-frame-canvas--soft" />
          <span className="mono introduction-image-caption">IMAGE STUDY / 02 — DEMONSTRATION</span>
          <span className="image-axis mono" aria-hidden="true">A—A′</span>
        </div>
        <div className="introduction-copy" data-scroll-reveal>
          <span className="eyebrow mono">A PLACE IS NEVER ONLY A PLACE.</span>
          <h2 id="introduction-title">It is a light<br />that <em>changes.</em></h2>
          <div className="introduction-copy-bottom">
            <span className="introduction-index mono">[ 02.1 ]</span>
            <p>Every site holds its own measure of light, material and pause. This opening statement is provisional; it sets a tone for the experience while SAWIRI’s own words take shape.</p>
            <a href="#showreel" className="introduction-next mono">CONTINUE TO VISUAL STUDY <ArrowDownRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
