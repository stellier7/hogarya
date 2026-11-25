import type { MetadataRoute } from "next";
import { landingPath } from "@/domain/landing";
import { propertyKinds } from "@/domain/labels";
import { siteUrl } from "@/domain/site";
import type { Operation } from "@/domain/types";
import { zones } from "@/domain/zones";
import { loadCatalog, publicProperties } from "@/server/catalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await loadCatalog();
  const now = new Date();
  const operations: Operation[] = ["sale", "rent"];
  const paths = new Set<string>([
    "/",
    "/comprar",
    "/alquilar",
    "/publicar",
    "/nosotros",
    "/contacto",
    "/propiedades",
    "/inmobiliarias",
  ]);
  for (const zone of zones) paths.add(`/zonas/${zone.slug}`);
  for (const operation of operations) {
    paths.add(landingPath(operation));
    for (const kind of propertyKinds) paths.add(landingPath(operation, undefined, kind.id));
    for (const zone of zones) {
      paths.add(landingPath(operation, zone.slug));
      for (const kind of propertyKinds) paths.add(landingPath(operation, zone.slug, kind.id));
    }
  }
  const listings = publicProperties(store)
    .filter((property) => !property.demo)
    .map((property) => ({
      url: `${siteUrl()}/propiedades/${property.slug}`,
      lastModified: property.updatedAt,
    }));
  return [
    ...[...paths].map((path) => ({ url: `${siteUrl()}${path === "/" ? "" : path}`, lastModified: now })),
    ...listings,
  ];
}
