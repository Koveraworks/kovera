import { useState } from 'react';
import { ArrowRight, Clock, MapPin, ShieldCheck, Store, Sun, UserRound, Wallet } from 'lucide-react';
import { Button, Card, Pill, Segmented } from '../ui.jsx';
import { fmt, useStrings } from '../i18n/index.js';

/** Example scenarios, in switcher order. Ids are category ids; text lives in strings. */
const SCENARIO_IDS = ['handloom', 'boutique', 'cafe'];

/** Invented travel time for each example worker, in minutes. */
const WORKER_MINUTES = { handloom: 15, boutique: 12, cafe: 18 };

/** The three promises under the buttons, in order. Text lives in strings (hero.trust). */
const TRUST_CHIPS = [
  { key: 'adults', icon: ShieldCheck, color: 'text-biz', tile: 'lg:bg-biz-pale' },
  { key: 'noFee', icon: Wallet, color: 'text-worker-bright', tile: 'lg:bg-worker-pale lg:text-worker' },
  { key: 'daytime', icon: Sun, color: 'text-worker-bright', tile: 'lg:bg-worker-pale lg:text-worker' },
];

const TARGET_MINUTES = 30;

export default function Hero({ onJoin }) {
  const s = useStrings('hero');
  const c = useStrings('common');
  const [active, setActive] = useState(SCENARIO_IDS[0]);

  const scenario = s.scenarios[active];

  const options = SCENARIO_IDS.map((id) => ({ value: id, label: c.categories[id] }));

  return (
    <section className="bg-white border-b border-line pt-10 pb-14 md:pt-20 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          From desktop width (lg) the copy and the example card sit side by
          side from the top: the headline lives in the left column, with the
          card level with it. Below lg everything stacks in reading order.
        */}
        <div className="grid grid-cols-1 gap-10 items-start lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div className="min-w-0">
            <Pill wrap tone="biz" icon={MapPin}>{s.pilot}</Pill>

            {/*
              Below lg the headline takes two lines (lead, then accent), so it
              can stay larger than the section headings. From lg it flows as
              one sentence and wraps within the left column.
              Sizes are in rem and nothing is nowrap, so enlarged text wraps instead of overflowing.
            */}
            <h1 className="mt-5 text-[1.5rem] min-[22.5rem]:text-[1.75rem] min-[25rem]:text-[1.875rem] sm:text-[2.5rem] md:text-[2.75rem] xl:text-[3.5rem] font-extrabold tracking-tight leading-[1.15] text-ink">
              <span className="block lg:inline">{s.headline.lead}</span>{' '}
              <span className="block text-biz lg:inline">{s.headline.accent}</span>
            </h1>

            {/* One line on phones too: sized to fit from 320px wide. */}
            <p className="mt-3 text-sm min-[22.5rem]:text-base min-[25rem]:text-[1.0625rem] sm:text-xl lg:text-2xl font-semibold tracking-tight text-biz">
              {c.tagline}
            </p>

            <p className="mt-6 max-w-2xl text-base sm:text-lg lg:mt-8 lg:text-xl leading-relaxed lg:leading-relaxed text-body break-words">
              {s.intro}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3 lg:mt-10 lg:gap-4">
              <Button variant="biz" size="lg" className="w-full sm:w-auto" onClick={() => onJoin('business')}>
                {c.cta.needWorkers}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
              {/* Both filled: the two sides get equal weight, each in its own colour. */}
              <Button variant="worker" size="lg" className="w-full sm:w-auto" onClick={() => onJoin('worker')}>
                {c.cta.wantWork}
                <ArrowRight className="w-5 h-5 shrink-0" aria-hidden="true" />
              </Button>
            </div>

            {/* A plain wrapping row on phones and tablets; flat chips under a hairline on desktop. */}
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-body lg:mt-10 lg:gap-2.5 lg:border-t lg:border-line lg:pt-8 lg:text-ink">
              {TRUST_CHIPS.map(({ key, icon: Icon, color, tile }) => (
                <li key={key} className="flex max-w-full min-w-0 items-start gap-1.5 lg:items-center lg:gap-2 lg:rounded-xl lg:border lg:border-line lg:bg-page lg:px-3.5 lg:py-2">
                  <span className={`shrink-0 mt-0.5 ${color} lg:mt-0 lg:flex lg:h-6 lg:w-6 lg:items-center lg:justify-center lg:rounded-md ${tile}`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 break-words">{s.trust[key]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:mt-12">
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
                  {/* No pay figure until the pilot has real ones: only how pay works. */}
                  <p className="mt-3 pt-3 border-t border-worker/25 text-sm text-worker-dark break-words">{s.card.payTerms}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
