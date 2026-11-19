import { useId, useState } from 'react';
import { ArrowRight, Wallet } from 'lucide-react';
import { Section, SectionHeading, Card, Button, Choice, Fact } from '../ui.jsx';
import { useStrings, fmt } from '../i18n/index.js';
import { CATEGORY_IDS } from '../data/rates.js';

/** Shift lengths on offer, in hours. Labels live in strings (shifts.lengths). */
const SHIFT_HOURS = [4, 6, 8];

/**
 * Fact puts its value on the right. When a long value wraps onto its own line,
 * right-aligned text reads badly on a phone, so values here align left; a
 * value that fits beside its label still sits on the right.
 */
const FACT_LEFT = '[&>dd]:text-left';

/** Small label for a group, with an optional note beside it. */
function GroupLabel({ id, label, note }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <span id={id} className="text-sm font-semibold text-ink">{label}</span>
      {note && <span className="text-sm text-body">{note}</span>}
    </div>
  );
}

/**
 * What a shift looks like: pick a type of shop to see the work, its limits and
 * the usual hours. Shift lengths and how pay works apply to every shop. No pay
 * figures until the pilot produces real ones.
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-12">
          {/* Choices, and what applies to every shop */}
          <div className="min-w-0 space-y-6">
            <div>
              <GroupLabel id={`${ids}-cat`} label={s.categoryLabel} />
              <div role="group" aria-labelledby={`${ids}-cat`} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {CATEGORY_IDS.map((id) => (
                  <Choice key={id} selected={category === id} onClick={() => setCategory(id)}>
                    <span className="block text-base font-semibold break-words">{c.categories[id]}</span>
                    <span className="block text-sm text-body break-words group-aria-pressed:text-white">{s.roles[id]}</span>
                  </Choice>
                ))}
              </div>
            </div>

            <div>
              <GroupLabel id={`${ids}-len`} label={s.lengthLabel} note={s.lengthNote} />
              {/* Information, not a choice: flat tiles that do not look pressable. */}
              <ul aria-labelledby={`${ids}-len`} className="grid grid-cols-3 gap-2 sm:gap-3">
                {SHIFT_HOURS.map((h) => (
                  <li key={h} className="min-w-0 rounded-2xl border border-line bg-page px-1 py-2.5 text-center min-[22.5rem]:px-2">
                    <span className="block break-words text-base font-semibold text-ink">{fmt(c.hours, { n: h })}</span>
                    <span className="block break-words text-sm text-body">{s.lengths[h]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The chosen shop, then pay and the two ways in */}
          <div className="min-w-0 space-y-5 border-t border-line pt-6 md:border-t-0 md:pt-0 md:border-l md:border-line md:pl-8 lg:pl-12">
            {/* The block below is replaced on every choice; this line stays mounted so
                screen readers hear what changed instead of just "pressed". */}
            <p className="sr-only" aria-live="polite">
              {c.categories[category]}. {s.typicalHoursLabel}: {s.typicalHours[category]}
            </p>
            <div key={category} className="animate-swap">
              <h3 className="break-words text-xl font-bold text-ink">{c.categories[category]}</h3>
              <p className="mt-2 text-base text-body">{s.work[category]} {s.limits[category]}</p>
              <dl className="mt-2 space-y-1.5">
                <Fact className={FACT_LEFT} label={s.typicalHoursLabel}>{s.typicalHours[category]}</Fact>
                <Fact className={FACT_LEFT} label={s.matchLabel}>{s.matchValue}</Fact>
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-page p-4 sm:p-5">
              <h3 className="flex items-start gap-1.5 text-sm font-semibold text-body">
                <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-biz" aria-hidden="true" />
                <span className="min-w-0 break-words">{s.payTitle}</span>
              </h3>
              <p className="mt-1.5 break-words text-lg font-bold text-ink text-pretty">{c.payAgreed}</p>
              <dl className="mt-3 space-y-2.5 border-t border-line pt-3">
                <Fact className={FACT_LEFT} label={s.paymentLabel}>{s.paymentValue}</Fact>
                <Fact className={FACT_LEFT} label={s.workerFeeLabel}>{s.workerFeeValue}</Fact>
                <Fact className={FACT_LEFT} label={s.pilotFeeLabel}>{s.pilotFeeValue}</Fact>
              </dl>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {/* The chosen shop type carries over to the business form. */}
              <Button variant="biz" className="w-full" onClick={() => onJoin('business', { category })}>
                {c.cta.needWorkers}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
              <Button variant="worker" className="w-full" onClick={() => onJoin('worker')}>
                {c.cta.wantWork}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
