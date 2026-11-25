import Image from "next/image";
import Link from "next/link";
import { SearchPanel } from "@/components/home/SearchPanel";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { PropertyCard } from "@/components/property/PropertyCard";
import { description, siteName, siteUrl, slogan } from "@/domain/site";
import { loadCatalog, publicProperties } from "@/server/catalog";
import { sortProperties } from "@/domain/filters";
import { zones } from "@/domain/zones";

const reasons = [
  {
    number: "01",
    title: "Publicación exclusiva",
    body: "Un propietario no sube su aviso por su cuenta. Publican agentes, inmobiliarias y socios que Hogar Ya autoriza.",
  },
  {
    number: "02",
    title: "Un responsable en cada ficha",
    body: "Cada propiedad muestra quién la comercializa. La marca del socio se mantiene; Hogar Ya es el marketplace.",
  },
  {
    number: "03",
    title: "Revisión antes de salir",
    body: "Una ficha nueva queda pendiente hasta que el administrador la aprueba. Nada se presenta como verificado sin ese proceso.",
  },
  {
    number: "04",
    title: "Cobertura nacional",
    body: "El catálogo está pensado para ciudades y departamentos de todo Honduras, de la vivienda económica a la propiedad premium.",
  },
];

export default async function HomePage() {
  const store = await loadCatalog();
  const published = sortProperties(publicProperties(store), "recientes");
  const featured = published.filter((property) => property.featured).slice(0, 3);
  const featuredIds = new Set(featured.map((property) => property.id));
  const recent = published.filter((property) => !featuredIds.has(property.id)).slice(0, 4);
  const agencies = new Map(store.agencies.map((agency) => [agency.id, agency]));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    slogan,
    description,
    url: siteUrl(),
    areaServed: { "@type": "Country", name: "Honduras" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative min-h-[88vh] overflow-hidden rounded-b-[2.75rem] bg-forest text-ivory">
        <Parallax strength={160}>
          <Image
            src="/demo/hero.jpg"
            alt="Fotografía de referencia de una casa contemporánea. No es una propiedad de Hogar Ya."
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/45 to-forest/25" />
        <div className="enter relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-28 pt-24">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-ivory/80">Bienes raíces · Honduras</p>
          <h1 className="display mt-4 max-w-4xl text-5xl leading-[1.05] md:text-7xl">{slogan}</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-ivory/85 md:text-base">
            Descubra casas, apartamentos, terrenos y locales. Compare y contacte al agente autorizado que comercializa cada propiedad.
          </p>
        </div>
      </section>
      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-5">
        <SearchPanel />
      </div>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="kicker">Selección</p>
            <h2 className="display mt-3 text-4xl text-forest">Propiedades destacadas</h2>
          </div>
          <Link href="/propiedades" className="text-[0.72rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-gold-deep">Ver catálogo</Link>
        </div>
        </Reveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {featured[0] ? (
            <div className="lg:col-span-7">
              <PropertyCard property={featured[0]} agency={agencies.get(featured[0].agencyId)} />
            </div>
          ) : null}
          <div className="grid content-start gap-10 lg:col-span-5">
            {featured.slice(1).map((property) => (
              <PropertyCard key={property.id} property={property} agency={agencies.get(property.agencyId)} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
          <p className="kicker">Recién publicadas</p>
          <h2 className="display mt-3 text-4xl text-forest">Lo último en el catálogo</h2>
          </Reveal>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((property) => (
              <PropertyCard key={property.id} property={property} agency={agencies.get(property.agencyId)} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
        <p className="kicker">Honduras</p>
        <h2 className="display mt-3 max-w-xl text-4xl text-forest">Ciudades y zonas para empezar la búsqueda</h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {zones.map((zone, index) => (
            <Link key={zone.slug} href={`/zonas/${zone.slug}`} className={`media group relative block min-h-56 bg-forest ${index < 2 ? "md:col-span-2 md:min-h-80" : ""}`}>
              <Parallax strength={56}>
              <Image src={zone.image} alt={`Imagen de referencia para ${zone.city}. No es una fotografía de la ciudad.`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" />
              </Parallax>
              <span className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent" />
              <span className="absolute bottom-0 left-0 p-5">
                <span className="display block text-3xl text-ivory">{zone.city}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-ivory/75">{zone.department}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.22em] text-ivory/70">La diferencia</p>
            <h2 className="display mt-3 text-4xl">Por qué elegir Hogar Ya</h2>
          </div>
          <ol className="grid gap-8">
            {reasons.map((reason, index) => (
              <Reveal key={reason.number} delay={index * 70}>
              <li className="grid gap-2 border-t border-ivory/15 pt-6 md:grid-cols-[4rem_1fr]">
                <span className="display text-2xl text-gold">{reason.number}</span>
                <div>
                  <h3 className="text-lg">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-ivory/75">{reason.body}</p>
                </div>
              </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
        <Reveal className="h-full">
        <div className="sheet h-full p-8 md:p-10">
          <p className="kicker">Socios</p>
          <h2 className="display mt-3 text-4xl text-forest">Agentes e inmobiliarias</h2>
          <p className="mt-4 text-sm leading-6 text-charcoal/80">
            Hogar Ya centraliza inventario autorizado. Cada inmobiliaria conserva su nombre y atiende a sus clientes. El alta de un socio la confirma el administrador.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contacto" className="btn">Solicitar autorización</Link>
            <Link href="/inmobiliarias" className="btn-line">Ver socios de prueba</Link>
          </div>
        </div>
        </Reveal>
        <Reveal className="h-full" delay={80}>
        <div className="h-full rounded-[1.5rem] bg-ivory-deep p-8 md:p-10">
          <p className="kicker">Propietarios</p>
          <h2 className="display mt-3 text-4xl text-forest">Comercialice su propiedad</h2>
          <p className="mt-4 text-sm leading-6 text-charcoal/80">
            Si no es un agente autorizado, no publique solo. Envíe una solicitud de captación con los datos del inmueble y el equipo de Hogar Ya la revisa.
          </p>
          <Link href="/publicar" className="btn mt-8">Quiero que la comercialicen</Link>
        </div>
        </Reveal>
      </section>
    </>
  );
}
