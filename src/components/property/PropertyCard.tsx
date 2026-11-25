import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { countLabel, formatPrice } from "@/domain/format";
import { kindLabel, operationLabel } from "@/domain/labels";
import type { Agency, Property } from "@/domain/types";

function facts(property: Property): string[] {
  return [
    property.bedrooms != null ? countLabel(property.bedrooms, "habitación", "habitaciones") : null,
    property.bathrooms != null ? countLabel(property.bathrooms, "baño", "baños") : null,
    property.parking != null ? countLabel(property.parking, "estacionamiento", "estacionamientos") : null,
  ].filter((item): item is string => Boolean(item));
}

export function PropertyCard({
  property,
  agency,
  layout = "cuadricula",
}: {
  property: Property;
  agency?: Agency;
  layout?: "cuadricula" | "lista";
}) {
  const image = property.images[0];
  const meta = facts(property);
  const wide = layout === "lista";

  return (
    <Reveal>
    <article className={wide ? "grid gap-6 border-t border-line py-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center" : "group transition duration-300 hover:-translate-y-1 motion-reduce:transform-none"}>
      <Link href={`/propiedades/${property.slug}`} className={`media relative block bg-forest ${wide ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={wide ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-sm text-ivory/80">Sin fotografía</span>
        )}
      </Link>
      <div className={wide ? "" : "pt-4"}>
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-[0.68rem] uppercase tracking-[0.16em] text-forest/70">
          {property.featured ? <span className="text-gold-deep">Destacada</span> : null}
          {property.demo ? <span>Prueba</span> : null}
          <span>{operationLabel(property.operation)}</span>
          <span>{kindLabel(property.kind)}</span>
        </p>
        <p className="display mt-3 text-3xl text-forest">{formatPrice(property.price, property.operation)}</p>
        <h3 className="mt-2 text-lg leading-snug">
          <Link href={`/propiedades/${property.slug}`} className="hover:text-forest">{property.title}</Link>
        </h3>
        <p className="mt-1 text-sm text-charcoal/75">{property.zone}, {property.city}</p>
        {meta.length > 0 ? <p className="mt-3 text-sm text-charcoal/80">{meta.join(" · ")}</p> : null}
        <p className="mt-4 text-[0.68rem] uppercase tracking-[0.16em] text-forest">{agency?.tradeName ?? "Responsable por asignar"}</p>
      </div>
    </article>
    </Reveal>
  );
}
