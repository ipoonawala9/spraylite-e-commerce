import type { Category, Product, ProductId, VariantId } from "@/types/product";

/**
 * Placeholder catalogue. Flavours and cap colours follow the real Spraylite
 * range; prices, ratings and review counts are illustrative.
 */
export const products: Product[] = [
  {
    id: "natural",
    name: "Natural Cooking Spray",
    shortName: "Natural",
    kind: "single",
    blurb: "Light canola oil for tava, kadai and air fryer.",
    description:
      "Our everyday spray. A fine, even coat of canola oil that stops dosas sticking and gets air-fryer tikka crisp, with a fraction of the oil you'd pour.",
    uses: ["Dosa and uttapam", "Air fryer", "Stir-fries", "Grilling"],
    categories: ["everyday", "indian"],
    size: "175 g tin",
    price: 349,
    mrp: 392,
    rating: 4.6,
    reviewCount: 1284,
    badge: "Bestseller",
    capColor: "#2F5DA8",
    oilColor: "#E8C766",
  },
  {
    id: "olive",
    name: "Olive Oil Cooking Spray",
    shortName: "Olive Oil",
    kind: "single",
    blurb: "Mild olive oil for salads, pasta and roasting.",
    description:
      "Olive oil in a fine mist. Dress a salad without drowning it, or give roast vegetables a light, even gloss.",
    uses: ["Salads", "Pasta", "Roast vegetables", "Garlic toast"],
    categories: ["everyday"],
    size: "175 g tin",
    price: 449,
    mrp: 499,
    rating: 4.7,
    reviewCount: 862,
    capColor: "#8FA04A",
    oilColor: "#A7A13A",
  },
  {
    id: "ghee",
    name: "Ghee Flavour Cooking Spray",
    shortName: "Ghee Flavour",
    kind: "single",
    blurb: "The aroma of desi ghee, a fraction of the fat.",
    description:
      "Rich ghee flavour for rotis, parathas and ghee roast dosa. A one-second spray finishes a roti the way a spoon of ghee would.",
    uses: ["Rotis and parathas", "Ghee roast dosa", "Khichdi", "Halwa"],
    categories: ["indian"],
    size: "175 g tin",
    price: 399,
    mrp: 449,
    rating: 4.8,
    reviewCount: 1043,
    badge: "Bestseller",
    capColor: "#E9D24B",
    oilColor: "#E0A526",
  },
  {
    id: "butter",
    name: "Butter Flavour Cooking Spray",
    shortName: "Butter Flavour",
    kind: "single",
    blurb: "Buttery flavour for pav, toast and popcorn.",
    description:
      "The buttery taste you want on pav, toast and corn, without spreading a knob of butter.",
    uses: ["Pav and toast", "Popcorn", "Corn on the cob", "Pancakes"],
    categories: ["everyday"],
    size: "175 g tin",
    price: 369,
    mrp: 420,
    rating: 4.5,
    reviewCount: 611,
    capColor: "#D4382C",
    oilColor: "#F2CF5B",
  },
  {
    id: "coconut",
    name: "Coconut Oil Cooking Spray",
    shortName: "Coconut Oil",
    kind: "single",
    blurb: "Coconut oil for appam, thoran and Kerala-style fry.",
    description:
      "Fragrant coconut oil for South Indian cooking. Mist the appachatti or finish a thoran with the flavour of a Kerala kitchen.",
    uses: ["Appam", "Thoran and avial", "Fish fry", "Banana chips"],
    categories: ["indian"],
    size: "175 g tin",
    price: 399,
    mrp: 449,
    rating: 4.6,
    reviewCount: 402,
    capColor: "#1F8A6E",
    oilColor: "#CFC6A4",
  },
  {
    id: "baking",
    name: "Baking Spray",
    shortName: "Baking",
    kind: "single",
    blurb: "Made for cake tins, so bakes come out clean.",
    description:
      "Reaches every corner of a bundt, loaf or muffin tray, so cakes release in one piece and the tin wipes clean.",
    uses: ["Cakes", "Muffins", "Bundt and loaf tins", "Brownies"],
    categories: ["baking"],
    size: "175 g tin",
    price: 379,
    mrp: 420,
    rating: 4.7,
    reviewCount: 538,
    capColor: "#5A4E26",
    oilColor: "#C9923E",
  },
  {
    id: "oriental",
    name: "Oriental Cooking Spray",
    shortName: "Oriental",
    kind: "single",
    blurb: "Toasted sesame notes for noodles and stir-fries.",
    description:
      "Sesame-forward flavour for Indo-Chinese favourites. Spray the wok for hakka noodles, chilli paneer or fried rice.",
    uses: ["Hakka noodles", "Fried rice", "Chilli paneer", "Momos"],
    categories: ["everyday"],
    size: "175 g tin",
    price: 399,
    mrp: 449,
    rating: 4.6,
    reviewCount: 327,
    badge: "New",
    capColor: "#8E1B24",
    oilColor: "#A8652A",
  },
  {
    id: "everyday-trio",
    name: "Everyday Trio",
    shortName: "Everyday Trio",
    kind: "bundle",
    blurb: "Natural, Ghee Flavour and Olive Oil. One for every meal.",
    description:
      "The three sprays most kitchens reach for: Natural for the tava, Ghee Flavour for rotis, Olive Oil for salads and roasting.",
    uses: ["Breakfast to dinner", "First-time buyers", "Housewarming gift"],
    categories: ["bundles"],
    size: "3 × 175 g tins",
    price: 1099,
    mrp: 1340,
    rating: 4.8,
    reviewCount: 296,
    capColor: "#2F5DA8",
    oilColor: "#E8C766",
    includes: ["natural", "ghee", "olive"],
  },
  {
    id: "full-pantry",
    name: "The Full Pantry",
    shortName: "Full Pantry",
    kind: "bundle",
    blurb: "All seven flavours in one gift box.",
    description:
      "Every Spraylite flavour, from Natural to Oriental. For the cook who wants the right spray for every dish, or a gift that gets used every day.",
    uses: ["Gifting", "Serious home cooks", "Stocking a new kitchen"],
    categories: ["bundles"],
    size: "7 × 175 g tins",
    price: 2499,
    mrp: 3078,
    rating: 4.9,
    reviewCount: 118,
    badge: "Gift pick",
    capColor: "#8E1B24",
    oilColor: "#A8652A",
    includes: [
      "natural",
      "olive",
      "baking",
      "ghee",
      "coconut",
      "butter",
      "oriental",
    ],
  },
];

export const productsById = Object.fromEntries(
  products.map((p) => [p.id, p]),
) as Record<ProductId, Product>;

export function getProduct(id: ProductId): Product | undefined {
  return productsById[id];
}

/** The seven single flavours, in the order the tins line up on the shelf. */
export const variants = products.filter(
  (p): p is Product & { id: VariantId } => p.kind === "single",
);

export const categoryFilters: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "everyday", label: "Everyday" },
  { id: "indian", label: "Indian cooking" },
  { id: "baking", label: "Baking" },
  { id: "bundles", label: "Bundles" },
];
