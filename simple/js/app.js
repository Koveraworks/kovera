/*
 * App shell: renders every registered section into its placeholder,
 * re-renders on language switch, and runs the floating WhatsApp button.
 */
(function () {
  function sectionByName(name) {
    for (var i = 0; i < K.sections.length; i += 1) if (K.sections[i].name === name) return K.sections[i];
    return null;
  }

  function applyDocumentLang() {
    var c = K.t('common');
    document.documentElement.lang = K.HTML_LANG[K.lang];
    document.title = c.meta.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', c.meta.description);
    var skip = document.querySelector('.skip-link');
    if (skip) skip.textContent = c.skip;
    var fab = document.querySelector('.fab');
    if (fab) {
      fab.href = K.whatsappUrl(c.whatsapp.question);
      fab.setAttribute('aria-label', c.cta.whatsapp);
      var label = fab.querySelector('.fab__label');
      if (label) label.textContent = c.cta.whatsapp;
    }
  }

  /**
   * Render all sections. Focus is kept across a re-render when the focused
   * element has an id or a data-focus-key attribute (the language toggle,
   * a form field).
   */
  K.renderAll = function () {
    var active = document.activeElement;
    var focusId = active && active.id;
    var focusKey = active && active.getAttribute && active.getAttribute('data-focus-key');

    var ctx = { lang: K.lang, t: K.t, c: K.t('common') };
    document.querySelectorAll('[data-section]').forEach(function (el) {
      var def = sectionByName(el.getAttribute('data-section'));
      if (!def) {
        console.warn('[Kovera] No section registered for', el.getAttribute('data-section'));
        return;
      }
      el.innerHTML = def.render(ctx);
      if (def.mount) def.mount(el, ctx);
    });
    applyDocumentLang();

    var target = (focusKey && document.querySelector('[data-focus-key="' + focusKey + '"]')) ||
      (focusId && document.getElementById(focusId));
    if (target && target !== document.activeElement) target.focus({ preventScroll: true });
  };

  /*
   * The floating WhatsApp button shows only while the hero, the contact band
   * and the form (which have their own buttons) are entirely off screen.
   */
  function watchFab() {
    var region = document.getElementById('top-region');
    var fab = document.querySelector('.fab');
    if (!region || !fab || typeof IntersectionObserver === 'undefined') return;
    function setVisible(visible) {
      fab.classList.toggle('is-visible', visible);
      fab.inert = !visible;
    }
    setVisible(false);
    new IntersectionObserver(function (entries) {
      setVisible(!entries[entries.length - 1].isIntersecting);
    }).observe(region);
  }

  function start() {
    var fab = document.querySelector('.fab');
    if (fab) fab.innerHTML = K.ui.whatsappIcon('icon-6') + '<span class="fab__label"></span>';
    K.renderAll();
    watchFab();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
