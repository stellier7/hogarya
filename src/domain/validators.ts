import { propertyKinds } from "./labels";
import type { Operation, PropertyKind } from "./types";
import { digitsOnly } from "./format";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const kindIds = new Set(propertyKinds.map((kind) => kind.id));

export type ContactInput = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export type CaptureInput = ContactInput & {
  location: string;
  kind: string;
  estimatedPrice: string;
  operation: string;
  description: string;
};

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function validateContact(input: ContactInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = clean(input.name);
  const email = clean(input.email).toLowerCase();
  const phone = clean(input.phone);
  const message = input.message.trim();
  const phoneDigits = digitsOnly(phone);

  if (name.length < 2 || name.length > 80) errors.name = "Escriba su nombre, entre 2 y 80 caracteres.";
  if (!emailPattern.test(email) || email.length > 120) errors.email = "Escriba un correo electrónico válido.";
  if (phoneDigits.length < 8 || phoneDigits.length > 15) errors.phone = "Escriba un teléfono con al menos 8 dígitos.";
  if (message.length < 10 || message.length > 2000) errors.message = "El mensaje debe tener entre 10 y 2000 caracteres.";
  return errors;
}

export function validateCapture(input: CaptureInput): Record<string, string> {
  const errors = validateContact({
    name: input.name,
    phone: input.phone,
    email: input.email,
    message: input.description,
  });
  if (errors.message) {
    errors.description = "La descripción debe tener entre 10 y 2000 caracteres.";
    delete errors.message;
  }
  const location = clean(input.location);
  if (location.length < 3 || location.length > 140) {
    errors.location = "Indique la ciudad o zona de la propiedad.";
  }
  if (!kindIds.has(input.kind as PropertyKind)) errors.kind = "Seleccione un tipo de propiedad.";
  if (input.operation !== "sale" && input.operation !== "rent") {
    errors.operation = "Seleccione venta o alquiler.";
  }
  const price = input.estimatedPrice.trim();
  if (price) {
    const normalized = price.replace(/[\s,]/g, "");
    const amount = Number(normalized);
    if (!/^\d+(\.\d+)?$/.test(normalized) || !Number.isFinite(amount) || amount > 1_000_000_000) {
      errors.estimatedPrice = "El precio estimado no es válido.";
    }
  }
  return errors;
}

export function parseOperation(value: string): Operation | null {
  if (value === "sale" || value === "rent") return value;
  return null;
}

export function parseKind(value: string): PropertyKind | null {
  if (kindIds.has(value as PropertyKind)) return value as PropertyKind;
  return null;
}
