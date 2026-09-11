import { getProduct } from "@/data/products";
import type { CartItem, PriceLookup } from "@/types/product";

export const FREE_DELIVERY_THRESHOLD = 499;
export const DELIVERY_FEE = 49;

const catalogue: PriceLookup = (id) => getProduct(id);

function total(items: CartItem[], lookup: PriceLookup, field: "price" | "mrp") {
  return items.reduce((sum, item) => {
    const product = lookup(item.id);
    return product ? sum + product[field] * item.qty : sum;
  }, 0);
}

/** Number of units in the cart (two tins of Natural count as two). */
export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartSubtotal(items: CartItem[], lookup = catalogue) {
  return total(items, lookup, "price");
}

export function cartMrpTotal(items: CartItem[], lookup = catalogue) {
  return total(items, lookup, "mrp");
}

export function cartSavings(items: CartItem[], lookup = catalogue) {
  return cartMrpTotal(items, lookup) - cartSubtotal(items, lookup);
}

export function deliveryFee(subtotal: number) {
  if (subtotal <= 0 || subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
}

export function freeDeliveryRemaining(subtotal: number) {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
}

/** 0 to 1, for the free-delivery meter. */
export function freeDeliveryProgress(subtotal: number) {
  return Math.min(1, Math.max(0, subtotal / FREE_DELIVERY_THRESHOLD));
}
