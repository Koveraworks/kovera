import { UserRoundCheck, IdCard, Sun, Wallet, X, ArrowRight } from 'lucide-react';
import { Section, SectionHeading, Button, CARD_LIFT } from '../ui.jsx';
import { useStrings } from '../i18n/index.js';
import { cx } from '../lib/cx.js';

/** Full class strings per side (no interpolation). */
const SIDE_STYLES = {
  business: {
    card: 'border-biz',
    tile: 'bg-biz text-white',
    label: 'text-biz',
  },
  worker: {
    card: 'border-worker-bright',
    tile: 'bg-worker text-white',
    label: 'text-worker',
  },
};

const COMMITMENTS = [
  { key: 'adults', side: 'business', icon: UserRoundCheck },
  { key: 'idCheck', side: 'business', icon: IdCard },
  { key: 'daytime', side: 'worker', icon: Sun },
  { key: 'noFee', side: 'worker', icon: Wallet },
];

/** The dark "approach" band: white commitment cards on navy, then what the pilot does not do. */
export default function Trust({ onJoin }) {
  const s = useStrings('trust');
  const c = useStrings('common');

  return (
    <Section id="trust" tone="navy" className="lg:py-28">
      <SectionHeading onDark title={s.title} sub={s.sub} />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {COMMITMENTS.map(({ key, side, icon: Icon }) => {
          const style = SIDE_STYLES[side];
          const item = s.commitments[key];
          return (
            <li
              key={key}
              className={cx('bg-white text-ink rounded-3xl p-6 border-t-4 min-w-0 break-words', CARD_LIFT, style.card)}
            >
              <span className={cx('w-11 h-11 rounded-2xl flex items-center justify-center', style.tile)}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <p className={cx('mt-4 text-sm font-semibold', style.label)}>{c.side[side]}</p>
              <h3 className="mt-1 text-lg font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-base text-body">{item.body}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 rounded-3xl border border-white/20 p-6">
        <h3 className="text-xl font-bold text-white">{s.dontTitle}</h3>
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {s.dont.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-base text-navy-soft min-w-0 break-words">
              <X className="w-5 h-5 shrink-0 mt-0.5 text-worker-glow" aria-hidden="true" />
              <span className="min-w-0">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="white" size="lg" onClick={() => onJoin(null)}>
          {c.cta.join}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Button>
      </div>
    </Section>
  );
}
