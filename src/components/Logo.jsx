import koveraLogo from '../assets/kovera-logo.webp';
import { cx } from '../lib/cx.js';

/**
 * Emblem + wordmark. Sizes are capped in viewport units so the logo never
 * pushes the header controls off a narrow screen, even with enlarged text.
 *
 * Inside a link with the `group` class, the emblem and the dot grow slightly
 * on hover.
 */
export default function Logo({ onDark = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cx('flex shrink-0 items-center justify-center overflow-hidden rounded-xl p-1 w-[min(2.5rem,10vw)] h-[min(2.5rem,10vw)] transition-colors duration-200', onDark ? 'bg-white' : 'bg-white border border-line group-hover:border-biz/30')}>
        <img src={koveraLogo} alt="" className="h-full w-full object-contain transition-transform duration-200 ease-out group-hover:scale-110" />
      </span>
      <span className="inline-flex items-center gap-1">
        <span lang="en" className={cx('font-black tracking-tight leading-none text-[min(1.5rem,6.5vw)]', onDark ? 'text-white' : 'text-biz')}>
          kovera
        </span>
        <span className="h-2 w-2 shrink-0 rounded-full bg-worker-bright transition-transform duration-200 ease-out group-hover:scale-150" aria-hidden="true" />
      </span>
    </span>
  );
}
