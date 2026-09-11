"use client";

import { useReducedMotion } from "motion/react";
import { type RefObject, useEffect, useRef } from "react";
import { NOZZLE, TIN_VIEWBOX } from "@/components/product/Tin";
import { whenIdle } from "@/lib/idle";
import { MistEngine } from "./mist-engine";

interface MistCanvasProps {
  /** Oil colour for new droplets. */
  tint: string;
  /** The hero: pointer events are read here and the canvas covers it. */
  stageRef: RefObject<HTMLElement | null>;
  /** Wrapper around the tin; the engine tilts it and fires from its nozzle. */
  tinRef: RefObject<HTMLElement | null>;
}

const INTERACTIVE = "a, button, input, select, textarea, label, [role='radio']";

export function MistCanvas({ tint, stageRef, tinRef }: MistCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<MistEngine | null>(null);
  const tintRef = useRef(tint);
  const lastTint = useRef(tint);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const tin = tinRef.current;
    if (!canvas || !stage || !tin) return;

    const boot = () => {
      const engine = new MistEngine(canvas);
      engineRef.current = engine;
      engine.setTint(tintRef.current);
      engine.onTilt = (radians) => {
        tin.style.transform = `rotate(${radians}rad)`;
      };

      const measure = () => {
        // Measure the tin upright; the engine applies its own tilt.
        const tilt = tin.style.transform;
        tin.style.transform = "none";
        const s = stage.getBoundingClientRect();
        const t = tin.getBoundingClientRect();
        tin.style.transform = tilt;

        engine.resize(
          s.width,
          s.height,
          Math.min(window.devicePixelRatio || 1, 2),
        );
        const left = t.left - s.left;
        const top = t.top - s.top;
        const pivotX = left + t.width / 2;
        const pivotY = top + t.height;
        engine.setGeometry({
          pivotX,
          pivotY,
          nozzleDX: left + (NOZZLE.x / TIN_VIEWBOX.width) * t.width - pivotX,
          nozzleDY: top + (NOZZLE.y / TIN_VIEWBOX.height) * t.height - pivotY,
        });
        if (reduced) engine.renderStill();
      };
      measure();
      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(stage);

      // Only animate while the hero is on screen and the tab is visible.
      let inView = true;
      let pageVisible = document.visibilityState === "visible";
      const syncVisibility = () => engine.setVisible(inView && pageVisible);
      const intersection = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncVisibility();
      });
      intersection.observe(stage);
      const onVisibility = () => {
        pageVisible = document.visibilityState === "visible";
        syncVisibility();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const teardown = () => {
        resizeObserver.disconnect();
        intersection.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        engine.destroy();
        engineRef.current = null;
      };
      if (reduced) return teardown;

      const toLocal = (event: PointerEvent) => {
        const s = stage.getBoundingClientRect();
        return [event.clientX - s.left, event.clientY - s.top] as const;
      };
      const onMove = (event: PointerEvent) => {
        const [x, y] = toLocal(event);
        engine.pointerMove(x, y, event.timeStamp);
      };
      const onDown = (event: PointerEvent) => {
        if ((event.target as Element).closest(INTERACTIVE)) return;
        onMove(event);
        engine.pulse();
        engine.hold(true);
      };
      const onUp = () => engine.hold(false);
      const onLeave = () => {
        engine.pointerLeave();
        engine.hold(false);
      };

      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointerleave", onLeave);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);

      // The page's one unprompted moment: a sweep of spray across the headline.
      const intro = window.setTimeout(
        () => engine.sweepAcross(-0.12, 0.24, 0.9),
        250,
      );

      return () => {
        window.clearTimeout(intro);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        teardown();
      };
    };

    // The mist is decoration: start it once the page is interactive, so it
    // never competes with first paint or hydration.
    let teardown: (() => void) | undefined;
    const cancelBoot = whenIdle(() => {
      teardown = boot();
    }, 1500);

    return () => {
      cancelBoot();
      teardown?.();
    };
  }, [reduced, stageRef, tinRef]);

  useEffect(() => {
    tintRef.current = tint;
    const engine = engineRef.current;
    if (!engine || tint === lastTint.current) return;
    lastTint.current = tint;
    engine.setTint(tint);
    // Choosing a flavour answers with a short puff in that oil's colour.
    if (reduced) engine.renderStill();
    else engine.pulse(0.35);
  }, [tint, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 size-full"
    />
  );
}
