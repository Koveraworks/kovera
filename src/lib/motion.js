/**
 * Whether small celebrations (confetti, a vibration) are welcome: not when
 * the visitor asked the system for less motion, nor when their browser says
 * they are saving data.
 */
export function canCelebrate() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  if (navigator.connection?.saveData) return false;
  return true;
}

/** A short buzz on phones that support it. Does nothing elsewhere. */
export function buzz() {
  if (!canCelebrate()) return;
  try {
    navigator.vibrate?.(35);
  } catch {
    // Some in-app browsers throw instead of ignoring it.
  }
}
