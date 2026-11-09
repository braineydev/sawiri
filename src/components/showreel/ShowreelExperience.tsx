"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { demoProjects } from "@/data/projects";
import type { KeyboardEvent } from "react";

const studies = demoProjects.map((project) => ({ src: project.hero_image_url, alt: project.gallery_json[0]?.alt ?? `${project.title}, demonstration image study`, title: project.title, place: project.location }));

export function ShowreelExperience() {
  const dialog = useRef<HTMLDialogElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const pointerStart = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const openStudy = () => {
    setIndex(0);
    dialog.current?.showModal();
  };
  const closeStudy = () => dialog.current?.close();
  const onClose = () => openButton.current?.focus();
  const previous = () => setIndex((current) => (current - 1 + studies.length) % studies.length);
  const next = () => setIndex((current) => (current + 1) % studies.length);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    if (Math.abs(distance) > 48) {
      if (distance < 0) next();
      else previous();
    }
    pointerStart.current = null;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
  };

  const current = studies[index];

  return (
    <section id="showreel" className="showreel-section page-gutter" aria-labelledby="showreel-title">
      <div className="section-heading"><span className="eyebrow mono">03 / SPATIAL SEQUENCE</span><span className="section-count mono">IMAGE-BASED VISUAL STUDY · DEMONSTRATION</span></div>
      <div className="showreel-heading"><div><span className="eyebrow mono">MATERIAL / LIGHT / FORM</span><h2 id="showreel-title">Look a little<br /><em>closer.</em></h2></div><p>A small collection of image studies. Demonstration material for exploring the visual rhythm of the experience.</p></div>

      <button ref={openButton} className="visual-study-poster" type="button" onClick={openStudy} aria-haspopup="dialog" aria-label="Open the demonstration architectural visual study" data-cursor="explore">
        <Image src={studies[2].src} alt="Demonstration image of geometric contemporary architecture" fill sizes="(max-width: 760px) 100vw, 90vw" />
        <span className="poster-shade" />
        <span className="poster-top mono"><span>VISUAL STUDY / DEMONSTRATION</span><span>SEQUENCE 01—06</span></span>
        <span className="poster-action"><span className="poster-action-icon"><ArrowUpRight size={19} /></span><span><b>OPEN THE STUDY</b><small>AN IMAGE SEQUENCE · NO FILM ASSET SUPPLIED</small></span></span>
        <span className="poster-corner mono">AZ—VS/01</span>
      </button>

      <dialog ref={dialog} className="study-dialog" aria-label="Demonstration architectural visual study" onClose={onClose} onKeyDown={handleKeyDown}>
        <div className="study-modal">
          <div className="study-toolbar mono"><span>VISUAL STUDY / DEMONSTRATION</span><span>{String(index + 1).padStart(2, "0")} — {String(studies.length).padStart(2, "0")}</span><button type="button" onClick={closeStudy} autoFocus aria-label="Close visual study"><span>CLOSE</span><X size={17} /></button></div>
          <div className="study-image-stage" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }} data-cursor="drag" aria-label="Swipe or drag to move between demonstration images">
            <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" />
            <span className="study-image-shade" />
            <div className="study-image-meta"><span className="mono">{current.place.toUpperCase()}</span><h2>{current.title}</h2><span className="mono">DEMONSTRATION STUDY / {String(index + 1).padStart(2, "0")}</span></div>
            <button type="button" className="study-arrow study-previous" onClick={previous} aria-label="Previous image"><ArrowLeft /></button>
            <button type="button" className="study-arrow study-next" onClick={next} aria-label="Next image"><ArrowRight /></button>
          </div>
          <div className="study-footer mono"><span>SWIPE OR USE ARROW KEYS / BUTTONS</span><div className="study-progress" aria-label={`Image ${index + 1} of ${studies.length}`}>{studies.map((study, i) => <button type="button" key={study.title} onClick={() => setIndex(i)} aria-label={`Show image ${i + 1}: ${study.title}`} aria-current={i === index ? "true" : undefined}><i /></button>)}</div><span>REEL ARCHER / IMAGE STUDY</span></div>
        </div>
      </dialog>
    </section>
  );
}
