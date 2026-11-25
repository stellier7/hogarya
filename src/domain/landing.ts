import { kindPlural, kindToSlug, slugToKind } from "./labels";
import type { Operation, PropertyKind } from "./types";
import { findZone, zoneName } from "./zones";

export function parseLandingSegments(segments: string[] | undefined): { city?: string; kind?: PropertyKind } | null {
  if (!segments || segments.length === 0) return {};
  if (segments.length > 2) return null;

  if (segments.length === 1) {
    const only = segments[0] ?? "";
    const kind = slugToKind(only);
    if (kind) return { kind };
    if (findZone(only)) return { city: only };
    return null;
  }

  const city = segments[0] ?? "";
  const kind = slugToKind(segments[1] ?? "");
  if (!findZone(city) || !kind) return null;
  return { city, kind };
}

export function landingTitle(operation: Operation, city?: string, kind?: PropertyKind): string {
  const subject = kind ? kindPlural(kind) : "Propiedades";
  const deal = operation === "sale" ? "en venta" : "en alquiler";
  const place = city ? `en ${zoneName(city)}` : "en Honduras";
  return `${subject} ${deal} ${place}`;
}

export function landingPath(operation: Operation, city?: string, kind?: PropertyKind): string {
  const root = operation === "sale" ? "/comprar" : "/alquilar";
  const kindSlug = kind ? kindToSlug(kind) : undefined;
  if (city && kindSlug) return `${root}/${city}/${kindSlug}`;
  if (city) return `${root}/${city}`;
  if (kindSlug) return `${root}/${kindSlug}`;
  return root;
}
