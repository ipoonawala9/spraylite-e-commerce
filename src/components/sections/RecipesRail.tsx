"use client";

import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { productsById } from "@/data/products";
import { recipes } from "@/data/recipes";
import { addToCart } from "@/lib/shop-actions";

export function RecipesRail() {
  const railRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setEdges({
      atStart: rail.scrollLeft <= 4,
      atEnd: rail.scrollLeft >= max - 4,
    });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    rail.addEventListener("scroll", measure, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const scroll = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : rail.clientWidth * 0.8;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    rail.scrollBy({
      left: direction * step,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="recipes"
      aria-labelledby="recipes-title"
      className="py-20 lg:py-28"
    >
      <div className="page-x flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 id="recipes-title" className="type-h2">
            Cook with it
          </h2>
          <p className="mt-3 max-w-[46ch] text-lg text-ink-soft">
            Five everyday dishes, each started with a one-second spray.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <IconButton
            label="Previous recipes"
            disabled={edges.atStart}
            onClick={() => scroll(-1)}
            className="ring-1 ring-ink/15 ring-inset"
          >
            <ChevronLeft aria-hidden className="size-5" />
          </IconButton>
          <IconButton
            label="Next recipes"
            disabled={edges.atEnd}
            onClick={() => scroll(1)}
            className="ring-1 ring-ink/15 ring-inset"
          >
            <ChevronRight aria-hidden className="size-5" />
          </IconButton>
        </div>
      </div>

      <ul
        ref={railRef}
        className="mt-10 no-scrollbar flex snap-x snap-mandatory rail-pad gap-4 overflow-x-auto pb-2"
      >
        {recipes.map((recipe) => {
          const product = productsById[recipe.productId];
          return (
            <li
              key={recipe.id}
              className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-2rem)/2.4)] lg:w-[calc((100%-3rem)/4)]"
            >
              <article className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-panel bg-aluminium-deep">
                  <Image
                    src={recipe.image}
                    alt={recipe.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 20rem, (min-width: 640px) 42vw, 78vw"
                    className="object-cover transition-transform duration-700 ease-out-soft motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 flex items-center gap-1.5 type-small text-ink-soft">
                  <Clock aria-hidden className="size-4" />
                  {recipe.minutes} min
                </p>
                <h3 className="mt-1 type-h3">{recipe.title}</h3>
                <p className="mt-1 type-small text-ink-soft">{recipe.note}</p>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-4 inline-flex h-10 press items-center gap-2 rounded-full bg-tin pr-4 pl-2 text-sm font-semibold ring-1 ring-ink/15 ring-inset hover:bg-white"
                >
                  <span
                    aria-hidden
                    className="size-6 rounded-full shadow-[inset_0_-2px_4px_rgb(0_0_0/0.25)]"
                    style={{
                      background: `radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.55), transparent 45%), ${product.capColor}`,
                    }}
                  />
                  Add {product.shortName}
                </button>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
