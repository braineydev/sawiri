"use client";

import { useEffect, useRef } from "react";

const FRAME_COUNT = 240;
const HALF_WINDOW = 12;
const HEADER_DAMPING = 9;
const SECTION_DAMPING = 28;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const frameRequests = new Map<number, Promise<Blob>>();

function getFrame(index: number) {
  let request = frameRequests.get(index);
  if (!request) {
    const path = `/sawiri-story-frames/frame_${String(index + 1).padStart(4, "0")}.webp`;
    request = fetch(path).then((response) => {
      if (!response.ok) throw new Error(`Unable to load frame ${index + 1}`);
      return response.blob();
    });
    frameRequests.set(index, request);
    request.catch(() => frameRequests.delete(index));
  }
  return request;
}

type Props = { startFrame?: number; endFrame?: number; scrubScope?: "section" | "viewport"; className?: string };

export function HeroFrameSequence({ startFrame = 0, endFrame = FRAME_COUNT - 1, scrubScope = "viewport", className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = canvas?.closest<HTMLElement>(".signature-hero");
    const targetElement = scrubScope === "section" ? section : canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !targetElement || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const blobs: (Blob | undefined)[] = new Array(FRAME_COUNT);
    const bitmaps = new Map<number, ImageBitmap>();
    const pending = new Set<number>();
    let center = startFrame;
    let position = 0;
    let target = 0;
    let lastTime = 0;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let disposed = false;
    let isActive = false;

    const draw = (bitmap: ImageBitmap, alpha = 1) => {
      const scale = Math.max(width / bitmap.width, height / bitmap.height);
      const drawWidth = bitmap.width * scale;
      const drawHeight = bitmap.height * scale;
      context.globalAlpha = alpha;
      context.drawImage(bitmap, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
      context.globalAlpha = 1;
    };

    const requestRender = () => {
      if (!animationFrame && !disposed) {
        lastTime = performance.now();
        animationFrame = requestAnimationFrame(render);
      }
    };

    const decode = (index: number) => {
      const blob = blobs[index];
      if (!isActive || !blob || bitmaps.has(index) || pending.has(index)) return;
      pending.add(index);
      createImageBitmap(blob).then((bitmap) => {
        pending.delete(index);
        if (disposed || !isActive || Math.abs(index - center) > HALF_WINDOW + 4) {
          bitmap.close();
          return;
        }
        bitmaps.set(index, bitmap);
        requestRender();
      }).catch(() => pending.delete(index));
    };

    const manageWindow = () => {
      for (const [index, bitmap] of bitmaps) {
        if (Math.abs(index - center) > HALF_WINDOW + 4) {
          bitmap.close();
          bitmaps.delete(index);
        }
      }
      for (let offset = 0; offset <= HALF_WINDOW; offset++) {
        for (const index of offset === 0 ? [center] : [center + offset, center - offset]) {
          if (index >= startFrame && index <= endFrame) decode(index);
        }
      }
    };

    const nearest = (index: number) => {
      if (bitmaps.has(index)) return bitmaps.get(index);
      for (let offset = 1; offset <= HALF_WINDOW + 4; offset++) {
        const nearby = bitmaps.get(index - offset) ?? bitmaps.get(index + offset);
        if (nearby) return nearby;
      }
      return undefined;
    };

    function render(time: number) {
      animationFrame = 0;
      const delta = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
      lastTime = time;
      const difference = target - position;
      const damping = scrubScope === "section" ? HEADER_DAMPING : SECTION_DAMPING;
      position = reducedMotion.matches || Math.abs(difference) < 0.0002
        ? target
        : position + difference * (1 - Math.exp(-delta * damping));

      if (!isActive) return;

      const nextCenter = Math.round(startFrame + position * (endFrame - startFrame));
      if (nextCenter !== center || bitmaps.size === 0) {
        center = nextCenter;
        manageWindow();
      }

      const framePosition = startFrame + position * (endFrame - startFrame);
      const lowerIndex = Math.floor(framePosition);
      const base = nearest(lowerIndex);
      if (base) {
        draw(base);
        const next = bitmaps.get(lowerIndex + 1);
        const blend = framePosition - lowerIndex;
        if (next && blend > 0.03) draw(next, blend);
      }
      if (position !== target || pending.size > 0) requestRender();
    }

    const updateTarget = () => {
      if (reducedMotion.matches) {
        target = 0;
      } else {
        if (scrubScope === "section" && section) {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          const scrollDistance = Math.max(1, section.offsetHeight - window.innerHeight);
          target = clamp((window.scrollY - sectionTop) / scrollDistance);
        } else {
          const bounds = targetElement.getBoundingClientRect();
          target = clamp((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height));
        }
      }
      requestRender();
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const pixelRatio = Math.max(1, Math.min(window.devicePixelRatio || 1, 2, 2560 / width));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingQuality = "high";
      updateTarget();
    };

    const fetchFrame = async (index: number) => {
      blobs[index] = await getFrame(index);
      if (isActive && Math.abs(index - center) <= HALF_WINDOW) decode(index);
    };

    let loadCancelled = false;
    const loadFrames = async () => {
      const priority: number[] = [startFrame];
      const remaining: number[] = [];
      for (let index = startFrame + 1; index <= endFrame; index++) {
        (index % 8 === 0 || index === endFrame ? priority : remaining).push(index);
      }
      const queue = [...priority, ...remaining];
      let nextIndex = 0;
      const worker = async () => {
        while (!loadCancelled) {
          const index = nextIndex++;
          if (index >= queue.length) return;
          try { await fetchFrame(queue[index]); } catch { /* Keep loading the available frames. */ }
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
    };

    resize();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", resize);
    const observer = new ResizeObserver(updateTarget);
    observer.observe(targetElement);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isActive = entry.isIntersecting;
      if (isActive) {
        position = target;
        center = Math.round(startFrame + position * (endFrame - startFrame));
        manageWindow();
        requestRender();
      } else {
        bitmaps.forEach((bitmap) => bitmap.close());
        bitmaps.clear();
      }
    }, { rootMargin: `${Math.round(window.innerHeight * 0.25)}px 0px` });
    visibilityObserver.observe(targetElement);
    void loadFrames();

    return () => {
      disposed = true;
      loadCancelled = true;
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", resize);
      observer.disconnect();
      visibilityObserver.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      bitmaps.forEach((bitmap) => bitmap.close());
    };
  }, [startFrame, endFrame, scrubScope]);

  return <canvas ref={canvasRef} className={`hero-frame-canvas${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
