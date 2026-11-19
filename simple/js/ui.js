/*
 * Shared building blocks, as HTML-string builders. Plain-JS twins of the
 * React components in src/ui.jsx; their styles live in css/base.css.
 *
 * Rules these encode:
 * - Cards are flat (border + tint, no shadow) and do not react to hover.
 * - One selected style: solid side colour and white text. A choice also gets
 *   a check mark; a segmented strip shows the selection by its fill alone.
 * - Every control is at least 44px tall.
 * - Tones: "biz" = indigo (business side), "worker" = cyan (worker side).
 *
 * `html` arguments are inserted as-is (strings from K.t are trusted).
 * Escape anything a visitor typed with K.esc first.
 */
K.ui = (function () {
  var cx = K.cx;

  /** Turn { 'aria-label': 'x', disabled: true, hidden: false } into an attribute string. */
  function attrs(obj) {
    if (!obj) return '';
    return Object.keys(obj).map(function (key) {
      var v = obj[key];
      if (v === false || v == null) return '';
      if (v === true) return ' ' + key;
      return ' ' + key + '="' + K.esc(v) + '"';
    }).join('');
  }

  /** Lucide icon by name (see icons.js), e.g. icon('ArrowRight', 'icon-5'). Decorative: aria-hidden. */
  function icon(name, cls) {
    var def = K.ICONS[name];
    if (!def) throw new Error('Unknown icon: ' + name);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="' +
      cx('lucide', 'lucide-' + def.slug, cls) + '">' + def.svg + '</svg>';
  }

  function whatsappIcon(cls) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="' + (cls || '') + '"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
  }

  /**
   * Page section with the standard vertical rhythm and centred container.
   * tone: 'page' | 'white' | 'navy'
   */
  function section(o) {
    return '<section' + (o.id ? ' id="' + o.id + '"' : '') + ' class="' + cx('section', 'section--' + (o.tone || 'page'), o.cls) + '"' + attrs(o.attrs) + '>' +
      '<div class="' + cx('container', o.narrow && 'container--narrow') + '">' + o.html + '</div></section>';
  }

  /** Section title (h2) with optional supporting line. align: 'center' (default) | 'left'. */
  function sectionHeading(o) {
    return '<div class="' + cx('section-heading', (o.align || 'center') === 'center' && 'section-heading--center', o.onDark && 'section-heading--dark', o.cls) + '">' +
      '<h2' + (o.headingId ? ' id="' + o.headingId + '"' : '') + ' class="section-heading__title">' + o.title + '</h2>' +
      (o.sub ? '<p class="section-heading__sub">' + o.sub + '</p>' : '') + '</div>';
  }

  /** Flat container. tone: 'white' | 'page' | 'biz' | 'worker'. tag defaults to div. */
  function card(o) {
    var tag = o.tag || 'div';
    return '<' + tag + ' class="' + cx('card', 'card--' + (o.tone || 'white'), o.cls) + '"' + attrs(o.attrs) + '>' + o.html + '</' + tag + '>';
  }

  /**
   * Button, or a link styled as one when `href` is given.
   * variant: biz, worker, whatsapp, outline, outline-worker, outline-whatsapp,
   *   soft-worker, white (on navy), link-biz, link-worker, link-whatsapp.
   * size: 'md' (default) | 'lg'. Put icon(...) inside `html` as needed.
   */
  function button(o) {
    var variant = o.variant || 'biz';
    var isLink = variant.indexOf('link-') === 0;
    var cls = cx('btn', 'btn--' + variant, !isLink && 'btn--' + (o.size || 'md'), o.cls);
    if (o.href) {
      return '<a href="' + K.esc(o.href) + '" class="' + cls + '"' + attrs(o.attrs) + '>' + o.html + '</a>';
    }
    return '<button type="' + (o.type || 'button') + '" class="' + cls + '"' + attrs(o.attrs) + '>' + o.html + '</button>';
  }

  /** Small status label. tone: neutral | white | biz | worker | gold. icon: icon name. wrap: allow two lines. */
  function pill(o) {
    return '<span class="' + cx('pill', 'pill--' + (o.tone || 'neutral'), o.wrap && 'pill--wrap', o.cls) + '">' +
      (o.icon ? icon(o.icon, 'icon-4') : '') + '<span class="pill__text">' + o.html + '</span></span>';
  }

  /**
   * One option in a set of choices (toggle button with aria-pressed).
   * Selected = solid tone + check mark. Secondary text inside can use
   * class "choice__sub" (turns white when selected).
   */
  function choice(o) {
    var tone = o.tone || 'biz';
    var mark = '';
    if (o.selected && !o.compact) mark = icon('Check', 'choice__check');
    if (o.selected && o.compact) mark = '<span class="choice__badge">' + icon('Check', 'icon-3-5') + '</span>';
    return '<button type="button" aria-pressed="' + (o.selected ? 'true' : 'false') + '" class="' +
      cx('choice', 'choice--' + tone, o.compact && 'choice--compact', o.cls) + '"' + attrs(o.attrs) + '>' + o.html + mark + '</button>';
  }

  /**
   * Two or three mutually exclusive options in one strip.
   * options: [{ value, label, tone?: 'biz' | 'worker' }]. Each button carries
   * data-value; the section wires the click itself.
   */
  function segmented(o) {
    return '<div role="group" aria-label="' + K.esc(o.ariaLabel || '') + '" class="' + cx('seg', o.cls) + '"' + attrs(o.attrs) + '>' +
      o.options.map(function (opt) {
        var selected = opt.value === o.value;
        return '<button type="button" data-value="' + K.esc(opt.value) + '" aria-pressed="' + (selected ? 'true' : 'false') + '" class="' +
          cx('seg__btn', 'seg__btn--' + (opt.tone || 'biz')) + '">' + opt.label + '</button>';
      }).join('') + '</div>';
  }

  /** List row with a check mark. Wrap rows in <ul class="check-list">. tone: biz | worker | glow. */
  function checkItem(o) {
    return '<li class="' + cx('check-item', o.cls) + '">' + icon('Check', 'check-item__icon check-item__icon--' + (o.tone || 'biz')) +
      '<span class="min-w-0">' + o.html + '</span></li>';
  }

  /** Label/value row. Wrap rows in <dl class="facts">. */
  function fact(o) {
    return '<div class="' + cx('fact', o.cls) + '"><dt>' + o.label + '</dt><dd>' + o.html + '</dd></div>';
  }

  /** Emblem + wordmark. Inside a link with class "logo-link" the emblem and dot grow on hover. */
  function logo(o) {
    o = o || {};
    return '<span class="' + cx('logo', o.onDark && 'logo--dark') + '">' +
      '<span class="logo__emblem"><img src="assets/kovera-logo.webp" alt="" width="40" height="40"></span>' +
      '<span class="logo__word"><span lang="en" class="logo__text">kovera</span><span class="logo__dot" aria-hidden="true"></span></span></span>';
  }

  return {
    attrs: attrs, icon: icon, whatsappIcon: whatsappIcon, section: section, sectionHeading: sectionHeading,
    card: card, button: button, pill: pill, choice: choice, segmented: segmented, checkItem: checkItem,
    fact: fact, logo: logo,
  };
})();
