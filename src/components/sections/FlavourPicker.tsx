"use client";

import { type KeyboardEvent, useRef } from "react";
import { variants } from "@/data/products";
import { m } from "@/lib/motion";
import type { VariantId } from "@/types/product";

interface FlavourPickerProps {
  value: VariantId;
  onChange: (id: VariantId) => void;
}

/** Seven tin caps, seen from above. A radio group: arrow keys move and select. */
export function FlavourPicker({ value, onChange }: FlavourPickerProps) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const current = variants.findIndex((variant) => variant.id === value);

  const select = (index: number) => {
    const next = (index + variants.length) % variants.length;
    onChange(variants[next].id);
    buttons.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: current + 1,
      ArrowDown: current + 1,
      ArrowLeft: current - 1,
      ArrowUp: current - 1,
      Home: 0,
      End: variants.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <div>
      <p id="flavour-label" className="type-small font-semibold">
        Pick a flavour
      </p>
      <div
        role="radiogroup"
        aria-labelledby="flavour-label"
        onKeyDown={onKeyDown}
        className="mt-3 flex flex-wrap gap-2.5"
      >
        {variants.map((variant, index) => {
          const checked = variant.id === value;
          return (
            <button
              key={variant.id}
              ref={(el) => {
                buttons.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={variant.shortName}
              tabIndex={checked ? 0 : -1}
              onClick={() => onChange(variant.id)}
              className="relative grid size-11 press place-items-center rounded-full"
            >
              {checked && (
                <m.span
                  layoutId="flavour-ring"
                  className="absolute -inset-0.5 rounded-full border-2 border-ink"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}
              <span
                className="size-9 rounded-full shadow-[inset_0_-3px_6px_rgb(0_0_0/0.28)]"
                style={{
                  background: `radial-gradient(circle at 34% 30%, rgb(255 255 255 / 0.55), transparent 45%), ${variant.capColor}`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
