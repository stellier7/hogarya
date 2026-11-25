import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Gallery } from "@/components/property/Gallery";
import { PropertyCard } from "@/components/property/PropertyCard";
import { countLabel, formatArea, formatDate, formatPrice } from "@/domain/format";
import { kindLabel, operationLabel, operationPath } from "@/domain/labels";
import { platformWhatsapp, siteUrl } from "@/domain/site";
import { agencyById, agentById, findPublicProperty, loadCatalog, similarProperties } from "@/server/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = findPublicProperty(await loadCatalog(), slug);
  if (!property) return { title: "Propiedad" };
  return {
    title: `${property.title}, ${property.city}`,
    description: property.description.slice(0, 160),
    alternates: { canonical: `/propiedades/${property.slug}` },
    robots: property.demo ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: property.images[0] ? [{ url: property.images[0].src, alt: property.images[0].alt }] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params;
  const store = await loadCatalog();
  const property = findPublicProperty(store, slug);
  if (!property) notFound();
  const agency = agencyById(store, property.agencyId);
  const agent = agentById(store, property.agentId);
  const similar = similarProperties(store, property);
  const whatsapp = agent?.whatsappE164 || platformWhatsapp();
  const message = `Hola, quiero información sobre ${property.referenceCode}, ${property.title}.`;
  const specs = [
    ["Operación", operationLabel(property.operation)],
    ["Tipo", kindLabel(property.kind)],
    ["Habitaciones", property.bedrooms != null ? countLabel(property.bedrooms, "habitación", "habitaciones") : "—"],
    ["Baños", property.bathrooms != null ? countLabel(property.bathrooms, "baño", "baños") : "—"],
    ["Estacionamientos", property.parking != null ? countLabel(property.parking, "estacionamiento", "estacionamientos") : "—"],
    ["Construcción", formatArea(property.constructionArea)],
    ["Terreno", formatArea(property.lotArea)],
    ["Publicada", property.publishedAt ? formatDate(property.publishedAt) : "—"],
  ];

  return (
    <article className="pb-24 md:pb-0">
      <Gallery images={property.images} title={property.title} />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <p className="text-sm text-charcoal/70">
            <Link href="/">Inicio</Link>
            {" / "}
            <Link href={operationPath(property.operation)}>{property.operation === "sale" ? "Comprar" : "Alquilar"}</Link>
            {" / "}
            <Link href={`/zonas/${property.citySlug}`}>{property.city}</Link>
          </p>
          <p className="kicker mt-6">{property.demo ? "Dato de prueba" : "Publicación"} · {property.referenceCode}</p>
          <h1 className="display mt-3 text-4xl text-forest md:text-6xl">{property.title}</h1>
          <p className="mt-3 text-sm">{property.zone}, {property.city}, {property.department}</p>
          <p className="display mt-6 text-4xl text-forest">{formatPrice(property.price, property.operation)}</p>
          {property.verification ? (
            <p className="mt-4 text-sm">Verificada el {formatDate(property.verification.at)}.</p>
          ) : (
            <p className="mt-4 text-sm text-charcoal/70">Esta publicación no está verificada.</p>
          )}
          <div className="mt-8 max-w-2xl text-sm leading-7">
            {property.description.split(/\n+/).map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-4">{paragraph}</p>
            ))}
          </div>
          <dl className="sheet mt-10 grid gap-px overflow-hidden bg-line sm:grid-cols-2">
            {specs.map(([label, value]) => (
              <div key={label} className="bg-ivory px-4 py-4">
                <dt className="kicker">{label}</dt>
                <dd className="mt-2 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          {property.amenities.length > 0 ? (
            <div className="mt-10">
              <h2 className="display text-3xl text-forest">Amenidades</h2>
              <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                {property.amenities.map((amenity) => (
                  <li key={amenity} className="border-t border-line py-2">{amenity}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className="grid content-start gap-8 lg:sticky lg:top-24 lg:self-start">
          <section className="sheet p-6">
            <p className="kicker">Responsable</p>
            <h2 className="display mt-3 text-3xl text-forest">{agent?.name ?? "Agente por asignar"}</h2>
            <p className="mt-2 text-sm">{agency?.tradeName}</p>
            <p className="mt-3 text-sm leading-6 text-charcoal/75">{agent?.bio}</p>
            {agent?.demo || agency?.demo ? <p className="mt-3 text-xs uppercase tracking-[0.14em]">Perfil de prueba</p> : null}
            {agency ? <Link href={`/inmobiliarias/${agency.slug}`} className="mt-4 inline-block text-sm underline">Ver inmobiliaria</Link> : null}
            {whatsapp ? (
              <a className="btn mt-6 w-full" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            ) : (
              <p className="mt-6 text-sm leading-6">WhatsApp se activa cuando el agente o Hogar Ya confirman un número oficial. Use el formulario.</p>
            )}
          </section>
          <section id="solicitud">
            <h2 className="display text-3xl text-forest">Solicitar información</h2>
            <div className="mt-4">
              <InquiryForm propertyId={property.id} source="property" />
            </div>
          </section>
        </aside>
      </div>
      {similar.length > 0 ? (
        <section className="mx-auto max-w-6xl px-5 pb-16">
          <h2 className="display text-4xl text-forest">Propiedades similares</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} agency={agencyById(store, item.agencyId)} />
            ))}
          </div>
        </section>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-30 rounded-t-[1.5rem] border-t border-line bg-ivory p-3 shadow-[0_-12px_30px_rgb(23_43_40/8%)] md:hidden">
        <a href="#solicitud" className="btn w-full">Solicitar información</a>
      </div>
      <p className="sr-only">{siteUrl()}/propiedades/{property.slug}</p>
    </article>
  );
}
