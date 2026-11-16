import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANG, HTML_LANG, LANGS, LANG_STORAGE_KEY, LanguageContext, getStrings } from './index.js';

function initialLang() {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  const browser = (typeof navigator !== 'undefined' && navigator.language) || '';
  return browser.toLowerCase().startsWith('hi') ? 'hi' : DEFAULT_LANG;
}

export default function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const value = useMemo(() => ({
    lang,
    setLang: (next) => {
      if (!LANGS.includes(next)) return;
      setLangState(next);
      try {
        window.localStorage.setItem(LANG_STORAGE_KEY, next);
      } catch {
        // Not saved; the choice still applies for this visit.
      }
    },
  }), [lang]);

  // Keep the document itself in the chosen language for screen readers and search.
  useEffect(() => {
    const meta = getStrings('common', lang).meta;
    document.documentElement.lang = HTML_LANG[lang];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
