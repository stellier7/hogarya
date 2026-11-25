"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { errorState, type FormState } from "@/domain/forms";
import { hashPassword, verifyPassword } from "@/server/password";
import { clearSession, sessionSecret, startSession } from "@/server/session";
import { pushAudit, readStore, updateStore } from "@/server/store";

export async function login(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!sessionSecret()) {
    return errorState("Defina HOGAR_YA_SESSION_SECRET en el servidor antes de ingresar.");
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const store = await readStore();
  const user = store.users.find((item) => item.email === email && item.active);
  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    return errorState("Correo o contraseña incorrectos.");
  }
  await startSession(user.id);
  redirect("/admin");
}

export async function setupAdmin(_previous: FormState, formData: FormData): Promise<FormState> {
  if (!sessionSecret()) {
    return errorState("Defina HOGAR_YA_SESSION_SECRET en el servidor antes de crear el administrador.");
  }
  const existing = await readStore();
  if (existing.users.some((user) => user.role === "admin")) {
    return errorState("Ya existe un administrador. Ingrese con esa cuenta.");
  }
  const name = String(formData.get("name") ?? "").trim().replace(/\s+/g, " ");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (name.length < 2 || name.length > 80) return errorState("Escriba el nombre del administrador.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return errorState("Escriba un correo válido.");
  if (password.length < 10) return errorState("La contraseña debe tener al menos 10 caracteres.");
  if (password !== confirm) return errorState("Las contraseñas no coinciden.");

  const { hash, salt } = hashPassword(password);
  const userId = randomUUID();
  let created = false;
  await updateStore((store) => {
    if (store.users.some((user) => user.role === "admin" || user.email === email)) return;
    store.users.push({
      id: userId,
      email,
      name,
      role: "admin",
      agencyId: null,
      agentId: null,
      passwordHash: hash,
      passwordSalt: salt,
      active: true,
      createdAt: new Date().toISOString(),
    });
    pushAudit(store, {
      actor: email,
      action: "create-admin",
      entityType: "user",
      entityId: userId,
      summary: "Se creó el primer administrador.",
    });
    created = true;
  });
  if (!created) return errorState("No se pudo crear el administrador.");
  await startSession(userId);
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}
