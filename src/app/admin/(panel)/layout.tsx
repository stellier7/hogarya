import Link from "next/link";
import { signOut } from "@/app/actions/auth";
import { Logo } from "@/components/logo/Logo";
import type { SessionUser } from "@/domain/types";
import { requireSession } from "@/server/session";

export const dynamic = "force-dynamic";

function linksFor(user: SessionUser): { href: string; label: string }[] {
  const links = [
    { href: "/admin", label: "Resumen" },
    { href: "/admin/propiedades", label: "Propiedades" },
    { href: "/admin/consultas", label: "Consultas" },
  ];
  if (user.role === "admin" || user.role === "agency") links.push({ href: "/admin/agentes", label: "Agentes" });
  if (user.role === "admin") {
    links.push(
      { href: "/admin/destacadas", label: "Destacadas" },
      { href: "/admin/inmobiliarias", label: "Inmobiliarias" },
      { href: "/admin/captaciones", label: "Captaciones" },
      { href: "/admin/accesos", label: "Accesos" },
      { href: "/admin/actividad", label: "Actividad" },
    );
  }
  return links;
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();
  return (
    <div className="min-h-screen md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="bg-forest text-ivory md:min-h-screen">
        <div className="px-5 py-6"><Logo tone="ivory" /></div>
        <nav className="grid px-3" aria-label="Panel">
          {linksFor(user).map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm text-ivory/80 transition-colors duration-300 hover:bg-ivory/10 hover:text-ivory">{link.label}</Link>
          ))}
        </nav>
        <p className="px-6 py-4 text-xs text-ivory/60">{user.name}<br />{user.role}</p>
        <form action={signOut} className="px-6 pb-6">
          <button type="submit" className="text-xs uppercase tracking-[0.16em] text-ivory/80">Cerrar sesión</button>
        </form>
        <p className="px-6 pb-8"><Link href="/" className="text-xs text-ivory/70">Ver el sitio</Link></p>
      </aside>
      <div className="px-5 py-8 md:px-10">{children}</div>
    </div>
  );
}
