import type { CSSProperties } from "react";

type ArchitecturalGridProps = { opacity?: number; visible?: boolean };

export function ArchitecturalGrid({
  opacity = 0.45,
  visible = true,
}: ArchitecturalGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`architectural-grid${visible ? " is-visible" : ""}`}
      style={{ "--grid-opacity": opacity } as CSSProperties}
    />
  );
}
