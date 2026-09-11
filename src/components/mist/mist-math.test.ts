import { describe, expect, it } from "vitest";
import {
  aimToward,
  createNoise2D,
  gaussian,
  hexToRgb,
  mulberry32,
  wrapAngle,
} from "./mist-math";

describe("mulberry32", () => {
  it("repeats exactly for the same seed", () => {
    const a = mulberry32(175);
    const b = mulberry32(175);
    const first = Array.from({ length: 5 }, a);
    expect(Array.from({ length: 5 }, b)).toEqual(first);
  });

  it("differs between seeds and stays in [0, 1)", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toBe(b);
    const rng = mulberry32(9);
    for (let i = 0; i < 1000; i++) {
      const n = rng();
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe("gaussian", () => {
  it("centres on zero with unit spread", () => {
    const rng = mulberry32(42);
    const samples = Array.from({ length: 20000 }, () => gaussian(rng));
    const mean = samples.reduce((s, x) => s + x, 0) / samples.length;
    const variance =
      samples.reduce((s, x) => s + (x - mean) ** 2, 0) / samples.length;
    expect(Math.abs(mean)).toBeLessThan(0.03);
    expect(Math.abs(variance - 1)).toBeLessThan(0.05);
  });
});

describe("createNoise2D", () => {
  it("is deterministic per seed and bounded", () => {
    const a = createNoise2D(mulberry32(7));
    const b = createNoise2D(mulberry32(7));
    for (let i = 0; i < 200; i++) {
      const x = i * 0.37;
      const y = i * 0.11;
      expect(a(x, y)).toBe(b(x, y));
      expect(Math.abs(a(x, y))).toBeLessThanOrEqual(1.5);
    }
  });
});

describe("aimToward", () => {
  it("is zero when the point is straight ahead of the nozzle", () => {
    expect(aimToward(-100, 0, 0.9)).toBeCloseTo(0);
  });

  it("is positive up-left and negative down-left", () => {
    expect(aimToward(-100, -100, 0.9)).toBeCloseTo(Math.PI / 4);
    expect(aimToward(-100, 100, 0.9)).toBeCloseTo(-Math.PI / 4);
  });

  it("clamps to the limit", () => {
    expect(aimToward(-10, -100, 0.5)).toBe(0.5);
  });

  it("returns null when the point is behind the can", () => {
    expect(aimToward(100, 0, 0.9)).toBeNull();
    expect(aimToward(50, -40, 0.9)).toBeNull();
  });
});

describe("helpers", () => {
  it("wraps angles into [-π, π)", () => {
    expect(wrapAngle(3 * Math.PI)).toBeCloseTo(-Math.PI);
    expect(wrapAngle(Math.PI / 2 + 4 * Math.PI)).toBeCloseTo(Math.PI / 2);
  });

  it("parses hex colours", () => {
    expect(hexToRgb("#E8C766")).toEqual([232, 199, 102]);
  });
});
