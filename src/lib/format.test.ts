import { describe, expect, it } from "vitest";
import { discountPercent, formatINR } from "./format";

describe("formatINR", () => {
  it("formats whole rupees with the rupee sign and no decimals", () => {
    expect(formatINR(349)).toBe("₹349");
  });

  it("uses Indian digit grouping", () => {
    expect(formatINR(1099)).toBe("₹1,099");
    expect(formatINR(123456)).toBe("₹1,23,456");
  });
});

describe("discountPercent", () => {
  it("rounds the saving against MRP to a whole percent", () => {
    expect(discountPercent(349, 392)).toBe(11);
  });

  it("returns 0 when the price is at or above MRP", () => {
    expect(discountPercent(392, 392)).toBe(0);
    expect(discountPercent(400, 392)).toBe(0);
  });
});
