import { toast } from "sonner";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";

/**
 * Store actions with feedback for the page. Overlays (sheets, dialogs) pass
 * notify: false and show feedback inline instead, since a modal makes the
 * rest of the page, toasts included, inert.
 */

export function addToCart(product: Product, notify = true) {
  useCart.getState().add(product.id);
  if (!notify) return;
  toast(`Added ${product.shortName} to your cart`, {
    action: {
      label: "View cart",
      onClick: () => useUI.getState().openPanel("cart"),
    },
  });
}

export function removeFromCart(product: Product, notify = true) {
  const removed = useCart.getState().remove(product.id);
  if (!removed || !notify) return;
  toast(`Removed ${product.shortName} from your cart`, {
    action: {
      label: "Undo",
      onClick: () => useCart.getState().restore(removed),
    },
  });
}

export function toggleWishlist(product: Product, notify = true) {
  const saved = useWishlist.getState().toggle(product.id);
  if (!notify) return;
  toast(
    saved
      ? `Saved ${product.shortName} to your wishlist`
      : `Removed ${product.shortName} from your wishlist`,
    {
      action: saved
        ? {
            label: "View",
            onClick: () => useUI.getState().openPanel("wishlist"),
          }
        : {
            label: "Undo",
            onClick: () => useWishlist.getState().toggle(product.id),
          },
    },
  );
}

/** Scroll to an in-page section, respecting reduced motion. */
export function scrollToSection(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });
  history.replaceState(null, "", hash);
}
