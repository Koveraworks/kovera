/**
 * Indian mobile numbers. The form shows a fixed "+91" prefix, so the field
 * itself holds the 10-digit national number.
 */

/**
 * Reduce whatever was typed, pasted or autofilled to at most 10 national digits.
 *
 * "+91 98765 43210", "0091 9876543210" and "09876543210" all become
 * "9876543210". A country code is only removed when more than 10 digits are
 * present, because a 10-digit number may itself start with 91.
 */
export function normalizePhoneDigits(input) {
  let digits = String(input ?? '').replace(/\D/g, '');
  // Mobile numbers never start with 0: drop trunk and "00" international prefixes.
  digits = digits.replace(/^0+/, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  return digits.slice(0, 10);
}

/** "9876543210" -> "98765 43210" (partial input is formatted as far as it goes). */
export function formatPhone(input) {
  const digits = normalizePhoneDigits(input);
  return digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;
}

export function isValidIndianMobile(input) {
  return /^[6-9]\d{9}$/.test(normalizePhoneDigits(input));
}
