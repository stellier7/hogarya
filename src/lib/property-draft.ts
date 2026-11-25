import type { PropertyDraft } from "@/components/admin/PropertyEditor";
import type { Property, SessionUser } from "@/domain/types";
import { agenciesFor, agentsFor } from "@/domain/scope";
import { readStore } from "@/server/store";

export async function editorContext(user: SessionUser, property?: Property) {
  const store = await readStore();
  const agencies = agenciesFor(user, store.agencies);
  const agents = agentsFor(user, store.agents);
  const draft: PropertyDraft = property
    ? {
        id: property.id,
        title: property.title,
        operation: property.operation,
        kind: property.kind,
        citySlug: property.citySlug,
        zone: property.zone,
        price: property.price == null ? "" : String(property.price),
        bedrooms: property.bedrooms == null ? "" : String(property.bedrooms),
        bathrooms: property.bathrooms == null ? "" : String(property.bathrooms),
        parking: property.parking == null ? "" : String(property.parking),
        constructionArea: property.constructionArea == null ? "" : String(property.constructionArea),
        lotArea: property.lotArea == null ? "" : String(property.lotArea),
        description: property.description,
        amenities: property.amenities.join(", "),
        status: property.status,
        featured: property.featured,
        agencyId: property.agencyId,
        agentId: property.agentId,
      }
    : {
        title: "",
        operation: "sale",
        kind: "house",
        citySlug: "tegucigalpa",
        zone: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        parking: "",
        constructionArea: "",
        lotArea: "",
        description: "",
        amenities: "",
        status: "pending",
        featured: false,
        agencyId: agencies[0]?.id ?? "",
        agentId: agents.find((agent) => agent.agencyId === agencies[0]?.id)?.id ?? agents[0]?.id ?? "",
      };
  return { store, agencies, agents, draft };
}
