/*
 * Kovera, plain-JS edition: shared core.
 *
 * Classic scripts on one global namespace (K) so the site works from any
 * static host and even when index.html is opened straight from disk.
 *
 * Load order (see index.html): core.js, icons.js, strings/*.js, data.js,
 * ui.js, sections/*.js, app.js.
 */
window.K = window.K || {};
K.strings = K.strings || {};
K.sections = [];

/* ---------- contact + config ---------- */

K.WHATSAPP_NUMBER = '918053123817';
K.PHONE_DISPLAY = '+91 80531 23817';
K.PHONE_TEL = 'tel:+918053123817';

K.whatsappUrl = function (message) {
  return 'https://wa.me/' + K.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
};

/* ---------- small helpers ---------- */

/** Escape text for safe use inside HTML (text or attribute values). Use on anything a visitor typed. */
K.esc = function (value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/** Join class names, skipping falsy values. */
K.cx = function () {
  return Array.prototype.filter.call(arguments, Boolean).join(' ');
};

/** Fill `{name}` placeholders: K.fmt('Hello {name}', { name: 'Asha' }). */
K.fmt = function (template, vars) {
  vars = vars || {};
  return String(template).replace(/\{(\w+)\}/g, function (match, key) {
    return key in vars ? String(vars[key]) : match;
  });
};

/** Indian digit grouping with Latin digits in both languages: 18000 -> "18,000". */
K.inr = function (n) {
  return Number(n).toLocaleString('en-IN');
};

/** "₹720 – ₹840" */
K.inrRange = function (min, max) {
  return '₹' + K.inr(min) + ' – ₹' + K.inr(max);
};

/** Unique id for label/aria wiring (stable within one render). */
K.uid = (function () {
  var n = 0;
  return function (prefix) { n += 1; return (prefix || 'k') + '-' + n; };
})();

/* ---------- email (optional on the waitlist forms) ---------- */

K.EMAIL_MAX_LENGTH = 254;
K.normalizeEmail = function (input) {
  return String(input == null ? '' : input).trim().toLowerCase();
};
K.isValidEmail = function (input) {
  var email = K.normalizeEmail(input);
  return email.length <= K.EMAIL_MAX_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/* ---------- Indian mobile numbers (field holds the 10-digit national number) ---------- */

(function () {
  var MAX_DIGITS = 12;
  function toLatinDigits(text) {
    return text.replace(/[०-९]/g, function (d) { return String(d.charCodeAt(0) - 0x0966); });
  }
  K.normalizePhoneDigits = function (input) {
    var raw = toLatinDigits(String(input == null ? '' : input));
    var digits = raw.replace(/\D/g, '').replace(/^0+/, '');
    var hasCountryCode = digits.indexOf('91') === 0 && (digits.length === 12 || (raw.indexOf('+') !== -1 && digits.length > 10));
    if (hasCountryCode) digits = digits.slice(2);
    return digits.slice(0, MAX_DIGITS);
  };
  K.formatPhone = function (input) {
    var digits = K.normalizePhoneDigits(input);
    return digits.length > 5 ? digits.slice(0, 5) + ' ' + digits.slice(5) : digits;
  };
  K.isValidIndianMobile = function (input) {
    return /^[6-9]\d{9}$/.test(K.normalizePhoneDigits(input));
  };
  K.digitsBefore = function (text, caret) {
    return toLatinDigits(String(text).slice(0, caret)).replace(/\D/g, '').length;
  };
  K.caretAfterDigits = function (formatted, count) {
    var position = 0;
    var seen = 0;
    while (position < formatted.length && seen < count) {
      if (/\d/.test(formatted[position])) seen += 1;
      position += 1;
    }
    return position;
  };
})();

/* ---------- i18n: English (India) and Hindi ---------- */

K.LANGS = ['en', 'hi'];
K.DEFAULT_LANG = 'en';
K.LANG_STORAGE_KEY = 'kovera-lang';
K.HTML_LANG = { en: 'en-IN', hi: 'hi' };

/** A missing Hindi value falls back to English, so a gap never renders as "undefined". */
K.withFallback = function withFallback(primary, fallback) {
  if (primary === undefined || primary === null) return fallback;
  if (Array.isArray(fallback)) {
    if (!Array.isArray(primary)) return fallback;
    return fallback.map(function (item, i) { return withFallback(primary[i], item); });
  }
  if (fallback && typeof fallback === 'object') {
    if (typeof primary !== 'object') return fallback;
    var out = {};
    Object.keys(fallback).forEach(function (key) { out[key] = withFallback(primary[key], fallback[key]); });
    return out;
  }
  return primary;
};

K.lang = (function () {
  try {
    var saved = window.localStorage.getItem(K.LANG_STORAGE_KEY);
    if (K.LANGS.indexOf(saved) !== -1) return saved;
  } catch (e) { /* storage blocked: fall through */ }
  var browser = (navigator && navigator.language) || '';
  return browser.toLowerCase().indexOf('hi') === 0 ? 'hi' : K.DEFAULT_LANG;
})();

/** Strings for one namespace in the current (or given) language, e.g. K.t('hero'). */
K.t = function (namespace, lang) {
  var ns = K.strings[namespace];
  if (!ns) throw new Error('Unknown string namespace: ' + namespace);
  var l = lang || K.lang;
  return l === 'en' ? ns.en : K.withFallback(ns[l], ns.en);
};

/** Switch language: saves it, then re-renders every section (see app.js). */
K.setLang = function (next) {
  if (K.LANGS.indexOf(next) === -1 || next === K.lang) return;
  K.lang = next;
  try { window.localStorage.setItem(K.LANG_STORAGE_KEY, next); } catch (e) { /* not saved */ }
  K.renderAll();
};

/* ---------- sections ---------- */

/**
 * Register a section. Sections render in the order their placeholder
 * (<div data-section="name">) appears in index.html.
 *
 *   K.section('hero', {
 *     render: function (ctx) { return '<section>…</section>'; }, // HTML string
 *     mount: function (el, ctx) { … }                            // optional: wire events
 *   });
 *
 * render() runs again on every language switch (the placeholder's content is
 * replaced and mount() runs again), so keep any state a visitor created
 * (open panel, chosen option, typed text) in variables in the section's own
 * closure, never only in the DOM.
 *
 * ctx = { lang, t: K.t, c: K.t('common') }
 */
K.section = function (name, def) {
  def.name = name;
  K.sections.push(def);
};

/* ---------- the "join" bus ---------- */

/**
 * Every "join the waitlist" button on the page calls K.join(side, context).
 *   side: 'business' | 'worker' | null (null = just scroll to the form)
 *   context: optional { category, hours, shiftsPerWeek } picked further down the page
 * The waitlist section listens with K.onJoin(fn) and receives (side, context).
 * K.join also scrolls to #waitlist and moves focus to #waitlist-heading.
 */
K._joinListeners = [];
K.onJoin = function (fn) { K._joinListeners.push(fn); };
K.join = function (side, context) {
  K._joinListeners.forEach(function (fn) { fn(side || null, context || null); });
  var target = document.getElementById('waitlist');
  if (target) target.scrollIntoView();
  var heading = document.getElementById('waitlist-heading');
  if (heading) heading.focus({ preventScroll: true });
};

/** Declarative join buttons: <button data-join="business" data-join-context='{"category":"cafe"}'>. */
document.addEventListener('click', function (event) {
  var el = event.target.closest && event.target.closest('[data-join]');
  if (!el) return;
  event.preventDefault();
  var side = el.getAttribute('data-join') || null;
  var ctxAttr = el.getAttribute('data-join-context');
  var context = null;
  if (ctxAttr) { try { context = JSON.parse(ctxAttr); } catch (e) { context = null; } }
  K.join(side === 'any' ? null : side, context);
});
