/**
 * Email is optional on the waitlist forms. When one is given it only has to
 * look like an address (something@domain.tld); the database applies the same
 * rule (supabase/schema.sql, private.intake_valid_email).
 */

export const EMAIL_MAX_LENGTH = 254;

/** Trimmed and lower-cased, so the same address always saves the same way. */
export function normalizeEmail(input) {
  return String(input ?? '').trim().toLowerCase();
}

export function isValidEmail(input) {
  const email = normalizeEmail(input);
  return email.length <= EMAIL_MAX_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
