"use client";

import { useEffect, type ReactNode } from "react";

export function ScrollMotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const selector = [
      "[data-scroll-reveal]",
      ".studio-introduction .section-heading",
      ".showreel-section .section-heading",
      ".showreel-heading",
      ".visual-study-poster",
      ".portfolio-intro-main",
      ".portfolio-controls",
      ".project-index-card",
      ".case-narrative",
      ".case-section-label",
      ".case-gallery-item",
      ".case-blueprint-item",
      ".case-comparisons",
      ".studio-intro > *",
      ".studio-philosophy > *",
      ".studio-section-head",
      ".studio-method .studio-section-head",
      ".principle-row",
    ].join(",");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const tracked = new Set<HTMLElement>();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add("is-revealed");
        observer.unobserve(element);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    const observeElement = (element: HTMLElement) => {
      if (tracked.has(element)) return;
      tracked.add(element);
      element.classList.add("scroll-reveal-target");
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.93 && rect.bottom > 0) element.classList.add("is-revealed");
      else observer.observe(element);
    };
    const observeWithin = (container: ParentNode) => container.querySelectorAll<HTMLElement>(selector).forEach(observeElement);
    observeWithin(document);
    root.classList.add("has-scroll-motion");
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches(selector)) observeElement(node);
        observeWithin(node);
      }));
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("has-scroll-motion");
      tracked.forEach((element) => element.classList.remove("scroll-reveal-target", "is-revealed"));
    };
  }, []);

  return children;
}
