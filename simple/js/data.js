/**
 * Example hourly pay ranges (₹ per hour) by shop category. Illustrations
 * only: actual pay is agreed with both sides for each shift. Always show
 * them with an "example" label or footnote.
 *
 * Category display names: K.t('common').categories[id].
 */
K.CATEGORY_IDS = ['boutique', 'handloom', 'cafe', 'salon'];

K.EXAMPLE_RATES = {
  boutique: { min: 190, max: 225 },
  handloom: { min: 180, max: 210 },
  cafe: { min: 175, max: 200 },
  salon: { min: 185, max: 220 },
};

/** Pilot starting areas. Display names: K.t('common').areas[id]. */
K.AREA_IDS = ['insar', 'model-town', 'sector-11-12', 'gt-road'];
