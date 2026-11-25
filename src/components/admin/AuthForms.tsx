"use client";

import { useActionState } from "react";
import { login, setupAdmin } from "@/app/actions/auth";
import { idleFormState } from "@/domain/forms";
import { Field } from "@/components/forms/InquiryForm";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, idleFormState);
  return (
    <form action={action} className="grid gap-4" noValidate>
      {state.status === "error" ? <p role="alert" className="text-sm text-[#7a3e32]">{state.message}</p> : null}
      <Field label="Correo" name="email" type="email" autoComplete="username" required />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      <button className="btn" disabled={pending} type="submit">{pending ? "Ingresando" : "Ingresar"}</button>
    </form>
  );
}

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAdmin, idleFormState);
  return (
    <form action={action} className="grid gap-4" noValidate>
      {state.status === "error" ? <p role="alert" className="text-sm text-[#7a3e32]">{state.message}</p> : null}
      <Field label="Nombre" name="name" autoComplete="name" required />
      <Field label="Correo" name="email" type="email" autoComplete="username" required />
      <Field label="Contraseña" name="password" type="password" autoComplete="new-password" required minLength={10} />
      <Field label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" required minLength={10} />
      <button className="btn" disabled={pending} type="submit">{pending ? "Creando" : "Crear administrador"}</button>
    </form>
  );
}
