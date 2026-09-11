"use client";

import { categoryFilters } from "@/data/products";
import { cn } from "@/lib/cn";
import { m } from "@/lib/motion";
import type { Category } from "@/types/product";

interface FilterChipsProps {
  value: Category | "all";
  onChange: (value: Category | "all") => void;
  className?: string;
}

export function FilterChips({ value, onChange, className }: FilterChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filter sprays"
      className={cn(
        "-mx-1 no-scrollbar flex gap-2 overflow-x-auto px-1 py-1",
        className,
      )}
    >
      {categoryFilters.map((filter) => {
        const active = filter.id === value;
        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(filter.id)}
            className={cn(
              "relative h-10 shrink-0 press rounded-full px-4 text-sm font-semibold",
              active
                ? "text-tin"
                : "text-ink ring-1 ring-ink/15 ring-inset hover:bg-ink/6",
            )}
          >
            {active && (
              <m.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              />
            )}
            <span className="relative">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
