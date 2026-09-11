import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "@/data/products";
import type { ProductId } from "@/types/product";
import { useCart } from "./cart";

interface WishlistState {
  ids: ProductId[];
  /** Adds or removes a product; returns true if it's now saved. */
  toggle: (id: ProductId) => boolean;
  remove: (id: ProductId) => void;
  /** Puts a product back at its old position (for Undo); ignored if already saved. */
  restore: (id: ProductId, index: number) => void;
  clear: () => void;
}

function sanitize(ids: unknown): ProductId[] {
  if (!Array.isArray(ids)) return [];
  return ids.filter(
    (id): id is ProductId =>
      typeof id === "string" && getProduct(id as ProductId) !== undefined,
  );
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (id) => {
        const saved = get().ids.includes(id);
        set(({ ids }) => ({
          ids: saved ? ids.filter((existing) => existing !== id) : [...ids, id],
        }));
        return !saved;
      },

      remove: (id) =>
        set(({ ids }) => ({ ids: ids.filter((existing) => existing !== id) })),

      restore: (id, index) => {
        const { ids } = get();
        if (ids.includes(id)) return;
        const next = [...ids];
        next.splice(Math.min(index, next.length), 0, id);
        set({ ids: next });
      },

      clear: () => set({ ids: [] }),
    }),
    {
      name: "spraylite-wishlist",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ids: state.ids }),
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        ids: sanitize((persisted as Partial<WishlistState> | undefined)?.ids),
      }),
    },
  ),
);

export function moveToCart(id: ProductId) {
  useCart.getState().add(id);
  useWishlist.getState().remove(id);
}
