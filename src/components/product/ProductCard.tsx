"use client";

import { Badge } from "@/components/ui/Badge";
import { useUI } from "@/store/ui";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./AddToCartButton";
import { PriceTag } from "./PriceTag";
import { ProductVisual, tintFor } from "./ProductVisual";
import { Rating } from "./Rating";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({ product }: { product: Product }) {
  const openQuickView = useUI((state) => state.openQuickView);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
        {/* Mouse shortcut to quick view; the product name is the keyboard route. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => openQuickView(product.id)}
          className="relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-panel"
          style={{ backgroundColor: tintFor(product) }}
        >
          <span className="absolute inset-x-0 top-[13%] bottom-[7%] flex justify-center transition-transform duration-500 ease-out-soft motion-safe:group-hover:-translate-y-1.5">
            <ProductVisual product={product} />
          </span>
        </button>
        {product.badge && (
          <Badge className="pointer-events-none absolute top-3 left-3">
            {product.badge}
          </Badge>
        )}
        <WishlistButton product={product} className="absolute top-2 right-2" />
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        <Rating rating={product.rating} count={product.reviewCount} />
        <h3 className="font-display text-[1.0625rem] leading-snug font-bold sm:text-lg">
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            className="rounded-sm text-left decoration-2 underline-offset-4 hover:underline"
          >
            {product.name}
          </button>
        </h3>
        <p className="line-clamp-2 type-small text-ink-soft">{product.blurb}</p>
        <div className="mt-auto pt-2">
          <PriceTag price={product.price} mrp={product.mrp} />
          <p className="type-small text-ink-soft">{product.size}</p>
        </div>
        <AddToCartButton product={product} size="sm" className="mt-2" />
      </div>
    </article>
  );
}
