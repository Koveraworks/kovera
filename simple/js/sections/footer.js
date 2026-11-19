(function () {
  var LINKS = [
    { key: 'shifts', href: '#shifts' },
    { key: 'areas', href: '#areas' },
    { key: 'how', href: '#how-it-works' },
    { key: 'approach', href: '#trust' },
    { key: 'faq', href: '#faq' },
  ];

  K.section('footer', {
    render: function (ctx) {
      var s = K.t('footer'), h = K.t('header'), c = ctx.c;
      var links = LINKS.map(function (l) {
        return '<a href="' + l.href + '" class="footer__link">' + h.nav[l.key] + '</a>';
      }).join('');
      // Extra bottom padding keeps the floating WhatsApp button off the last lines.
      return '<footer class="footer on-dark"><div class="footer__container">' +
        '<div class="footer__top"><div>' +
          K.ui.logo({ onDark: true }) +
          '<p class="footer__line">' + s.line + '</p>' +
          '<p class="footer__tagline">' + c.tagline + '</p>' +
        '</div>' +
        // Each link carries its own side padding so short words are still 44px wide;
        // the negative margin keeps the text lined up with the column edge.
        '<nav aria-label="' + K.esc(s.navLabel) + '" class="footer__nav">' + links +
          '<button type="button" data-join="any" class="footer__join">' + c.cta.join +
            K.ui.icon('ArrowRight', 'footer__join-icon') + '</button>' +
        '</nav></div>' +
        '<div class="footer__bottom"><p>' + s.pilot + '</p><p class="footer__note">' + s.note + '</p></div>' +
        '</div></footer>';
    },
  });
})();
