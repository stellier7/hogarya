import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PropertyCard } from "@/components/property/PropertyCard";
import { phoneLinks } from "@/domain/format";
import { isPublicProperty } from "@/domain/filters";
import { loadCatalog } from "@/server/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = (await loadCatalog()).agencies.find((item) => item.slug === slug && item.authorized && !item.demo);
  if (!agency) return { title: "Inmobiliaria" };
  return {
    title: agency.tradeName,
    description: agency.description.slice(0, 160),
    robots: agency.demo ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export default async function AgencyPage({ params }: Props) {
  const { slug } = await params;
  const store = await loadCatalog();
  const agency = store.agencies.find((item) => item.slug === slug && item.authorized && !item.demo);
  if (!agency) notFound();
  const agents = store.agents.filter((agent) => agent.agencyId === agency.id && agent.authorized);
  const properties = store.properties.filter((property) => property.agencyId === agency.id && isPublicProperty(property, store.agencies));
  return (
    <article className="mx-auto max-w-6xl px-5 py-16">
      <p className="kicker">{agency.demo ? "Inmobiliaria de prueba" : "Inmobiliaria"}</p>
      <h1 className="display mt-3 text-5xl text-forest">{agency.tradeName}</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6">{agency.description}</p>
      <p className="mt-3 text-sm">{agency.location}</p>
      {phoneLinks(agency.phone).length > 0 ? (
        <ul className="mt-4 grid gap-2 text-sm">
          {phoneLinks(agency.phone).map((phone) => (
            <li key={phone.tel}>
              <a className="underline" href={phone.tel}>{phone.label}</a>
            </li>
          ))}
        </ul>
      ) : null}
      {!agency.phone && !agency.email ? <p className="mt-2 text-sm text-charcoal/70">Sin teléfono ni correo reales en este perfil.</p> : null}
      <h2 className="display mt-12 text-3xl text-forest">Agentes</h2>
      <ul className="mt-4 grid gap-4 md:grid-cols-2">
        {agents.map((agent) => (
          <li key={agent.id} className="sheet px-5 py-4">
            <p className="text-lg">{agent.name}</p>
            <p className="mt-2 text-sm leading-6 text-charcoal/75">{agent.bio}</p>
          </li>
        ))}
      </ul>
      <h2 className="display mt-12 text-3xl text-forest">Propiedades</h2>
      <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} agency={agency} />
        ))}
      </div>
    </article>
  );
}
