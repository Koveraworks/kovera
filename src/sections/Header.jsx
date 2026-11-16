import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Languages, Menu, X } from 'lucide-react';
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

export default function Header({ onJoin }) {
  const s = useStrings('header');
  const c = useStrings('common');
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  const menuButtonRef = useRef(null);

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
    <header ref={headerRef} className="site-header sticky top-0 z-40 border-b border-line bg-white">
      {/* The row wraps instead of overflowing when text is enlarged. */}
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-2 sm:px-6 lg:px-8">
        <a href="#top" aria-label={s.home} onClick={() => setMenuOpen(false)} className="rounded-xl p-1">
          <Logo />
        </a>

        <nav aria-label={s.navLabel} className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <a key={item.key} href={item.href} className="inline-flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-ink hover:text-biz">
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
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-line-strong bg-white px-3 text-sm font-semibold text-ink transition-colors hover:border-biz hover:text-biz"
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

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? s.closeMenu : s.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className={cx(
              'inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors xl:hidden',
              menuOpen ? 'border-biz bg-biz-pale text-biz' : 'border-line-strong bg-white text-ink hover:border-biz hover:text-biz',
            )}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        inert={!menuOpen}
        className={cx(
          'absolute inset-x-0 top-full z-40 border-b border-line bg-white px-4 pb-5 pt-2 shadow-lg transition-opacity duration-150 sm:px-6 xl:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <nav aria-label={s.navLabel} className="mx-auto flex max-w-6xl flex-col">
          {NAV.map((item) => (
            <a
              key={item.key}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center rounded-xl px-3 text-base font-semibold text-ink hover:bg-page"
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
