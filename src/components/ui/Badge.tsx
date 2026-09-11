import type { Product } from "@/types/product";
import { cn } from "@/lib/cn";

const tones: Record<NonNullable<Product["badge"]>, string> = {
  Bestseller: "bg-lite text-ink",
  New: "bg-brand text-white",
  "Gift pick": "bg-ink text-tin",
};

export function Badge({
  children,
  className,
}: {
  children: NonNullable<Product["badge"]>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold",
        tones[children],
        className,
      )}
    >
      {children}
    </span>
  );
}
