"use client";

import { Heart, X } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { PriceTag } from "@/components/product/PriceTag";
import { ProductVisual, tintFor } from "@/components/product/ProductVisual";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Sheet } from "@/components/ui/Sheet";
import { getProduct } from "@/data/products";
import { m } from "@/lib/motion";
import { scrollToSection } from "@/lib/shop-actions";
import { useUI } from "@/store/ui";
import { moveToCart, useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";
import { EmptyState } from "./EmptyState";
import { Notice } from "./Notice";

interface NoticeState {
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function WishlistSheet() {
  const open = useUI((state) => state.panel === "wishlist");
  const closePanel = useUI((state) => state.closePanel);
  const openPanel = useUI((state) => state.openPanel);
  const ids = useWishlist((state) => state.ids);
  const [notice, setNotice] = useState<NoticeState | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const close = () => {
    setNotice(null);
    closePanel();
  };

  const showCart = () => {
    setNotice(null);
    openPanel("cart");
  };

  const remove = (product: Product) => {
    const index = useWishlist.getState().ids.indexOf(product.id);
    useWishlist.getState().remove(product.id);
    setNotice({
      message: `Removed ${product.shortName}.`,
      actionLabel: "Undo",
      onAction: () => {
        useWishlist.getState().restore(product.id, index);
        setNotice(null);
      },
    });
  };

  const move = (product: Product) => {
    moveToCart(product.id);
    setNotice({
      message: `Moved ${product.shortName} to your cart.`,
      actionLabel: "View cart",
      onAction: showCart,
    });
  };

  const saved = ids
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product));

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Wishlist"
      description={saved.length > 0 ? `${saved.length} saved` : undefined}
      footer={
        saved.length > 0 ? (
          <Button variant="secondary" className="w-full" onClick={showCart}>
            View cart
          </Button>
        ) : undefined
      }
    >
      {notice && <Notice {...notice} />}

      {saved.length === 0 ? (
        <EmptyState
          visual={
            <span className="grid size-24 place-items-center rounded-full bg-coral/20">
              <Heart aria-hidden className="size-10 text-heart" />
            </span>
          }
          title="Nothing saved yet"
          body="Tap the heart on any spray to keep it here for later."
          action={
            <Button
              onClick={() => {
                close();
                window.setTimeout(() => scrollToSection("#shop"), 60);
              }}
            >
              Browse sprays
            </Button>
          }
        />
      ) : (
        <ul className="divide-y divide-ink/10">
          <AnimatePresence initial={false}>
            {saved.map((product) => (
              <m.li
                key={product.id}
                layout
                exit={{
                  opacity: 0,
                  height: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
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
                  <p className="leading-snug font-semibold">{product.name}</p>
                  <PriceTag
                    price={product.price}
                    mrp={product.mrp}
                    className="mt-0.5"
                  />
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <Button size="sm" onClick={() => move(product)}>
                      Move to cart
                    </Button>
                    <IconButton
                      label={`Remove ${product.shortName} from wishlist`}
                      onClick={() => remove(product)}
                      className="size-10"
                    >
                      <X aria-hidden className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Sheet>
  );
}
