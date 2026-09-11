import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  max: number;
  /** Product name, used to label the buttons for screen readers. */
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "md";
  /** Focus "+" on mount, so focus isn't lost when this replaces an Add button. */
  autoFocusIncrement?: boolean;
  className?: string;
}

/** At 1, the minus becomes a bin so the last tap clearly removes the item. */
export function QuantityStepper({
  value,
  max,
  label,
  onIncrement,
  onDecrement,
  size = "md",
  autoFocusIncrement = false,
  className,
}: QuantityStepperProps) {
  const isLast = value <= 1;
  const button =
    "press inline-flex h-full items-center justify-center rounded-full hover:bg-white/12 disabled:opacity-35 disabled:pointer-events-none";

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label}`}
      className={cn(
        "inline-flex items-center rounded-full bg-ink text-tin",
        size === "md" ? "h-12 gap-1 px-1" : "h-10 gap-0.5 px-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        aria-label={isLast ? `Remove ${label}` : `One fewer ${label}`}
        className={cn(button, size === "md" ? "w-10" : "w-9")}
      >
        {isLast ? (
          <Trash2 className="size-4" aria-hidden />
        ) : (
          <Minus className="size-4" aria-hidden />
        )}
      </button>
      <output
        aria-live="polite"
        className="min-w-7 text-center font-semibold tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrement}
        disabled={value >= max}
        autoFocus={autoFocusIncrement}
        aria-label={`One more ${label}`}
        className={cn(button, size === "md" ? "w-10" : "w-9")}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
