/**
 * The shop types Kovera places workers in (issue #11). One list shared by the
 * business form, the quiz and the "Ask your AI" prompts. Display names live in
 * src/i18n/strings/shopTypes.js; what the database saves is the English name.
 *
 * The first four ids are the same as CATEGORY_IDS (src/data/rates.js), so a
 * category picked in the hero or the shifts section can preselect the
 * business form's shop type.
 */
export const SHOP_TYPE_IDS = [
  'boutique',
  'handloom',
  'cafe',
  'salon',
  'kirana',
  'mobile',
  'bakery',
  'hotel',
  'events',
  'warehouse',
  'gym',
  'other',
];

export function isShopType(id) {
  return SHOP_TYPE_IDS.includes(id);
}
