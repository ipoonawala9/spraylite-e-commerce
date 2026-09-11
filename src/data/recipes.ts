import type { StaticImageData } from "next/image";
import cake from "@/assets/recipes/chocolate-cake.jpg";
import dosa from "@/assets/recipes/dosa.jpg";
import noodles from "@/assets/recipes/hakka-noodles.jpg";
import salad from "@/assets/recipes/olive-oil-salad.jpg";
import paneer from "@/assets/recipes/paneer-tikka.jpg";
import type { VariantId } from "@/types/product";

export interface Recipe {
  id: string;
  title: string;
  minutes: number;
  note: string;
  /** The spray the dish is made with; the card offers to add it. */
  productId: VariantId;
  image: StaticImageData;
  alt: string;
  credit: { name: string; url: string };
}

/** Photos from Unsplash (Unsplash License); credited in the README. */
export const recipes: Recipe[] = [
  {
    id: "ghee-roast-dosa",
    title: "Ghee roast dosa",
    minutes: 20,
    note: "Crisp, golden edges from one light spray per dosa.",
    productId: "ghee",
    image: dosa,
    alt: "A crisp paper dosa on a banana leaf with chutney and sambar",
    credit: {
      name: "Pavan Reddy",
      url: "https://unsplash.com/photos/JJhZ34RRyfk",
    },
  },
  {
    id: "paneer-tikka",
    title: "Air-fryer paneer tikka",
    minutes: 25,
    note: "Spray the basket and skewers instead of brushing on oil.",
    productId: "natural",
    image: paneer,
    alt: "Skewers of marinated paneer, capsicum and onion",
    credit: {
      name: "Ashwini Chaudhary (Monty)",
      url: "https://unsplash.com/photos/ne2zRzZZZNY",
    },
  },
  {
    id: "eggless-chocolate-cake",
    title: "Eggless chocolate cake",
    minutes: 50,
    note: "Coat the tin once and the cake turns out in one piece.",
    productId: "baking",
    image: cake,
    alt: "A slice of layered chocolate cake on a white plate",
    credit: {
      name: "Will Echols",
      url: "https://unsplash.com/photos/P_l1bJQpQF0",
    },
  },
  {
    id: "veg-hakka-noodles",
    title: "Veg hakka noodles",
    minutes: 20,
    note: "Sesame notes without a ladle of oil in the wok.",
    productId: "oriental",
    image: noodles,
    alt: "Stir-fried noodles with vegetables and chopsticks on a wooden plate",
    credit: {
      name: "Orijit Chatterjee",
      url: "https://unsplash.com/photos/wEBg_pYtynw",
    },
  },
  {
    id: "olive-oil-salad",
    title: "Salad with an olive oil mist",
    minutes: 15,
    note: "Mist the leaves instead of pouring dressing over them.",
    productId: "olive",
    image: salad,
    alt: "A bowl of salad with tomatoes, feta and greens",
    credit: {
      name: "Taylor Kiser",
      url: "https://unsplash.com/photos/EvoIiaIVRzU",
    },
  },
];
