import { Store, ShoppingBag, Coffee, Building2 } from 'lucide-react';
import { Section, SectionHeading, Card, Button } from '../ui.jsx';
import { useStrings } from '../i18n/index.js';
import { AREA_IDS } from '../data/rates.js';

const AREA_ICONS = {
  insar: Store,
  'model-town': ShoppingBag,
  'sector-11-12': Coffee,
  'gt-road': Building2,
};

/** Where the pilot is starting: a plain list of the four areas, plus a join-anyway strip. */
export default function Areas({ onJoin }) {
  const s = useStrings('areas');
  const c = useStrings('common');

  return (
    <Section id="areas" tone="white">
      <SectionHeading title={s.title} sub={s.sub} />

      <ul aria-label={s.listLabel} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {AREA_IDS.map((id) => {
          const Icon = AREA_ICONS[id];
          const item = s.items[id];
          return (
            // Same look as <Card tone="page">, built by hand because Card's p-6 sm:p-8 cannot be overridden to p-5.
            <li key={id} className="rounded-3xl border bg-page border-line p-5 lg:p-7 flex items-start gap-4 min-w-0">
              <span className="w-11 h-11 shrink-0 rounded-2xl bg-biz-pale text-biz flex items-center justify-center">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 break-words">
                <h3 className="text-xl font-bold text-ink">{c.areas[id]}</h3>
                <p className="mt-1 text-base text-body">{item.shops}</p>
                <p className="mt-1 text-sm text-body">
                  <span className="font-semibold text-ink">{s.busyLabel}</span> {item.busy}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      <Card tone="biz" className="mt-6 lg:mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="min-w-0 break-words">
          <p className="text-lg font-bold text-ink">{s.elsewhereTitle}</p>
          <p className="mt-1 text-base text-biz-body">{s.elsewhereBody}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="biz" onClick={() => onJoin('business')}>
            {c.cta.needWorkers}
          </Button>
          <Button variant="outline-worker" onClick={() => onJoin('worker')}>
            {c.cta.wantWork}
          </Button>
        </div>
      </Card>
    </Section>
  );
}
