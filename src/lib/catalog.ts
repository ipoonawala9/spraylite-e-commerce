import { getProduct, variants } from "@/data/products";
import type {
  CartItem,
  Category,
  Product,
  ProductId,
  VariantId,
} from "@/types/product";

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export const sortOptions: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "rating", label: "Top rated" },
];

export function filterProducts(list: Product[], category: Category | "all") {
  return category === "all"
    ? list
    : list.filter((product) => product.categories.includes(category));
}

/** Flavours that go well with each product, for "Pairs well with" in the cart. */
const PAIRINGS: Partial<Record<ProductId, VariantId[]>> = {
  natural: ["ghee", "olive"],
  olive: ["oriental", "natural"],
  ghee: ["natural", "butter"],
  butter: ["baking", "ghee"],
  coconut: ["natural", "ghee"],
  baking: ["butter", "natural"],
  oriental: ["olive", "natural"],
  "everyday-trio": ["baking", "oriental"],
};

/**
 * Up to `limit` single flavours to suggest: pairings for what's in the cart
 * first, then the best rated. Skips anything already owned, counting the tins
 * inside bundles.
 */
export function suggestFor(items: CartItem[], limit = 2): Product[] {
  const owned = new Set<ProductId>();
  for (const { id } of items) {
    owned.add(id);
    getProduct(id)?.includes?.forEach((variant) => owned.add(variant));
  }

  const picks: VariantId[] = [];
  const consider = (id: VariantId) => {
    if (!owned.has(id) && !picks.includes(id)) picks.push(id);
  };
  items.forEach(({ id }) => PAIRINGS[id]?.forEach(consider));
  [...variants]
    .sort((a, b) => b.rating - a.rating)
    .forEach((v) => consider(v.id));

  return picks
    .slice(0, limit)
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product));
}

/** Returns a sorted copy; the catalogue order is the "featured" order. */
export function sortProducts(list: Product[], key: SortKey) {
  const sorted = [...list];
  switch (key) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort(
        (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      );
    default:
      return sorted;
  }
}
