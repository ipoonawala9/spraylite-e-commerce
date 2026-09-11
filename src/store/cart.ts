import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct } from "@/data/products";
import type { CartItem, ProductId } from "@/types/product";

/** Per-line limit, like a real store's stock cap. */
export const MAX_QTY = 10;

export interface RemovedLine {
  item: CartItem;
  index: number;
}

interface CartState {
  items: CartItem[];
  add: (id: ProductId, qty?: number) => void;
  setQty: (id: ProductId, qty: number) => void;
  increment: (id: ProductId) => void;
  decrement: (id: ProductId) => void;
  /** Removes a line and returns it with its position, for Undo. */
  remove: (id: ProductId) => RemovedLine | undefined;
  restore: (line: RemovedLine) => void;
  clear: () => void;
}

const clampQty = (qty: number) =>
  Math.min(MAX_QTY, Math.max(0, Math.floor(qty)));

/** Drops anything in storage that isn't a valid line for today's catalogue. */
function sanitize(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter(
      (item): item is CartItem =>
        typeof item?.id === "string" &&
        getProduct(item.id) !== undefined &&
        Number.isFinite(item.qty) &&
        item.qty > 0,
    )
    .map((item) => ({ id: item.id, qty: clampQty(item.qty) }));
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add: (id, qty = 1) =>
        set(({ items }) => {
          const existing = items.find((item) => item.id === id);
          if (!existing)
            return { items: [...items, { id, qty: clampQty(qty) }] };
          return {
            items: items.map((item) =>
              item.id === id
                ? { ...item, qty: clampQty(item.qty + qty) }
                : item,
            ),
          };
        }),

      setQty: (id, qty) =>
        set(({ items }) => {
          const next = clampQty(qty);
          return {
            items:
              next === 0
                ? items.filter((item) => item.id !== id)
                : items.map((item) =>
                    item.id === id ? { ...item, qty: next } : item,
                  ),
          };
        }),

      increment: (id) => get().add(id, 1),

      decrement: (id) => {
        const line = get().items.find((item) => item.id === id);
        if (line) get().setQty(id, line.qty - 1);
      },

      remove: (id) => {
        const { items } = get();
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return undefined;
        set({ items: items.filter((item) => item.id !== id) });
        return { item: items[index], index };
      },

      restore: ({ item, index }) => {
        const { items } = get();
        if (items.some((existing) => existing.id === item.id)) return;
        const next = [...items];
        next.splice(Math.min(index, next.length), 0, item);
        set({ items: next });
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "spraylite-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Rehydrated after mount by <StoreHydrator /> so server and client HTML match.
      skipHydration: true,
      merge: (persisted, current) => ({
        ...current,
        items: sanitize((persisted as Partial<CartState> | undefined)?.items),
      }),
    },
  ),
);
