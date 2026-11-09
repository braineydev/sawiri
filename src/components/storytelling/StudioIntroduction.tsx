import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { demoProjects } from "@/data/projects";

export function StudioIntroduction() {
  return (
    <section id="studio-introduction" className="studio-introduction page-gutter" aria-labelledby="introduction-title">
      <div className="section-heading"><span className="eyebrow mono">02 / INTRODUCTION</span><span className="section-count mono">A PROVISIONAL POINT OF VIEW</span></div>
      <div className="introduction-layout">
        <div className="introduction-image-wrap" data-cursor="explore">
          <Image src={demoProjects[0].hero_image_url} alt="Demonstration image study: a quiet contemporary living space opening to a garden" fill sizes="(max-width: 760px) 86vw, 42vw" />
          <span className="mono introduction-image-caption">IMAGE STUDY / 02 — DEMONSTRATION</span>
          <span className="image-axis mono" aria-hidden="true">A—A′</span>
        </div>
        <div className="introduction-copy">
          <span className="eyebrow mono">A PLACE IS NEVER ONLY A PLACE.</span>
          <h2 id="introduction-title">It is a light<br />that <em>changes.</em></h2>
          <div className="introduction-copy-bottom">
            <span className="introduction-index mono">[ 02.1 ]</span>
            <p>Every site holds its own measure of light, material and pause. This opening statement is provisional; it sets a tone for the experience while Reel Archer’s own words take shape.</p>
            <a href="#showreel" className="introduction-next mono">CONTINUE TO VISUAL STUDY <ArrowDownRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
