"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { captureStatuses, leadStatuses } from "@/domain/labels";
import { canManageUsers, canReviewCaptures, canSetLeadStatus, canViewLead } from "@/domain/permissions";
import { slugify } from "@/domain/format";
import type { CaptureStatus, LeadStatus } from "@/domain/types";
import { hashPassword } from "@/server/password";
import { requireSession } from "@/server/session";
import { pushAudit, updateStore } from "@/server/store";

function refresh() {
  revalidatePath("/admin");
  revalidatePath("/inmobiliarias");
}

export async function saveAgency(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (user.role !== "admin") redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const tradeName = String(formData.get("tradeName") ?? "").trim().replace(/\s+/g, " ");
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim().replace(/\s+/g, " ");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsappE164") ?? "").replace(/\D/g, "");
  const authorized = formData.get("authorized") === "on";
  if (tradeName.length < 3 || description.length < 10 || location.length < 3) {
    redirect("/admin/inmobiliarias?aviso=incompleta");
  }
  await updateStore((store) => {
    const current = id ? store.agencies.find((agency) => agency.id === id) : undefined;
    const slugBase = slugify(tradeName);
    const slug = store.agencies.some((agency) => agency.slug === slugBase && agency.id !== current?.id)
      ? `${slugBase}-${randomUUID().slice(0, 4)}`
      : slugBase;
    const next = {
      id: current?.id ?? randomUUID(),
      slug,
      tradeName,
      description,
      location,
      email: email || null,
      phone: phone || null,
      whatsappE164: whatsapp || null,
      authorized,
      demo: current?.demo ?? process.env.HOGAR_YA_PUBLISH_REAL !== "1",
    };
    if (current) Object.assign(current, next);
    else store.agencies.unshift(next);
    pushAudit(store, {
      actor: user.email,
      action: "save-agency",
      entityType: "agency",
      entityId: next.id,
      summary: `${authorized ? "Autorizó" : "Guardó"} ${tradeName}.`,
    });
  });
  refresh();
  redirect("/admin/inmobiliarias?aviso=guardada");
}

export async function saveAgent(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (user.role === "agent") redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const agencyId = user.role === "agency" ? user.agencyId ?? "" : String(formData.get("agencyId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsappE164") ?? "").replace(/\D/g, "");
  const authorized = user.role === "admin" ? formData.get("authorized") === "on" : true;
  if (name.length < 3 || bio.length < 10 || !agencyId) redirect("/admin/agentes?aviso=incompleta");

  await updateStore((store) => {
    const agency = store.agencies.find((item) => item.id === agencyId);
    if (!agency) return;
    if (user.role === "agency" && user.agencyId !== agency.id) return;
    const current = id ? store.agents.find((agent) => agent.id === id) : undefined;
    if (current && user.role === "agency" && current.agencyId !== user.agencyId) return;
    const next = {
      id: current?.id ?? randomUUID(),
      agencyId: agency.id,
      name,
      photo: current?.photo ?? null,
      bio,
      phone: phone || null,
      whatsappE164: whatsapp || null,
      email: email || null,
      location: location || agency.location,
      authorized: user.role === "admin" ? authorized : (current?.authorized ?? false),
      demo: current?.demo ?? process.env.HOGAR_YA_PUBLISH_REAL !== "1",
    };
    if (current) Object.assign(current, next);
    else store.agents.unshift(next);
    pushAudit(store, {
      actor: user.email,
      action: "save-agent",
      entityType: "agent",
      entityId: next.id,
      summary: `Guardó el agente ${name}.`,
    });
  });
  refresh();
  redirect("/admin/agentes?aviso=guardado");
}

export async function setLeadStatus(formData: FormData): Promise<void> {
  const user = await requireSession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as LeadStatus;
  if (!leadStatuses.includes(status)) redirect("/admin/consultas");
  await updateStore((store) => {
    const lead = store.leads.find((item) => item.id === id);
    if (!lead || !canViewLead(user, lead) || !canSetLeadStatus(user, lead)) return;
    lead.status = status;
    pushAudit(store, {
      actor: user.email,
      action: "lead-status",
      entityType: "lead",
      entityId: lead.id,
      summary: `Consulta de ${lead.name} marcada como ${status}.`,
    });
  });
  revalidatePath("/admin/consultas");
  redirect("/admin/consultas?aviso=estado");
}

export async function setCaptureStatus(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (!canReviewCaptures(user)) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as CaptureStatus;
  if (!captureStatuses.includes(status)) redirect("/admin/captaciones");
  await updateStore((store) => {
    const request = store.captures.find((item) => item.id === id);
    if (!request) return;
    request.status = status;
    pushAudit(store, {
      actor: user.email,
      action: "capture-status",
      entityType: "capture",
      entityId: request.id,
      summary: `Captación de ${request.name} marcada como ${status}.`,
    });
  });
  revalidatePath("/admin/captaciones");
  redirect("/admin/captaciones?aviso=estado");
}

export async function createAccess(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (!canManageUsers(user)) redirect("/admin");
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const roleRaw = String(formData.get("role") ?? "");
  const role = roleRaw === "admin" || roleRaw === "agency" || roleRaw === "agent" ? roleRaw : null;
  const agencyId = String(formData.get("agencyId") ?? "").trim() || null;
  const agentId = String(formData.get("agentId") ?? "").trim() || null;
  if (!role || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10) {
    redirect("/admin/accesos?aviso=incompleta");
  }
  if ((role === "agency" || role === "agent") && !agencyId) redirect("/admin/accesos?aviso=incompleta");
  if (role === "agent" && !agentId) redirect("/admin/accesos?aviso=incompleta");

  const { hash, salt } = hashPassword(password);
  await updateStore((store) => {
    if (store.users.some((account) => account.email === email)) return;
    if (agencyId && !store.agencies.some((agency) => agency.id === agencyId)) return;
    if (agentId) {
      const agent = store.agents.find((item) => item.id === agentId);
      if (!agent || agent.agencyId !== agencyId) return;
    }
    const id = randomUUID();
    store.users.push({
      id,
      email,
      name,
      role,
      agencyId: role === "admin" ? null : agencyId,
      agentId: role === "agent" ? agentId : null,
      passwordHash: hash,
      passwordSalt: salt,
      active: true,
      createdAt: new Date().toISOString(),
    });
    pushAudit(store, {
      actor: user.email,
      action: "create-user",
      entityType: "user",
      entityId: id,
      summary: `Creó el acceso ${role} para ${email}.`,
    });
  });
  revalidatePath("/admin/accesos");
  redirect("/admin/accesos?aviso=creado");
}

export async function setUserActive(formData: FormData): Promise<void> {
  const user = await requireSession();
  if (!canManageUsers(user)) redirect("/admin");
  const id = String(formData.get("id") ?? "");
  const active = String(formData.get("active") ?? "") === "1";
  await updateStore((store) => {
    const account = store.users.find((item) => item.id === id);
    if (!account) return;
    const otherAdmins = store.users.filter((item) => item.role === "admin" && item.active && item.id !== account.id);
    if (account.role === "admin" && !active && otherAdmins.length === 0) return;
    account.active = active;
    pushAudit(store, {
      actor: user.email,
      action: "user-active",
      entityType: "user",
      entityId: account.id,
      summary: `${active ? "Activó" : "Suspendió"} el acceso de ${account.email}.`,
    });
  });
  redirect("/admin/accesos?aviso=estado");
}
