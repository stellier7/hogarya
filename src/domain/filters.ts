import { kindLabel, operationQueryValue, propertyKinds } from "./labels";
import type {
  Agency,
  CatalogQuery,
  CatalogView,
  Operation,
  Property,
  PropertyKind,
  SortKey,
} from "./types";
import { findZone } from "./zones";

export const PAGE_SIZE = 9;

const kindIds = new Set(propertyKinds.map((kind) => kind.id));

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseMoney(value: string): number | undefined {
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return undefined;
  const amount = Number.parseInt(cleaned, 10);
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  return amount;
}

function parseCount(value: string): number | undefined {
  if (!value) return undefined;
  const amount = Number.parseInt(value, 10);
  if (!Number.isFinite(amount) || amount < 0 || amount > 20) return undefined;
  return amount;
}

function parseOperation(value: string): Operation | undefined {
  if (value === "venta" || value === "sale") return "sale";
  if (value === "alquiler" || value === "rent") return "rent";
  return undefined;
}

function parseKind(value: string): PropertyKind | undefined {
  return kindIds.has(value as PropertyKind) ? (value as PropertyKind) : undefined;
}

export function parseCatalogQuery(input: Record<string, string | string[] | undefined>): CatalogQuery {
  const ordenRaw = first(input.orden);
  const orden: SortKey =
    ordenRaw === "precio-asc" || ordenRaw === "precio-desc" || ordenRaw === "recientes" ? ordenRaw : "recientes";
  const vista: CatalogView = first(input.vista) === "lista" ? "lista" : "cuadricula";
  const pageRaw = Number.parseInt(first(input.pagina) || "1", 10);
  const city = first(input.ciudad).trim();

  return {
    operation: parseOperation(first(input.operacion)),
    city: city && findZone(city) ? city : undefined,
    kind: parseKind(first(input.tipo)),
    min: parseMoney(first(input.min)),
    max: parseMoney(first(input.max)),
    bedrooms: parseCount(first(input.habitaciones)),
    bathrooms: parseCount(first(input.banos)),
    parking: parseCount(first(input.estacionamientos)),
    q: first(input.q).trim() || undefined,
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    vista,
    orden,
  };
}

export function isPublicProperty(property: Property, agencies: Agency[]): boolean {
  const agency = agencies.find((item) => item.id === property.agencyId);
  const agentReady = agency?.authorized === true;
  return agentReady && property.status === "published";
}

export function sortProperties(properties: Property[], orden: SortKey): Property[] {
  const copy = [...properties];
  copy.sort((a, b) => {
    if (orden === "precio-asc" || orden === "precio-desc") {
      const aPrice = a.price;
      const bPrice = b.price;
      if (aPrice == null && bPrice == null) return 0;
      if (aPrice == null) return 1;
      if (bPrice == null) return -1;
      return orden === "precio-asc" ? aPrice - bPrice : bPrice - aPrice;
    }
    const aDate = a.publishedAt ?? a.createdAt;
    const bDate = b.publishedAt ?? b.createdAt;
    return bDate.localeCompare(aDate);
  });
  return copy;
}

export function queryProperties(properties: Property[], agencies: Agency[], query: CatalogQuery): Property[] {
  const needle = query.q?.toLowerCase();
  const filtered = properties.filter((property) => {
    if (!isPublicProperty(property, agencies)) return false;
    if (query.operation && property.operation !== query.operation) return false;
    if (query.city && property.citySlug !== query.city) return false;
    if (query.kind && property.kind !== query.kind) return false;
    if (query.min != null && (property.price == null || property.price < query.min)) return false;
    if (query.max != null && (property.price == null || property.price > query.max)) return false;
    if (query.bedrooms != null && (property.bedrooms ?? -1) < query.bedrooms) return false;
    if (query.bathrooms != null && (property.bathrooms ?? -1) < query.bathrooms) return false;
    if (query.parking != null && (property.parking ?? -1) < query.parking) return false;
    if (needle) {
      const haystack = [
        property.title,
        property.referenceCode,
        property.zone,
        property.city,
        property.department,
        property.description,
        kindLabel(property.kind),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
  return sortProperties(filtered, query.orden);
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): {
  items: T[];
  page: number;
  pages: number;
  total: number;
} {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(page, 1), pages);
  const start = (current - 1) * size;
  return { items: items.slice(start, start + size), page: current, pages, total: items.length };
}

export function catalogHref(query: CatalogQuery, overrides: Partial<CatalogQuery> = {}): string {
  const next: CatalogQuery = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (next.operation) params.set("operacion", operationQueryValue(next.operation));
  if (next.city) params.set("ciudad", next.city);
  if (next.kind) params.set("tipo", next.kind);
  if (next.min != null) params.set("min", String(next.min));
  if (next.max != null) params.set("max", String(next.max));
  if (next.bedrooms != null) params.set("habitaciones", String(next.bedrooms));
  if (next.bathrooms != null) params.set("banos", String(next.bathrooms));
  if (next.parking != null) params.set("estacionamientos", String(next.parking));
  if (next.q) params.set("q", next.q);
  if (next.orden !== "recientes") params.set("orden", next.orden);
  if (next.vista === "lista") params.set("vista", "lista");
  if (next.page > 1) params.set("pagina", String(next.page));
  const qs = params.toString();
  return qs ? `/propiedades?${qs}` : "/propiedades";
}

export function relatedProperties(property: Property, properties: Property[], agencies: Agency[]): Property[] {
  return properties
    .filter((item) => item.id !== property.id && isPublicProperty(item, agencies))
    .map((item) => ({
      item,
      score: (item.citySlug === property.citySlug ? 2 : 0) + (item.kind === property.kind ? 1 : 0),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || (b.item.publishedAt ?? "").localeCompare(a.item.publishedAt ?? ""))
    .slice(0, 3)
    .map((entry) => entry.item);
}
