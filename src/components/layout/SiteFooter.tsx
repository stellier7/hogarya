import Link from "next/link";
import { Logo } from "@/components/logo/Logo";
import { zones } from "@/domain/zones";

const iagoLinks = [
  { href: "https://www.iagodigital.com/servicios", label: "Servicios" },
  { href: "https://www.iagodigital.com/industrias", label: "Industrias" },
  { href: "https://www.iagodigital.com/website-design-honduras", label: "Web" },
  { href: "https://www.iagodigital.com/seo-services-honduras", label: "SEO" },
  { href: "https://www.iagodigital.com/whatsapp-automation", label: "WhatsApp" },
  { href: "https://www.iagodigital.com/case-studies", label: "Casos" },
  { href: "https://www.iagodigital.com/about", label: "About" },
  { href: "https://www.iagodigital.com/blog", label: "Blog" },
  { href: "https://www.iagodigital.com/contact", label: "Contacto" },
  { href: "https://www.iagodigital.com/pricing", label: "Planes" },
  { href: "https://www.iagodigital.com/en", label: "English", hrefLang: "en" },
  { href: "https://www.iagodigital.com/terms", label: "Términos" },
  { href: "https://www.iagodigital.com/privacy", label: "Privacidad" },
  { href: "https://www.linkedin.com/company/iago-digital", label: "LinkedIn" },
  { href: "https://www.facebook.com/profile.php?id=61595522623553", label: "Facebook" },
  { href: "https://www.instagram.com/iagodigital.web/", label: "Instagram" },
] as const;

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
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/comprar">Comprar</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/alquilar">Alquilar</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/propiedades">Todas las propiedades</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/publicar">Publicar propiedad</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/inmobiliarias">Inmobiliarias</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/nosotros">Nosotros</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/contacto">Contacto</Link></li>
            <li><Link className="transition-colors duration-300 hover:text-gold" href="/marca">Sistema visual</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.18em]">Ciudades</p>
          <span className="mt-3 block h-px w-8 bg-gold" />
          <ul className="mt-4 grid gap-2 text-sm">
            {zones.map((zone) => (
              <li key={zone.slug}>
                <Link className="transition-colors duration-300 hover:text-gold" href={`/zonas/${zone.slug}`}>{zone.city}</Link>
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
      <div className="border-t border-ivory/15">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 py-8 text-center">
          <a href="https://www.iagodigital.com/" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold tracking-tight text-ivory transition-colors duration-300 hover:text-[#E8734A]">
            IAGO<span className="text-[#E8734A]">.</span>
          </a>
          <p className="text-sm text-ivory/70">© 2026 IAGO Digital. Todos los derechos reservados.</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-ivory/70">
            {iagoLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  hrefLang={"hrefLang" in item ? item.hrefLang : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-[#E8734A]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
