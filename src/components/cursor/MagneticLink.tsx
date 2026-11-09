"use client";

import { useEffect, useRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string; children: ReactNode; strength?: number };

export function MagneticLink({ children, strength = 0.12, onPointerMove, onPointerLeave, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * strength;
      const y = (event.clientY - bounds.top - bounds.height / 2) * strength;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { element.style.setProperty("--magnetic-x", `${Math.max(-5, Math.min(5, x))}px`); element.style.setProperty("--magnetic-y", `${Math.max(-5, Math.min(5, y))}px`); });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      element.style.setProperty("--magnetic-x", "0px");
      element.style.setProperty("--magnetic-y", "0px");
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);
    return () => { element.removeEventListener("pointermove", onMove); element.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(frame); };
  }, [strength]);

  return <Link {...props} ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} className={`magnetic-link ${props.className ?? ""}`}>{children}</Link>;
}
