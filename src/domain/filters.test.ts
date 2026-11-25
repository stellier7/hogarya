import assert from "node:assert/strict";
import test from "node:test";
import { isPublicProperty, parseCatalogQuery, queryProperties } from "./filters";
import { landingTitle, parseLandingSegments } from "./landing";
import type { Agency, Property } from "./types";

const agencies: Agency[] = [
  {
    id: "ok",
    slug: "ok",
    tradeName: "Socio de prueba",
    description: "Prueba",
    phone: null,
    whatsappE164: null,
    email: null,
    location: "Tegucigalpa",
    authorized: true,
    demo: true,
  },
  {
    id: "blocked",
    slug: "blocked",
    tradeName: "Sin autorización",
    description: "Prueba",
    phone: null,
    whatsappE164: null,
    email: null,
    location: "La Ceiba",
    authorized: false,
    demo: true,
  },
];

function property(overrides: Partial<Property> & Pick<Property, "id" | "status" | "agencyId">): Property {
  return {
    referenceCode: overrides.id,
    slug: overrides.id,
    title: "Casa de prueba",
    operation: "sale",
    kind: "house",
    featured: false,
    verification: null,
    demo: true,
    price: 100,
    citySlug: "tegucigalpa",
    city: "Tegucigalpa",
    department: "Francisco Morazán",
    zone: "Centro",
    description: "Dato de prueba",
    bedrooms: 3,
    bathrooms: 2,
    parking: 1,
    constructionArea: 100,
    lotArea: 200,
    amenities: [],
    images: [],
    agentId: "agent",
    rejectionNote: null,
    publishedAt: "2026-11-01T00:00:00.000Z",
    createdAt: "2026-11-01T00:00:00.000Z",
    updatedAt: "2026-11-01T00:00:00.000Z",
    ...overrides,
  };
}

const listings: Property[] = [
  property({ id: "sale-house", status: "published", agencyId: "ok", price: 80, bedrooms: 2 }),
  property({
    id: "rent-apt",
    status: "published",
    agencyId: "ok",
    operation: "rent",
    kind: "apartment",
    citySlug: "san-pedro-sula",
    city: "San Pedro Sula",
    price: 20,
    bedrooms: 1,
    publishedAt: "2026-11-20T00:00:00.000Z",
  }),
  property({ id: "pending", status: "pending", agencyId: "ok", price: 10 }),
  property({ id: "blocked-public", status: "published", agencyId: "blocked", price: 5 }),
  property({ id: "land", status: "published", agencyId: "ok", kind: "land", bedrooms: null, price: 50 }),
];

test("public catalog hides pending listings and unauthorized agencies", () => {
  const result = queryProperties(listings, agencies, parseCatalogQuery({}));
  assert.deepEqual(result.map((item) => item.id), ["rent-apt", "sale-house", "land"]);
  assert.equal(isPublicProperty(listings[2]!, agencies), false);
  assert.equal(isPublicProperty(listings[3]!, agencies), false);
});

test("filters by operation, city, price, rooms, and text", () => {
  const result = queryProperties(
    listings,
    agencies,
    parseCatalogQuery({
      operacion: "venta",
      ciudad: "tegucigalpa",
      min: "60",
      max: "90",
      habitaciones: "2",
      q: "casa",
    }),
  );
  assert.deepEqual(result.map((item) => item.id), ["sale-house"]);
});

test("room minimum does not match land without bedrooms", () => {
  const result = queryProperties(listings, agencies, parseCatalogQuery({ habitaciones: "1" }));
  assert.equal(result.some((item) => item.id === "land"), false);
});

test("price sort puts missing prices last", () => {
  const withMissing = [
    property({ id: "b", status: "published", agencyId: "ok", price: 30 }),
    property({ id: "a", status: "published", agencyId: "ok", price: null }),
    property({ id: "c", status: "published", agencyId: "ok", price: 10 }),
  ];
  const result = queryProperties(withMissing, agencies, parseCatalogQuery({ orden: "precio-asc" }));
  assert.deepEqual(result.map((item) => item.id), ["c", "b", "a"]);
});

test("landing segments distinguish cities and property types", () => {
  assert.deepEqual(parseLandingSegments(undefined), {});
  assert.deepEqual(parseLandingSegments(["casas"]), { kind: "house" });
  assert.deepEqual(parseLandingSegments(["tegucigalpa"]), { city: "tegucigalpa" });
  assert.deepEqual(parseLandingSegments(["tegucigalpa", "casas"]), { city: "tegucigalpa", kind: "house" });
  assert.equal(parseLandingSegments(["casas", "tegucigalpa"]), null);
  assert.equal(parseLandingSegments(["no-existe"]), null);
  assert.equal(landingTitle("sale", "tegucigalpa", "house"), "Casas en venta en Tegucigalpa");
  assert.equal(landingTitle("rent"), "Propiedades en alquiler en Honduras");
});
