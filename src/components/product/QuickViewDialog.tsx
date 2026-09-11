"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { getProduct, productsById } from "@/data/products";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-math";
import { formatINR } from "@/lib/format";
import { m } from "@/lib/motion";
import { useUI } from "@/store/ui";
import { AddToCartButton } from "./AddToCartButton";
import { PriceTag } from "./PriceTag";
import { ProductVisual, tintFor } from "./ProductVisual";
import { Rating } from "./Rating";
import { WishlistButton } from "./WishlistButton";

/** Product details without leaving the page: a bottom sheet on phones, a dialog on larger screens. */
export function QuickViewDialog() {
  const id = useUI((state) => state.quickViewId);
  const close = useUI((state) => state.closeQuickView);
  const product = id ? getProduct(id) : undefined;
  const reduce = useReducedMotion();
  const hidden = reduce ? { opacity: 0 } : { opacity: 0, y: 32 };
  const open = Boolean(product);

  // Toasts sit above everything; clear them so they don't cover the dialog.
  useEffect(() => {
    if (open) toast.dismiss();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && close()}>
      <AnimatePresence>
        {product && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-ink/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <m.div
                className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-panel bg-tin shadow-sheet outline-none md:inset-x-auto md:top-1/2 md:bottom-auto md:left-1/2 md:w-[min(56rem,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-panel"
                initial={hidden}
                animate={{ opacity: 1, y: 0 }}
                exit={hidden}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              >
                <div className="grid md:grid-cols-2">
                  <div
                    className="relative flex aspect-[5/4] items-end justify-center pb-[8%] md:aspect-auto md:min-h-[32rem]"
                    style={{ backgroundColor: tintFor(product, 18) }}
                  >
                    <div className="h-[76%] w-[80%]">
                      <ProductVisual product={product} className="mx-auto" />
                    </div>
                    {product.badge && (
                      <Badge className="absolute top-5 left-5">
                        {product.badge}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4">
                      <Dialog.Title className="font-display text-[1.875rem] leading-tight font-bold tracking-tight">
                        {product.name}
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <IconButton label="Close" className="-mt-1 -mr-2">
                          <X aria-hidden className="size-5" />
                        </IconButton>
                      </Dialog.Close>
                    </div>

                    <Rating
                      rating={product.rating}
                      count={product.reviewCount}
                    />
                    <PriceTag
                      price={product.price}
                      mrp={product.mrp}
                      size="lg"
                    />
                    <Dialog.Description className="leading-relaxed text-ink-soft">
                      {product.description}
                    </Dialog.Description>

                    {product.includes && (
                      <p className="type-small">
                        <span className="font-semibold">Inside: </span>
                        {product.includes
                          .map((v) => productsById[v].shortName)
                          .join(", ")}
                      </p>
                    )}

                    <div>
                      <h3 className="type-small font-semibold">Good for</h3>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {product.uses.map((use) => (
                          <li
                            key={use}
                            className="rounded-full bg-aluminium px-3 py-1 type-small"
                          >
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="type-small text-ink-soft">
                      {product.size}. Free delivery on orders over{" "}
                      {formatINR(FREE_DELIVERY_THRESHOLD)}.
                    </p>

                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <AddToCartButton
                        product={product}
                        notify={false}
                        className="flex-1"
                      />
                      <WishlistButton
                        product={product}
                        notify={false}
                        className="size-12 ring-1 ring-ink/15 ring-inset"
                      />
                    </div>
                  </div>
                </div>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
