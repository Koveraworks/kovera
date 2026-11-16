/**
 * Indian mobile numbers. The form shows a fixed "+91" prefix, so the field
 * itself holds the 10-digit national number.
 */

const MAX_DIGITS = 12; // room for a typed "91" country code before it is removed

/** Hindi keyboards can produce Devanagari digits (०-९): read them as 0-9. */
function toLatinDigits(text) {
  return text.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 0x0966));
}

/**
 * Reduce whatever was typed, pasted or autofilled to national digits.
 *
 * "+91 98765 43210", "919876543210", "0091 9876543210" and "09876543210" all
 * become "9876543210".
 *
 * A leading "91" is only treated as the country code when that is
 * unambiguous: the text has a "+", or there are exactly 12 digits. A 10-digit
 * number can itself start with 91, so anything else is left alone, and an
 * over-long entry (11 digits) is kept visible and fails validation rather
 * than being silently trimmed into a different number.
 */
export function normalizePhoneDigits(input) {
  const raw = toLatinDigits(String(input ?? ''));
  let digits = raw.replace(/\D/g, '');
  // Mobile numbers never start with 0: drop trunk and "00" international prefixes.
  digits = digits.replace(/^0+/, '');
  const hasCountryCode = digits.startsWith('91') && (digits.length === 12 || (raw.includes('+') && digits.length > 10));
  if (hasCountryCode) {
    digits = digits.slice(2);
  }
  return digits.slice(0, MAX_DIGITS);
}

/** "9876543210" -> "98765 43210" (partial input is formatted as far as it goes). */
export function formatPhone(input) {
  const digits = normalizePhoneDigits(input);
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

export function isValidIndianMobile(input) {
  return /^[6-9]\d{9}$/.test(normalizePhoneDigits(input));
}

/** How many digits sit before a caret position in a field's text. */
export function digitsBefore(text, caret) {
  return toLatinDigits(String(text).slice(0, caret)).replace(/\D/g, '').length;
}

/** The caret position in formatted text that follows the given number of digits. */
export function caretAfterDigits(formatted, count) {
  let position = 0;
  let seen = 0;
  while (position < formatted.length && seen < count) {
    if (/\d/.test(formatted[position])) seen += 1;
    position += 1;
  }
  return position;
}
