(function () {
  var AREA_ICONS = {
    insar: 'Store',
    'model-town': 'ShoppingBag',
    'sector-11-12': 'Coffee',
    'gt-road': 'Building2',
  };

  /** Where the pilot is starting: a plain list of the four areas, plus a join-anyway strip. */
  K.section('areas', {
    render: function () {
      var s = K.t('areas');
      var c = K.t('common');

      var items = K.AREA_IDS.map(function (id) {
        var item = s.items[id];
        // Same look as a page-tone card, built by hand because Card's padding cannot be overridden to p-5.
        return '<li class="areas__item">' +
          '<span class="areas__icon">' + K.ui.icon(AREA_ICONS[id], 'icon-5') + '</span>' +
          '<div class="areas__text">' +
            '<h3 class="areas__name">' + c.areas[id] + '</h3>' +
            '<p class="areas__shops">' + item.shops + '</p>' +
            '<p class="areas__busy"><span class="areas__busy-label">' + s.busyLabel + '</span> ' + item.busy + '</p>' +
          '</div></li>';
      }).join('');

      var strip = K.ui.card({
        tone: 'biz', cls: 'areas__strip',
        html: '<div class="areas__strip-text"><p class="areas__strip-title">' + s.elsewhereTitle + '</p>' +
          '<p class="areas__strip-body">' + s.elsewhereBody + '</p></div>' +
          '<div class="areas__strip-actions">' +
          K.ui.button({ variant: 'biz', html: c.cta.needWorkers, attrs: { 'data-join': 'business' } }) +
          K.ui.button({ variant: 'outline-worker', html: c.cta.wantWork, attrs: { 'data-join': 'worker' } }) +
          '</div>',
      });

      return K.ui.section({
        id: 'areas', tone: 'white',
        html: K.ui.sectionHeading({ title: s.title, sub: s.sub }) +
          '<ul aria-label="' + K.esc(s.listLabel) + '" class="areas__list">' + items + '</ul>' + strip,
      });
    },
  });
})();
