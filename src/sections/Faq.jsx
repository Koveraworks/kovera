import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Section, SectionHeading, Button } from '../ui.jsx';
import { useStrings } from '../i18n/index.js';
import { whatsappUrl } from '../lib/contact.js';
import { cx } from '../lib/cx.js';

/** FAQ accordion: one item open at a time. */
// Takes the shared { onJoin } prop but does not need it: the closing link goes to WhatsApp.
export default function Faq() {
  const s = useStrings('faq');
  const c = useStrings('common');
  const [openIndex, setOpenIndex] = useState(null);
  const baseId = useId();

  return (
    <Section id="faq" tone="page" narrow>
      <SectionHeading title={s.title} sub={s.sub} />

      <div className="space-y-3">
        {s.items.map((item, i) => {
          const open = openIndex === i;
          const triggerId = `${baseId}-q-${i}`;
          const panelId = `${baseId}-a-${i}`;
          return (
            <div key={i} className="bg-white rounded-2xl border border-line">
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full min-h-11 p-5 flex items-center justify-between gap-4 text-left text-base sm:text-lg font-semibold text-ink hover:text-biz cursor-pointer rounded-2xl"
                >
                  <span className="min-w-0 break-words">{item.q}</span>
                  <ChevronDown
                    className={cx('w-5 h-5 shrink-0 text-body transition-transform', open && 'rotate-180')}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                data-expanded={open}
                inert={!open}
                className="accordion-panel"
              >
                <div className="accordion-inner">
                  <p className="px-5 pb-5 text-base text-body leading-relaxed break-words">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-sm text-body">
        {s.more}{' '}
        <Button
          variant="link-whatsapp"
          href={whatsappUrl(c.whatsapp.question)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {s.whatsapp}
        </Button>
      </p>
    </Section>
  );
}
