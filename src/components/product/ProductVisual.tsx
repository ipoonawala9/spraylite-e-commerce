import { productsById } from "@/data/products";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";
import { Tin } from "./Tin";

interface ProductVisualProps {
  product: Product;
  detail?: "full" | "simple";
  className?: string;
}

/** A single tin, or a bundle's tins lined up like the shelf shot, tallest in the middle. */
export function ProductVisual({
  product,
  detail = "full",
  className,
}: ProductVisualProps) {
  if (!product.includes) {
    return (
      <Tin
        capColor={product.capColor}
        label={product.shortName}
        detail={detail}
        className={cn("h-full w-auto", className)}
      />
    );
  }

  const ids = product.includes;
  const count = ids.length;
  // Share of each tin left showing where it overlaps its neighbour.
  const showing = count > 3 ? 0.42 : 0.62;
  const width = 100 / (1 + (count - 1) * showing);
  const middle = (count - 1) / 2;

  return (
    <div
      aria-hidden
      className={cn("flex h-full w-full items-end justify-center", className)}
    >
      {ids.map((id, i) => {
        const variant = productsById[id];
        const depth = Math.abs(i - middle);
        return (
          <div
            key={id}
            className="relative origin-bottom"
            style={{
              width: `${width}%`,
              marginLeft: i === 0 ? 0 : `-${width * (1 - showing)}%`,
              zIndex: count - Math.round(depth * 2),
              transform: `scale(${1 - depth * (count > 3 ? 0.07 : 0.1)})`,
            }}
          >
            <Tin
              capColor={variant.capColor}
              label={variant.shortName}
              detail="simple"
              className="h-auto w-full"
            />
          </div>
        );
      })}
    </div>
  );
}

/** The product's cap colour, washed out over tin white, for panels behind a tin. */
export function tintFor(product: Product, strength = 14) {
  return `color-mix(in oklab, ${product.capColor} ${strength}%, var(--color-tin))`;
}
