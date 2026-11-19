/**
 * Shop category ids shown in the hero and the shifts section. There are no
 * pay figures here: pay is agreed and shown before every shift, and figures
 * come back only once the pilot produces real ones.
 *
 * Category ids are shared across the site: see `categories` in
 * src/i18n/strings/common.js for display names. They are also the first four
 * shop-type ids (src/data/shopTypes.js), so a pick can preselect the shop type.
 */
export const CATEGORY_IDS = ['boutique', 'handloom', 'cafe', 'salon'];

/** Pilot starting areas. Display names live in `areas` in common strings. */
export const AREA_IDS = ['insar', 'model-town', 'sector-11-12', 'gt-road'];
