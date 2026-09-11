"use client";

import { useRef, useState } from "react";
import { MistCanvas } from "@/components/mist/MistCanvas";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { PriceTag } from "@/components/product/PriceTag";
import { Tin, TinCap } from "@/components/product/Tin";
import { productsById } from "@/data/products";
import { m } from "@/lib/motion";
import type { VariantId } from "@/types/product";
import { FlavourPicker } from "./FlavourPicker";

export function Hero() {
  const [flavourId, setFlavourId] = useState<VariantId>("natural");
  const flavour = productsById[flavourId];
  const stageRef = useRef<HTMLElement>(null);
  const tinRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={stageRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div className="hero-grid page-x gap-x-12 gap-y-8 pt-10 pb-14 md:pt-14 lg:min-h-[min(50rem,calc(100svh-6.75rem))] lg:pb-16">
        <div className="[grid-area:copy] lg:self-end">
          <h1 id="hero-title" className="type-hero">
            Spray Smart.
            <br />
            Cook Lite.
          </h1>
          <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-ink-soft md:text-xl">
            Precision oil sprays in seven flavours, made in Mumbai. Less oil,
            more control, better taste.
          </p>
        </div>

        <div className="relative flex items-end justify-end pr-[26%] [grid-area:stage] sm:justify-center sm:pr-[10%] lg:items-center lg:justify-end lg:pr-[14%]">
          <div className="relative aspect-[2/5] h-[clamp(15rem,40svh,22rem)] sm:h-[clamp(18rem,44svh,28rem)] lg:h-[clamp(22rem,58svh,36rem)]">
            <m.div
              key={flavourId}
              className="absolute top-[3%] -right-[62%] w-[64%]"
              initial={{ rotate: 26, y: -16 }}
              animate={{ rotate: 15, y: 0 }}
              transition={{ type: "spring", bounce: 0.35, duration: 0.6 }}
            >
              <TinCap
                color={flavour.capColor}
                className="h-auto w-full drop-shadow-[0_12px_14px_rgb(16_50_92/0.2)]"
              />
            </m.div>
            <div ref={tinRef} className="size-full origin-bottom">
              <Tin
                capOff
                capColor={flavour.capColor}
                label={flavour.shortName}
                className="size-full"
              />
            </div>
          </div>
        </div>

        <div className="relative z-20 [grid-area:picker] lg:self-start">
          <FlavourPicker value={flavourId} onChange={setFlavourId} />
          <div className="mt-5 max-w-md" aria-live="polite">
            <p className="font-display text-2xl font-bold tracking-tight">
              {flavour.name}
            </p>
            <p className="mt-1 text-ink-soft">{flavour.blurb}</p>
          </div>
          <div className="mt-5 flex max-w-md flex-wrap items-center gap-x-5 gap-y-3">
            <PriceTag price={flavour.price} mrp={flavour.mrp} size="lg" />
            <AddToCartButton
              product={flavour}
              className="w-auto min-w-44 flex-1"
            />
          </div>
          <p className="mt-6 type-small text-ink-soft">
            <span className="hidden pointer-fine:inline">
              Move your pointer to aim the tin. Press and hold to spray.{" "}
            </span>
            <span className="hidden pointer-coarse:inline">
              Tap near the tin to spray.{" "}
            </span>
            <a
              href="#shop"
              className="font-semibold text-brand underline underline-offset-4"
            >
              See the whole range
            </a>
          </p>
        </div>
      </div>

      <MistCanvas tint={flavour.oilColor} stageRef={stageRef} tinRef={tinRef} />
    </section>
  );
}
