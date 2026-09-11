import { describe, expect, it } from "vitest";
import { monthlySavings } from "./calories";

describe("monthlySavings", () => {
  it("is zero when you don't cook with oil", () => {
    expect(monthlySavings(0)).toEqual({ kcal: 0, ml: 0 });
  });

  it("treats negative input as zero", () => {
    expect(monthlySavings(-4)).toEqual({ kcal: 0, ml: 0 });
  });

  it("scales a week of daily cooking up to a month", () => {
    // 7 uses a week is about 30.3 a month; each swap saves 113 kcal and 14 ml.
    expect(monthlySavings(7)).toEqual({ kcal: 3428, ml: 425 });
  });
});
