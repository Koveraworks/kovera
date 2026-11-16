/**
 * Shared building blocks. Every section uses these so spacing, type sizes,
 * selected states and the two side colours stay consistent.
 *
 * Rules these encode:
 * - Cards are flat at rest (border + tint, no shadow); a shadow appears only
 *   as a response to hover, or on things that float (menu, WhatsApp button).
 * - One selected style: solid side colour, white text, check mark.
 * - Every control is at least 44px tall (min-h-11).
 * - Text that carries information is 14px (text-sm) or larger.
 * - Tones: "biz" = indigo (business side), "worker" = cyan (worker side).
 */
import { Check } from 'lucide-react';
import { cx } from './lib/cx.js';

const SECTION_TONES = {
  page: 'bg-page',
  white: 'bg-white border-y border-line',
  navy: 'on-dark bg-biz-dark text-white',
};

/** Page section with the standard vertical rhythm and centred container. */
export function Section({ id, tone = 'page', narrow = false, className, children }) {
  return (
    <section id={id} className={cx('py-16 md:py-20', SECTION_TONES[tone], className)}>
      <div className={cx('mx-auto px-4 sm:px-6 lg:px-8', narrow ? 'max-w-4xl' : 'max-w-6xl')}>
        {children}
      </div>
    </section>
  );
}

/** Section title (h2) with optional supporting line. */
export function SectionHeading({ title, sub, align = 'center', onDark = false, className }) {
  return (
    <div className={cx('max-w-2xl mb-10', align === 'center' && 'mx-auto text-center', className)}>
      <h2 className={cx('text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-balance', onDark ? 'text-white' : 'text-ink')}>
        {title}
      </h2>
      {sub && (
        <p className={cx('mt-3 text-base sm:text-lg leading-relaxed text-pretty', onDark ? 'text-navy-soft' : 'text-body')}>
          {sub}
        </p>
      )}
    </div>
  );
}

const CARD_TONES = {
  white: 'bg-white border-line',
  page: 'bg-page border-line',
  biz: 'bg-biz-pale border-biz/15',
  worker: 'bg-worker-pale border-worker/25',
};

/** Hover response for cards: a small lift and shadow. Also usable on hand-built cards. */
export const CARD_LIFT = 'transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg';

/** Flat container. `as` changes the element (default div). `lift` adds the hover response. */
export function Card({ tone = 'white', as: Tag = 'div', lift = false, className, children, ...rest }) {
  return (
    <Tag className={cx('min-w-0 rounded-3xl border p-6 sm:p-8', CARD_TONES[tone], lift && CARD_LIFT, className)} {...rest}>
      {children}
    </Tag>
  );
}

// `btn` hooks the arrow nudge in index.css. Transform and shadow are in the
// transition list so the hover lift eases instead of snapping.
const BUTTON_BASE = 'btn inline-flex max-w-full items-center justify-center gap-2 min-h-11 rounded-2xl text-base font-semibold text-center transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed';

// Hover: filled buttons darken, lift a little and gain a shadow; outlined
// buttons take their side's colour on the border and a pale fill.
const BUTTON_VARIANTS = {
  biz: 'bg-biz text-white hover:bg-biz-dark hover:-translate-y-0.5 hover:shadow-md',
  worker: 'bg-worker text-white hover:bg-worker-dark hover:-translate-y-0.5 hover:shadow-md',
  whatsapp: 'bg-whatsapp text-white hover:bg-whatsapp-dark hover:-translate-y-0.5 hover:shadow-md',
  outline: 'bg-white text-biz border border-line-strong hover:border-biz hover:bg-biz-pale',
  'outline-worker': 'bg-white text-worker border border-line-strong hover:border-worker hover:bg-worker-pale',
  'outline-whatsapp': 'bg-white text-whatsapp border border-line-strong hover:border-whatsapp hover:bg-whatsapp-pale',
  'soft-worker': 'bg-worker-pale text-worker-dark border border-worker/30 hover:bg-white',
  white: 'bg-white text-biz hover:bg-page hover:-translate-y-0.5 hover:shadow-md',
  'link-biz': 'text-biz hover:text-biz-dark hover:underline',
  'link-worker': 'text-worker hover:text-worker-dark hover:underline',
  'link-whatsapp': 'text-whatsapp hover:text-whatsapp-dark hover:underline',
};

const BUTTON_SIZES = {
  md: 'px-5 py-2.5',
  lg: 'px-7 py-3.5',
};

/**
 * Button, or a link styled as one when `href` is given.
 * Variants: biz, worker, whatsapp, outline, outline-worker, outline-whatsapp,
 * soft-worker, white (on navy), link-biz, link-worker, link-whatsapp (text
 * links, no padding). The whatsapp variants are only for things that open WhatsApp.
 */
export function Button({ variant = 'biz', size = 'md', href, className, children, ...rest }) {
  const isLink = variant.startsWith('link-');
  const classes = cx(BUTTON_BASE, BUTTON_VARIANTS[variant], !isLink && BUTTON_SIZES[size], className);
  if (href) {
    return <a href={href} className={classes} {...rest}>{children}</a>;
  }
  return <button type="button" className={classes} {...rest}>{children}</button>;
}

const PILL_TONES = {
  neutral: 'bg-page text-ink border-line',
  white: 'bg-white text-ink border-line',
  biz: 'bg-biz-pale text-biz border-biz/15',
  worker: 'bg-worker-pale text-worker-dark border-worker/25',
  gold: 'bg-gold-pale text-gold-ink border-gold/40',
};

/**
 * Small status label. It never shrinks to make room for a neighbour, so it
 * stays on one line whenever one line physically fits; it wraps only when
 * it is wider than its whole container (very large text on a narrow phone).
 * Put it in a `flex flex-wrap gap-2` row so it drops below its neighbour as
 * a whole. Pass `wrap` for a longer phrase that is expected to run to two lines.
 */
export function Pill({ tone = 'neutral', icon: Icon, wrap = false, className, children }) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center gap-1.5 max-w-full border px-3 py-1 text-sm font-semibold',
        wrap ? 'rounded-2xl text-left' : 'rounded-full',
        PILL_TONES[tone],
        className,
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span className="min-w-0">{children}</span>
    </span>
  );
}

const CHOICE_SELECTED = {
  biz: 'bg-biz border-biz text-white',
  worker: 'bg-worker border-worker text-white',
};

/**
 * One option in a set of choices (a toggle button with aria-pressed).
 * Selected = solid tone + check mark. The button has the `group` class, so
 * secondary text inside can restyle itself when selected, for example:
 *   <span className="text-body group-aria-pressed:text-white/85">…</span>
 *
 * `compact` is for short options that sit three or four across (a number, a
 * word): centred text, tighter padding, and the check mark as a corner badge
 * so it takes no room from the label.
 */
export function Choice({ selected, tone = 'biz', compact = false, className, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        'group relative min-h-11 rounded-2xl border transition-colors cursor-pointer active:scale-[0.98]',
        compact ? 'px-2 py-2 text-center' : 'px-4 py-3 pr-10 text-left',
        selected ? CHOICE_SELECTED[tone] : 'bg-white border-line-strong text-ink hover:border-ink',
        className,
      )}
      {...rest}
    >
      {children}
      {selected && !compact && <Check className="absolute top-3 right-3 w-5 h-5" aria-hidden="true" />}
      {selected && compact && (
        <span className={cx('absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border bg-white', tone === 'worker' ? 'border-worker text-worker' : 'border-biz text-biz')}>
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      )}
    </button>
  );
}

/**
 * Two or three mutually exclusive options in one strip.
 * options: [{ value, label, tone?: 'biz' | 'worker' }]
 */
export function Segmented({ options, value, onChange, ariaLabel, className }) {
  return (
    <div role="group" aria-label={ariaLabel} className={cx('flex flex-wrap gap-1 rounded-2xl border border-line-strong bg-white p-1', className)}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cx(
              'flex-1 min-w-0 min-h-11 rounded-xl px-3 py-2 text-sm sm:text-base font-semibold wrap-anywhere transition-colors cursor-pointer',
              selected
                ? (option.tone === 'worker' ? 'bg-worker text-white' : 'bg-biz text-white')
                : 'text-ink hover:bg-page',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

const CHECK_TONES = {
  biz: 'text-biz',
  worker: 'text-worker-bright',
  glow: 'text-worker-glow',
};

/** List row with a check mark. Use inside <ul className="space-y-2.5">. */
export function CheckItem({ tone = 'biz', className, children }) {
  return (
    <li className={cx('flex items-start gap-2.5 text-base', className)}>
      <Check className={cx('w-5 h-5 shrink-0 mt-0.5', CHECK_TONES[tone])} aria-hidden="true" />
      <span className="min-w-0">{children}</span>
    </li>
  );
}

/** Label/value row. Use inside <dl className="space-y-2.5">. */
export function Fact({ label, children, className }) {
  return (
    <div className={cx('flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5', className)}>
      <dt className="text-sm text-body">{label}</dt>
      <dd className="text-sm font-semibold text-ink text-right">{children}</dd>
    </div>
  );
}
