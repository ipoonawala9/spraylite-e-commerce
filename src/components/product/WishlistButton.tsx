"use client";

import { Heart } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import { m } from "@/lib/motion";
import { toggleWishlist } from "@/lib/shop-actions";
import { useWishlist } from "@/store/wishlist";
import type { Product } from "@/types/product";

interface WishlistButtonProps {
  product: Product;
  notify?: boolean;
  className?: string;
}

export function WishlistButton({
  product,
  notify = true,
  className,
}: WishlistButtonProps) {
  const saved = useWishlist((state) => state.ids.includes(product.id));

  return (
    <IconButton
      label={`Save ${product.shortName} to wishlist`}
      aria-pressed={saved}
      onClick={() => toggleWishlist(product, notify)}
      className={cn("bg-tin/85 hover:bg-tin", className)}
    >
      <m.span
        className="inline-flex"
        initial={false}
        animate={{ scale: saved ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Heart
          aria-hidden
          strokeWidth={2}
          className={cn(
            "size-5 transition-colors",
            saved ? "fill-heart text-heart" : "text-ink",
          )}
        />
      </m.span>
    </IconButton>
  );
}
