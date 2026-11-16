import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Languages } from 'lucide-react';
import Logo from '../components/Logo.jsx';
import { Button } from '../ui.jsx';
import { useLang, useStrings } from '../i18n/index.js';
import { cx } from '../lib/cx.js';

const NAV = [
  { key: 'shifts', href: '#shifts' },
  { key: 'areas', href: '#areas' },
  { key: 'how', href: '#how-it-works' },
  { key: 'approach', href: '#trust' },
  { key: 'faq', href: '#faq' },
];

// One easing for the menu's parts so they move together.
const EASE = 'duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]';

export default function Header({ onJoin }) {
  const s = useStrings('header');
  const c = useStrings('common');
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);
  const progressRef = useRef(null);

  // Scroll progress bar. Written straight to the element's transform inside
  // requestAnimationFrame: no React re-render per scroll event.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const bar = progressRef.current;
      if (!bar) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Close the menu on an outside tap or Escape (Escape returns focus to the button).
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) setMenuOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const other = lang === 'hi' ? 'en' : 'hi';
  const join = () => {
    setMenuOpen(false);
    onJoin(null);
  };

  return (
    <header
      ref={headerRef}
      // Tabbing out of an open menu closes it, so it never sits over the content being read.
      onBlur={(e) => {
        if (menuOpen && e.relatedTarget && !headerRef.current?.contains(e.relatedTarget)) setMenuOpen(false);
      }}
      className="site-header sticky top-0 z-40 border-b border-line bg-white"
    >
      {/* A full-width white strip above the menu's dimmed backdrop, so the header itself never dims. */}
      <div className="relative z-40 bg-white">
      {/* The row wraps instead of overflowing when text is enlarged. */}
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
        <a href="#top" aria-label={s.home} onClick={() => setMenuOpen(false)} className="group rounded-xl p-1">
          <Logo />
        </a>

        <nav aria-label={s.navLabel} className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={item.href}
              // The underline grows from the left on hover.
              className="relative inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-ink transition-colors duration-200 hover:text-biz after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-worker-bright after:transition-transform after:duration-200 after:ease-out hover:after:scale-x-100"
            >
              {s.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 xl:ml-0">
          <button
            type="button"
            onClick={() => setLang(other)}
            aria-label={s.switchLabel}
            lang={other}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-line-strong bg-white px-3 text-sm font-semibold text-ink transition-[color,background-color,border-color,transform] duration-200 hover:border-biz hover:bg-biz-pale hover:text-biz active:scale-95"
          >
            <Languages className="hidden h-4 w-4 sm:block" aria-hidden="true" />
            <span>{s.switchTo}</span>
          </button>

          {/* Below sm the hero buttons and the menu already offer this. The wrapper
              does the hiding: Button sets its own display class. */}
          <span className="hidden sm:block">
            <Button onClick={join} className="whitespace-nowrap">
              {c.cta.join}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </span>

          {/* Menu button: three bars that fold into a cross. */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? s.closeMenu : s.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className={cx(
              'inline-flex h-11 w-11 shrink-0 cursor-pointer select-none items-center justify-center rounded-2xl border transition-[color,background-color,border-color,transform] active:scale-90 xl:hidden',
              EASE,
              menuOpen ? 'border-biz/30 bg-biz-pale text-biz' : 'border-line-strong bg-white text-ink hover:border-biz hover:bg-biz-pale hover:text-biz',
            )}
          >
            <span className={cx('relative flex h-3.5 w-5 flex-col items-center justify-between transition-transform', EASE, menuOpen ? 'rotate-90' : 'rotate-0')} aria-hidden="true">
              <span className={cx('block h-0.5 w-5 origin-center rounded-full bg-current transition-transform', EASE, menuOpen ? 'translate-y-[6px] rotate-45' : 'translate-y-0 rotate-0')} />
              <span className={cx('block h-0.5 w-5 rounded-full bg-current transition-[opacity,transform] duration-150 ease-out', menuOpen ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100')} />
              <span className={cx('block h-0.5 w-5 origin-center rounded-full bg-current transition-transform', EASE, menuOpen ? '-translate-y-[6px] -rotate-45' : 'translate-y-0 rotate-0')} />
            </span>
          </button>
        </div>
      </div>
      </div>

      {/* Scroll progress along the header's bottom edge. */}
      <div
        ref={progressRef}
        className="absolute bottom-0 left-0 z-40 h-[3px] w-full origin-left bg-linear-to-r from-biz via-worker-bright to-gold will-change-transform"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      {/* Dimmed page behind the open menu; a tap on it closes the menu. It fills the
          screen and the header row and menu paint above it, so it needs no fixed
          header height and adds nothing to the page's scroll length. */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={cx(
          'fixed inset-0 z-30 bg-ink/30 transition-opacity xl:hidden',
          EASE,
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      {/* The menu slides down from under the header and fades in. */}
      <div
        id="mobile-nav"
        inert={!menuOpen}
        className={cx(
          'absolute inset-x-0 top-full z-40 border-b border-line bg-white px-4 pb-5 pt-2 shadow-xl transition-[opacity,transform,visibility] sm:px-6 xl:hidden',
          EASE,
          menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0',
        )}
      >
        <nav aria-label={s.navLabel} className="mx-auto flex max-w-6xl flex-col">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-ink transition-colors duration-150 hover:bg-page hover:text-biz active:bg-biz-pale"
            >
              {s.nav[item.key]}
            </a>
          ))}
          <Button onClick={join} className="mt-3 w-full">
            {c.cta.join}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </nav>
      </div>
    </header>
  );
}
