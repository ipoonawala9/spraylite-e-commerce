import { create } from "zustand";
import type { ProductId } from "@/types/product";

export type Panel = "cart" | "wishlist" | "menu";

interface UIState {
  panel: Panel | null;
  quickViewId: ProductId | null;
  openPanel: (panel: Panel) => void;
  closePanel: () => void;
  openQuickView: (id: ProductId) => void;
  closeQuickView: () => void;
}

/** Which overlay is open. Only one panel or dialog shows at a time. */
export const useUI = create<UIState>()((set) => ({
  panel: null,
  quickViewId: null,
  openPanel: (panel) => set({ panel, quickViewId: null }),
  closePanel: () => set({ panel: null }),
  openQuickView: (id) => set({ quickViewId: id, panel: null }),
  closeQuickView: () => set({ quickViewId: null }),
}));
