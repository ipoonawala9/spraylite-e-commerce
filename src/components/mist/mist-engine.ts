import {
  aimToward,
  createNoise2D,
  gaussian,
  hexToRgb,
  mulberry32,
  type Rng,
} from "./mist-math";

/**
 * A seeded aerosol plume for the hero. How it works and what each setting
 * does is written up in docs/design/mist.md.
 */
export interface MistSettings {
  seed: number;
  /** Upper bound on live particles; scaled down on small canvases. */
  budget: number;
  coneDeg: number;
  /** Initial droplet speed, px/s. */
  speed: number;
  /** Speed lost per second, divided by relative droplet size. */
  drag: number;
  /** px/s², multiplied by relative droplet size. */
  gravity: number;
  /** Noise-driven push at full reach, px/s². */
  turbulence: number;
  noiseScale: number;
  /** Share of particles drawn as soft haze. */
  haze: number;
  /** Length of one tap, seconds. */
  pulse: number;
  /** Particles emitted per second while spraying. */
  rate: number;
}

export const DEFAULT_MIST: MistSettings = {
  seed: 175,
  budget: 1200,
  coneDeg: 28,
  speed: 880,
  drag: 2.6,
  gravity: 90,
  turbulence: 260,
  noiseScale: 0.006,
  haze: 0.35,
  pulse: 0.25,
  rate: 2400,
};

/** Where the nozzle sits, relative to the point the tin pivots around. */
export interface MistGeometry {
  pivotX: number;
  pivotY: number;
  nozzleDX: number;
  nozzleDY: number;
}

const AIM_LIMIT = 0.85;
/** How much of the aim the tin itself follows. */
const TILT_SHARE = 0.3;
/** Critically damped follow with a 0.4 s response. */
const AIM_OMEGA = (2 * Math.PI) / 0.4;
const REACH = 420;
const STIR_RADIUS = 110;
const SIZE_BUCKETS = [0.5, 0.8, 1.2, 1.8, 2.6, 3.4];
const HAZE = 1;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

function nearestBucket(radius: number) {
  let best = 0;
  for (let i = 1; i < SIZE_BUCKETS.length; i++) {
    if (
      Math.abs(SIZE_BUCKETS[i] - radius) < Math.abs(SIZE_BUCKETS[best] - radius)
    )
      best = i;
  }
  return best;
}

export class MistEngine {
  /** Called every frame with the tin's tilt in radians (clockwise positive). */
  onTilt?: (radians: number) => void;

  private readonly ctx: CanvasRenderingContext2D;
  private readonly settings: MistSettings;
  private rng!: Rng;
  private noise!: (x: number, y: number) => number;

  private width = 0;
  private height = 0;
  private dpr = 1;
  private budget: number;

  // Particle pool: parallel typed arrays, no allocation in the frame loop.
  private count = 0;
  private readonly px: Float32Array;
  private readonly py: Float32Array;
  private readonly vx: Float32Array;
  private readonly vy: Float32Array;
  private readonly radius: Float32Array;
  private readonly age: Float32Array;
  private readonly life: Float32Array;
  private readonly alpha: Float32Array;
  private readonly kind: Uint8Array;
  private readonly tint: Uint8Array;
  private readonly bucket: Uint8Array;

  private readonly tints: string[] = [];
  private tintIndex = 0;
  private sprites = new Map<string, HTMLCanvasElement>();

  private aim = 0;
  private aimVelocity = 0;
  private aimTarget = 0;
  private sweep: {
    from: number;
    to: number;
    start: number;
    duration: number;
  } | null = null;

  private geometry: MistGeometry = {
    pivotX: 0,
    pivotY: 0,
    nozzleDX: 0,
    nozzleDY: 0,
  };
  private nozzleX = 0;
  private nozzleY = 0;

  private emitUntil = 0;
  private holding = false;
  private carry = 0;

  private pointer = { x: 0, y: 0, vx: 0, vy: 0, t: 0, active: false };

  private time = 0;
  private last = 0;
  private raf = 0;
  private running = false;
  private visible = true;

  constructor(canvas: HTMLCanvasElement, settings: Partial<MistSettings> = {}) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.settings = { ...DEFAULT_MIST, ...settings };
    this.budget = this.settings.budget;

    const size = this.settings.budget;
    this.px = new Float32Array(size);
    this.py = new Float32Array(size);
    this.vx = new Float32Array(size);
    this.vy = new Float32Array(size);
    this.radius = new Float32Array(size);
    this.age = new Float32Array(size);
    this.life = new Float32Array(size);
    this.alpha = new Float32Array(size);
    this.kind = new Uint8Array(size);
    this.tint = new Uint8Array(size);
    this.bucket = new Uint8Array(size);

    this.reset();
  }

  /** Restart the seeded sequence, so the same seed always gives the same spray. */
  reset() {
    this.rng = mulberry32(this.settings.seed);
    this.noise = createNoise2D(mulberry32(this.settings.seed ^ 0x9e3779b9));
    this.count = 0;
    this.time = 0;
    this.carry = 0;
    this.emitUntil = 0;
    this.sweep = null;
  }

  setTint(hex: string) {
    let index = this.tints.indexOf(hex);
    if (index === -1) index = this.tints.push(hex) - 1;
    this.tintIndex = index;
  }

  resize(width: number, height: number, dpr: number) {
    const canvas = this.ctx.canvas;
    if (dpr !== this.dpr) this.sprites.clear();
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    this.budget = Math.round(
      clamp((width * height) / 900, 420, this.settings.budget),
    );
    this.draw();
  }

  setGeometry(geometry: MistGeometry) {
    this.geometry = geometry;
    this.updateNozzle();
  }

  pointerMove(x: number, y: number, now: number) {
    const p = this.pointer;
    const dt = Math.max(0.008, (now - p.t) / 1000);
    if (p.active && dt < 0.2) {
      // Blend toward the latest velocity so one noisy event doesn't spike it.
      p.vx = p.vx * 0.5 + ((x - p.x) / dt) * 0.5;
      p.vy = p.vy * 0.5 + ((y - p.y) / dt) * 0.5;
    }
    p.x = x;
    p.y = y;
    p.t = now;
    p.active = true;

    const target = aimToward(x - this.nozzleX, y - this.nozzleY, AIM_LIMIT);
    if (target !== null) this.aimTarget = target;
    this.wake();
  }

  pointerLeave() {
    this.pointer.active = false;
  }

  /** One tap of spray. */
  pulse(seconds = this.settings.pulse) {
    this.emitUntil = Math.max(this.emitUntil, this.time + seconds);
    this.wake();
  }

  /** Press and hold. */
  hold(on: boolean) {
    this.holding = on;
    if (on) this.wake();
  }

  /** The one unprompted moment: a sweep of spray across the headline. */
  sweepAcross(from: number, to: number, seconds: number) {
    this.sweep = { from, to, start: this.time, duration: seconds };
    this.aim = from;
    this.aimVelocity = 0;
    this.pulse(seconds);
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (!visible) this.stop();
    else if (!this.isIdle()) this.start();
  }

  start() {
    if (this.running || !this.visible) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.sprites.clear();
    this.onTilt = undefined;
  }

  /** Reduced motion: simulate the seeded spray off-screen and draw one still frame. */
  renderStill(aim = -0.05, seconds = 1.1) {
    this.stop();
    this.reset();
    this.aim = this.aimTarget = aim;
    this.aimVelocity = 0;
    this.onTilt?.(aim * TILT_SHARE);
    this.updateNozzle();
    this.emitUntil = 0.55;
    const dt = 1 / 60;
    for (let t = 0; t < seconds; t += dt) this.step(dt);
    this.draw();
  }

  private wake() {
    if (!this.running) this.start();
  }

  private isIdle() {
    return (
      this.count === 0 &&
      !this.holding &&
      this.time >= this.emitUntil &&
      this.sweep === null &&
      Math.abs(this.aimTarget - this.aim) < 0.001 &&
      Math.abs(this.aimVelocity) < 0.001
    );
  }

  private frame = (now: number) => {
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    this.step(dt);
    this.draw();
    if (this.isIdle()) {
      this.running = false;
      return;
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private updateNozzle() {
    const tilt = this.aim * TILT_SHARE;
    const cos = Math.cos(tilt);
    const sin = Math.sin(tilt);
    const { pivotX, pivotY, nozzleDX, nozzleDY } = this.geometry;
    this.nozzleX = pivotX + nozzleDX * cos - nozzleDY * sin;
    this.nozzleY = pivotY + nozzleDX * sin + nozzleDY * cos;
  }

  private step(dt: number) {
    this.time += dt;
    this.stepAim(dt);

    const spraying = this.holding || this.time < this.emitUntil;
    if (spraying) {
      const due = this.settings.rate * dt + this.carry;
      const whole = Math.floor(due);
      this.carry = due - whole;
      this.emit(whole, dt);
    } else {
      this.carry = 0;
    }

    this.stepParticles(dt);

    const decay = Math.exp(-8 * dt);
    this.pointer.vx *= decay;
    this.pointer.vy *= decay;
  }

  private stepAim(dt: number) {
    let target = this.aimTarget;
    if (this.sweep) {
      const progress = (this.time - this.sweep.start) / this.sweep.duration;
      if (progress >= 1) {
        this.aimTarget = this.sweep.to;
        this.sweep = null;
      } else {
        target =
          this.sweep.from +
          (this.sweep.to - this.sweep.from) * easeInOut(progress);
      }
    }
    const acceleration =
      AIM_OMEGA * AIM_OMEGA * (target - this.aim) -
      2 * AIM_OMEGA * this.aimVelocity;
    this.aimVelocity += acceleration * dt;
    this.aim += this.aimVelocity * dt;
    this.onTilt?.(this.aim * TILT_SHARE);
    this.updateNozzle();
  }

  private emit(amount: number, dt: number) {
    const { speed, haze, coneDeg } = this.settings;
    const rng = this.rng;
    const heading = Math.PI - this.aim;
    const spread = (coneDeg * Math.PI) / 180 / 4;

    for (let k = 0; k < amount && this.count < this.budget; k++) {
      const i = this.count++;
      const isHaze = rng() < haze;
      const angle = heading + gaussian(rng) * spread;
      const velocity = speed * (0.55 + 0.6 * rng()) * (isHaze ? 0.5 : 1);
      const size = isHaze
        ? 10 + 16 * rng()
        : clamp(0.9 * Math.exp(0.55 * gaussian(rng)), 0.35, 3.4);
      // Spread births across the frame so the stream doesn't band.
      const lead = rng() * dt;

      this.vx[i] = Math.cos(angle) * velocity;
      this.vy[i] = Math.sin(angle) * velocity;
      this.px[i] = this.nozzleX + this.vx[i] * lead;
      this.py[i] = this.nozzleY + this.vy[i] * lead;
      this.radius[i] = size;
      this.age[i] = 0;
      this.life[i] = (0.9 + 1.3 * rng()) * (isHaze ? 1.4 : 1);
      this.alpha[i] = isHaze
        ? 0.035 + 0.03 * rng()
        : clamp(0.5 + 0.28 * (size / 1.2), 0.5, 0.92);
      this.kind[i] = isHaze ? HAZE : 0;
      this.tint[i] = this.tintIndex;
      this.bucket[i] = isHaze ? 0 : nearestBucket(size);
    }
  }

  private stepParticles(dt: number) {
    const { drag, gravity, turbulence, noiseScale } = this.settings;
    const pointer = this.pointer;
    const stirR2 = STIR_RADIUS * STIR_RADIUS;
    const drift = this.time * 0.35;

    for (let i = 0; i < this.count;) {
      const age = (this.age[i] += dt);
      const x = this.px[i];
      const y = this.py[i];
      if (
        age >= this.life[i] ||
        x < -60 ||
        y < -60 ||
        x > this.width + 60 ||
        y > this.height + 60
      ) {
        this.kill(i);
        continue;
      }

      const isHaze = this.kind[i] === HAZE;
      const relative = isHaze ? 1.5 : Math.max(0.35, this.radius[i] / 1.2);
      const damping = Math.exp((-drag / relative) * dt);
      let vx = this.vx[i] * damping;
      let vy = this.vy[i] * damping;

      vy += gravity * (isHaze ? 0.08 : relative) * dt;

      const dx = x - this.nozzleX;
      const dy = y - this.nozzleY;
      const reach = Math.min(1, Math.sqrt(dx * dx + dy * dy) / REACH);
      const phi =
        this.noise(x * noiseScale, y * noiseScale + drift) * Math.PI * 2;
      const push = turbulence * reach * (isHaze ? 0.6 : 1) * dt;
      vx += Math.cos(phi) * push;
      vy += Math.sin(phi) * push;

      if (pointer.active) {
        const ox = x - pointer.x;
        const oy = y - pointer.y;
        const d2 = ox * ox + oy * oy;
        if (d2 < stirR2) {
          const d = Math.sqrt(d2) || 1;
          const falloff = (1 - d / STIR_RADIUS) ** 2 * dt;
          vx += (pointer.vx * 1.8 + (ox / d) * 160) * falloff;
          vy += (pointer.vy * 1.8 + (oy / d) * 160) * falloff;
        }
      }

      this.vx[i] = vx;
      this.vy[i] = vy;
      this.px[i] = x + vx * dt;
      this.py[i] = y + vy * dt;
      i++;
    }
  }

  /** Swap-remove: move the last particle into the dead slot. */
  private kill(i: number) {
    const last = --this.count;
    if (i === last) return;
    this.px[i] = this.px[last];
    this.py[i] = this.py[last];
    this.vx[i] = this.vx[last];
    this.vy[i] = this.vy[last];
    this.radius[i] = this.radius[last];
    this.age[i] = this.age[last];
    this.life[i] = this.life[last];
    this.alpha[i] = this.alpha[last];
    this.kind[i] = this.kind[last];
    this.tint[i] = this.tint[last];
    this.bucket[i] = this.bucket[last];
  }

  private draw() {
    const ctx = this.ctx;
    const dpr = this.dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Haze underneath, droplets on top.
    for (const pass of [HAZE, 0]) {
      for (let i = 0; i < this.count; i++) {
        if (this.kind[i] !== pass) continue;
        const t = this.age[i] / this.life[i];
        const fadeIn = Math.min(1, this.age[i] / 0.06);
        const a = this.alpha[i] * fadeIn * (1 - t ** 1.6);
        if (a < 0.01) continue;

        const sprite =
          pass === HAZE
            ? this.hazeSprite(this.tint[i])
            : this.dropSprite(this.tint[i], this.bucket[i]);
        const size = pass === HAZE ? this.radius[i] * 2 * dpr : sprite.width;
        ctx.globalAlpha = a;
        ctx.drawImage(
          sprite,
          this.px[i] * dpr - size / 2,
          this.py[i] * dpr - size / 2,
          size,
          size,
        );
      }
    }
    ctx.globalAlpha = 1;
  }

  private dropSprite(tint: number, bucket: number) {
    const key = `${tint}:${bucket}`;
    const cached = this.sprites.get(key);
    if (cached) return cached;

    const r = SIZE_BUCKETS[bucket] * this.dpr;
    const size = Math.ceil(r * 2 + 2);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const g = canvas.getContext("2d")!;
    const c = size / 2;
    const [R, G, B] = hexToRgb(this.tints[tint] ?? "#E8C766");
    // A darker rim gives pale oils (Natural, Coconut) an edge against aluminium.
    const [r2, g2, b2] = [R * 0.5, G * 0.5, B * 0.5].map(Math.round);

    const fill = g.createRadialGradient(c, c, 0, c, c, r);
    fill.addColorStop(0, `rgba(${R},${G},${B},0.95)`);
    fill.addColorStop(0.62, `rgba(${R},${G},${B},0.85)`);
    fill.addColorStop(0.86, `rgba(${r2},${g2},${b2},0.9)`);
    fill.addColorStop(1, `rgba(${r2},${g2},${b2},0)`);
    g.fillStyle = fill;
    g.beginPath();
    g.arc(c, c, r, 0, Math.PI * 2);
    g.fill();

    // The largest drops catch the light.
    if (SIZE_BUCKETS[bucket] >= 1.8) {
      g.fillStyle = "rgba(255,255,255,0.85)";
      g.beginPath();
      g.arc(c - r * 0.35, c - r * 0.35, r * 0.28, 0, Math.PI * 2);
      g.fill();
    }

    this.sprites.set(key, canvas);
    return canvas;
  }

  private hazeSprite(tint: number) {
    const key = `${tint}:haze`;
    const cached = this.sprites.get(key);
    if (cached) return cached;

    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const g = canvas.getContext("2d")!;
    const [R, G, B] = hexToRgb(this.tints[tint] ?? "#E8C766");
    const fill = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    fill.addColorStop(0, `rgba(${R},${G},${B},0.9)`);
    fill.addColorStop(0.5, `rgba(${R},${G},${B},0.35)`);
    fill.addColorStop(1, `rgba(${R},${G},${B},0)`);
    g.fillStyle = fill;
    g.fillRect(0, 0, size, size);

    this.sprites.set(key, canvas);
    return canvas;
  }
}
