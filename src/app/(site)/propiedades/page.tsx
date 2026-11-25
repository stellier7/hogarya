import type { Metadata } from "next";
import { CatalogScreen } from "@/components/catalog/CatalogScreen";
import { parseCatalogQuery, queryProperties } from "@/domain/filters";
import { hasPublicDemo, loadCatalog } from "@/server/catalog";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata(): Promise<Metadata> {
  const store = await loadCatalog();
  return {
    title: "Propiedades",
    description: "Catálogo de propiedades en venta y alquiler en Honduras, publicadas por socios autorizados de Hogar Ya.",
    robots: hasPublicDemo(store) ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function PropertiesPage({ searchParams }: Props) {
  const store = await loadCatalog();
  const query = parseCatalogQuery(await searchParams);
  const properties = queryProperties(store.properties, store.agencies, query);
  return (
    <CatalogScreen
      title="Propiedades"
      intro="Compre o alquile con el agente responsable de cada publicación. Ajuste ubicación, tipo, precio y características."
      query={query}
      properties={properties}
      agencies={store.agencies}
    />
  );
}
