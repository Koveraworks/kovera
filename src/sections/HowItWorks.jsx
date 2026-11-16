import { useStrings } from '../i18n/index.js';
import { Section, SectionHeading, Card } from '../ui.jsx';

export default function HowItWorks() {
  const s = useStrings('how');

  return (
    <Section id="how-it-works" tone="white">
      <SectionHeading title={s.title} sub={s.sub} />

      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {s.steps.map((step, i) => (
          <Card key={step.title} as="li" tone="page">
            {/* One colour for all three: the steps apply to both sides, so no side colour. */}
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold bg-biz-pale text-biz">
              {i + 1}
            </div>
            <h3 className="mt-4 text-xl font-bold text-ink">{step.title}</h3>
            <p className="mt-2 text-base text-body">{step.body}</p>
          </Card>
        ))}
      </ol>

      <p className="mt-8 text-center text-sm text-body">{s.note}</p>
    </Section>
  );
}
