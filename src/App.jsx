import { useCallback, useEffect, useRef, useState } from 'react';
import LanguageProvider from './i18n/LanguageProvider.jsx';
import { useStrings } from './i18n/index.js';
import { whatsappUrl } from './lib/contact.js';
import { cx } from './lib/cx.js';
import WhatsAppIcon from './components/WhatsAppIcon.jsx';
import Header from './sections/Header.jsx';
import Hero from './sections/Hero.jsx';
import ContactBand from './sections/ContactBand.jsx';
import Waitlist from './sections/Waitlist.jsx';
import Problem from './sections/Problem.jsx';
import ShiftsRates from './sections/ShiftsRates.jsx';
import Areas from './sections/Areas.jsx';
import TwoSides from './sections/TwoSides.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import Trust from './sections/Trust.jsx';
import Faq from './sections/Faq.jsx';
import Footer from './sections/Footer.jsx';

function Site() {
  const c = useStrings('common');
  const h = useStrings('header');

  // Which form is open (null = the visitor has not chosen yet) and what they
  // picked further down the page, as ids: { side, category, hours, shiftsPerWeek }.
  const [side, setSide] = useState(null);
  const [context, setContext] = useState(null);
  const waitlistHeadingRef = useRef(null);

  /** Every "join" button on the page lands here. */
  const onJoin = useCallback((nextSide, nextContext) => {
    if (nextSide) setSide(nextSide);
    if (nextSide && nextContext) setContext({ ...nextContext, side: nextSide });
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
    // Keyboard and screen-reader users are taken there too.
    waitlistHeadingRef.current?.focus({ preventScroll: true });
  }, []);

  // The floating WhatsApp button shows only while the hero, the contact band
  // and the form (which have their own buttons) are entirely off screen.
  // Watching the whole region, not a marker line, also covers jumps that
  // skip past it without scrolling through.
  const topRegionRef = useRef(null);
  const [fabVisible, setFabVisible] = useState(false);
  useEffect(() => {
    const region = topRegionRef.current;
    if (!region || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setFabVisible(!entry.isIntersecting);
    });
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-page font-sans text-ink antialiased">
      <Header onJoin={onJoin} />

      <main>
        <div ref={topRegionRef}>
          <Hero onJoin={onJoin} />
          <ContactBand />
          <Waitlist
            side={side}
            onSideChange={setSide}
            context={context}
            onClearContext={() => setContext(null)}
            headingRef={waitlistHeadingRef}
          />
        </div>
        <Problem />
        <ShiftsRates onJoin={onJoin} />
        <Areas onJoin={onJoin} />
        <TwoSides onJoin={onJoin} />
        <HowItWorks />
        <Trust onJoin={onJoin} />
        <Faq />
      </main>

      <Footer onJoin={onJoin} />

      <a
        href={whatsappUrl(c.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={h.fab}
        inert={!fabVisible}
        className={cx(
          'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-biz px-4 text-base font-semibold text-white shadow-lg transition-opacity duration-200 hover:bg-biz-dark sm:px-5',
          fabVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="hidden sm:inline">{c.cta.whatsapp}</span>
      </a>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Site />
    </LanguageProvider>
  );
}
