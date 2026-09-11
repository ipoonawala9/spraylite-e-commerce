"use client";

import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Tin } from "@/components/product/Tin";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { getProduct, productsById } from "@/data/products";
import {
  cartCount,
  cartSavings,
  cartSubtotal,
  deliveryFee,
} from "@/lib/cart-math";
import { suggestFor } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { scrollToSection } from "@/lib/shop-actions";
import { type RemovedLine, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import type { ProductId } from "@/types/product";
import { CartLineItem } from "./CartLineItem";
import { CartSuggestions } from "./CartSuggestions";
import { EmptyState } from "./EmptyState";
import { FreeDeliveryMeter } from "./FreeDeliveryMeter";
import { Notice } from "./Notice";

export function CartSheet() {
  const open = useUI((state) => state.panel === "cart");
  const closePanel = useUI((state) => state.closePanel);
  const items = useCart((state) => state.items);
  const [removed, setRemoved] = useState<RemovedLine | null>(null);
  const [showCheckoutNote, setShowCheckoutNote] = useState(false);

  useEffect(() => {
    if (!removed) return;
    const timer = window.setTimeout(() => setRemoved(null), 6000);
    return () => window.clearTimeout(timer);
  }, [removed]);

  const close = () => {
    setRemoved(null);
    setShowCheckoutNote(false);
    closePanel();
  };

  const remove = (id: ProductId) => {
    const line = useCart.getState().remove(id);
    if (line) setRemoved(line);
  };

  const undo = () => {
    if (removed) useCart.getState().restore(removed);
    setRemoved(null);
  };

  const count = cartCount(items);
  const subtotal = cartSubtotal(items);
  const delivery = deliveryFee(subtotal);
  const natural = productsById.natural;

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Your cart"
      description={
        count > 0 ? `${count} ${count === 1 ? "item" : "items"}` : undefined
      }
      footer={
        items.length > 0 ? (
          <CartSummary
            subtotal={subtotal}
            savings={cartSavings(items)}
            delivery={delivery}
            showNote={showCheckoutNote}
            onCheckout={() => setShowCheckoutNote(true)}
          />
        ) : undefined
      }
    >
      {removed && (
        <Notice
          message={`Removed ${getProduct(removed.item.id)?.shortName ?? "item"}.`}
          actionLabel="Undo"
          onAction={undo}
        />
      )}

      {items.length === 0 ? (
        <EmptyState
          visual={
            <Tin
              capColor={natural.capColor}
              label={natural.shortName}
              detail="simple"
              className="h-36 w-auto"
            />
          }
          title="Your cart is empty"
          body="Start with Natural, our everyday spray."
          action={
            <div className="mx-auto flex max-w-60 flex-col items-stretch gap-2">
              <AddToCartButton product={natural} notify={false} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  close();
                  window.setTimeout(() => scrollToSection("#shop"), 60);
                }}
              >
                Browse all sprays
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <FreeDeliveryMeter subtotal={subtotal} />
          <ul className="mt-2 divide-y divide-ink/10">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onRemove={remove} />
              ))}
            </AnimatePresence>
          </ul>
          <CartSuggestions products={suggestFor(items)} />
        </>
      )}
    </Sheet>
  );
}

interface CartSummaryProps {
  subtotal: number;
  savings: number;
  delivery: number;
  showNote: boolean;
  onCheckout: () => void;
}

function CartSummary({
  subtotal,
  savings,
  delivery,
  showNote,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div>
      <dl className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-soft">Subtotal</dt>
          <dd className="tabular-nums">{formatINR(subtotal)}</dd>
        </div>
        {savings > 0 && (
          <div className="flex justify-between font-semibold text-brand">
            <dt>You save</dt>
            <dd className="tabular-nums">{formatINR(savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd className="tabular-nums">
            {delivery === 0 ? "Free" : formatINR(delivery)}
          </dd>
        </div>
      </dl>
      <div className="mt-3 flex items-baseline justify-between border-t border-ink/10 pt-3">
        <span className="font-semibold">Total</span>
        <span className="text-2xl font-semibold tabular-nums">
          {formatINR(subtotal + delivery)}
        </span>
      </div>
      <Button size="lg" className="mt-4 w-full" onClick={onCheckout}>
        Go to checkout
      </Button>
      {showNote && (
        <p role="status" className="mt-3 text-center type-small text-ink-soft">
          Checkout isn&apos;t part of this demo. Your cart stays saved on this
          device.
        </p>
      )}
    </div>
  );
}
