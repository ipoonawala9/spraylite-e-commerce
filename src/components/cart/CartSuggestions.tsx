"use client";

import { ProductVisual, tintFor } from "@/components/product/ProductVisual";
import { Button } from "@/components/ui/Button";
import { formatINR } from "@/lib/format";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/product";

/** A short, relevant cross-sell under the cart lines. */
export function CartSuggestions({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="cart-suggestions"
      className="mt-6 border-t border-ink/10 pt-5"
    >
      <h3 id="cart-suggestions" className="text-sm font-semibold">
        Pairs well with
      </h3>
      <ul className="mt-3 space-y-3">
        {products.map((product) => (
          <li key={product.id} className="flex items-center gap-3">
            <div
              className="flex h-16 w-12 shrink-0 items-end justify-center rounded-xl pb-1.5"
              style={{ backgroundColor: tintFor(product) }}
            >
              <div className="flex h-[80%] w-full justify-center">
                <ProductVisual product={product} detail="simple" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm leading-snug font-semibold">
                {product.name}
              </p>
              <p className="type-small text-ink-soft tabular-nums">
                {formatINR(product.price)}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              aria-label={`Add ${product.shortName}`}
              onClick={() => useCart.getState().add(product.id)}
            >
              Add
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
