"use client";

import { useActionState, useState } from "react";
import { saveProperty } from "@/app/actions/properties";
import { idleFormState } from "@/domain/forms";
import { propertyKinds, publicationStatuses, statusLabel } from "@/domain/labels";
import type { Agency, Agent, Operation, PropertyKind, PublicationStatus } from "@/domain/types";
import { zones } from "@/domain/zones";

export type PropertyDraft = {
  id?: string;
  title: string;
  operation: Operation;
  kind: PropertyKind;
  citySlug: string;
  zone: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  constructionArea: string;
  lotArea: string;
  description: string;
  amenities: string;
  status: PublicationStatus;
  featured: boolean;
  agencyId: string;
  agentId: string;
};

export function PropertyEditor({
  draft,
  agencies,
  agents,
  canModerate,
}: {
  draft: PropertyDraft;
  agencies: Agency[];
  agents: Agent[];
  canModerate: boolean;
}) {
  const [state, action, pending] = useActionState(saveProperty, idleFormState);
  const [agencyId, setAgencyId] = useState(draft.agencyId);
  const [agentId, setAgentId] = useState(draft.agentId);
  const visibleAgents = agents.filter((agent) => agent.agencyId === agencyId);

  return (
    <form action={action} className="grid gap-4">
      {draft.id ? <input type="hidden" name="id" value={draft.id} /> : null}
      {state.status === "error" ? <p role="alert" className="text-sm text-[#7a3e32]">{state.message}</p> : null}
      <label className="grid gap-2 text-sm">
        <span className="kicker">Título</span>
        <input name="title" defaultValue={draft.title} className="field" required />
        <FieldError message={state.fieldErrors.title} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <Select name="operation" label="Operación" defaultValue={draft.operation} error={state.fieldErrors.operation} options={[{ id: "sale", label: "Venta" }, { id: "rent", label: "Alquiler" }]} />
        <Select name="kind" label="Tipo" defaultValue={draft.kind} error={state.fieldErrors.kind} options={propertyKinds.map((kind) => ({ id: kind.id, label: kind.singular }))} />
        <Select name="citySlug" label="Ciudad" defaultValue={draft.citySlug} error={state.fieldErrors.citySlug} options={zones.map((zone) => ({ id: zone.slug, label: zone.city }))} />
        <Text name="zone" label="Zona" defaultValue={draft.zone} error={state.fieldErrors.zone} />
        <Text name="price" label="Precio en lempiras" defaultValue={draft.price} error={state.fieldErrors.price} />
        <Text name="bedrooms" label="Habitaciones" defaultValue={draft.bedrooms} error={state.fieldErrors.bedrooms} />
        <Text name="bathrooms" label="Baños" defaultValue={draft.bathrooms} error={state.fieldErrors.bathrooms} />
        <Text name="parking" label="Estacionamientos" defaultValue={draft.parking} error={state.fieldErrors.parking} />
        <Text name="constructionArea" label="Área de construcción m²" defaultValue={draft.constructionArea} error={state.fieldErrors.constructionArea} />
        <Text name="lotArea" label="Área de terreno m²" defaultValue={draft.lotArea} error={state.fieldErrors.lotArea} />
      </div>
      <label className="grid gap-2 text-sm">
        <span className="kicker">Descripción</span>
        <textarea name="description" defaultValue={draft.description} rows={6} className="field" />
        <FieldError message={state.fieldErrors.description} />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="kicker">Amenidades, separadas por coma</span>
        <textarea name="amenities" defaultValue={draft.amenities} rows={3} className="field" />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          <span className="kicker">Inmobiliaria</span>
          <select
            name="agencyId"
            className="field"
            value={agencyId}
            onChange={(event) => {
              const next = event.target.value;
              setAgencyId(next);
              const first = agents.find((agent) => agent.agencyId === next);
              setAgentId(first?.id ?? "");
            }}
          >
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>{agency.tradeName}{agency.authorized ? "" : " · sin autorización"}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm">
          <span className="kicker">Agente</span>
          <select name="agentId" className="field" value={agentId} onChange={(event) => setAgentId(event.target.value)}>
            {visibleAgents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </label>
      </div>
      {canModerate ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Select name="status" label="Estado" defaultValue={draft.status} error={state.fieldErrors.status} options={publicationStatuses.map((status) => ({ id: status, label: statusLabel(status) }))} />
          <label className="flex items-center gap-3 pt-7 text-sm">
            <input type="checkbox" name="featured" defaultChecked={draft.featured} />
            Destacada al publicarse
          </label>
        </div>
      ) : (
        <p className="text-sm leading-6">Al guardar, la ficha queda pendiente de aprobación. No puede cambiar el estado ni destacar la propiedad.</p>
      )}
      <button className="btn w-fit" type="submit" disabled={pending}>{pending ? "Guardando" : "Guardar"}</button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-xs text-[#7a3e32]">{message}</span>;
}

function Text({ name, label, defaultValue, error }: { name: string; label: string; defaultValue: string; error?: string }) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="kicker">{label}</span>
      <input name={name} defaultValue={defaultValue} className="field" />
      <FieldError message={error} />
    </label>
  );
}

function Select({
  name,
  label,
  defaultValue,
  options,
  error,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: { id: string; label: string }[];
  error?: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="kicker">{label}</span>
      <select name={name} defaultValue={defaultValue} className="field">
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      <FieldError message={error} />
    </label>
  );
}
