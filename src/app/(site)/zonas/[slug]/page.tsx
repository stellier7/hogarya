import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property/PropertyCard";
import { isPublicProperty } from "@/domain/filters";
import { kindPlural, propertyKinds } from "@/domain/labels";
import { findZone, zones } from "@/domain/zones";
import { hasPublicDemo, loadCatalog } from "@/server/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return zones.map((zone) => ({ slug: zone.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const zone = findZone((await params).slug);
  if (!zone) return { title: "Zona" };
  const store = await loadCatalog();
  return {
    title: `Propiedades en ${zone.city}`,
    description: `${zone.summary} Compre o alquile con socios autorizados de Hogar Ya.`,
    robots: hasPublicDemo(store) ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function ZonePage({ params }: Props) {
  const zone = findZone((await params).slug);
  if (!zone) notFound();
  const store = await loadCatalog();
  const properties = store.properties.filter(
    (property) => property.citySlug === zone.slug && isPublicProperty(property, store.agencies),
  );
  const agencies = new Map(store.agencies.map((agency) => [agency.id, agency]));

  return (
    <article>
      <section className="relative min-h-[46vh] bg-forest text-ivory">
        <Image src={zone.image} alt={`Imagen de referencia para ${zone.city}. No es una fotografía de la ciudad.`} fill priority sizes="100vw" className="object-cover opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[46vh] max-w-6xl flex-col justify-end px-5 py-12">
          <p className="text-[0.72rem] uppercase tracking-[0.22em]">{zone.department}</p>
          <h1 className="display mt-3 text-5xl md:text-6xl">{zone.city}</h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-ivory/85">{zone.summary}</p>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap gap-3 text-sm">
          <Link className="btn-line" href={`/comprar/${zone.slug}`}>En venta</Link>
          <Link className="btn-line" href={`/alquilar/${zone.slug}`}>En alquiler</Link>
          {propertyKinds.slice(0, 4).map((kind) => (
            <Link key={kind.id} className="btn-line" href={`/comprar/${zone.slug}/${kind.slug}`}>{kindPlural(kind.id)} en venta</Link>
          ))}
        </div>
        <h2 className="display mt-12 text-4xl text-forest">Publicaciones</h2>
        {properties.length === 0 ? (
          <p className="mt-4 max-w-xl text-sm leading-6">Todavía no hay propiedades publicadas en {zone.city}. Puede dejar una consulta o revisar otra ciudad.</p>
        ) : (
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} agency={agencies.get(property.agencyId)} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
