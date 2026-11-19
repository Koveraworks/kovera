(function () {
  K.section('how', {
    render: function () {
      var s = K.t('how');
      var steps = s.steps.map(function (step, i) {
        // One colour for all three: the steps apply to both sides, so no side colour.
        return K.ui.card({ tag: 'li', tone: 'page', html:
          '<div class="how__num">' + (i + 1) + '</div>' +
          '<h3 class="how__title">' + step.title + '</h3>' +
          '<p class="how__body">' + step.body + '</p>' });
      }).join('');
      return K.ui.section({
        id: 'how-it-works', tone: 'white',
        html: K.ui.sectionHeading({ title: s.title, sub: s.sub }) +
          '<ol class="how__grid">' + steps + '</ol>' +
          '<p class="how__note">' + s.note + '</p>',
      });
    },
  });
})();
