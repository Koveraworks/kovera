/**
 * The shared list of shop types, in display order. Used by the business form
 * now, and by the "Which shift fits you?" quiz and the "Ask your AI" prompts
 * later (issues #11, #14). Display names live in src/i18n/strings/shopTypes.js.
 *
 * The id is what is saved (business_registrations.shop_type), and the database
 * accepts only these ids: keep this list and the trigger in
 * supabase/migrations/*_waitlist_location_fields.sql in step.
 *
 * The first four ids are the same as CATEGORY_IDS in src/data/rates.js, so a
 * category picked further up the page can preselect the shop type.
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
