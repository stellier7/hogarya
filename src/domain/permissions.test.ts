import assert from "node:assert/strict";
import test from "node:test";
import { canApprove, canDeleteProperty, canManageProperty, canViewLead } from "./permissions";
import type { Lead, Property, SessionUser } from "./types";

const property = {
  id: "p1",
  agencyId: "centro",
  agentId: "ana",
  status: "published",
} as Property;

const draft = { ...property, status: "draft" } as Property;

const admin: SessionUser = { id: "u1", email: "a@hogarya.local", name: "Admin", role: "admin", agencyId: null, agentId: null };
const centro: SessionUser = { id: "u2", email: "c@hogarya.local", name: "Centro", role: "agency", agencyId: "centro", agentId: null };
const norte: SessionUser = { id: "u3", email: "n@hogarya.local", name: "Norte", role: "agency", agencyId: "norte", agentId: null };
const ana: SessionUser = { id: "u4", email: "ana@hogarya.local", name: "Ana", role: "agent", agencyId: "centro", agentId: "ana" };
const luis: SessionUser = { id: "u5", email: "luis@hogarya.local", name: "Luis", role: "agent", agencyId: "centro", agentId: "luis" };

test("an agent cannot edit another agency or another agent", () => {
  assert.equal(canManageProperty(admin, property), true);
  assert.equal(canManageProperty(centro, property), true);
  assert.equal(canManageProperty(norte, property), false);
  assert.equal(canManageProperty(ana, property), true);
  assert.equal(canManageProperty(luis, property), false);
});

test("only an administrator approves, and partners delete drafts only", () => {
  assert.equal(canApprove(admin), true);
  assert.equal(canApprove(ana), false);
  assert.equal(canDeleteProperty(ana, property), false);
  assert.equal(canDeleteProperty(ana, draft), true);
  assert.equal(canDeleteProperty(norte, draft), false);
  assert.equal(canDeleteProperty(admin, property), true);
});

test("leads stay with the responsible agency and agent", () => {
  const lead = { agencyId: "centro", agentId: "ana" } as Lead;
  assert.equal(canViewLead(admin, lead), true);
  assert.equal(canViewLead(centro, lead), true);
  assert.equal(canViewLead(norte, lead), false);
  assert.equal(canViewLead(ana, lead), true);
  assert.equal(canViewLead(luis, lead), false);
});
