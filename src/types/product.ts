export type VariantId =
  "natural" | "olive" | "baking" | "ghee" | "coconut" | "butter" | "oriental";

export type BundleId = "everyday-trio" | "full-pantry";

export type ProductId = VariantId | BundleId;

export type Category = "everyday" | "indian" | "baking" | "bundles";

export interface Product {
  id: ProductId;
  /** Full display name, e.g. "Ghee Flavour Cooking Spray". */
  name: string;
  /** Name used on the tin label and in tight spaces, e.g. "Ghee Flavour". */
  shortName: string;
  kind: "single" | "bundle";
  /** One line that says what the spray is for. */
  blurb: string;
  description: string;
  uses: string[];
  categories: Category[];
  size: string;
  /** Selling price in whole rupees. */
  price: number;
  /** Maximum retail price in whole rupees. */
  mrp: number;
  rating: number;
  reviewCount: number;
  badge?: "Bestseller" | "New" | "Gift pick";
  /** Cap colour of the tin; tints swatches and cards. */
  capColor: string;
  /** Colour of the oil itself; tints the hero mist. */
  oilColor: string;
  /** Tins inside a bundle, in the order they're drawn. */
  includes?: VariantId[];
}

export interface CartItem {
  id: ProductId;
  qty: number;
}

export type PriceLookup = (
  id: ProductId,
) => Pick<Product, "price" | "mrp"> | undefined;
