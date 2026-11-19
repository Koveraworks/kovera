/**
 * Two languages: English (India) and Hindi.
 *
 * Each file in ./strings exports `{ en: {...}, hi: {...} }` with the same
 * shape. Components read their namespace with `useStrings('hero')` and get
 * the object for the current language. A missing Hindi value falls back to
 * English, so a gap never renders as "undefined".
 *
 * Check shapes with: node scripts/check-i18n.mjs
 */
import { createContext, useContext } from 'react';
import common from './strings/common.js';
import header from './strings/header.js';
import hero from './strings/hero.js';
import contact from './strings/contact.js';
import waitlist from './strings/waitlist.js';
import problem from './strings/problem.js';
import shifts from './strings/shifts.js';
import areas from './strings/areas.js';
import sides from './strings/sides.js';
import how from './strings/how.js';
import trust from './strings/trust.js';
import faq from './strings/faq.js';
import footer from './strings/footer.js';
import shopTypes from './strings/shopTypes.js';

export const LANGS = ['en', 'hi'];
export const DEFAULT_LANG = 'en';
export const LANG_STORAGE_KEY = 'kovera-lang';

/** BCP 47 tags for <html lang>. */
export const HTML_LANG = { en: 'en-IN', hi: 'hi' };

const NAMESPACES = { common, header, hero, contact, waitlist, problem, shifts, areas, sides, how, trust, faq, footer, shopTypes };

function withFallback(primary, fallback) {
  if (primary === undefined || primary === null) return fallback;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(primary)) return fallback;
    return fallback.map((item, i) => withFallback(primary[i], item));
  }
  if (fallback && typeof fallback === 'object') {
    if (typeof primary !== 'object') return fallback;
    const out = {};
    for (const key of Object.keys(fallback)) out[key] = withFallback(primary[key], fallback[key]);
    return out;
  }
  return primary;
}

const DICT = { en: {}, hi: {} };
for (const [name, ns] of Object.entries(NAMESPACES)) {
  DICT.en[name] = ns.en;
  DICT.hi[name] = withFallback(ns.hi, ns.en);
}

/** Strings for a namespace in a given language (English by default). */
export function getStrings(namespace, lang = DEFAULT_LANG) {
  return (DICT[lang] ?? DICT[DEFAULT_LANG])[namespace];
}

export const LanguageContext = createContext({ lang: DEFAULT_LANG, setLang: () => {} });

/** `{ lang, setLang }` */
export function useLang() {
  return useContext(LanguageContext);
}

/** The current language's strings for one namespace, e.g. `const s = useStrings('hero')`. */
export function useStrings(namespace) {
  const { lang } = useContext(LanguageContext);
  return getStrings(namespace, lang);
}

/** Fill `{name}` placeholders: fmt('Hello {name}', { name: 'Asha' }). */
export function fmt(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}
