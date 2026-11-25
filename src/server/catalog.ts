import { isPublicProperty, relatedProperties } from "@/domain/filters";
import type { Agency, Agent, Property, StoreData } from "@/domain/types";
import { readStore } from "./store";

export async function loadCatalog(): Promise<StoreData> {
  return readStore();
}

export function publicProperties(store: StoreData): Property[] {
  return store.properties.filter((property) => isPublicProperty(property, store.agencies));
}

export function findPublicProperty(store: StoreData, slug: string): Property | undefined {
  return publicProperties(store).find((property) => property.slug === slug);
}

export function agencyById(store: StoreData, id: string): Agency | undefined {
  return store.agencies.find((agency) => agency.id === id);
}

export function agentById(store: StoreData, id: string): Agent | undefined {
  return store.agents.find((agent) => agent.id === id);
}

export function similarProperties(store: StoreData, property: Property): Property[] {
  return relatedProperties(property, store.properties, store.agencies);
}

export function hasPublicDemo(store: StoreData): boolean {
  return publicProperties(store).some((property) => property.demo);
}
