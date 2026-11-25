import type { AreaUnit, Currency, Operation } from "./types";

export function formatPrice(price: number | null, operation: Operation, currency: Currency = "HNL"): string {
  if (price == null) return "Precio a consultar";
  const amount = new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency,
    currencyDisplay: currency === "USD" ? "code" : "symbol",
    maximumFractionDigits: 0,
  }).format(price);
  return operation === "rent" ? `${amount} / mes` : amount;
}

function areaSuffix(unit: AreaUnit): string {
  switch (unit) {
    case "m2":
      return "m²";
    case "vara2":
      return "varas²";
    default: {
      const unhandled: never = unit;
      return unhandled;
    }
  }
}

export function formatArea(value: number | null, unit: AreaUnit = "m2"): string {
  if (value == null) return "—";
  const amount = new Intl.NumberFormat("es-HN").format(value);
  return `${amount} ${areaSuffix(unit)}`;
}

export type PhoneLink = {
  label: string;
  tel: string;
  whatsapp: string;
};

export function phoneLinks(value: string | null | undefined): PhoneLink[] {
  if (!value) return [];
  const matches = value.match(/\d(?:[\d\s-]*\d)/g) ?? [];
  const seen = new Set<string>();
  const links: PhoneLink[] = [];
  for (const match of matches) {
    const digits = match.replace(/\D/g, "");
    const local = digits.startsWith("504") && digits.length > 8 ? digits.slice(3) : digits;
    if (local.length < 8 || local.length > 11 || seen.has(local)) continue;
    seen.add(local);
    const e164 = `504${local}`;
    links.push({
      label: match.trim(),
      tel: `tel:+${e164}`,
      whatsapp: `https://wa.me/${e164}`,
    });
  }
  return links;
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
