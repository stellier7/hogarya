import assert from "node:assert/strict";
import test from "node:test";
import { validateCapture, validateContact } from "./validators";

test("contact form requires a real email, phone, and message", () => {
  const errors = validateContact({ name: "A", phone: "123", email: "no", message: "hola" });
  assert.ok(errors.name);
  assert.ok(errors.phone);
  assert.ok(errors.email);
  assert.ok(errors.message);
  const ok = validateContact({
    name: "María López",
    phone: "9999-0000",
    email: "maria@example.com",
    message: "Quiero información de esta propiedad de prueba.",
  });
  assert.deepEqual(ok, {});
});

test("capture form checks operation, type, and optional price", () => {
  const errors = validateCapture({
    name: "Carlos Méndez",
    phone: "50499990000",
    email: "carlos@example.com",
    message: "",
    location: "Tegucigalpa",
    kind: "castle",
    estimatedPrice: "-5",
    operation: "permuta",
    description: "Quiero comercializar una casa de prueba.",
  });
  assert.ok(errors.kind);
  assert.ok(errors.operation);
  assert.ok(errors.estimatedPrice);
  assert.equal(errors.description, undefined);
});
