/** Small, dependency-free maths for the mist: seeded randomness and noise. */

export type Rng = () => number;

/** mulberry32: fast seeded PRNG. Same seed, same sequence, every time. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal sample (Box–Muller). */
export function gaussian(rng: Rng) {
  let u = 0;
  while (u === 0) u = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function grad(hash: number, x: number, y: number) {
  switch (hash & 7) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    case 3:
      return -x - y;
    case 4:
      return x;
    case 5:
      return -x;
    case 6:
      return y;
    default:
      return -y;
  }
}

/** Seeded 2D gradient (Perlin) noise, roughly in [-1, 1]. */
export function createNoise2D(rng: Rng) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  return (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const X = xi & 255;
    const Y = yi & 255;
    const xf = x - xi;
    const yf = y - yi;
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    const top = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const bottom = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return lerp(top, bottom, v);
  };
}

/** Wraps an angle into [-π, π). */
export function wrapAngle(angle: number) {
  const twoPi = Math.PI * 2;
  const wrapped = (((angle + Math.PI) % twoPi) + twoPi) % twoPi;
  return wrapped - Math.PI;
}

/**
 * Aim relative to straight left (the way the nozzle faces), clamped to
 * ±limit radians. Positive is up-left. Returns null when the point is
 * behind the can, so the aim holds instead of flipping sides.
 */
export function aimToward(dx: number, dy: number, limit: number) {
  const relative = wrapAngle(Math.atan2(dy, dx) - Math.PI);
  if (Math.abs(relative) > Math.PI / 2) return null;
  return Math.max(-limit, Math.min(limit, relative));
}

export function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.replace("#", ""), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
