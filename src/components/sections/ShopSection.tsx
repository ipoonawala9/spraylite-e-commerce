"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useMemo, useState } from "react";
import { FilterChips } from "@/components/product/FilterChips";
import { ProductCard } from "@/components/product/ProductCard";
import { categoryFilters, products } from "@/data/products";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-math";
import {
  type SortKey,
  filterProducts,
  sortOptions,
  sortProducts,
} from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { m } from "@/lib/motion";
import type { Category } from "@/types/product";

export function ShopSection() {
  const [category, setCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const visible = useMemo(
    () => sortProducts(filterProducts(products, category), sort),
    [category, sort],
  );
  const categoryLabel = categoryFilters.find((f) => f.id === category)?.label;

  return (
    <section
      id="shop"
      aria-labelledby="shop-title"
      className="page-x py-20 lg:py-28"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <h2 id="shop-title" className="type-h2">
            Shop the range
          </h2>
          <p className="mt-3 max-w-[50ch] text-lg text-ink-soft">
            Seven flavours in 175 g tins, plus two bundles that save more. Free
            delivery over {formatINR(FREE_DELIVERY_THRESHOLD)}.
          </p>
        </div>
        <label className="flex items-center gap-3 type-small text-ink-soft">
          Sort by
          <span className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="h-10 cursor-pointer appearance-none rounded-full bg-tin pr-10 pl-4 text-sm font-semibold text-ink ring-1 ring-ink/15 ring-inset"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink"
            />
          </span>
        </label>
      </div>

      <FilterChips value={category} onChange={setCategory} className="mt-8" />
      <p aria-live="polite" className="sr-only">
        {category === "all"
          ? `Showing all ${visible.length} products`
          : `Showing ${visible.length} in ${categoryLabel}`}
      </p>

      <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((product) => (
            <m.li
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            >
              <ProductCard product={product} />
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
