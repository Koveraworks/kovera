/**
 * Example hourly pay ranges (₹ per hour) by shop category. These are
 * illustrations only: actual pay is agreed with both sides for each shift.
 * Always show them with an "example" label or footnote.
 *
 * Category ids are shared across the site: see `categories` in
 * src/i18n/strings/common.js for display names.
 */
export const CATEGORY_IDS = ['boutique', 'handloom', 'cafe', 'salon'];

export const EXAMPLE_RATES = {
  boutique: { min: 190, max: 225 },
  handloom: { min: 180, max: 210 },
  cafe: { min: 175, max: 200 },
  salon: { min: 185, max: 220 },
};

/** Pilot starting areas. Display names live in `areas` in common strings. */
export const AREA_IDS = ['insar', 'model-town', 'sector-11-12', 'gt-road'];
