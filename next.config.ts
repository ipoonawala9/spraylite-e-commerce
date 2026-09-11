import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the project root; a stray lockfile higher up the tree would otherwise confuse Turbopack.
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
  },
};

export default nextConfig;
