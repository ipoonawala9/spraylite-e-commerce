import { beforeEach, describe, expect, it } from "vitest";
import { MAX_QTY, useCart } from "./cart";

const cart = () => useCart.getState();

beforeEach(() => {
  useCart.setState({ items: [] });
});

describe("cart store", () => {
  it("adds a new product with quantity 1", () => {
    cart().add("natural");
    expect(cart().items).toEqual([{ id: "natural", qty: 1 }]);
  });

  it("adding a product that's already there increases its quantity", () => {
    cart().add("natural");
    cart().add("natural", 2);
    expect(cart().items).toEqual([{ id: "natural", qty: 3 }]);
  });

  it("caps quantity at MAX_QTY", () => {
    cart().add("natural", MAX_QTY + 5);
    expect(cart().items[0].qty).toBe(MAX_QTY);
    cart().increment("natural");
    expect(cart().items[0].qty).toBe(MAX_QTY);
  });

  it("removes the line when quantity is set to 0", () => {
    cart().add("olive", 2);
    cart().setQty("olive", 0);
    expect(cart().items).toEqual([]);
  });

  it("removes the line when decremented from 1", () => {
    cart().add("olive");
    cart().decrement("olive");
    expect(cart().items).toEqual([]);
  });

  it("returns the removed line and its position so it can be restored", () => {
    cart().add("natural");
    cart().add("olive");
    cart().add("ghee");

    const removed = cart().remove("olive");
    expect(removed).toEqual({ item: { id: "olive", qty: 1 }, index: 1 });
    expect(cart().items.map((i) => i.id)).toEqual(["natural", "ghee"]);

    cart().restore(removed!);
    expect(cart().items.map((i) => i.id)).toEqual(["natural", "olive", "ghee"]);
  });

  it("returns undefined when removing something that isn't in the cart", () => {
    expect(cart().remove("butter")).toBeUndefined();
  });

  it("clears every line", () => {
    cart().add("natural");
    cart().add("olive");
    cart().clear();
    expect(cart().items).toEqual([]);
  });
});
