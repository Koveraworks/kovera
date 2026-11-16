import { ArrowRight } from 'lucide-react';
import { useStrings } from '../i18n/index.js';
import { Section, SectionHeading, Card, Pill, Button, CheckItem } from '../ui.jsx';

export default function TwoSides({ onJoin }) {
  const s = useStrings('sides');
  const c = useStrings('common');

  return (
    <Section tone="page">
      <SectionHeading title={s.title} sub={s.sub} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card lift tone="biz" className="flex flex-col">
          <div>
            <Pill tone="white">{c.side.business}</Pill>
          </div>
          <h3 className="mt-4 text-xl font-bold text-ink">{s.business.title}</h3>
          <p className="mt-2 text-base text-biz-body">{s.business.body}</p>
          <ul className="mt-5 space-y-2.5 text-ink">
            {s.business.points.map((point) => (
              <CheckItem key={point} tone="biz">{point}</CheckItem>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Button variant="biz" onClick={() => onJoin('business')} className="w-full sm:w-auto">
              {c.cta.needWorkers}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </Card>

        <Card lift tone="worker" className="flex flex-col">
          <div>
            <Pill tone="worker">{c.side.worker}</Pill>
          </div>
          <h3 className="mt-4 text-xl font-bold text-ink">{s.worker.title}</h3>
          <p className="mt-2 text-base text-worker-dark">{s.worker.body}</p>
          <ul className="mt-5 space-y-2.5 text-ink">
            {s.worker.points.map((point) => (
              <CheckItem key={point} tone="worker">{point}</CheckItem>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <Button variant="worker" onClick={() => onJoin('worker')} className="w-full sm:w-auto">
              {c.cta.wantWork}
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-sm text-body">{s.closing}</p>
    </Section>
  );
}
