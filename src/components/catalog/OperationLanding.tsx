import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogScreen } from "@/components/catalog/CatalogScreen";
import { parseCatalogQuery, queryProperties } from "@/domain/filters";
import { landingTitle, parseLandingSegments } from "@/domain/landing";
import type { Operation } from "@/domain/types";
import { hasPublicDemo, loadCatalog } from "@/server/catalog";

type Search = Record<string, string | string[] | undefined>;

export async function operationMetadata(operation: Operation, segments: string[] | undefined): Promise<Metadata> {
  const parsed = parseLandingSegments(segments);
  if (!parsed) return { title: "Propiedades" };
  const store = await loadCatalog();
  const title = landingTitle(operation, parsed.city, parsed.kind);
  return {
    title,
    description: `${title}. Marketplace Hogar Ya: inventario de agentes e inmobiliarias autorizadas en Honduras.`,
    robots: hasPublicDemo(store) ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export async function OperationLanding({
  operation,
  segments,
  searchParams,
}: {
  operation: Operation;
  segments?: string[];
  searchParams: Promise<Search>;
}) {
  const parsed = parseLandingSegments(segments);
  if (!parsed) notFound();
  const store = await loadCatalog();
  const query = parseCatalogQuery(await searchParams);
  query.operation = operation;
  if (parsed.city) query.city = parsed.city;
  if (parsed.kind) query.kind = parsed.kind;
  const title = landingTitle(operation, parsed.city, parsed.kind);
  const properties = queryProperties(store.properties, store.agencies, query);
  return (
    <CatalogScreen
      title={title}
      intro="Compre o alquile con el agente responsable de cada publicación. Ajuste ubicación, tipo, precio y características."
      query={query}
      properties={properties}
      agencies={store.agencies}
    />
  );
}
