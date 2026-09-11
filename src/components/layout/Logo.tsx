import Image from "next/image";
import logo from "@/assets/spraylite-logo.png";
import { cn } from "@/lib/cn";

interface LogoProps {
  /**
   * Rendered height in CSS pixels; width follows the artwork's aspect ratio.
   * The file is exactly 5:4, so any multiple of 4 gives a whole-pixel width
   * and next/image's rendered size always matches its attributes.
   */
  height?: number;
  /** Load straight away (use in the header, which is always on screen). */
  eager?: boolean;
  className?: string;
}

/** The official Spraylite mark, from the brand's launch page. */
export function Logo({ height = 44, eager = false, className }: LogoProps) {
  return (
    <Image
      src={logo}
      alt="Spraylite"
      height={height}
      width={Math.round((height * logo.width) / logo.height)}
      loading={eager ? "eager" : "lazy"}
      className={cn("w-auto", className)}
    />
  );
}
