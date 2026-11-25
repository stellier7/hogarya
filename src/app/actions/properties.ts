"use server";

import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { errorState, type FormState } from "@/domain/forms";
import { publicationStatuses } from "@/domain/labels";
import { canApprove, canDeleteProperty, canManageProperty } from "@/domain/permissions";
import { slugify } from "@/domain/format";
import type { Property, PublicationStatus } from "@/domain/types";
import { findZone } from "@/domain/zones";
import { readPropertyInput } from "@/server/property-input";
import { requireSession } from "@/server/session";
import { pushAudit, updateStore } from "@/server/store";
import { propertyFilePath, saveUpload } from "@/server/uploads";

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/comprar");
  revalidatePath("/alquilar");
  revalidatePath("/admin/propiedades");
  if (slug) revalidatePath(`/propiedades/${slug}`);
}

function uniqueSlug(existing: string[], desired: string, currentId?: string, currentSlug?: string): string {
  const base = slugify(desired);
  if (currentSlug === base || !existing.includes(base)) return base;
  let index = 2;
  while (existing.includes(`${base}-${index}`) && `${base}-${index}` !== currentSlug) index += 1;
  return existing.includes(`${base}-${index}`) ? `${base}-${currentId?.slice(0, 6) ?? index}` : `${base}-${index}`;
}

export async function saveProperty(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await requireSession();
  const parsed = readPropertyInput(formData);
  if (!parsed.value) return errorState("Revise los campos marcados.", parsed.errors);
  const input = parsed.value;
  const id = String(formData.get("id") ?? "").trim();
  let nextId = id;
  let failure = "";

  await updateStore((store) => {
    const agency = store.agencies.find((item) => item.id === input.agencyId);
    const agent = store.agents.find((item) => item.id === input.agentId);
    if (!agency || !agent || agent.agencyId !== agency.id) {
      failure = "Seleccione una inmobiliaria y un agente de esa inmobiliaria.";
      return;
    }
    if (user.role === "agency" && user.agencyId !== agency.id) {
      failure = "No puede publicar en otra inmobiliaria.";
      return;
    }
    if (user.role === "agent" && (user.agencyId !== agency.id || user.agentId !== agent.id)) {
      failure = "Solo puede editar sus propias publicaciones.";
      return;
    }

    const city = findZone(input.citySlug);
    if (!city) {
      failure = "Seleccione una ciudad de Honduras.";
      return;
    }

    const now = new Date().toISOString();
    const current = id ? store.properties.find((item) => item.id === id) : undefined;
    if (id && !current) {
      failure = "No encontramos esa propiedad.";
      return;
    }
    if (current && !canManageProperty(user, current)) {
      failure = "No tiene permiso para editar esta propiedad.";
      return;
    }

    let status: PublicationStatus = user.role === "admin" ? input.status : "pending";
    if (!publicationStatuses.includes(status)) status = "pending";
    if (status === "published" && (!agency.authorized || !agent.authorized)) {
      failure = "La inmobiliaria y el agente deben estar autorizados antes de publicar.";
      return;
    }

    const slugs = store.properties.filter((item) => item.id !== current?.id).map((item) => item.slug);
    const slug = uniqueSlug(slugs, input.title, current?.id, current?.slug);
    const demo = current?.demo ?? process.env.HOGAR_YA_PUBLISH_REAL !== "1";
    const featured = user.role === "admin" ? input.featured && status === "published" : (current?.featured ?? false);
    const publishedAt =
      status === "published" ? (current?.publishedAt ?? now) : (current?.publishedAt ?? null);

    const next: Property = {
      id: current?.id ?? randomUUID(),
      referenceCode: current?.referenceCode ?? `HY-${now.slice(0, 10).replace(/-/g, "")}-${randomUUID().slice(0, 4).toUpperCase()}`,
      slug,
      title: input.title,
      operation: input.operation,
      kind: input.kind,
      status,
      featured,
      verification: current?.verification ?? null,
      demo,
      price: input.price,
      citySlug: city.slug,
      city: city.city,
      department: city.department,
      zone: input.zone,
      description: input.description,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      parking: input.parking,
      constructionArea: input.constructionArea,
      lotArea: input.lotArea,
      currency: current?.currency,
      lotAreaUnit: current?.lotAreaUnit,
      amenities: input.amenities,
      images: current?.images ?? [],
      agencyId: agency.id,
      agentId: agent.id,
      rejectionNote: status === "rejected" ? current?.rejectionNote ?? null : null,
      publishedAt,
      createdAt: current?.createdAt ?? now,
      updatedAt: now,
    };
    nextId = next.id;
    if (current) {
      Object.assign(current, next);
    } else {
      store.properties.unshift(next);
    }
    pushAudit(store, {
      actor: user.email,
      action: current ? "update-property" : "create-property",
      entityType: "property",
      entityId: next.id,
      summary: `${current ? "Actualizó" : "Creó"} ${next.referenceCode}. Estado: ${next.status}.`,
    });
  });

  if (failure) return errorState(failure, parsed.errors);
  refresh();
  redirect(`/admin/propiedades/${nextId}?aviso=guardada`);
}

export async function setPropertyStatus(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (!canApprove(user)) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as PublicationStatus;
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (!publicationStatuses.includes(status)) redirect(`/admin/propiedades/${id}?aviso=estado-invalido`);

  let slug = "";
  let blocked = false;
  await updateStore((store) => {
    const property = store.properties.find((item) => item.id === id);
    if (!property) return;
    const agency = store.agencies.find((item) => item.id === property.agencyId);
    const agent = store.agents.find((item) => item.id === property.agentId);
    if (status === "published" && (!agency?.authorized || !agent?.authorized)) {
      blocked = true;
      return;
    }
    property.status = status;
    property.updatedAt = new Date().toISOString();
    if (status === "published" && !property.publishedAt) property.publishedAt = property.updatedAt;
    if (status !== "published") property.featured = false;
    property.rejectionNote = status === "rejected" ? note || "Rechazada por el administrador." : null;
    slug = property.slug;
    pushAudit(store, {
      actor: user.email,
      action: "set-status",
      entityType: "property",
      entityId: property.id,
      summary: `${property.referenceCode} pasó a ${status}.`,
    });
  });
  refresh(slug);
  redirect(blocked ? `/admin/propiedades/${id}?aviso=sin-autorizacion` : `/admin/propiedades/${id}?aviso=estado`);
}

export async function toggleFeatured(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (!canApprove(user)) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  let slug = "";
  await updateStore((store) => {
    const property = store.properties.find((item) => item.id === id);
    if (!property || property.status !== "published") return;
    property.featured = !property.featured;
    property.updatedAt = new Date().toISOString();
    slug = property.slug;
    pushAudit(store, {
      actor: user.email,
      action: "feature",
      entityType: "property",
      entityId: property.id,
      summary: `${property.referenceCode} ${property.featured ? "quedó destacada" : "dejó de estar destacada"}.`,
    });
  });
  refresh(slug);
  const returnTo = String(formData.get("returnTo") ?? "/admin/destacadas");
  redirect(returnTo.startsWith("/admin") ? returnTo : "/admin/destacadas");
}

export async function deleteProperty(formData: FormData): Promise<void> {
  const user = await requireSession();
  const id = String(formData.get("id") ?? "");
  let allowed = false;
  await updateStore((store) => {
    const property = store.properties.find((item) => item.id === id);
    if (!property || !canDeleteProperty(user, property)) return;
    store.properties = store.properties.filter((item) => item.id !== id);
    allowed = true;
    pushAudit(store, {
      actor: user.email,
      action: "delete-property",
      entityType: "property",
      entityId: id,
      summary: `Eliminó ${property.referenceCode}.`,
    });
  });
  refresh();
  redirect(allowed ? "/admin/propiedades?aviso=eliminada" : `/admin/propiedades/${id}?aviso=sin-permiso`);
}

export async function uploadPropertyImage(formData: FormData): Promise<void> {
  const user = await requireSession();
  const id = String(formData.get("id") ?? "");
  const file = formData.get("foto");
  if (!(file instanceof File) || file.size === 0) redirect(`/admin/propiedades/${id}?aviso=sin-foto`);
  let savedName = "";
  try {
    const saved = await saveUpload(file, "property", id);
    savedName = saved.fileName;
  } catch {
    redirect(`/admin/propiedades/${id}?aviso=foto-invalida`);
  }
  let slug = "";
  await updateStore((store) => {
    const property = store.properties.find((item) => item.id === id);
    if (!property || !canManageProperty(user, property)) return;
    property.images.push({
      src: `/uploads/properties/${id}/${savedName}`,
      alt: `${property.title}. Fotografía cargada en el panel.`,
    });
    property.updatedAt = new Date().toISOString();
    if (user.role !== "admin" && property.status === "published") property.status = "pending";
    slug = property.slug;
    pushAudit(store, {
      actor: user.email,
      action: "add-image",
      entityType: "property",
      entityId: id,
      summary: `Agregó una fotografía a ${property.referenceCode}.`,
    });
  });
  refresh(slug);
  redirect(`/admin/propiedades/${id}?aviso=foto`);
}

export async function deletePropertyImage(formData: FormData): Promise<void> {
  const user = await requireSession();
  const id = String(formData.get("id") ?? "");
  const src = String(formData.get("src") ?? "");
  let slug = "";
  await updateStore((store) => {
    const property = store.properties.find((item) => item.id === id);
    if (!property || !canManageProperty(user, property)) return;
    property.images = property.images.filter((image) => image.src !== src);
    property.updatedAt = new Date().toISOString();
    if (user.role !== "admin" && property.status === "published") property.status = "pending";
    slug = property.slug;
    pushAudit(store, {
      actor: user.email,
      action: "remove-image",
      entityType: "property",
      entityId: id,
      summary: `Quitó una fotografía de ${property.referenceCode}.`,
    });
  });
  const prefix = `/uploads/properties/${id}/`;
  if (src.startsWith(prefix)) {
    const absolute = propertyFilePath(id, src.slice(prefix.length));
    if (absolute) await unlink(absolute).catch(() => undefined);
  }
  refresh(slug);
  redirect(`/admin/propiedades/${id}?aviso=foto`);
}
