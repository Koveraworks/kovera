import { X } from 'lucide-react';
import { useStrings, useLang } from '../i18n/index.js';
import { Section, SectionHeading, Card, CheckItem } from '../ui.jsx';

export default function Problem() {
  const s = useStrings('problem');
  const { lang } = useLang();

  return (
    <Section tone="white">
      <SectionHeading title={s.title} sub={s.sub} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        <Card tone="white">
          <h3 className="text-xl font-bold text-ink">{s.usual.title}</h3>
          <ul className="mt-5 space-y-2.5 text-body">
            {s.usual.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-base">
                <X className="w-5 h-5 shrink-0 mt-0.5 text-body" aria-hidden="true" />
                <span className="min-w-0 break-words">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card tone="biz">
          <h3 className="text-xl font-bold text-ink">{s.kovera.title}</h3>
          <ul className="mt-5 space-y-2.5 text-biz-body">
            {s.kovera.items.map((item) => (
              <CheckItem key={item} tone="biz">{item}</CheckItem>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-10 text-center">
        <p
          lang={lang === 'en' ? 'hi-Latn' : undefined}
          className="text-xl sm:text-2xl font-bold text-biz break-words"
        >
          {s.slogan}
        </p>
        <p className="mt-2 text-sm text-body">{s.sloganNote}</p>
      </div>
    </Section>
  );
}
