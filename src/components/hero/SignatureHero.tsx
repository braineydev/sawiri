import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { heroConfig } from "@/config/hero.config";
import { MagneticLink } from "@/components/cursor/MagneticLink";

export function SignatureHero() {
  return (
    <section id="home" className="signature-hero" aria-labelledby="hero-title">
      <a className="hero-image-plane" href="#showreel" aria-label="Explore the demonstration architectural visual study" data-cursor="explore">
        <Image className="hero-image" src={heroConfig.image.src} alt={heroConfig.image.alt} fill sizes="100vw" preload style={{ objectPosition: heroConfig.image.position }} />
        <div className="hero-image-veil" />
        <span className="hero-image-credit mono">{heroConfig.image.credit}</span>
        <span className="hero-image-coordinate mono" data-cursor="crosshair">{heroConfig.coordinates}</span>
      </a>
      <div className="hero-inner page-gutter">
        <div className="hero-index mono"><span>01 / PROVISIONAL OPENING</span><span className="hero-edition">MATERIAL / INTERVAL</span></div>
        <div className="hero-composition">
          <div className="hero-headline-column">
            <span className="eyebrow mono hero-eyebrow">{heroConfig.eyebrow} <i /></span>
            <h1 id="hero-title" className="hero-headline"><span>{heroConfig.headline[0]}</span><span className="hero-headline-middle">{heroConfig.headline[1]}</span><span className="hero-headline-last">{heroConfig.headline[2]}</span></h1>
          </div>
          <div className="hero-caption">
            <span className="eyebrow mono">PROVISIONAL COPY STUDY</span>
            <p>{heroConfig.statement}</p>
            <MagneticLink href="/projects" className="hero-explore-link" data-cursor="view"><span>EXPLORE THE PROJECTS</span><ArrowUpRight size={15} /></MagneticLink>
          </div>
        </div>
        <div className="hero-bottomline mono"><span>DEMONSTRATION ARCHITECTURAL IMAGE</span><a href="#studio-introduction" className="scroll-cue"><span>SCROLL TO APPROACH</span><ArrowDown size={14} /></a><span className="hero-figure">FIG. 01 — 06</span></div>
      </div>
      <span className="hero-side-mark mono" aria-hidden="true">A—01&nbsp; / &nbsp;SPATIAL NOTES</span>
    </section>
  );
}
