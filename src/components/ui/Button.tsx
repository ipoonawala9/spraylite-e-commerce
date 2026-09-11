import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "lite" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-deep",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-tin",
  lite: "bg-lite text-ink hover:bg-ink hover:text-lite",
  ghost: "text-ink hover:bg-ink/8",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** Shared so links can look like buttons without nesting a <button> in an <a>. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleProps = {}) {
  return cn(
    "press inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-45",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyleProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
