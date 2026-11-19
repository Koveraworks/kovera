(function () {
  function side(o) {
    var points = o.s.points.map(function (p) { return K.ui.checkItem({ tone: o.tone, html: p }); }).join('');
    return K.ui.card({ tone: o.tone, cls: 'sides__card', html:
      '<div>' + K.ui.pill({ tone: o.pill, html: o.label }) + '</div>' +
      '<h3 class="sides__title">' + o.s.title + '</h3>' +
      '<p class="sides__body sides__body--' + o.tone + '">' + o.s.body + '</p>' +
      '<ul class="check-list sides__points">' + points + '</ul>' +
      '<div class="sides__cta">' +
        K.ui.button({ variant: o.tone, cls: 'sides__btn', attrs: { 'data-join': o.join },
          html: o.cta + K.ui.icon('ArrowRight', 'icon-5') }) +
      '</div>' });
  }

  K.section('sides', {
    render: function (ctx) {
      var s = K.t('sides'), c = ctx.c;
      return K.ui.section({
        tone: 'page', cls: 'sides',
        html:
          K.ui.sectionHeading({ title: s.title, sub: s.sub }) +
          '<div class="sides__grid">' +
            side({ tone: 'biz', pill: 'white', s: s.business, label: c.side.business, cta: c.cta.needWorkers, join: 'business' }) +
            side({ tone: 'worker', pill: 'worker', s: s.worker, label: c.side.worker, cta: c.cta.wantWork, join: 'worker' }) +
          '</div>' +
          '<p class="sides__closing">' + s.closing + '</p>',
      });
    },
  });
})();
