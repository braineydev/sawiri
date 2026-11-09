"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { KeyboardEvent, PointerEvent } from "react";
import { PortfolioImage } from "@/components/portfolio/PortfolioImage";

export type LightboxAsset = { url: string; alt: string; caption?: string; kind?: "image" | "drawing" };

export function ProjectLightbox({ title, assets, activeIndex, onClose, onChange }: {
  title: string;
  assets: LightboxAsset[];
  activeIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pointerStart = useRef<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const active = activeIndex !== null && assets[activeIndex] ? assets[activeIndex] : null;

  useEffect(() => {
    if (active && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [active]);

  if (!active || activeIndex === null) return null;
  const previous = () => onChange((activeIndex - 1 + assets.length) % assets.length);
  const next = () => onChange((activeIndex + 1) % assets.length);
  const keyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); previous(); }
    if (event.key === "ArrowRight") { event.preventDefault(); next(); }
  };
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStart.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current === null) return;
    const distance = event.clientX - pointerStart.current;
    if (Math.abs(distance) > 48) {
      if (distance < 0) next();
      else previous();
    }
    pointerStart.current = null;
  };

  return (
    <dialog ref={dialog} className="case-lightbox" aria-label={`${title} image viewer`} onClose={onClose} onKeyDown={keyDown}>
      <div className="case-lightbox-shell">
        <header className="case-lightbox-toolbar mono"><span>{title.toUpperCase()} / IMAGE STUDY</span><span>{String(activeIndex + 1).padStart(2, "0")} — {String(assets.length).padStart(2, "0")}</span><button ref={closeButton} type="button" onClick={() => dialog.current?.close()} autoFocus aria-label="Close image viewer">CLOSE <X size={17} /></button></header>
        <div className={`case-lightbox-stage${active.kind === "drawing" ? " is-drawing" : ""}`} onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { pointerStart.current = null; }}>
          <PortfolioImage key={active.url} src={active.url} alt={active.alt} sizes="100vw" priority className="case-lightbox-image" />
          {assets.length > 1 && <><button className="case-lightbox-arrow case-lightbox-prev" type="button" onClick={previous} aria-label="Previous image"><ArrowLeft /></button><button className="case-lightbox-arrow case-lightbox-next" type="button" onClick={next} aria-label="Next image"><ArrowRight /></button></>}
          {active.caption && <p className="case-lightbox-caption mono">{active.caption}</p>}
        </div>
        <footer className="case-lightbox-footer mono"><span>USE ARROW KEYS OR SWIPE TO EXPLORE</span><span>{active.kind === "drawing" ? "TECHNICAL DRAWING" : "PROJECT IMAGE"}</span></footer>
      </div>
    </dialog>
  );
}
