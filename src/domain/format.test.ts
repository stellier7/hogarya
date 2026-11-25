import assert from "node:assert/strict";
import test from "node:test";
import { formatArea, formatPrice, phoneLinks } from "./format";

test("dollar prices stay labeled as USD and lempira prices stay in lempiras", () => {
  assert.match(formatPrice(600000, "sale", "USD"), /USD\s600,000/);
  assert.match(formatPrice(8450000, "sale"), /8,450,000/);
  assert.equal(formatPrice(600000, "sale", "USD").includes("L"), false);
});

test("lot area can be stated in square varas", () => {
  assert.equal(formatArea(4000, "vara2"), "4,000 varas²");
  assert.equal(formatArea(360), "360 m²");
});

test("published phones become call and WhatsApp links", () => {
  const links = phoneLinks("9839-9087 / 8933-9525");
  assert.deepEqual(
    links.map((link) => link.label),
    ["9839-9087", "8933-9525"],
  );
  assert.equal(links[0]?.tel, "tel:+50498399087");
  assert.equal(links[1]?.whatsapp, "https://wa.me/50489339525");
});
