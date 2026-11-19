import { useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading, Card, Button, Pill, Choice, Fact } from '../ui.jsx';
import { useStrings } from '../i18n/index.js';
import { CATEGORY_IDS } from '../data/rates.js';

/**
 * "What a shift looks like": pick a type of shop to see its work, limits and
 * usual hours, then the facts that hold for every shift. No pay figures: pay
 * is agreed and shown before each shift. Both join buttons pass only the
 * chosen category to the waitlist: onJoin(side, { category }).
 */
export default function ShiftsRates({ onJoin }) {
  const s = useStrings('shifts');
  const c = useStrings('common');
  const ids = useId();

  const [category, setCategory] = useState(CATEGORY_IDS[0]);

  return (
    <Section id="shifts" tone="page" className="lg:py-28">
      <SectionHeading title={s.title} sub={s.sub} />

      <Card className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-8 lg:gap-12">
          {/* Choices. Indigo, the colour for content that speaks to both sides. */}
          <div className="min-w-0">
            <span id={`${ids}-cat`} className="mb-3 block text-sm font-semibold text-ink">{s.categoryLabel}</span>
            <div role="group" aria-labelledby={`${ids}-cat`} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
              {CATEGORY_IDS.map((id) => (
                <Choice key={id} tone="biz" selected={category === id} onClick={() => setCategory(id)}>
                  <span className="block text-base font-semibold break-words">{c.categories[id]}</span>
                </Choice>
              ))}
            </div>
          </div>

          {/* What the chosen shop's shift looks like */}
          <div className="min-w-0 space-y-5 border-t border-line pt-6 md:border-t-0 md:pt-0 md:border-l md:border-line md:pl-8 lg:pl-12">
            {/* The block below is replaced on every choice; this line stays mounted so
                screen readers hear the new work description instead of just "pressed". */}
            <p className="sr-only" aria-live="polite">
              {c.categories[category]}. {s.work[category]} {s.limits[category]}
            </p>
            <div key={category} className="animate-swap">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="min-w-0 break-words text-xl font-bold text-ink">{c.categories[category]}</h3>
                <Pill tone="biz">{s.lengthPill}</Pill>
              </div>
              <p className="mt-2 text-base text-body">{s.work[category]} {s.limits[category]}</p>
              <dl className="mt-2">
                <Fact label={s.typicalHoursLabel}>{s.typicalHours[category]}</Fact>
              </dl>
            </div>

            {/* The same for every shop, so it sits outside the swapped block. */}
            <div className="border-y border-line py-4">
              <h3 className="mb-3 text-base font-bold text-ink">{s.everyShiftLabel}</h3>
              <dl className="space-y-2.5">
                <Fact label={s.daytimeLabel}>{s.daytimeValue}</Fact>
                <Fact label={s.payLabel}>{s.payValue}</Fact>
                <Fact label={s.paidLabel}>{s.paidValue}</Fact>
                <Fact label={s.feeLabel}>{s.feeValue}</Fact>
                <Fact label={s.matchLabel}>{s.matchValue}</Fact>
              </dl>
            </div>

            {/* Equal weight for both sides, stacked so long Hindi labels can wrap. */}
            <div className="grid grid-cols-1 gap-3">
              <Button variant="biz" className="w-full" onClick={() => onJoin('business', { category })}>
                {s.ctaBusiness[category]}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
              <Button variant="worker" className="w-full" onClick={() => onJoin('worker', { category })}>
                {s.ctaWorker[category]}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
