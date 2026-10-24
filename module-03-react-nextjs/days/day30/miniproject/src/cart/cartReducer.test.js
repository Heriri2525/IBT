import { test } from "node:test";
import assert from "node:assert/strict";
import { cartReducer, initialCartState } from "./cartReducer.js";

const doro = { id: 1, name: "Doro Wat", price: 320, category: "Ethiopian" };
const shiro = { id: 4, name: "Shiro", price: 180, category: "Vegetarian" };

test("add puts a new dish in the cart with qty 1", () => {
  const next = cartReducer(initialCartState, { type: "add", dish: doro });
  assert.deepEqual(next.items, [
    { id: 1, name: "Doro Wat", price: 320, qty: 1 },
  ]);
});

test("adding the same dish twice increases qty", () => {
  let state = cartReducer(initialCartState, { type: "add", dish: doro });
  state = cartReducer(state, { type: "add", dish: doro });
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].qty, 2);
});

test("decrement lowers qty and removes at zero", () => {
  let state = cartReducer(initialCartState, { type: "add", dish: doro });
  state = cartReducer(state, { type: "add", dish: doro });
  state = cartReducer(state, { type: "decrement", id: 1 });
  assert.equal(state.items[0].qty, 1);
  state = cartReducer(state, { type: "decrement", id: 1 });
  assert.equal(state.items.length, 0);
});

test("remove deletes only the chosen dish", () => {
  let state = cartReducer(initialCartState, { type: "add", dish: doro });
  state = cartReducer(state, { type: "add", dish: shiro });
  state = cartReducer(state, { type: "remove", id: 1 });
  assert.deepEqual(state.items.map((i) => i.id), [4]);
});

test("clear empties the cart", () => {
  let state = cartReducer(initialCartState, { type: "add", dish: doro });
  state = cartReducer(state, { type: "clear" });
  assert.deepEqual(state.items, []);
});

test("never mutates the previous state", () => {
  const before = cartReducer(initialCartState, { type: "add", dish: doro });
  const snapshot = JSON.stringify(before);
  cartReducer(before, { type: "add", dish: doro });
  cartReducer(before, { type: "remove", id: 1 });
  assert.equal(JSON.stringify(before), snapshot);
});

test("unknown action throws", () => {
  assert.throws(() => cartReducer(initialCartState, { type: "nope" }));
});
