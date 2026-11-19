/**
 * States and districts for the State and City pickers. States ship with the
 * page; each state's districts are a separate small file, fetched only once
 * that state is picked. Source and update steps: src/data/places/README.md.
 */
import { STATES } from '../data/places/states.js';

const loaders = import.meta.glob('../data/places/districts/*.json', { import: 'default' });
const cache = new Map();

export { STATES };

export function stateByCode(code) {
  return STATES.find((s) => s.code === code) ?? null;
}

/** Districts of a state: [{ en, hi, aliases? }]. Cached; a failed load can be retried. */
export function loadDistricts(code) {
  if (cache.has(code)) return cache.get(code);
  const load = loaders[`../data/places/districts/${code}.json`];
  if (!load) return Promise.reject(new Error(`No district list for state ${code}`));
  const promise = load().catch((err) => {
    cache.delete(code);
    throw err;
  });
  cache.set(code, promise);
  return promise;
}

/** Picker options in the given language; the value saved is always the English name. */
export function stateOptions(lang) {
  return STATES.map((s) => ({
    value: s.code,
    label: lang === 'hi' ? s.hi : s.en,
    sublabel: lang === 'hi' ? s.en : null,
    search: [s.en, s.hi, s.code],
  }));
}

export function districtOptions(districts, lang) {
  return (districts ?? []).map((d) => ({
    value: d.en,
    label: lang === 'hi' ? d.hi : d.en,
    sublabel: lang === 'hi' ? d.en : null,
    search: [d.en, d.hi, ...(d.aliases ?? [])],
  }));
}
