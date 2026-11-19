(function () {
  var COMMITMENTS = [
    { key: 'adults', side: 'business', icon: 'UserRoundCheck' },
    { key: 'idCheck', side: 'business', icon: 'IdCard' },
    { key: 'daytime', side: 'worker', icon: 'Sun' },
    { key: 'noFee', side: 'worker', icon: 'Wallet' },
  ];

  /** The dark "approach" band: white commitment cards on navy, then what the pilot does not do. */
  K.section('trust', {
    render: function (ctx) {
      var s = K.t('trust'), c = ctx.c;
      var cards = COMMITMENTS.map(function (m) {
        var item = s.commitments[m.key];
        return '<li class="trust__card trust__card--' + m.side + '">' +
          '<span class="trust__tile">' + K.ui.icon(m.icon, 'icon-5') + '</span>' +
          '<p class="trust__side">' + c.side[m.side] + '</p>' +
          '<h3 class="trust__title">' + item.title + '</h3>' +
          '<p class="trust__body">' + item.body + '</p></li>';
      }).join('');
      var dont = s.dont.map(function (line) {
        return '<li class="trust__dont-item">' + K.ui.icon('X', 'icon-5 trust__x') +
          '<span class="min-w-0">' + line + '</span></li>';
      }).join('');

      return K.ui.section({
        id: 'trust', tone: 'navy', cls: 'on-dark trust',
        html:
          K.ui.sectionHeading({ onDark: true, title: s.title, sub: s.sub }) +
          '<ul class="trust__grid">' + cards + '</ul>' +
          '<div class="trust__dont">' +
            '<h3 class="trust__dont-title">' + s.dontTitle + '</h3>' +
            '<ul class="trust__dont-list">' + dont + '</ul>' +
          '</div>' +
          '<div class="trust__cta">' +
            K.ui.button({ variant: 'white', size: 'lg', attrs: { 'data-join': 'any' },
              html: c.cta.join + K.ui.icon('ArrowRight', 'icon-5') }) +
          '</div>',
      });
    },
  });
})();
