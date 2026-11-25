"use server";

import { randomUUID } from "node:crypto";
import { errorState, successState, type FormState } from "@/domain/forms";
import { validateCapture, validateContact } from "@/domain/validators";
import type { CaptureRequest, Lead, LeadSource, PropertyKind } from "@/domain/types";
import { isPublicProperty } from "@/domain/filters";
import { saveUpload } from "@/server/uploads";
import { pushAudit, updateStore } from "@/server/store";

function honeypot(formData: FormData): boolean {
  return String(formData.get("company_website") ?? "").trim().length > 0;
}

export async function submitInquiry(_previous: FormState, formData: FormData): Promise<FormState> {
  if (honeypot(formData)) return successState("Recibimos su mensaje.");
  const input = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const fieldErrors = validateContact(input);
  if (Object.keys(fieldErrors).length > 0) {
    return errorState("Revise los campos marcados.", fieldErrors);
  }

  const sourceRaw = String(formData.get("source") ?? "contact");
  const source: LeadSource = sourceRaw === "property" || sourceRaw === "partner" ? sourceRaw : "contact";
  const propertyId = String(formData.get("propertyId") ?? "").trim() || null;
  let saved = false;
  let failure = "";

  await updateStore((store) => {
    let agencyId: string | null = null;
    let agentId: string | null = null;
    if (propertyId) {
      const property = store.properties.find((item) => item.id === propertyId);
      if (!property || !isPublicProperty(property, store.agencies)) {
        failure = "Esa propiedad ya no está publicada.";
        return;
      }
      agencyId = property.agencyId;
      agentId = property.agentId;
    }
    const email = input.email.trim().toLowerCase();
    const duplicate = store.leads.some(
      (lead) => lead.email === email && lead.propertyId === propertyId && lead.message.trim() === input.message.trim(),
    );
    if (duplicate) {
      saved = true;
      return;
    }
    const lead: Lead = {
      id: randomUUID(),
      propertyId,
      agencyId,
      agentId,
      name: input.name.replace(/\s+/g, " ").trim(),
      phone: input.phone.trim(),
      email,
      message: input.message.trim(),
      source,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    store.leads.unshift(lead);
    pushAudit(store, {
      actor: email,
      action: "create-lead",
      entityType: "lead",
      entityId: lead.id,
      summary: propertyId ? `Consulta sobre ${propertyId}.` : "Consulta general.",
    });
    saved = true;
  });

  if (failure) return errorState(failure);
  if (!saved) return errorState("No se pudo registrar la consulta. Inténtelo de nuevo.");
  return successState("Recibimos su consulta. El equipo de Hogar Ya o el agente responsable dará seguimiento.");
}

export async function submitCapture(_previous: FormState, formData: FormData): Promise<FormState> {
  if (honeypot(formData)) return successState("Recibimos su solicitud de captación.");
  const input = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: "",
    location: String(formData.get("location") ?? ""),
    kind: String(formData.get("kind") ?? ""),
    estimatedPrice: String(formData.get("estimatedPrice") ?? ""),
    operation: String(formData.get("operation") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const fieldErrors = validateCapture(input);
  if (Object.keys(fieldErrors).length > 0) {
    return errorState("Revise los campos marcados.", fieldErrors);
  }

  const files = formData.getAll("fotos").filter((file): file is File => file instanceof File && file.size > 0).slice(0, 4);
  const id = randomUUID();
  const photos: CaptureRequest["photos"] = [];
  try {
    for (const file of files) {
      const saved = await saveUpload(file, "capture", id);
      photos.push({ file: saved.fileName, name: saved.originalName });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo guardar una fotografía.";
    return errorState(message);
  }

  const priceRaw = input.estimatedPrice.trim();
  const estimatedPrice = priceRaw ? Math.round(Number(priceRaw.replace(/[^\d.]/g, ""))) : null;
  const request: CaptureRequest = {
    id,
    name: input.name.replace(/\s+/g, " ").trim(),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    location: input.location.replace(/\s+/g, " ").trim(),
    kind: input.kind as PropertyKind,
    estimatedPrice,
    operation: input.operation === "rent" ? "rent" : "sale",
    description: input.description.trim(),
    photos,
    status: "received",
    createdAt: new Date().toISOString(),
  };

  await updateStore((store) => {
    store.captures.unshift(request);
    pushAudit(store, {
      actor: request.email,
      action: "create-capture",
      entityType: "capture",
      entityId: request.id,
      summary: `Solicitud de captación en ${request.location}.`,
    });
  });

  return successState("Recibimos la solicitud. Hogar Ya la revisará antes de comercializar la propiedad. Publicar sigue reservado a socios autorizados.");
}
