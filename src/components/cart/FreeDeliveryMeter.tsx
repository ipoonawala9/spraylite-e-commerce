"use client";

import {
  FREE_DELIVERY_THRESHOLD,
  freeDeliveryProgress,
  freeDeliveryRemaining,
} from "@/lib/cart-math";
import { formatINR } from "@/lib/format";
import { m } from "@/lib/motion";

export function FreeDeliveryMeter({ subtotal }: { subtotal: number }) {
  const remaining = freeDeliveryRemaining(subtotal);

  return (
    <div className="rounded-field bg-lite-soft p-4">
      <p className="text-sm" aria-live="polite">
        {remaining > 0 ? (
          <>
            You&apos;re{" "}
            <strong className="tabular-nums">{formatINR(remaining)}</strong>{" "}
            away from free delivery.
          </>
        ) : (
          "Your order ships free."
        )}
      </p>
      <div
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_THRESHOLD}
        aria-valuenow={Math.min(subtotal, FREE_DELIVERY_THRESHOLD)}
        className="mt-2.5 h-2 overflow-hidden rounded-full bg-white"
      >
        <m.div
          className="h-full origin-left rounded-full bg-brand"
          initial={false}
          animate={{ scaleX: freeDeliveryProgress(subtotal) }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        />
      </div>
    </div>
  );
}
