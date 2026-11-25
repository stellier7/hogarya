import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { zones } from "@/domain/zones";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="grid content-start gap-6">
          <Logo tone="ivory" />
          <p className="max-w-sm text-sm leading-6 text-ivory/80">
            Marketplace inmobiliario para Honduras. Las publicaciones corresponden a agentes e inmobiliarias autorizadas.
          </p>
        </div>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.18em]">Explorar</p>
          <span className="mt-3 block h-px w-8 bg-gold" />
          <ul className="mt-4 grid gap-2 text-sm">
            <li><Link href="/comprar">Comprar</Link></li>
            <li><Link href="/alquilar">Alquilar</Link></li>
            <li><Link href="/propiedades">Todas las propiedades</Link></li>
            <li><Link href="/publicar">Publicar propiedad</Link></li>
            <li><Link href="/inmobiliarias">Inmobiliarias</Link></li>
            <li><Link href="/nosotros">Nosotros</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/marca">Sistema visual</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.18em]">Ciudades</p>
          <span className="mt-3 block h-px w-8 bg-gold" />
          <ul className="mt-4 grid gap-2 text-sm">
            {zones.map((zone) => (
              <li key={zone.slug}>
                <Link href={`/zonas/${zone.slug}`}>{zone.city}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs leading-5 text-ivory/70 md:flex-row md:justify-between">
          <p>Hogar Ya. Teléfono, correo, dirección y redes oficiales pendientes de confirmación.</p>
          <p>Los registros marcados como prueba no son ofertas reales.</p>
        </div>
      </div>
    </footer>
  );
}
