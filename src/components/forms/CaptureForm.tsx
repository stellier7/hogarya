"use client";

import { useActionState } from "react";
import { submitCapture } from "@/app/actions/public";
import { idleFormState } from "@/domain/forms";
import { propertyKinds } from "@/domain/labels";
import { Field, Honeypot } from "./InquiryForm";

export function CaptureForm() {
  const [state, action, pending] = useActionState(submitCapture, idleFormState);
  if (state.status === "success") {
    return <p role="status" className="sheet bg-white px-5 py-6 text-sm leading-6">{state.message}</p>;
  }
  return (
    <form action={action} className="relative grid gap-4" noValidate>
      <Honeypot />
      {state.status === "error" ? <p role="alert" className="text-sm text-[#7a3e32]">{state.message}</p> : null}
      <Field label="Nombre" name="name" error={state.fieldErrors.name} autoComplete="name" required />
      <Field label="Teléfono" name="phone" error={state.fieldErrors.phone} autoComplete="tel" required />
      <Field label="Correo" name="email" error={state.fieldErrors.email} type="email" autoComplete="email" required />
      <Field label="Ubicación de la propiedad" name="location" error={state.fieldErrors.location} required />
      <label className="grid gap-2 text-sm">
        <span className="kicker">Tipo</span>
        <select name="kind" className="field" defaultValue="house">
          {propertyKinds.map((kind) => (
            <option key={kind.id} value={kind.id}>{kind.singular}</option>
          ))}
        </select>
        {state.fieldErrors.kind ? <span className="text-xs text-[#7a3e32]">{state.fieldErrors.kind}</span> : null}
      </label>
      <label className="grid gap-2 text-sm">
        <span className="kicker">Operación</span>
        <select name="operation" className="field" defaultValue="sale">
          <option value="sale">Venta</option>
          <option value="rent">Alquiler</option>
        </select>
        {state.fieldErrors.operation ? <span className="text-xs text-[#7a3e32]">{state.fieldErrors.operation}</span> : null}
      </label>
      <Field label="Precio estimado en lempiras" name="estimatedPrice" error={state.fieldErrors.estimatedPrice} inputMode="numeric" />
      <label className="grid gap-2 text-sm">
        <span className="kicker">Descripción</span>
        <textarea name="description" required rows={5} className="field" />
        {state.fieldErrors.description ? <span className="text-xs text-[#7a3e32]">{state.fieldErrors.description}</span> : null}
      </label>
      <label className="grid gap-2 text-sm">
        <span className="kicker">Fotografías opcionales</span>
        <input name="fotos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="rounded-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.14em] file:text-ivory" />
        <span className="text-xs text-charcoal/70">Hasta 4 imágenes JPG, PNG o WebP, de menos de 3 MB cada una.</span>
      </label>
      <button className="btn" type="submit" disabled={pending}>{pending ? "Enviando" : "Enviar solicitud"}</button>
    </form>
  );
}
