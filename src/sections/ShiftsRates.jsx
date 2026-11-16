import { useId, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, SectionHeading, Card, Button, Pill, Choice, Segmented, CheckItem, Fact } from '../ui.jsx';
import { useStrings, fmt } from '../i18n/index.js';
import { CATEGORY_IDS, EXAMPLE_RATES } from '../data/rates.js';
import { inrRange } from '../lib/format.js';
import { cx } from '../lib/cx.js';

const SHIFT_HOURS = [4, 6, 8];
const SHIFTS_PER_WEEK = [1, 2, 3, 5];
/** Worker view: every shift is 4 hours, and a month counts as 4 weeks. */
const WORKER_SHIFT_HOURS = 4;
const WEEKS_PER_MONTH = 4;

const BIG_NUMBER = {
  biz: 'text-ink',
  worker: 'text-worker',
};

/** Small label for a group of choices, with an optional note beside it. */
function GroupLabel({ id, label, note }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <span id={id} className="text-sm font-semibold text-ink">{label}</span>
      {note && <span className="text-sm text-body">{note}</span>}
    </div>
  );
}

export default function ShiftsRates({ onJoin }) {
  const s = useStrings('shifts');
  const c = useStrings('common');
  const ids = useId();

  const [side, setSide] = useState('business');
  const [category, setCategory] = useState(CATEGORY_IDS[0]);
  const [hours, setHours] = useState(4);
  const [shiftsPerWeek, setShiftsPerWeek] = useState(2);

  const isBusiness = side === 'business';
  const tone = isBusiness ? 'biz' : 'worker';
  const rate = EXAMPLE_RATES[category];

  const perShiftMin = rate.min * WORKER_SHIFT_HOURS;
  const perShiftMax = rate.max * WORKER_SHIFT_HOURS;
  const perWeekMin = perShiftMin * shiftsPerWeek;
  const perWeekMax = perShiftMax * shiftsPerWeek;

  const estimate = isBusiness
    ? inrRange(rate.min * hours, rate.max * hours)
    : inrRange(perWeekMin * WEEKS_PER_MONTH, perWeekMax * WEEKS_PER_MONTH);

  const resultKey = isBusiness ? `b-${category}-${hours}` : `w-${category}-${shiftsPerWeek}`;

  return (
    <Section id="shifts" tone="page">
      <SectionHeading title={s.title} sub={s.sub} />

      <Segmented
        ariaLabel={s.sideLabel}
        className="mx-auto mb-8 max-w-md"
        value={side}
        onChange={setSide}
        options={[
          { value: 'business', label: s.sideBusiness, tone: 'biz' },
          { value: 'worker', label: s.sideWorker, tone: 'worker' },
        ]}
      />

      <Card className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* Choices */}
          <div className="min-w-0 space-y-6">
            <div>
              <GroupLabel id={`${ids}-cat`} label={s.categoryLabel} />
              <div role="group" aria-labelledby={`${ids}-cat`} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                {CATEGORY_IDS.map((id) => (
                  <Choice key={id} tone={tone} selected={category === id} onClick={() => setCategory(id)}>
                    <span className="block text-base font-semibold break-words">{c.categories[id]}</span>
                    <span className="block text-sm text-body group-aria-pressed:text-white/85">
                      {inrRange(EXAMPLE_RATES[id].min, EXAMPLE_RATES[id].max)} {c.perHour}*
                    </span>
                  </Choice>
                ))}
              </div>
            </div>

            {isBusiness ? (
              <div>
                <GroupLabel id={`${ids}-len`} label={s.lengthLabel} note={s.lengthNote} />
                <div role="group" aria-labelledby={`${ids}-len`} className="grid grid-cols-3 gap-3">
                  {SHIFT_HOURS.map((h) => (
                    <Choice key={h} compact tone="biz" selected={hours === h} onClick={() => setHours(h)}>
                      <span className="block break-words text-base font-semibold">{fmt(c.hours, { n: h })}</span>
                      <span className="block break-words text-sm text-body group-aria-pressed:text-white/85">{s.lengths[h]}</span>
                    </Choice>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <GroupLabel id={`${ids}-week`} label={s.perWeekLabel} note={s.perWeekNote} />
                <div role="group" aria-labelledby={`${ids}-week`} className="grid grid-cols-4 gap-3">
                  {SHIFTS_PER_WEEK.map((n) => (
                    <Choice
                      key={n}
                      compact
                      tone="worker"
                      selected={shiftsPerWeek === n}
                      onClick={() => setShiftsPerWeek(n)}
                      aria-label={n === 1 ? s.shiftOne : fmt(s.shiftMany, { n })}
                    >
                      <span className="text-lg font-semibold tabular-nums">{n}</span>
                    </Choice>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Result */}
          <div className="min-w-0 border-t border-line pt-6 md:border-t-0 md:pt-0 md:border-l md:border-line md:pl-8">
            {/* The block below is replaced on every choice; this line stays mounted so
                screen readers hear the new figure instead of just "pressed". */}
            <p className="sr-only" aria-live="polite">
              {c.categories[category]}. {isBusiness ? fmt(s.bizEstimateLabel, { n: hours }) : s.workerEstimateLabel}: {estimate}
            </p>
            <div key={resultKey} className="animate-swap space-y-5">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="min-w-0 break-words text-xl font-bold text-ink">{c.categories[category]}</h3>
                  <Pill tone={tone}>{c.zeroFee}</Pill>
                </div>
                <p className="mt-2 text-base text-body">{s.work[category]} {s.limits[category]}</p>
                <dl className="mt-2">
                  <Fact label={s.typicalHoursLabel}>{s.typicalHours[category]}</Fact>
                </dl>
              </div>

              <div>
                <p className="text-sm text-body">
                  {isBusiness ? fmt(s.bizEstimateLabel, { n: hours }) : s.workerEstimateLabel}
                </p>
                <p className={cx('mt-1 break-words text-3xl font-extrabold tabular-nums', BIG_NUMBER[tone])}>
                  {estimate}*
                </p>
                {!isBusiness && (
                  <p className="mt-1 text-sm text-body">
                    {shiftsPerWeek === 1 ? s.basisOne : fmt(s.basisMany, { n: shiftsPerWeek })}
                  </p>
                )}
              </div>

              {isBusiness ? (
                <dl className="space-y-2.5 border-y border-line py-4">
                  <Fact label={s.pilotFeeLabel}>{s.pilotFeeValue}</Fact>
                  <Fact label={s.paymentLabel}>{s.paymentValue}</Fact>
                  <Fact label={s.matchLabel}>{s.matchValue}</Fact>
                </dl>
              ) : (
                <dl className="space-y-2.5 border-y border-line py-4">
                  <Fact label={s.perShiftLabel}>{inrRange(perShiftMin, perShiftMax)}*</Fact>
                  <Fact label={s.perWeekFactLabel}>{inrRange(perWeekMin, perWeekMax)}*</Fact>
                  <Fact label={s.workerFeeLabel}>{s.workerFeeValue}</Fact>
                </dl>
              )}

              <div>
                <p className="mb-2 text-sm font-semibold text-ink">{s.safetyLabel}</p>
                <ul className="space-y-2.5 text-ink">
                  {s.safety.map((point) => (
                    <CheckItem key={point} tone={tone}>{point}</CheckItem>
                  ))}
                </ul>
              </div>

              <div>
                {isBusiness ? (
                  <Button variant="biz" className="w-full" onClick={() => onJoin('business', { category, hours })}>
                    {s.ctaBusiness}
                    <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button variant="worker" className="w-full" onClick={() => onJoin('worker', { category, shiftsPerWeek })}>
                    {s.ctaWorker}
                    <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
                  </Button>
                )}
                <p className="mt-3 text-sm text-body">{c.exampleRateNote}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}
