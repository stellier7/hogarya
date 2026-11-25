import type { CaptureStatus, LeadStatus, Operation, PropertyKind, PublicationStatus } from "./types";

export const propertyKinds: { id: PropertyKind; singular: string; plural: string; slug: string }[] = [
  { id: "house", singular: "Casa", plural: "Casas", slug: "casas" },
  { id: "apartment", singular: "Apartamento", plural: "Apartamentos", slug: "apartamentos" },
  { id: "land", singular: "Terreno", plural: "Terrenos", slug: "terrenos" },
  { id: "retail", singular: "Local comercial", plural: "Locales comerciales", slug: "locales" },
  { id: "office", singular: "Oficina", plural: "Oficinas", slug: "oficinas" },
  { id: "building", singular: "Edificio", plural: "Edificios", slug: "edificios" },
  { id: "industrial", singular: "Propiedad industrial", plural: "Propiedades industriales", slug: "industriales" },
  { id: "farm", singular: "Finca", plural: "Fincas", slug: "fincas" },
];

const kindById = new Map(propertyKinds.map((kind) => [kind.id, kind]));
const kindBySlug = new Map(propertyKinds.map((kind) => [kind.slug, kind]));

export function kindLabel(kind: PropertyKind): string {
  return kindById.get(kind)?.singular ?? kind;
}

export function kindPlural(kind: PropertyKind): string {
  return kindById.get(kind)?.plural ?? kind;
}

export function kindToSlug(kind: PropertyKind): string {
  return kindById.get(kind)?.slug ?? kind;
}

export function slugToKind(slug: string): PropertyKind | undefined {
  return kindBySlug.get(slug)?.id;
}

export function operationLabel(operation: Operation): string {
  switch (operation) {
    case "sale":
      return "Venta";
    case "rent":
      return "Alquiler";
    default: {
      const exhausted: never = operation;
      return exhausted;
    }
  }
}

export function operationPath(operation: Operation): string {
  switch (operation) {
    case "sale":
      return "/comprar";
    case "rent":
      return "/alquilar";
    default: {
      const exhausted: never = operation;
      return exhausted;
    }
  }
}

export function operationQueryValue(operation: Operation): "venta" | "alquiler" {
  switch (operation) {
    case "sale":
      return "venta";
    case "rent":
      return "alquiler";
    default: {
      const exhausted: never = operation;
      return exhausted;
    }
  }
}

export function statusLabel(status: PublicationStatus): string {
  switch (status) {
    case "draft":
      return "Borrador";
    case "pending":
      return "Pendiente de aprobación";
    case "published":
      return "Publicada";
    case "rejected":
      return "Rechazada";
    case "paused":
      return "Pausada";
    case "sold":
      return "Vendida";
    case "rented":
      return "Alquilada";
    default: {
      const exhausted: never = status;
      return exhausted;
    }
  }
}

export function leadStatusLabel(status: LeadStatus): string {
  switch (status) {
    case "new":
      return "Nueva";
    case "in_progress":
      return "En seguimiento";
    case "closed":
      return "Cerrada";
    default: {
      const exhausted: never = status;
      return exhausted;
    }
  }
}

export function captureStatusLabel(status: CaptureStatus): string {
  switch (status) {
    case "received":
      return "Recibida";
    case "in_review":
      return "En revisión";
    case "contacted":
      return "Contactada";
    case "declined":
      return "Declinada";
    default: {
      const exhausted: never = status;
      return exhausted;
    }
  }
}

export const publicationStatuses: PublicationStatus[] = [
  "draft",
  "pending",
  "published",
  "rejected",
  "paused",
  "sold",
  "rented",
];

export const leadStatuses: LeadStatus[] = ["new", "in_progress", "closed"];

export const captureStatuses: CaptureStatus[] = ["received", "in_review", "contacted", "declined"];
