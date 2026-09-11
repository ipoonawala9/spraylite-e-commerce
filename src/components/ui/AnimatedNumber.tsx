"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Critically damped spring with a 0.6 s response. */
const OMEGA = (2 * Math.PI) / 0.6;

interface AnimatedNumberProps {
  value: number;
  /** Must be a stable function (a module-level formatter), not an inline arrow. */
  format: (value: number) => string;
  className?: string;
}

/**
 * Counts to a new value on a spring. It carries its velocity into the next
 * change, so dragging a slider feels continuous rather than restarting. Writes
 * text directly instead of re-rendering React each frame. Visual only: pair it
 * with a screen-reader value.
 */
export function AnimatedNumber({
  value,
  format,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const velocity = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      shown.current = value;
      velocity.current = 0;
      el.textContent = format(value);
      return;
    }

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      const acceleration =
        OMEGA * OMEGA * (value - shown.current) - 2 * OMEGA * velocity.current;
      velocity.current += acceleration * dt;
      shown.current += velocity.current * dt;

      if (
        Math.abs(value - shown.current) < 0.5 &&
        Math.abs(velocity.current) < 0.5
      ) {
        shown.current = value;
        velocity.current = 0;
        el.textContent = format(value);
        return;
      }
      el.textContent = format(Math.round(shown.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduce, format]);

  return (
    <span ref={ref} aria-hidden className={className}>
      {format(value)}
    </span>
  );
}
