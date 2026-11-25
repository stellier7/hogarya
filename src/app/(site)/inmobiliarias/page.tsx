import type { Metadata } from "next";
import Link from "next/link";
import { isPublicProperty } from "@/domain/filters";
import { hasPublicDemo, loadCatalog } from "@/server/catalog";

export async function generateMetadata(): Promise<Metadata> {
  const store = await loadCatalog();
  return {
    title: "Inmobiliarias",
    description: "Socios autorizados que comercializan propiedades en Hogar Ya.",
    robots: hasPublicDemo(store) ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function AgenciesPage() {
  const store = await loadCatalog();
  const agencies = store.agencies.filter((agency) => agency.authorized);
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <p className="kicker">Socios</p>
      <h1 className="enter display mt-3 text-5xl text-forest">Inmobiliarias autorizadas</h1>
      <p className="mt-4 max-w-2xl text-sm leading-6">Cada socio conserva su nombre. Los perfiles de esta etapa están marcados como prueba y no tienen datos de contacto reales.</p>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {agencies.map((agency) => {
          const count = store.properties.filter((property) => property.agencyId === agency.id && isPublicProperty(property, store.agencies)).length;
          return (
            <li key={agency.id} className="sheet p-6 transition duration-300 hover:-translate-y-1 motion-reduce:transform-none">
              <p className="kicker">{agency.demo ? "Prueba" : "Socio"}</p>
              <h2 className="display mt-3 text-3xl text-forest">{agency.tradeName}</h2>
              <p className="mt-3 text-sm leading-6">{agency.description}</p>
              <p className="mt-4 text-sm">{agency.location} · {count} {count === 1 ? "publicación" : "publicaciones"}</p>
              <Link href={`/inmobiliarias/${agency.slug}`} className="mt-6 inline-block text-sm underline">Ver propiedades</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
