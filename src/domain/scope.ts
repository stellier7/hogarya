import { canViewLead } from "./permissions";
import type { Agency, Agent, Lead, Property, SessionUser } from "./types";

export function agenciesFor(user: SessionUser, agencies: Agency[]): Agency[] {
  switch (user.role) {
    case "admin":
      return agencies;
    case "agency":
    case "agent":
      return agencies.filter((agency) => agency.id === user.agencyId);
    default: {
      const exhausted: never = user.role;
      return exhausted;
    }
  }
}

export function propertiesFor(user: SessionUser, properties: Property[]): Property[] {
  switch (user.role) {
    case "admin":
      return properties;
    case "agency":
      return properties.filter((property) => property.agencyId === user.agencyId);
    case "agent":
      return properties.filter(
        (property) => property.agencyId === user.agencyId && property.agentId === user.agentId,
      );
    default: {
      const exhausted: never = user.role;
      return exhausted;
    }
  }
}

export function leadsFor(user: SessionUser, leads: Lead[]): Lead[] {
  return leads.filter((lead) => canViewLead(user, lead));
}

export function agentsFor(user: SessionUser, agents: Agent[]): Agent[] {
  switch (user.role) {
    case "admin":
      return agents;
    case "agency":
      return agents.filter((agent) => agent.agencyId === user.agencyId);
    case "agent":
      return agents.filter((agent) => agent.id === user.agentId);
    default: {
      const exhausted: never = user.role;
      return exhausted;
    }
  }
}
