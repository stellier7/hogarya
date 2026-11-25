"use client";

import { useEffect, useState, type ReactNode } from "react";

export function FilterDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const apply = () => setOpen(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return (
    <details
      className="border border-line p-4 lg:border-0 lg:p-0"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="cursor-pointer list-none text-sm uppercase tracking-[0.16em] lg:hidden">Filtrar</summary>
      <div className="mt-4 grid gap-4 lg:mt-0">{children}</div>
    </details>
  );
}
