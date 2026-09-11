"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

/**
 * Loads the saved cart and wishlist after the first render, so the server
 * HTML and the first client render match. Also keeps other tabs in sync.
 */
export function StoreHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useWishlist.persist.rehydrate();

    const onStorage = (event: StorageEvent) => {
      if (event.key === useCart.persist.getOptions().name)
        useCart.persist.rehydrate();
      if (event.key === useWishlist.persist.getOptions().name)
        useWishlist.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return null;
}
