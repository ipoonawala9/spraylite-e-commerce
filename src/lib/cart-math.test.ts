import { describe, expect, it } from "vitest";
import type { CartItem, PriceLookup, ProductId } from "@/types/product";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  cartCount,
  deliveryFee,
  cartMrpTotal,
  cartSavings,
  cartSubtotal,
  freeDeliveryProgress,
  freeDeliveryRemaining,
} from "./cart-math";

const prices: Partial<Record<ProductId, { price: number; mrp: number }>> = {
  natural: { price: 349, mrp: 392 },
  olive: { price: 449, mrp: 499 },
};
const lookup: PriceLookup = (id) => prices[id];

const items: CartItem[] = [
  { id: "natural", qty: 2 },
  { id: "olive", qty: 1 },
];

describe("cart totals", () => {
  it("counts units, not lines", () => {
    expect(cartCount(items)).toBe(3);
  });

  it("adds up the selling price of every unit", () => {
    expect(cartSubtotal(items, lookup)).toBe(349 * 2 + 449);
  });

  it("adds up MRP of every unit", () => {
    expect(cartMrpTotal(items, lookup)).toBe(392 * 2 + 499);
  });

  it("reports savings as MRP total minus subtotal", () => {
    expect(cartSavings(items, lookup)).toBe(1283 - 1147);
  });

  it("ignores lines whose product is no longer in the catalogue", () => {
    const stale: CartItem[] = [{ id: "ghee", qty: 3 }];
    expect(cartSubtotal(stale, lookup)).toBe(0);
    expect(cartSavings(stale, lookup)).toBe(0);
  });

  it("uses the real catalogue when no lookup is given", () => {
    expect(cartSubtotal([{ id: "natural", qty: 1 }])).toBeGreaterThan(0);
  });
});

describe("deliveryFee", () => {
  it("is free for an empty cart and for orders over the threshold", () => {
    expect(deliveryFee(0)).toBe(0);
    expect(deliveryFee(FREE_DELIVERY_THRESHOLD)).toBe(0);
  });

  it("charges the flat fee below the threshold", () => {
    expect(deliveryFee(349)).toBe(DELIVERY_FEE);
  });
});

describe("free delivery", () => {
  it("says how much more is needed", () => {
    expect(freeDeliveryRemaining(349)).toBe(FREE_DELIVERY_THRESHOLD - 349);
  });

  it("never goes below zero", () => {
    expect(freeDeliveryRemaining(FREE_DELIVERY_THRESHOLD + 200)).toBe(0);
  });

  it("reports progress between 0 and 1", () => {
    expect(freeDeliveryProgress(0)).toBe(0);
    expect(freeDeliveryProgress(FREE_DELIVERY_THRESHOLD)).toBe(1);
    expect(freeDeliveryProgress(FREE_DELIVERY_THRESHOLD * 3)).toBe(1);
  });
});
