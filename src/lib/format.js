/** Indian digit grouping with Latin digits in both languages: 18000 -> "18,000". */
export function inr(n) {
  return Number(n).toLocaleString('en-IN');
}

/** "₹720 – ₹840" */
export function inrRange(min, max) {
  return `₹${inr(min)} – ₹${inr(max)}`;
}
