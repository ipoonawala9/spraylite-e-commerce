import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

interface IconButtonProps extends ComponentProps<"button"> {
  /** Accessible name; icon-only buttons have no visible text. */
  label: string;
}

export function IconButton({
  label,
  className,
  type = "button",
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "relative inline-flex size-11 shrink-0 press items-center justify-center rounded-full text-ink hover:bg-ink/8",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
