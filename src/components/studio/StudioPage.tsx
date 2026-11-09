import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { studioConfig } from "@/config/studio.config";
import { MethodologyTimeline } from "@/components/studio/MethodologyTimeline";

function Archive({ title, entries }: { title: string; entries: typeof studioConfig.awards }) {
  if (!entries.length) return null;
  return <section className="studio-archive page-gutter" aria-label={title}><p className="mono">{title}</p><div>{entries.map((entry, index) => <article className="archive-row" key={entry.id}>
    <span className="mono">{String(index + 1).padStart(2, "0")}</span><span className="mono">{entry.year}</span><div><h3>{entry.title}</h3><p>{entry.organization}{entry.category ? ` / ${entry.category}` : ""}</p>{entry.description && <small>{entry.description}</small>}</div>
    {isSafeExternalUrl(entry.url) && <a href={entry.url} target="_blank" rel="noopener noreferrer" aria-label={`Read ${entry.title} at ${entry.organization}`}>OPEN <ArrowUpRight size={14} /></a>}
  </article>)}</div></section>;
}

function isSafeExternalUrl(value?: string) {
  if (!value) return false;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

export function StudioPage() {
  return <section className="studio-page" id="studio" aria-labelledby="studio-title">
    <section className="studio-hero page-gutter" aria-labelledby="studio-title">
      <div className="studio-hero-grid" aria-hidden="true"><i /><i /><i /><i /><span>AZ / 05</span></div>
      <p className="mono studio-hero-kicker">{studioConfig.hero.eyebrow} <span>— EDITORIAL STUDY</span></p>
      <div className="studio-hero-copy"><h1 id="studio-title">{studioConfig.hero.title}<br /><em>{studioConfig.hero.titleSecond}</em></h1><p>{studioConfig.hero.note}</p></div>
      <a href="#studio-introduction" className="studio-scroll mono">SCROLL TO EXPLORE <ArrowDown size={14} /></a>
    </section>
    <section className="studio-intro page-gutter" id="studio-introduction"><p className="mono">{studioConfig.introduction.label}</p><div><h2>{studioConfig.introduction.heading}</h2><p>{studioConfig.introduction.body}</p><span className="mono studio-disclosure">PROVISIONAL EDITORIAL COPY / REQUIRES REEL ARCHER REVIEW</span></div><div className="studio-intro-figure" aria-label="Abstract architectural line study"><span className="mono">FIG. 01 / SPATIAL STUDY</span><i /><b /><small className="mono">N—01</small></div></section>
    <section className="studio-philosophy page-gutter"><p className="mono">{studioConfig.philosophy.label}</p><div><h2>{studioConfig.philosophy.statement}</h2><p>{studioConfig.philosophy.body}</p></div><span className="philosophy-index mono" aria-hidden="true">01—05</span></section>
    <section className="studio-principles page-gutter"><header className="studio-section-head"><p className="mono">02 / PRINCIPLES — DRAFT</p><h2>Ways of<br /><em>looking.</em></h2></header><div>{studioConfig.principles.map((principle, index) => <article key={principle.id} className="principle-row"><span className="mono">{String(index + 1).padStart(2, "0")}</span><h3>{principle.title}</h3><p>{principle.summary}</p></article>)}</div><p className="studio-disclosure mono">DEMONSTRATION COPY / REPLACE WITH APPROVED REEL ARCHER PRINCIPLES</p></section>
    <MethodologyTimeline stages={studioConfig.methodology} />
    <Archive title="AWARDS / VERIFIED RECORD" entries={studioConfig.awards} />
    <Archive title="PRESS / PUBLICATION ARCHIVE" entries={studioConfig.press} />
    <section className="studio-closing page-gutter"><p className="mono">A PROJECT BEGINS WITH A QUESTION</p><h2>Have something<br /><em>in mind?</em></h2><Link href="/#contact">Shape a project brief <ArrowUpRight size={16} /></Link></section>
  </section>;
}
