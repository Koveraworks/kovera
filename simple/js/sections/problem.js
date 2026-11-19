(function () {
  K.section('problem', {
    render: function (ctx) {
      var s = K.t('problem');
      var usual = s.usual.items.map(function (item) {
        return '<li class="problem__item">' + K.ui.icon('X', 'icon-5 problem__x') +
          '<span class="min-w-0 problem__text">' + item + '</span></li>';
      }).join('');
      var kovera = s.kovera.items.map(function (item) {
        return K.ui.checkItem({ tone: 'biz', html: item });
      }).join('');

      return K.ui.section({
        tone: 'white',
        html:
          K.ui.sectionHeading({ title: s.title, sub: s.sub }) +
          '<div class="problem__grid">' +
            K.ui.card({ tone: 'white', html:
              '<h3 class="problem__card-title">' + s.usual.title + '</h3>' +
              '<ul class="problem__list problem__list--usual">' + usual + '</ul>' }) +
            K.ui.card({ tone: 'biz', html:
              '<h3 class="problem__card-title">' + s.kovera.title + '</h3>' +
              '<ul class="check-list problem__list problem__list--biz">' + kovera + '</ul>' }) +
          '</div>' +
          '<div class="problem__slogan-wrap">' +
            '<p' + (ctx.lang === 'en' ? ' lang="hi-Latn"' : '') + ' class="problem__slogan">' + s.slogan + '</p>' +
            '<p class="problem__note">' + s.sloganNote + '</p>' +
          '</div>',
      });
    },
  });
})();
