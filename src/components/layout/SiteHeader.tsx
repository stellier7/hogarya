"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo/Logo";
import { nav } from "@/domain/site";

function isCurrent(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-ivory transition-shadow duration-300 ${scrolled ? "shadow-[0_10px_30px_rgb(23_43_40/8%)]" : ""}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" aria-label="Hogar Ya, inicio" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
              className={`text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 ${isCurrent(pathname, item.href) ? "text-forest" : "text-charcoal/70"} hover:text-forest`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="btn-line min-h-11 px-4 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none lg:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <nav id="menu-movil" className="overflow-hidden" aria-label="Móvil" inert={!open}>
          <ul className="grid border-t border-line px-5 py-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-full px-3 py-3 text-sm uppercase tracking-[0.16em] transition-colors duration-300 hover:bg-ivory-deep"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
