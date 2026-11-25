import Link from "next/link";
import { FilterDisclosure } from "@/components/catalog/FilterDisclosure";
import { PropertyCard } from "@/components/property/PropertyCard";
import { catalogHref, paginate } from "@/domain/filters";
import { propertyKinds } from "@/domain/labels";
import type { Agency, CatalogQuery, Property } from "@/domain/types";
import { zones } from "@/domain/zones";

const counts = ["", "1", "2", "3", "4", "5"];

export function CatalogScreen({
  title,
  intro,
  query,
  properties,
  agencies,
}: {
  title: string;
  intro: string;
  query: CatalogQuery;
  properties: Property[];
  agencies: Agency[];
}) {
  const page = paginate(properties, query.page);
  const agencyName = new Map(agencies.map((agency) => [agency.id, agency]));

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[17rem_minmax(0,1fr)]">
      <form action="/propiedades" method="get" className="grid content-start gap-4 lg:sticky lg:top-24 lg:self-start">
        <FilterDisclosure>
            <label className="grid gap-2 text-sm">
              <span className="kicker">Operación</span>
              <select name="operacion" className="field" defaultValue={query.operation === "rent" ? "alquiler" : query.operation === "sale" ? "venta" : ""}>
                <option value="">Comprar y alquilar</option>
                <option value="venta">Comprar</option>
                <option value="alquiler">Alquilar</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="kicker">Ubicación</span>
              <select name="ciudad" className="field" defaultValue={query.city ?? ""}>
                <option value="">Todo Honduras</option>
                {zones.map((zone) => (
                  <option key={zone.slug} value={zone.slug}>{zone.city}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="kicker">Tipo</span>
              <select name="tipo" className="field" defaultValue={query.kind ?? ""}>
                <option value="">Cualquier tipo</option>
                {propertyKinds.map((kind) => (
                  <option key={kind.id} value={kind.id}>{kind.singular}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm">
                <span className="kicker">Mínimo</span>
                <input name="min" defaultValue={query.min ?? ""} inputMode="numeric" className="field" aria-label="Precio mínimo" />
              </label>
              <label className="grid gap-2 text-sm">
                <span className="kicker">Máximo</span>
                <input name="max" defaultValue={query.max ?? ""} inputMode="numeric" className="field" aria-label="Precio máximo" />
              </label>
            </div>
            <CountSelect name="habitaciones" label="Habitaciones" value={query.bedrooms} />
            <CountSelect name="banos" label="Baños" value={query.bathrooms} />
            <CountSelect name="estacionamientos" label="Estacionamientos" value={query.parking} />
            <label className="grid gap-2 text-sm">
              <span className="kicker">Orden</span>
              <select name="orden" className="field" defaultValue={query.orden}>
                <option value="recientes">Más recientes</option>
                <option value="precio-asc">Precio menor</option>
                <option value="precio-desc">Precio mayor</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              <span className="kicker">Palabra</span>
              <input name="q" defaultValue={query.q ?? ""} className="field" placeholder="Zona o código" />
            </label>
            {query.vista === "lista" ? <input type="hidden" name="vista" value="lista" /> : null}
            <button className="btn" type="submit">Ver propiedades</button>
        </FilterDisclosure>
      </form>

      <section>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="display text-4xl text-forest md:text-5xl">{title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/80">{intro}</p>
          </div>
          <p className="text-sm">{page.total} {page.total === 1 ? "resultado" : "resultados"}</p>
        </div>
        <div className="mt-4 flex gap-4 text-[0.72rem] uppercase tracking-[0.16em]">
          <Link href={catalogHref(query, { vista: "cuadricula", page: 1 })} aria-current={query.vista === "cuadricula" ? "page" : undefined} className={query.vista === "cuadricula" ? "text-forest" : "text-charcoal/60"}>Cuadrícula</Link>
          <Link href={catalogHref(query, { vista: "lista", page: 1 })} aria-current={query.vista === "lista" ? "page" : undefined} className={query.vista === "lista" ? "text-forest" : "text-charcoal/60"}>Lista</Link>
        </div>
        {page.items.length === 0 ? (
          <p className="mt-10 max-w-lg text-sm leading-6">No hay propiedades publicadas con esos filtros. Pruebe otra ciudad, otro tipo o un rango de precio distinto.</p>
        ) : (
          <div className={query.vista === "lista" ? "mt-2" : "mt-8 grid gap-10 sm:grid-cols-2"}>
            {page.items.map((property) => (
              <PropertyCard key={property.id} property={property} agency={agencyName.get(property.agencyId)} layout={query.vista} />
            ))}
          </div>
        )}
        {page.pages > 1 ? (
          <nav className="mt-10 flex gap-4 text-sm" aria-label="Páginas">
            {Array.from({ length: page.pages }, (_, index) => index + 1).map((number) => (
              <Link key={number} href={catalogHref(query, { page: number })} aria-current={number === page.page ? "page" : undefined} className={number === page.page ? "text-forest" : "text-charcoal/60"}>
                {number}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>
    </div>
  );
}

function CountSelect({ name, label, value }: { name: string; label: string; value?: number }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="kicker">{label}</span>
      <select name={name} className="field" defaultValue={value != null ? String(value) : ""}>
        {counts.map((count) => (
          <option key={count || "any"} value={count}>{count ? `${count} o más` : "Cualquiera"}</option>
        ))}
      </select>
    </label>
  );
}
