import { useMemo } from 'react';

const COLORS = ['var(--color-biz)', 'var(--color-worker-bright)', 'var(--color-gold)', 'var(--color-worker-glow)', 'var(--color-whatsapp)'];
const PIECES = 28;

/**
 * A one-off burst of CSS confetti over its (position: relative) parent.
 * Purely decorative. The caller only renders it when canCelebrate() says so;
 * the CSS also hides it under reduced motion.
 */
export default function Confetti() {
  // Fixed per mount, so a re-render does not restart the pieces.
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        color: COLORS[i % COLORS.length],
        delay: `${(i % 7) * 45}ms`,
        drift: `${((i * 53) % 120) - 60}px`,
        spin: `${((i * 97) % 540) + 180}deg`,
        round: i % 3 === 0,
      })),
    [],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={p.round ? 'confetti-piece confetti-piece--round' : 'confetti-piece'}
          style={{ left: p.left, background: p.color, animationDelay: p.delay, '--drift': p.drift, '--spin': p.spin }}
        />
      ))}
    </div>
  );
}
