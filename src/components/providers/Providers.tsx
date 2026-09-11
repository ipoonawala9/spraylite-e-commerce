"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Motion loads its animation features after first paint, and honours
 * prefers-reduced-motion everywhere: transforms off, fades kept.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
