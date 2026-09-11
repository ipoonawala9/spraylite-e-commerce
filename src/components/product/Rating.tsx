import { Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatCount } from "@/lib/format";

interface RatingProps {
  rating: number;
  count: number;
  className?: string;
}

export function Rating({ rating, count, className }: RatingProps) {
  const score = rating.toFixed(1);
  return (
    <p
      className={cn(
        "flex items-center gap-1.5 type-small text-ink-soft",
        className,
      )}
    >
      <Star
        aria-hidden
        className="size-4 fill-lite text-ink"
        strokeWidth={1.5}
      />
      <span aria-hidden>
        <span className="font-semibold text-ink">{score}</span> (
        {formatCount(count)})
      </span>
      <span className="sr-only">
        Rated {score} out of 5 from {formatCount(count)} reviews
      </span>
    </p>
  );
}
