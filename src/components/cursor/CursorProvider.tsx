"use client";

import { useEffect, useRef, type ReactNode } from "react";

type CursorState = "default" | "view" | "explore" | "drag" | "crosshair";
const labels: Record<CursorState, string> = { default: "", view: "VIEW", explore: "EXPLORE", drag: "DRAG", crosshair: "+" };

export function CursorProvider({ children }: { children: ReactNode }) {
  const cursor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (motion.matches || !finePointer.matches) return;

    const element = cursor.current;
    if (!element) return;
    let x = -100;
    let y = -100;
    let targetX = x;
    let targetY = y;
    let frame = 0;
    let visible = false;

    const setState = (state: CursorState) => {
      element.dataset.state = state;
      element.textContent = labels[state];
    };

    const render = () => {
      x += (targetX - x) * 0.28;
      y += (targetY - y) * 0.28;
      element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2) frame = requestAnimationFrame(render);
      else frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const target = event.target instanceof Element ? event.target : null;
      const editable = target?.closest("input, textarea, select, [contenteditable='true']");
      const cursorTarget = target?.closest<HTMLElement>("[data-cursor]");
      const state = editable ? "default" : cursorTarget?.dataset.cursor as CursorState | undefined;
      setState(state && state in labels ? state : "default");
      if (!visible) {
        visible = true;
        element.classList.add("is-visible");
      }
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onPointerLeave = () => {
      visible = false;
      element.classList.remove("is-visible");
      setState("default");
    };
    const onKeyDown = () => {
      visible = false;
      element.classList.remove("is-visible");
    };

    document.body.classList.add("has-custom-cursor");
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", onPointerLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", onPointerLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <>{children}<div ref={cursor} aria-hidden="true" className="custom-cursor" data-state="default" /></>;
}
