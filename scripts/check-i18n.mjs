#!/usr/bin/env node
/**
 * Checks that every strings file has the same shape in English and Hindi.
 *
 *   node scripts/check-i18n.mjs                      # all files in src/i18n/strings
 *   node scripts/check-i18n.mjs src/i18n/strings/hero.js
 *
 * Errors (exit 1): a key missing on either side, a type mismatch, arrays of
 * different length, an empty string, a ₹ sign (no pay figures until the pilot
 * has real ones: issue #7).
 * Warnings: a Hindi value with no Devanagari, or identical to the English.
 */
import { readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const stringsDir = join(root, 'src/i18n/strings');
const files = process.argv.length > 2
  ? process.argv.slice(2).map((f) => resolve(f))
  : readdirSync(stringsDir).filter((f) => f.endsWith('.js')).map((f) => join(stringsDir, f));

const DEVANAGARI = /[ऀ-ॿ]/;
const HAS_LETTERS = /[A-Za-z]{3,}/;
// Values that are legitimately the same in both languages.
const SAME_OK = /^(Kovera|WhatsApp|[\d\s+–\-.,:*/#A-Z]*)$/;

let errors = 0;
let warnings = 0;

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

function compare(en, hi, path, file) {
  const te = typeOf(en);
  const th = typeOf(hi);
  if (th === 'undefined') {
    console.error(`ERROR ${file}: hi is missing "${path}"`);
    errors += 1;
    return;
  }
  if (te !== th) {
    console.error(`ERROR ${file}: "${path}" is ${te} in en but ${th} in hi`);
    errors += 1;
    return;
  }
  if (te === 'array') {
    if (en.length !== hi.length) {
      console.error(`ERROR ${file}: "${path}" has ${en.length} items in en but ${hi.length} in hi`);
      errors += 1;
    }
    en.forEach((item, i) => compare(item, hi[i], `${path}[${i}]`, file));
    return;
  }
  if (te === 'object') {
    for (const key of Object.keys(en)) compare(en[key], hi[key], path ? `${path}.${key}` : key, file);
    for (const key of Object.keys(hi)) {
      if (!(key in en)) {
        console.error(`ERROR ${file}: hi has extra key "${path ? `${path}.` : ''}${key}"`);
        errors += 1;
      }
    }
    return;
  }
  if (te === 'string') {
    if (en.includes('₹') || hi.includes('₹')) {
      console.error(`ERROR ${file}: "${path}" shows a ₹ amount; say "Pay is agreed and shown before every shift" instead`);
      errors += 1;
    }
    if (!en.trim() || !hi.trim()) {
      console.error(`ERROR ${file}: "${path}" is empty`);
      errors += 1;
      return;
    }
    const placeholders = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join(',');
    if (placeholders(en) !== placeholders(hi)) {
      console.error(`ERROR ${file}: "${path}" placeholders differ (en: ${placeholders(en) || 'none'}; hi: ${placeholders(hi) || 'none'})`);
      errors += 1;
    }
    if (SAME_OK.test(en)) return;
    if (en === hi) {
      console.warn(`warn  ${file}: "${path}" is identical in en and hi: ${JSON.stringify(en)}`);
      warnings += 1;
    } else if (HAS_LETTERS.test(en) && !DEVANAGARI.test(hi)) {
      console.warn(`warn  ${file}: "${path}" hi has no Devanagari: ${JSON.stringify(hi)}`);
      warnings += 1;
    }
  }
}

for (const file of files) {
  const short = file.replace(`${root}/`, '');
  let mod;
  try {
    mod = (await import(pathToFileURL(file).href)).default;
  } catch (err) {
    console.error(`ERROR ${short}: cannot load (${err.message})`);
    errors += 1;
    continue;
  }
  if (!mod || typeOf(mod.en) !== 'object' || typeOf(mod.hi) !== 'object') {
    console.error(`ERROR ${short}: default export must be { en: {...}, hi: {...} }`);
    errors += 1;
    continue;
  }
  compare(mod.en, mod.hi, '', short);
}

console.log(`${files.length} file(s) checked: ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
