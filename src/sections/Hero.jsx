import { useState } from 'react';
import { ArrowRight, BadgeIndianRupee, Clock, MapPin, ShieldCheck, Store, Sun, UserRound } from 'lucide-react';
import { Button, Card, Pill, Segmented } from '../ui.jsx';
import { fmt, useStrings } from '../i18n/index.js';
import { EXAMPLE_RATES } from '../data/rates.js';
import { inrRange } from '../lib/format.js';

/** Example scenarios, in switcher order. Ids are category ids; text lives in strings. */
const SCENARIO_IDS = ['handloom', 'boutique', 'cafe'];

/** Invented travel time for each example worker, in minutes. */
const WORKER_MINUTES = { handloom: 15, boutique: 12, cafe: 18 };

const SHIFT_HOURS = 4;
const TARGET_MINUTES = 30;

export default function Hero({ onJoin }) {
  const s = useStrings('hero');
  const c = useStrings('common');
  const [active, setActive] = useState(SCENARIO_IDS[0]);

  const scenario = s.scenarios[active];
  const rate = EXAMPLE_RATES[active];
  const payRange = inrRange(rate.min * SHIFT_HOURS, rate.max * SHIFT_HOURS);

  const options = SCENARIO_IDS.map((id) => ({ value: id, label: c.categories[id] }));

  return (
    <section className="bg-white border-b border-line pt-10 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Pill wrap tone="biz" icon={MapPin}>{s.pilot}</Pill>

        {/*
          The headline runs the full width above both columns so it fits on one
          line from tablet width up; the size steps down with the space. On
          phones one line would need about 17px, so it takes two: lead, then accent.
          Sizes are in rem and nothing is nowrap, so enlarged text wraps instead of overflowing.
        */}
        <h1 className="mt-5 text-[1.5rem] min-[22.5rem]:text-[1.75rem] min-[25rem]:text-[1.875rem] sm:text-[1.625rem] md:text-[2rem] lg:text-[2.75rem] xl:text-[3.25rem] font-extrabold tracking-tight leading-[1.15] text-ink">
          <span className="block sm:inline">{s.headline.lead}</span>{' '}
          <span className="block text-biz sm:inline">{s.headline.accent}</span>
        </h1>

        {/* One line on phones too: sized to fit from 320px wide. */}
        <p className="mt-3 text-sm min-[22.5rem]:text-base min-[25rem]:text-[1.0625rem] sm:text-xl lg:text-2xl font-semibold tracking-tight text-worker">
          {c.tagline}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-10 items-start lg:mt-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="min-w-0">
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-body break-words">
              {s.intro}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <Button variant="biz" size="lg" className="w-full sm:w-auto" onClick={() => onJoin('business')}>
                {c.cta.needWorkers}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
              <Button variant="outline-worker" size="lg" className="w-full sm:w-auto" onClick={() => onJoin('worker')}>
                {c.cta.wantWork}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body">
              <li className="flex items-start gap-1.5 min-w-0">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-biz" aria-hidden="true" />
                <span className="break-words">{s.trust.adults}</span>
              </li>
              <li className="flex items-start gap-1.5 min-w-0">
                <BadgeIndianRupee className="w-4 h-4 shrink-0 mt-0.5 text-worker-bright" aria-hidden="true" />
                <span className="break-words">{s.trust.zeroFee}</span>
              </li>
              <li className="flex items-start gap-1.5 min-w-0">
                <Sun className="w-4 h-4 shrink-0 mt-0.5 text-biz" aria-hidden="true" />
                <span className="break-words">{s.trust.daytime}</span>
              </li>
            </ul>
          </div>

          <div className="min-w-0">
            <Card>
              <h2 className="sr-only">{s.card.title}</h2>
              <Segmented
                options={options}
                value={active}
                onChange={setActive}
                ariaLabel={s.card.switchLabel}
              />

              <div key={active} className="mt-4 animate-swap">
                <div className="rounded-2xl bg-biz-pale p-4">
                  <p className="flex items-start gap-1.5 text-sm font-semibold text-biz">
                    <Store className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="min-w-0 break-words">{s.card.requestLabel}</span>
                  </p>
                  <h3 className="mt-2 text-base font-bold text-ink break-words">{scenario.role}</h3>
                  <p className="text-sm text-biz-body break-words">{scenario.place}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-biz-body">
                    <Clock className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="min-w-0 break-words">{scenario.hours}</span>
                  </p>
                  <p className="mt-1 text-sm text-ink break-words">{scenario.task}</p>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <span className="flex-1 min-w-4 border-t border-dashed border-line-strong" aria-hidden="true" />
                  <p className="min-w-0 text-center text-sm font-semibold text-ink break-words">
                    {fmt(s.card.bridge, { n: TARGET_MINUTES })}
                  </p>
                  <span className="flex-1 min-w-4 border-t border-dashed border-line-strong" aria-hidden="true" />
                </div>

                <div className="rounded-2xl bg-worker-pale p-4">
                  <p className="flex items-start gap-1.5 text-sm font-semibold text-worker-dark">
                    <UserRound className="w-4 h-4 shrink-0 mt-0.5 text-worker-bright" aria-hidden="true" />
                    <span className="min-w-0 break-words">{s.card.workerLabel}</span>
                  </p>
                  <h3 className="mt-2 text-base font-bold text-ink break-words">{scenario.worker}</h3>
                  <p className="text-sm text-worker-dark break-words">{scenario.workerArea}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-worker-dark">
                    <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-worker-bright" aria-hidden="true" />
                    <span className="min-w-0 break-words">{fmt(s.card.workerMeta, { n: WORKER_MINUTES[active] })}</span>
                  </p>
                  <div className="mt-3 pt-3 border-t border-worker/25">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm text-ink">
                      <span className="break-words">{fmt(s.card.payLabel, { hours: SHIFT_HOURS })}</span>
                      <span className="text-base font-extrabold tabular-nums">{fmt(s.card.payValue, { range: payRange })}</span>
                    </p>
                    <p className="mt-1 text-sm text-worker-dark break-words">{s.card.payTerms}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-body">{c.exampleRateNote}</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
