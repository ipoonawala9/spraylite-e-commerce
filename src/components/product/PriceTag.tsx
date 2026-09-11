import { cn } from "@/lib/cn";
import { discountPercent, formatINR } from "@/lib/format";

interface PriceTagProps {
  price: number;
  mrp: number;
  size?: "md" | "lg";
  className?: string;
}

export function PriceTag({
  price,
  mrp,
  size = "md",
  className,
}: PriceTagProps) {
  const off = discountPercent(price, mrp);
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums",
        className,
      )}
    >
      <span
        className={cn(
          "font-semibold text-ink",
          size === "lg" ? "text-2xl" : "text-lg",
        )}
      >
        <span className="sr-only">Price</span> {formatINR(price)}
      </span>
      {off > 0 && (
        <>
          <s className="text-sm text-ink-soft">
            <span className="sr-only">MRP</span> {formatINR(mrp)}
          </s>
          <span className="text-sm font-semibold text-brand">{off}% off</span>
        </>
      )}
    </p>
  );
}
