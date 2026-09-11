"use client";

import { ProductVisual, tintFor } from "@/components/product/ProductVisual";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { getProduct } from "@/data/products";
import { formatINR } from "@/lib/format";
import { m } from "@/lib/motion";
import { MAX_QTY, useCart } from "@/store/cart";
import type { CartItem, ProductId } from "@/types/product";

interface CartLineItemProps {
  item: CartItem;
  onRemove: (id: ProductId) => void;
}

export function CartLineItem({ item, onRemove }: CartLineItemProps) {
  const product = getProduct(item.id);
  if (!product) return null;

  return (
    <m.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      className="flex gap-4 overflow-hidden py-4"
    >
      <div
        className="flex h-24 w-20 shrink-0 items-end justify-center rounded-2xl pb-2"
        style={{ backgroundColor: tintFor(product) }}
      >
        <div className="flex h-[80%] w-full justify-center px-1">
          <ProductVisual product={product} detail="simple" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <p className="leading-snug font-semibold">{product.name}</p>
          <p className="font-semibold tabular-nums">
            {formatINR(product.price * item.qty)}
          </p>
        </div>
        <p className="type-small text-ink-soft">
          {product.size}
          {item.qty > 1 && `, ${formatINR(product.price)} each`}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <QuantityStepper
            size="sm"
            value={item.qty}
            max={MAX_QTY}
            label={product.shortName}
            onIncrement={() => useCart.getState().increment(item.id)}
            onDecrement={() =>
              item.qty === 1
                ? onRemove(item.id)
                : useCart.getState().decrement(item.id)
            }
          />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="rounded-sm type-small text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            Remove <span className="sr-only">{product.shortName}</span>
          </button>
        </div>
      </div>
    </m.li>
  );
}
