const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const counts = new Intl.NumberFormat("en-IN");

/** ₹1,23,456: whole rupees with Indian digit grouping. */
export function formatINR(amount: number) {
  return rupees.format(amount);
}

/** 12,34,567: Indian digit grouping for plain counts. */
export function formatCount(value: number) {
  return counts.format(value);
}

/** Whole-percent saving against MRP; 0 when there's no discount. */
export function discountPercent(price: number, mrp: number) {
  if (mrp <= 0 || price >= mrp) return 0;
  return Math.round((1 - price / mrp) * 100);
}
