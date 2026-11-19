/**
 * Type-ahead matching for the State and City pickers: the best matches for
 * what someone has typed, tolerant of case, spacing, punctuation and small
 * typos ("panipath" still finds Panipat).
 */

/** Lower case, no accents or punctuation, single spaces. Devanagari is kept. */
export function normalize(text) {
  return String(text ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim();
}

/** Edit distance, stopping early once it exceeds `max`. */
function distance(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + cost);
      best = Math.min(best, row[j]);
    }
    if (best > max) return max + 1;
    prev = row;
  }
  return prev[b.length];
}

/**
 * Lower is better; Infinity means no match. `term` and `query` are normalized.
 * 0 exact, 1 starts with, 2 a word starts with, 3 contains, 4 + typos.
 */
function score(term, query) {
  if (term === query) return 0;
  if (term.startsWith(query)) return 1;
  if (term.split(' ').some((word) => word.startsWith(query))) return 2;
  if (query.length >= 3 && term.includes(query)) return 3;
  if (query.length < 4) return Infinity;
  // Typos: compare against the start of the term, as long as what was typed.
  const allowed = query.length <= 6 ? 1 : 2;
  const d = Math.min(
    distance(term.slice(0, query.length), query, allowed),
    distance(term, query, allowed),
  );
  return d <= allowed ? 4 + d : Infinity;
}

/**
 * options: [{ value, search: [strings] }]. Returns matching options, best
 * first, then in their original order. An empty query returns every option.
 */
export function rankOptions(options, rawQuery, limit = Infinity) {
  const query = normalize(rawQuery);
  if (!query) return options.slice(0, limit);
  const whole = rankBy(options, [query]);
  if (whole.length) return whole.slice(0, limit);
  // Nothing matches the whole text: people often type both names, as in
  // "Haryana Panipat" or "Panipat, Haryana", so try each word on its own.
  return rankBy(options, words(query)).slice(0, limit);
}

function rankBy(options, queries) {
  const scored = [];
  options.forEach((option, index) => {
    let best = Infinity;
    for (const term of option.search) {
      const t = normalize(term);
      for (const q of queries) best = Math.min(best, score(t, q));
    }
    if (best !== Infinity) scored.push({ option, best, index });
  });
  scored.sort((a, b) => a.best - b.best || a.index - b.index);
  return scored.map((s) => s.option);
}

/** The separate words of a normalized query, when there is more than one. */
function words(query) {
  const parts = query.split(' ').filter((w) => w.length >= 3);
  return parts.length > 1 ? parts : [];
}

const isExact = (option, query) => option.search.some((term) => normalize(term) === query);

/**
 * The option whose name (in any listed form) is exactly what was typed. Failing
 * that, the one option named exactly by a single word of it ("Haryana Panipat"
 * picks Panipat in the district box and Haryana in the state box).
 */
export function exactOption(options, rawQuery) {
  const query = normalize(rawQuery);
  if (!query) return null;
  const whole = options.find((option) => isExact(option, query));
  if (whole) return whole;
  const hits = new Set();
  for (const word of words(query)) {
    for (const option of options) if (isExact(option, word)) hits.add(option);
  }
  return hits.size === 1 ? [...hits][0] : null;
}
