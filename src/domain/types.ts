export type Role = "admin" | "agent" | "agency" | "visitor";

export type PublicationStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "paused"
  | "sold"
  | "rented";

export type Operation = "sale" | "rent";

export type PropertyKind =
  | "house"
  | "apartment"
  | "land"
  | "retail"
  | "office"
  | "building"
  | "industrial"
  | "farm";

export type PropertyImage = {
  src: string;
  alt: string;
};

export type Currency = "HNL" | "USD";

export type AreaUnit = "m2" | "vara2";

export type Agency = {
  id: string;
  slug: string;
  tradeName: string;
  description: string;
  phone: string | null;
  whatsappE164: string | null;
  email: string | null;
  location: string;
  authorized: boolean;
  demo: boolean;
};

export type Agent = {
  id: string;
  agencyId: string;
  name: string;
  photo: string | null;
  bio: string;
  phone: string | null;
  whatsappE164: string | null;
  email: string | null;
  location: string;
  authorized: boolean;
  demo: boolean;
};

export type VerificationRecord = {
  at: string;
  by: string;
  note: string;
};

export type Property = {
  id: string;
  referenceCode: string;
  slug: string;
  title: string;
  operation: Operation;
  kind: PropertyKind;
  status: PublicationStatus;
  featured: boolean;
  /** Present only after a real verification review. Demo listings keep this null. */
  verification: VerificationRecord | null;
  demo: boolean;
  price: number | null;
  /** Omitted currency is lempiras. Dollar listings set USD. */
  currency?: Currency;
  lotAreaUnit?: AreaUnit;
  citySlug: string;
  city: string;
  department: string;
  zone: string;
  description: string;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  constructionArea: number | null;
  lotArea: number | null;
  amenities: string[];
  images: PropertyImage[];
  agencyId: string;
  agentId: string;
  rejectionNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadStatus = "new" | "in_progress" | "closed";

export type LeadSource = "property" | "contact" | "partner";

export type Lead = {
  id: string;
  propertyId: string | null;
  agencyId: string | null;
  agentId: string | null;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
};

export type CaptureStatus = "received" | "in_review" | "contacted" | "declined";

export type CapturePhoto = {
  file: string;
  name: string;
};

export type CaptureRequest = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  kind: PropertyKind;
  estimatedPrice: number | null;
  operation: Operation;
  description: string;
  photos: CapturePhoto[];
  status: CaptureStatus;
  createdAt: string;
};

export type UserAccount = {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "visitor">;
  agencyId: string | null;
  agentId: string | null;
  passwordHash: string;
  passwordSalt: string;
  active: boolean;
  createdAt: string;
};

export type AuditEntity = "property" | "agency" | "agent" | "lead" | "capture" | "user";

export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  entityType: AuditEntity;
  entityId: string;
  summary: string;
};

export type StoreData = {
  version: 1;
  agencies: Agency[];
  agents: Agent[];
  properties: Property[];
  leads: Lead[];
  captures: CaptureRequest[];
  users: UserAccount[];
  audit: AuditEvent[];
};

export type SortKey = "recientes" | "precio-asc" | "precio-desc";

export type CatalogView = "cuadricula" | "lista";

export type CatalogQuery = {
  operation?: Operation;
  city?: string;
  kind?: PropertyKind;
  min?: number;
  max?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  q?: string;
  page: number;
  vista: CatalogView;
  orden: SortKey;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Exclude<Role, "visitor">;
  agencyId: string | null;
  agentId: string | null;
};
