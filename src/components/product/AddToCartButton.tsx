"use client";

import { ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/cn";
import { addToCart, removeFromCart } from "@/lib/shop-actions";
import { MAX_QTY, useCart } from "@/store/cart";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  size?: "sm" | "md";
  notify?: boolean;
  className?: string;
}

/**
 * "Add to cart" that turns into a quantity stepper once the product is in the
 * cart. Focus follows the swap so keyboard users don't lose their place.
 */
export function AddToCartButton({
  product,
  size = "md",
  notify = true,
  className,
}: AddToCartButtonProps) {
  const qty = useCart(
    (state) => state.items.find((item) => item.id === product.id)?.qty ?? 0,
  );
  const [focusAfterSwap, setFocusAfterSwap] = useState<
    "add" | "stepper" | null
  >(null);

  if (qty > 0) {
    return (
      <QuantityStepper
        value={qty}
        max={MAX_QTY}
        label={product.shortName}
        size={size}
        autoFocusIncrement={focusAfterSwap === "stepper"}
        onIncrement={() => useCart.getState().increment(product.id)}
        onDecrement={() => {
          if (qty > 1) return useCart.getState().decrement(product.id);
          setFocusAfterSwap("add");
          removeFromCart(product, notify);
        }}
        className={cn("w-full justify-between", className)}
      />
    );
  }

  return (
    <Button
      size={size}
      autoFocus={focusAfterSwap === "add"}
      className={cn("w-full", className)}
      onClick={() => {
        setFocusAfterSwap("stepper");
        addToCart(product, notify);
      }}
    >
      <ShoppingBag aria-hidden className="size-4" />
      Add to cart
    </Button>
  );
}
