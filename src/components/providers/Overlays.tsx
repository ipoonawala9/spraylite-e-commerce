"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { whenIdle } from "@/lib/idle";
import { useUI } from "@/store/ui";

const CartSheet = dynamic(
  () => import("@/components/cart/CartSheet").then((m) => m.CartSheet),
  {
    ssr: false,
  },
);
const WishlistSheet = dynamic(
  () => import("@/components/cart/WishlistSheet").then((m) => m.WishlistSheet),
  { ssr: false },
);
const QuickViewDialog = dynamic(
  () =>
    import("@/components/product/QuickViewDialog").then(
      (m) => m.QuickViewDialog,
    ),
  { ssr: false },
);
const MobileMenu = dynamic(
  () => import("@/components/layout/MobileMenu").then((m) => m.MobileMenu),
  {
    ssr: false,
  },
);

/**
 * Sheets and dialogs aren't needed for first paint. They load when the
 * browser is idle, or straight away if someone opens one before then.
 */
export function Overlays() {
  const requested = useUI(
    (state) => state.panel !== null || state.quickViewId !== null,
  );
  const [idle, setIdle] = useState(false);

  useEffect(() => whenIdle(() => setIdle(true), 4000, 2500), []);

  if (!idle && !requested) return null;

  return (
    <>
      <CartSheet />
      <WishlistSheet />
      <QuickViewDialog />
      <MobileMenu />
    </>
  );
}
