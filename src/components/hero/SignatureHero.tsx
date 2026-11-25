import { HeroFrameSequence } from "@/components/hero/HeroFrameSequence";

export function SignatureHero() {
  return (
    <section id="home" className="signature-hero" aria-label="SAWIRI architectural film">
      <div className="hero-sticky-stage">
        <div className="hero-image-plane">
          <HeroFrameSequence startFrame={0} endFrame={55} scrubScope="section" />
        </div>
      </div>
    </section>
  );
}
