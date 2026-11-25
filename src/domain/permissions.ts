import type { Lead, Property, SessionUser } from "./types";

function deny(role: never): false {
  return role;
}

export function canManageProperty(user: SessionUser, property: Property): boolean {
  switch (user.role) {
    case "admin":
      return true;
    case "agency":
      return user.agencyId != null && user.agencyId === property.agencyId;
    case "agent":
      return (
        user.agencyId != null &&
        user.agentId != null &&
        user.agencyId === property.agencyId &&
        user.agentId === property.agentId
      );
    default: {
      return deny(user.role);
    }
  }
}

export function canApprove(user: SessionUser): boolean {
  return user.role === "admin";
}

export function canReviewCaptures(user: SessionUser): boolean {
  return user.role === "admin";
}

export function canManageUsers(user: SessionUser): boolean {
  return user.role === "admin";
}

export function canFeature(user: SessionUser): boolean {
  return user.role === "admin";
}

export function canDeleteProperty(user: SessionUser, property: Property): boolean {
  if (!canManageProperty(user, property)) return false;
  if (user.role === "admin") return true;
  return property.status === "draft" || property.status === "pending" || property.status === "rejected";
}

export function canViewLead(user: SessionUser, lead: Lead): boolean {
  switch (user.role) {
    case "admin":
      return true;
    case "agency":
      return user.agencyId != null && lead.agencyId === user.agencyId;
    case "agent":
      return user.agentId != null && lead.agentId === user.agentId;
    default: {
      return deny(user.role);
    }
  }
}

export function canSetLeadStatus(user: SessionUser, lead: Lead): boolean {
  return canViewLead(user, lead);
}
