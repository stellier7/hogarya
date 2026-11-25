import type { Operation } from "./types";

export function formatPrice(price: number | null, operation: Operation): string {
  if (price == null) return "Precio a consultar";
  const amount = new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
    maximumFractionDigits: 0,
  }).format(price);
  return operation === "rent" ? `${amount} / mes` : amount;
}

export function formatArea(value: number | null): string {
  if (value == null) return "—";
  return `${new Intl.NumberFormat("es-HN").format(value)} m²`;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-HN", {
    dateStyle: "medium",
    timeZone: "America/Tegucigalpa",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("es-HN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Tegucigalpa",
  }).format(new Date(iso));
}

export function countLabel(value: number, singular: string, plural: string): string {
  return `${new Intl.NumberFormat("es-HN").format(value)} ${value === 1 ? singular : plural}`;
}

export function slugify(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || "propiedad";
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}
