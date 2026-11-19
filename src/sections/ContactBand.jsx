import { Phone } from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon.jsx';
import { Button, Card } from '../ui.jsx';
import { fmt, useStrings } from '../i18n/index.js';
import { PHONE_DISPLAY, PHONE_TEL, whatsappUrl } from '../lib/contact.js';

/** Direct line to the team. Sits right under the hero, above the form. */
export default function ContactBand() {
  const s = useStrings('contact');
  const c = useStrings('common');

  return (
    // A pale indigo (business-side tint) strip between the white hero and the
    // off-white waitlist, closed by a hairline, so it stands out from both and
    // never runs into the waitlist below. Indigo because the band speaks to shops
    // needing urgent cover. The card is white so it stands out on the tint.
    <section className="border-b border-biz/15 bg-biz-pale py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* From md the buttons sit beside the text, and drop below it as a group when they do not fit. */}
        <Card tone="white" className="flex flex-col gap-5 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row md:flex-1 md:basis-80">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-whatsapp-pale text-whatsapp">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0 wrap-anywhere">
              <h2 className="text-xl font-bold text-ink sm:text-2xl">{s.title}</h2>
              <p className="mt-1 text-base text-body">{s.body}</p>
            </div>
          </div>

          <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="whatsapp" href={whatsappUrl(c.whatsapp.urgent)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5" />
              {s.whatsapp}
            </Button>
            <Button variant="outline" href={PHONE_TEL}>
              <Phone className="h-5 w-5" aria-hidden="true" />
              <span>{fmt(s.call, { number: PHONE_DISPLAY })}</span>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
