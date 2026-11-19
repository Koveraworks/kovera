(function () {
  /** Direct line to the team. Sits right under the hero, above the form. */
  K.section('contact', {
    render: function () {
      var s = K.t('contact');
      var c = K.t('common');
      // A pale indigo (business-side tint) strip between the white hero and the
      // off-white waitlist, closed by a hairline, so it stands out from both and
      // never runs into the waitlist below. Indigo because the band speaks to shops
      // needing urgent cover. The card is white so it stands out on the tint.
      return '<section class="contact"><div class="contact__container">' +
        // From md the buttons sit beside the text, and drop below it as a group when they do not fit.
        K.ui.card({
          tone: 'white', cls: 'contact__card',
          html:
            '<div class="contact__lead">' +
              '<span class="contact__icon">' + K.ui.whatsappIcon('icon-6') + '</span>' +
              '<div class="contact__text"><h2 class="contact__title">' + s.title + '</h2><p class="contact__body">' + s.body + '</p></div>' +
            '</div>' +
            '<div class="contact__actions">' +
              K.ui.button({ variant: 'whatsapp', href: K.whatsappUrl(c.whatsapp.urgent), attrs: { target: '_blank', rel: 'noopener noreferrer' },
                html: K.ui.whatsappIcon('icon-5') + s.whatsapp }) +
              K.ui.button({ variant: 'outline', href: K.PHONE_TEL,
                html: K.ui.icon('Phone', 'icon-5') + '<span>' + K.fmt(s.call, { number: K.PHONE_DISPLAY }) + '</span>' }) +
            '</div>',
        }) +
        '</div></section>';
    },
  });
})();
