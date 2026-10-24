import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

// minimal localStorage so the persist middleware runs in plain Node
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => mem.get(k) ?? null,
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};

const { useCartStore, selectTotal, selectCount } = await import("./cartStore.js");

const doro = { id: 1, name: "Doro Wat", price: 320, category: "Ethiopian" };
const shiro = { id: 4, name: "Shiro", price: 180, category: "Vegetarian" };
const state = () => useCartStore.getState();

// No React, no components: the store is just a module.
beforeEach(() => {
  state().clear();
});

test("addItem puts a new dish in the cart with qty 1", () => {
  state().addItem(doro);
  assert.deepEqual(state().items, [
    { id: 1, name: "Doro Wat", price: 320, qty: 1 },
  ]);
});

test("adding the same dish twice increases qty", () => {
  state().addItem(doro);
  state().addItem(doro);
  assert.equal(state().items.length, 1);
  assert.equal(state().items[0].qty, 2);
});

test("decrement lowers qty and removes at zero", () => {
  state().addItem(doro);
  state().addItem(doro);
  state().decrement(1);
  assert.equal(state().items[0].qty, 1);
  state().decrement(1);
  assert.equal(state().items.length, 0);
});

test("remove deletes only the chosen dish", () => {
  state().addItem(doro);
  state().addItem(shiro);
  state().remove(1);
  assert.deepEqual(state().items.map((i) => i.id), [4]);
});

test("clear empties the cart", () => {
  state().addItem(doro);
  state().clear();
  assert.deepEqual(state().items, []);
});

test("total and count are derived from items", () => {
  state().addItem(doro);
  state().addItem(doro);
  state().addItem(shiro);
  assert.equal(selectTotal(state()), 320 * 2 + 180);
  assert.equal(selectCount(state()), 3);
});

test("persist writes only items to localStorage", () => {
  state().addItem(shiro);
  const saved = JSON.parse(mem.get("addis-eats-cart"));
  assert.deepEqual(Object.keys(saved.state), ["items"]);
  assert.equal(saved.state.items[0].name, "Shiro");
});

test("actions keep the same reference between changes", () => {
  const before = state().addItem;
  state().addItem(doro);
  assert.equal(state().addItem, before); // why `onAdd` never breaks React.memo
});
