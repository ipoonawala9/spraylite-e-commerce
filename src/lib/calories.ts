/**
 * Rough figures behind the "spray vs spoon" comparison. A tablespoon of oil
 * is about 15 ml and 120 kcal; a one-second spray is under 1 g of oil,
 * about 7 kcal. We round the spray up to 1 ml so savings aren't overstated.
 */
export const KCAL_PER_TBSP = 120;
export const KCAL_PER_SPRAY = 7;
export const ML_PER_TBSP = 15;
export const ML_PER_SPRAY = 1;

const WEEKS_PER_MONTH = 52 / 12;

/** Calories and oil saved in a month by swapping a spoon for a spray. */
export function monthlySavings(usesPerWeek: number) {
  const usesPerMonth = Math.max(0, usesPerWeek) * WEEKS_PER_MONTH;
  return {
    kcal: Math.round(usesPerMonth * (KCAL_PER_TBSP - KCAL_PER_SPRAY)),
    ml: Math.round(usesPerMonth * (ML_PER_TBSP - ML_PER_SPRAY)),
  };
}
