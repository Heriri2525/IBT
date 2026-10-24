import { test } from "node:test";
import assert from "node:assert/strict";
import { validate, normalizePhone, AREAS } from "./validate.js";

const good = { name: "Hermela", phone: "0911234567", area: "Bole", notes: "" };

test("a complete form is valid", () => {
  assert.deepEqual(validate(good), {});
});

test("name is required (spaces do not count)", () => {
  assert.ok(validate({ ...good, name: "   " }).name);
});

test("phone accepts 09... and +2519...", () => {
  assert.deepEqual(validate({ ...good, phone: "0911234567" }), {});
  assert.deepEqual(validate({ ...good, phone: "+251911234567" }), {});
});

test("phone formatting is fixed, not rejected", () => {
  assert.equal(normalizePhone("091 123-4567"), "0911234567");
  assert.deepEqual(validate({ ...good, phone: "091 123 4567" }), {});
  assert.deepEqual(validate({ ...good, phone: "+251 91 123 4567" }), {});
});

test("phone: empty and wrong shape get different messages", () => {
  const empty = validate({ ...good, phone: "" }).phone;
  const wrong = validate({ ...good, phone: "12345" }).phone;
  assert.ok(empty && wrong && empty !== wrong);
  assert.match(wrong, /09/);
});

test("phone rejects a landline-style or short number", () => {
  assert.ok(validate({ ...good, phone: "0111234567" }).phone);
  assert.ok(validate({ ...good, phone: "091123456" }).phone);
});

test("area must be one of the four areas", () => {
  for (const area of AREAS) assert.deepEqual(validate({ ...good, area }), {});
  assert.ok(validate({ ...good, area: "Mars" }).area);
});

test("notes are optional but capped at 200 characters", () => {
  assert.deepEqual(validate({ ...good, notes: "" }), {});
  assert.deepEqual(validate({ ...good, notes: "x".repeat(200) }), {});
  assert.ok(validate({ ...good, notes: "x".repeat(201) }).notes);
});

test("several problems are all reported at once", () => {
  const errors = validate({ name: "", phone: "", area: "Bole", notes: "" });
  assert.deepEqual(Object.keys(errors), ["name", "phone"]);
});
