import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

/** Tin geometry, in viewBox units. The hero uses NOZZLE to place the mist emitter. */
export const TIN_VIEWBOX = { width: 120, height: 300 };
export const NOZZLE = { x: 44, y: 53 };

/** Each <use> maps the shared symbol onto the tin's full 120 × 300 box. */
const FULL = { width: 120, height: 300 };

const capVar = (color: string) => ({ "--cap": color }) as CSSProperties;

interface TinProps {
  capColor: string;
  /** Flavour name printed on the yellow band. */
  label: string;
  /** Show the spray actuator instead of the cap. */
  capOff?: boolean;
  /** "simple" drops the small label print for thumbnails. */
  detail?: "full" | "simple";
  /** When set, the tin is announced as an image; otherwise it's decorative. */
  title?: string;
  className?: string;
}

/**
 * An illustrated Spraylite tin: white body, yellow flavour band, the blue
 * logo tile and a cap in the flavour's colour. The artwork is defined once as
 * symbols in <TinDefs />; each tin is a few <use> references tinted through
 * the --cap variable, so the page stays light however many tins it shows.
 */
export function Tin({
  capColor,
  label,
  capOff = false,
  detail = "full",
  title,
  className,
}: TinProps) {
  const a11y = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true };
  const bandSize = label.length > 11 ? 6.4 : label.length > 8 ? 7.4 : 8.6;

  return (
    <svg
      viewBox={`0 0 ${TIN_VIEWBOX.width} ${TIN_VIEWBOX.height}`}
      className={cn("overflow-visible", className)}
      style={capVar(capColor)}
      {...a11y}
    >
      <use href={capOff ? "#tin-actuator" : "#tin-cap"} {...FULL} />
      <use href="#tin-body" {...FULL} />
      <text
        x="60"
        y={111 - (8.6 - bandSize) / 2}
        textAnchor="middle"
        fontSize={bandSize}
        fontWeight="700"
        letterSpacing="1.4"
        fill="#10325C"
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </text>
      {detail === "full" && <use href="#tin-print" {...FULL} />}
      <use href="#tin-shade" {...FULL} />
    </svg>
  );
}

/** The cap on its own, for the hero where it's been taken off the tin. */
export function TinCap({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="12 5 96 76"
      className={cn("overflow-visible", className)}
      style={capVar(color)}
      aria-hidden
    >
      <use href="#tin-cap" {...FULL} />
    </svg>
  );
}

const CAP_PATH = "M13 80 V34 C13 17 33 7 60 7 C87 7 107 17 107 34 V80 Z";

/** Shared gradients and tin symbols. Rendered once in the root layout. */
export function TinDefs() {
  const display = { fontFamily: "var(--font-display)" };

  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      className="pointer-events-none absolute"
    >
      <defs>
        <linearGradient id="tin-body-shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0B2340" stopOpacity="0.24" />
          <stop offset="0.14" stopColor="#0B2340" stopOpacity="0.05" />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.38" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="0.47" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.8" stopColor="#0B2340" stopOpacity="0.07" />
          <stop offset="1" stopColor="#0B2340" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="tin-cap-shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000000" stopOpacity="0.32" />
          <stop offset="0.18" stopColor="#000000" stopOpacity="0.04" />
          <stop offset="0.33" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.02" />
          <stop offset="0.82" stopColor="#000000" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="tin-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8E99A6" />
          <stop offset="0.36" stopColor="#F1F3F5" />
          <stop offset="0.6" stopColor="#BAC3CC" />
          <stop offset="1" stopColor="#7C8794" />
        </linearGradient>

        <symbol id="tin-cap" viewBox="0 0 120 300">
          <path
            d={CAP_PATH}
            style={{ fill: "var(--cap)", transition: "fill 300ms ease" }}
          />
          <path d={CAP_PATH} fill="url(#tin-cap-shade)" />
          <ellipse
            cx="40"
            cy="22"
            rx="15"
            ry="5"
            fill="#FFFFFF"
            fillOpacity="0.35"
          />
          <rect
            x="13"
            y="73"
            width="94"
            height="7"
            fill="#000000"
            fillOpacity="0.14"
          />
        </symbol>

        {/* Valve cup and actuator, nozzle facing left toward the headline. */}
        <symbol id="tin-actuator" viewBox="0 0 120 300">
          <path
            d="M26 80 C26 66 40 60 60 60 C80 60 94 66 94 80 Z"
            fill="url(#tin-metal)"
          />
          <rect x="44" y="40" width="34" height="24" rx="6" fill="#F3F5F7" />
          <rect
            x="44"
            y="40"
            width="34"
            height="24"
            rx="6"
            fill="url(#tin-cap-shade)"
            fillOpacity="0.6"
          />
          <rect x="47" y="36" width="28" height="7" rx="3.5" fill="#DDE2E7" />
          <ellipse
            cx={NOZZLE.x + 1.5}
            cy={NOZZLE.y}
            rx="2.2"
            ry="2.6"
            fill="#10325C"
          />
        </symbol>

        <symbol id="tin-body" viewBox="0 0 120 300">
          <ellipse
            cx="60"
            cy="293"
            rx="48"
            ry="5"
            fill="rgb(16 50 92 / 0.16)"
          />
          <rect
            x="12"
            y="76"
            width="96"
            height="12"
            rx="4"
            fill="url(#tin-metal)"
          />
          <rect x="10" y="84" width="100" height="206" rx="7" fill="#FBFCFD" />
          <rect x="10" y="96" width="100" height="22" fill="#F5C518" />
          <g transform="rotate(-7 60 150)">
            <rect
              x="33"
              y="128"
              width="54"
              height="46"
              rx="10"
              fill="#1D5FB4"
            />
            <text
              x="58"
              y="147"
              textAnchor="middle"
              fontSize="13"
              fontWeight="800"
              fontStyle="italic"
              fill="#FFFFFF"
              style={display}
            >
              Spray
            </text>
            <text
              x="62"
              y="167"
              textAnchor="middle"
              fontSize="19"
              fontWeight="800"
              fontStyle="italic"
              fill="#F5C518"
              style={display}
            >
              lite
            </text>
          </g>
          <rect
            x="10"
            y="226"
            width="100"
            height="44"
            style={{ fill: "var(--cap)", transition: "fill 300ms ease" }}
          />
          <g fill="#FFFFFF" fillOpacity="0.2">
            <rect x="16" y="232" width="20" height="14" rx="3" />
            <rect x="40" y="232" width="20" height="14" rx="3" />
            <rect x="64" y="232" width="20" height="14" rx="3" />
            <rect x="88" y="232" width="16" height="14" rx="3" />
            <rect x="16" y="250" width="30" height="14" rx="3" />
            <rect x="50" y="250" width="22" height="14" rx="3" />
            <rect x="76" y="250" width="28" height="14" rx="3" />
          </g>
          <rect
            x="11"
            y="284"
            width="98"
            height="7"
            rx="3.5"
            fill="url(#tin-metal)"
          />
        </symbol>

        {/* Small print, left off thumbnails. */}
        <symbol id="tin-print" viewBox="0 0 120 300">
          <text
            x="60"
            y="196"
            textAnchor="middle"
            fontSize="6.6"
            fontWeight="600"
            fontStyle="italic"
            fill="#1D5FB4"
            style={display}
          >
            Eat Lite, Eat Right
          </text>
          <text
            x="60"
            y="281"
            textAnchor="middle"
            fontSize="6"
            fontWeight="600"
            fill="#3F5877"
            letterSpacing="0.6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Net wt. 175 g
          </text>
        </symbol>

        {/* Cylindrical shading, laid over the body and label. */}
        <symbol id="tin-shade" viewBox="0 0 120 300">
          <rect
            x="10"
            y="84"
            width="100"
            height="206"
            rx="7"
            fill="url(#tin-body-shade)"
          />
        </symbol>
      </defs>
    </svg>
  );
}
