import { ArrowRight } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { useStrings } from '../i18n/index.js';

const LINKS = [
  { key: 'shifts', href: '#shifts' },
  { key: 'areas', href: '#areas' },
  { key: 'how', href: '#how-it-works' },
  { key: 'approach', href: '#trust' },
  { key: 'faq', href: '#faq' },
];

export default function Footer({ onJoin }) {
  const s = useStrings('footer');
  const h = useStrings('header');
  const c = useStrings('common');

  return (
    // Extra bottom padding keeps the floating WhatsApp button off the last lines.
    <footer className="on-dark bg-biz-dark pb-24 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 border-b border-white/15 pb-10 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo onDark />
            <p className="mt-3 text-base font-medium text-white">{s.line}</p>
            <p className="mt-1 text-sm text-navy-soft">{c.tagline}</p>
          </div>

          {/* Each link carries its own side padding so short words are still 44px wide;
              the negative margin keeps the text lined up with the column edge. */}
          <nav aria-label={s.navLabel} className="-mx-2 flex flex-wrap items-center gap-x-1 gap-y-1">
            {LINKS.map((link) => (
              <a key={link.key} href={link.href} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-base text-navy-soft hover:text-white">
                {h.nav[link.key]}
              </a>
            ))}
            <button
              type="button"
              onClick={() => onJoin(null)}
              className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-base font-semibold text-white hover:underline"
            >
              {c.cta.join}
              <ArrowRight className="h-4 w-4 text-worker-glow" aria-hidden="true" />
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-sm text-navy-soft sm:flex-row sm:items-center sm:justify-between">
          <p>{s.pilot}</p>
          <p className="sm:text-right">{s.note}</p>
        </div>
      </div>
    </footer>
  );
}
