"use client";

import { useActionState, type InputHTMLAttributes } from "react";
import { submitInquiry } from "@/app/actions/public";
import { idleFormState } from "@/domain/forms";

export function InquiryForm({
  propertyId,
  source,
  submitLabel = "Enviar consulta",
}: {
  propertyId?: string;
  source: "property" | "contact" | "partner";
  submitLabel?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, idleFormState);
  if (state.status === "success") {
    return <p role="status" className="border border-line bg-white px-5 py-6 text-sm leading-6">{state.message}</p>;
  }
  return (
    <form action={action} className="relative grid gap-4" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      {propertyId ? <input type="hidden" name="propertyId" value={propertyId} /> : null}
      {state.status === "error" ? <p role="alert" className="text-sm text-[#7a3e32]">{state.message}</p> : null}
      <Field label="Nombre" name="name" error={state.fieldErrors.name} autoComplete="name" required />
      <Field label="Teléfono" name="phone" error={state.fieldErrors.phone} autoComplete="tel" required />
      <Field label="Correo" name="email" error={state.fieldErrors.email} type="email" autoComplete="email" required />
      <label className="grid gap-2 text-sm">
        <span className="kicker">Mensaje</span>
        <textarea name="message" required rows={5} className="field" />
        {state.fieldErrors.message ? <span className="text-xs text-[#7a3e32]">{state.fieldErrors.message}</span> : null}
      </label>
      <button className="btn" type="submit" disabled={pending}>{pending ? "Enviando" : submitLabel}</button>
    </form>
  );
}

export function Field({
  label,
  name,
  error,
  ...props
}: { label: string; name: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="grid gap-2 text-sm" htmlFor={name}>
      <span className="kicker">{label}</span>
      <input id={name} name={name} className="field" {...props} />
      {error ? <span className="text-xs text-[#7a3e32]">{error}</span> : null}
    </label>
  );
}

export function Honeypot() {
  return (
    <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
      <label>
        Sitio web
        <input name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
