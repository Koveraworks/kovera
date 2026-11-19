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

  // Which form is open (null = the visitor has not chosen yet) and what they
  // picked further down the page: { side, category }, where category preselects
  // the business shop type.
  const [side, setSide] = useState(null);
  const [context, setContext] = useState(null);
  const [joinCount, setJoinCount] = useState(0);
  const waitlistHeadingRef = useRef(null);

  /** Every "join" button on the page lands here. */
  const onJoin = useCallback((nextSide, nextContext) => {
    if (nextSide) {
      setSide(nextSide);
      // A plain "join" clears any earlier pick, so nothing stale is saved with the form.
      setContext(nextContext ? { ...nextContext, side: nextSide } : null);
    }
    setJoinCount((n) => n + 1);
    // Smooth or instant is decided by CSS, which respects reduced motion.
    document.getElementById('waitlist')?.scrollIntoView();
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
    const observer = new IntersectionObserver((entries) => {
      // Several entries can arrive at once; the last one is the current state.
      setFabVisible(!entries[entries.length - 1].isIntersecting);
    });
    observer.observe(region);
    return () => observer.disconnect();
  }, []);

  return (
    <div id="top" className="min-h-screen bg-page font-sans text-ink antialiased">
      {/* First tab stop: lets keyboard users jump past the header. Off screen until focused. */}
      <a
        href="#main"
        className="fixed left-4 top-4 z-50 inline-flex min-h-11 -translate-y-24 items-center rounded-2xl bg-white px-5 text-base font-semibold text-biz shadow-lg focus:translate-y-0"
      >
        {c.skip}
      </a>

      <Header onJoin={onJoin} />

      {/* No tabIndex: the browser moves the tab starting point to an in-page anchor by itself,
          and a focusable <main> would steal focus on any click inside it. */}
      <main id="main">
        <div ref={topRegionRef}>
          <Hero onJoin={onJoin} />
          <ContactBand />
          <Waitlist
            side={side}
            onSideChange={setSide}
            context={context}
            onClearContext={() => setContext(null)}
            headingRef={waitlistHeadingRef}
            joinCount={joinCount}
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
        href={whatsappUrl(c.whatsapp.question)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={c.cta.whatsapp}
        inert={!fabVisible}
        // Pops in once the form has scrolled away; lifts on hover, presses in on tap.
        // A 56px circle until the window is 1600px wide: only then is there room
        // beside the content column for the label, so it never sits on a button.
        className={cx(
          'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-whatsapp px-4 text-base font-semibold text-white shadow-lg transition-[opacity,transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:bg-whatsapp-dark hover:shadow-xl active:scale-95 min-[100rem]:px-5',
          fabVisible ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-75 opacity-0',
        )}
      >
        <WhatsAppIcon className="h-6 w-6 shrink-0" />
        <span className="hidden min-[100rem]:inline">{c.cta.whatsapp}</span>
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
