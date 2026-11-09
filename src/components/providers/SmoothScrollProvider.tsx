"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reducedMotion.matches) lenisRef.current = new Lenis({ autoRaf: true, anchors: true, smoothWheel: true });
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}<BackToTopButton lenisRef={lenisRef} /></>;
}

function BackToTopButton({ lenisRef }: { lenisRef: { current: Lenis | null } }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const circumference = 2 * Math.PI * 21;

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0);
        setVisible(window.scrollY > 320);
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.1 });
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <button className="back-to-top" type="button" aria-label={`Scroll back to top. ${Math.round(scrollProgress * 100)}% down the page`} aria-hidden={!visible} tabIndex={visible ? 0 : -1} onClick={scrollToTop}>
      <svg className="back-to-top-ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle className="back-to-top-track" cx="24" cy="24" r="21" />
        <circle className="back-to-top-progress" cx="24" cy="24" r="21" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - scrollProgress)} />
      </svg>
      <ArrowUp size={21} strokeWidth={2.3} aria-hidden="true" />
    </button>
  );
}
