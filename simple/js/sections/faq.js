(function () {
  // Which item is open lives here, not in the DOM, so it survives a language switch (one open at a time).
  var openIndex = null;

  /** Update the open/closed attributes in place (no re-render) so the grid-rows transition animates. */
  function apply(el) {
    var buttons = el.querySelectorAll('.faq__trigger');
    for (var i = 0; i < buttons.length; i++) {
      var open = openIndex === i;
      var btn = buttons[i];
      var panel = el.querySelector('#' + btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.querySelector('.faq__chevron').classList.toggle('is-open', open);
      panel.setAttribute('data-expanded', open ? 'true' : 'false');
      if (open) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
    }
  }

  K.section('faq', {
    render: function (ctx) {
      var s = K.t('faq'), c = ctx.c;
      var items = s.items.map(function (item, i) {
        var open = openIndex === i;
        var triggerId = 'faq-q-' + i, panelId = 'faq-a-' + i;
        return '<div class="faq__item"><h3>' +
          '<button type="button" id="' + triggerId + '" aria-expanded="' + open + '" aria-controls="' + panelId + '" class="faq__trigger">' +
            '<span class="min-w-0 faq__q">' + item.q + '</span>' +
            K.ui.icon('ChevronDown', 'icon-5 faq__chevron' + (open ? ' is-open' : '')) +
          '</button></h3>' +
          '<div id="' + panelId + '" role="region" aria-labelledby="' + triggerId + '" data-expanded="' + open + '"' +
            (open ? '' : ' inert') + ' class="accordion-panel">' +
            '<div class="accordion-inner"><p class="faq__a">' + item.a + '</p></div></div></div>';
      }).join('');

      return K.ui.section({
        id: 'faq', tone: 'page', narrow: true,
        html:
          K.ui.sectionHeading({ title: s.title, sub: s.sub }) +
          '<div class="faq__list">' + items + '</div>' +
          // 16px, the same size as the link inside it.
          '<p class="faq__more">' + s.more + ' ' +
            K.ui.button({ variant: 'link-whatsapp', href: K.whatsappUrl(c.whatsapp.question),
              attrs: { target: '_blank', rel: 'noopener noreferrer' }, html: s.whatsapp }) +
          '</p>',
      });
    },
    mount: function (el) {
      var buttons = el.querySelectorAll('.faq__trigger');
      Array.prototype.forEach.call(buttons, function (btn, i) {
        btn.addEventListener('click', function () {
          openIndex = openIndex === i ? null : i;
          apply(el);
        });
      });
    },
  });
})();
