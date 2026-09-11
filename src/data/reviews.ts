import type { VariantId } from "@/types/product";

export interface Review {
  id: string;
  name: string;
  city: string;
  productId: VariantId;
  rating: number;
  quote: string;
}

/** Sample reviews written for the demo; they're labelled as such on the page. */
export const reviews: Review[] = [
  {
    id: "priya",
    name: "Priya S.",
    city: "Pune",
    productId: "ghee",
    rating: 5,
    quote:
      "Rotis taste the way my mother makes them, and I use a fraction of the ghee. It's the tin I reach for every morning.",
  },
  {
    id: "farhan",
    name: "Farhan K.",
    city: "Bengaluru",
    productId: "baking",
    rating: 5,
    quote:
      "My muffins used to tear every time I turned them out. One spray on the tray and they drop out clean.",
  },
  {
    id: "meera",
    name: "Meera I.",
    city: "Mumbai",
    productId: "natural",
    rating: 4,
    quote:
      "I count every gram of fat. A second of Natural on the tava is all my dosa needs, and the pan is easy to wash.",
  },
];
