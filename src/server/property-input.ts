import { findZone } from "@/domain/zones";
import { propertyKinds, publicationStatuses } from "@/domain/labels";
import type { Operation, PropertyKind, PublicationStatus } from "@/domain/types";

export type PropertyInput = {
  title: string;
  operation: Operation;
  kind: PropertyKind;
  citySlug: string;
  zone: string;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  constructionArea: number | null;
  lotArea: number | null;
  description: string;
  amenities: string[];
  status: PublicationStatus;
  featured: boolean;
  agencyId: string;
  agentId: string;
};

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function optionalNumber(
  raw: string,
  key: string,
  label: string,
  errors: Record<string, string>,
  max: number,
): number | null {
  if (!raw) return null;
  const value = Number(raw.replace(",", "."));
  if (!Number.isFinite(value) || value < 0 || value > max) {
    errors[key] = `${label} no es válido.`;
    return null;
  }
  return value;
}

const kinds = new Set(propertyKinds.map((kind) => kind.id));
const statuses = new Set(publicationStatuses);

export function readPropertyInput(formData: FormData): { value: PropertyInput | null; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const title = text(formData, "title").replace(/\s+/g, " ");
  const description = text(formData, "description");
  const zone = text(formData, "zone").replace(/\s+/g, " ");
  const citySlug = text(formData, "citySlug");
  const operationRaw = text(formData, "operation");
  const kindRaw = text(formData, "kind");
  const statusRaw = text(formData, "status") || "pending";
  const city = findZone(citySlug);

  if (title.length < 8 || title.length > 120) errors.title = "El título debe tener entre 8 y 120 caracteres.";
  if (description.length < 20 || description.length > 4000) {
    errors.description = "La descripción debe tener entre 20 y 4000 caracteres.";
  }
  if (zone.length < 2 || zone.length > 80) errors.zone = "Indique la zona o colonia.";
  if (!city) errors.citySlug = "Seleccione una ciudad de Honduras.";
  if (operationRaw !== "sale" && operationRaw !== "rent") errors.operation = "Seleccione venta o alquiler.";
  if (!kinds.has(kindRaw as PropertyKind)) errors.kind = "Seleccione un tipo de propiedad.";
  if (!statuses.has(statusRaw as PublicationStatus)) errors.status = "El estado no es válido.";

  const priceRaw = text(formData, "price");
  let price: number | null = null;
  if (priceRaw) {
    const amount = Number(priceRaw.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000_000) {
      errors.price = "Escriba un precio o déjelo vacío para consultar.";
    } else {
      price = Math.round(amount);
    }
  }

  const amenities = text(formData, "amenities")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 24)
    .map((item) => item.slice(0, 40));
  const bedrooms = optionalNumber(text(formData, "bedrooms"), "bedrooms", "Las habitaciones", errors, 30);
  const bathrooms = optionalNumber(text(formData, "bathrooms"), "bathrooms", "Los baños", errors, 30);
  const parking = optionalNumber(text(formData, "parking"), "parking", "Los estacionamientos", errors, 80);
  const constructionArea = optionalNumber(
    text(formData, "constructionArea"),
    "constructionArea",
    "El área de construcción",
    errors,
    1_000_000,
  );
  const lotArea = optionalNumber(text(formData, "lotArea"), "lotArea", "El área del terreno", errors, 100_000_000);

  if (Object.keys(errors).length > 0 || !city || (operationRaw !== "sale" && operationRaw !== "rent")) {
    return { value: null, errors };
  }

  const operation: Operation = operationRaw;
  const kind = kindRaw as PropertyKind;
  const status = statusRaw as PublicationStatus;

  return {
    errors,
    value: {
      title,
      operation,
      kind,
      citySlug: city.slug,
      zone,
      price,
      bedrooms,
      bathrooms,
      parking,
      constructionArea,
      lotArea,
      description,
      amenities,
      status,
      featured: formData.get("featured") === "on",
      agencyId: text(formData, "agencyId"),
      agentId: text(formData, "agentId"),
    },
  };
}
