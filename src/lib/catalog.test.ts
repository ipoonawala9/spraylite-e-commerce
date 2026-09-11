import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { filterProducts, sortProducts, suggestFor } from "./catalog";

describe("suggestFor", () => {
  const ids = (...args: Parameters<typeof suggestFor>) =>
    suggestFor(...args).map((p) => p.id);

  it("suggests the pairings for what's in the cart", () => {
    expect(ids([{ id: "natural", qty: 1 }])).toEqual(["ghee", "olive"]);
  });

  it("skips flavours already owned, including the tins inside a bundle", () => {
    expect(ids([{ id: "everyday-trio", qty: 1 }])).toEqual([
      "baking",
      "oriental",
    ]);
  });

  it("suggests nothing once every flavour is covered", () => {
    expect(ids([{ id: "full-pantry", qty: 1 }])).toEqual([]);
  });

  it("falls back to the best-rated flavours", () => {
    expect(ids([])).toEqual(["ghee", "olive"]);
  });
});

describe("filterProducts", () => {
  it("returns everything for 'all'", () => {
    expect(filterProducts(products, "all")).toHaveLength(products.length);
  });

  it("keeps only products in the category", () => {
    expect(filterProducts(products, "bundles").map((p) => p.id)).toEqual([
      "everyday-trio",
      "full-pantry",
    ]);
    expect(
      filterProducts(products, "baking").every((p) =>
        p.categories.includes("baking"),
      ),
    ).toBe(true);
  });
});

describe("sortProducts", () => {
  it("sorts by price without mutating the catalogue", () => {
    const ascending = sortProducts(products, "price-asc");
    const prices = ascending.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    expect(products[0].id).toBe("natural");

    const descending = sortProducts(products, "price-desc");
    expect(descending[0].price).toBe(Math.max(...prices));
  });

  it("puts the best rated first and breaks ties by review count", () => {
    const ids = sortProducts(products, "rating").map((p) => p.id);
    expect(ids[0]).toBe("full-pantry");
    expect(ids.indexOf("ghee")).toBeLessThan(ids.indexOf("everyday-trio"));
  });

  it("keeps catalogue order for 'featured'", () => {
    expect(sortProducts(products, "featured").map((p) => p.id)).toEqual(
      products.map((p) => p.id),
    );
  });
});
