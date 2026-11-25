"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function Parallax({
  children,
  className = "",
  strength = 40,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = frame.current;
    const inner = layer.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!node || !inner || motion.matches) return;

    let request = 0;
    const paint = () => {
      request = 0;
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = (viewport - rect.top) / (viewport + rect.height);
      const shift = (progress - 0.5) * strength;
      inner.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (request) return;
      request = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (request) window.cancelAnimationFrame(request);
    };
  }, [strength]);

  return (
    <div ref={frame} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div ref={layer} className="absolute -inset-y-[24%] inset-x-0">
        <div className="relative h-full w-full">{children}</div>
      </div>
    </div>
  );
}
