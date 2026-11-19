(function () {
  /** Example scenarios, in switcher order. Ids are category ids; text lives in strings. */
  var SCENARIO_IDS = ['handloom', 'boutique', 'cafe'];
  /** Invented travel time for each example worker, in minutes. */
  var WORKER_MINUTES = { handloom: 15, boutique: 12, cafe: 18 };
  /** The three promises under the buttons, in order. Text lives in strings (hero.trust). */
  var TRUST_CHIPS = [
    { key: 'adults', icon: 'ShieldCheck', tone: 'biz' },
    { key: 'zeroFee', icon: 'BadgeIndianRupee', tone: 'worker' },
    { key: 'daytime', icon: 'Sun', tone: 'worker' },
  ];
  var SHIFT_HOURS = 4;
  var TARGET_MINUTES = 30;

  // The chosen example scenario; kept here so it survives a language switch.
  var active = SCENARIO_IDS[0];

  /** The request / bridge / worker panel for the active scenario. */
  function scenarioHtml(s, c) {
    var sc = s.scenarios[active];
    var rate = K.EXAMPLE_RATES[active];
    var payRange = K.inrRange(rate.min * SHIFT_HOURS, rate.max * SHIFT_HOURS);
    return '<div class="hero__swap animate-swap">' +
      '<div class="hero__request">' +
        '<p class="hero__label hero__label--biz">' + K.ui.icon('Store', 'icon-4 hero__label-icon') +
          '<span class="hero__wrap">' + s.card.requestLabel + '</span></p>' +
        '<h3 class="hero__role">' + sc.role + '</h3>' +
        '<p class="hero__place hero__place--biz">' + sc.place + '</p>' +
        '<p class="hero__meta hero__place--biz">' + K.ui.icon('Clock', 'icon-4 hero__label-icon') +
          '<span class="hero__wrap">' + sc.hours + '</span></p>' +
        '<p class="hero__task">' + sc.task + '</p>' +
      '</div>' +
      '<div class="hero__bridge">' +
        '<span class="hero__dash" aria-hidden="true"></span>' +
        '<p class="hero__bridge-text">' + K.fmt(s.card.bridge, { n: TARGET_MINUTES }) + '</p>' +
        '<span class="hero__dash" aria-hidden="true"></span>' +
      '</div>' +
      '<div class="hero__worker">' +
        '<p class="hero__label hero__label--worker">' + K.ui.icon('UserRound', 'icon-4 hero__label-icon hero__bright') +
          '<span class="hero__wrap">' + s.card.workerLabel + '</span></p>' +
        '<h3 class="hero__role">' + sc.worker + '</h3>' +
        '<p class="hero__place hero__place--worker">' + sc.workerArea + '</p>' +
        '<p class="hero__meta hero__place--worker">' + K.ui.icon('ShieldCheck', 'icon-4 hero__label-icon hero__bright') +
          '<span class="hero__wrap">' + K.fmt(s.card.workerMeta, { n: WORKER_MINUTES[active] }) + '</span></p>' +
        '<div class="hero__pay">' +
          '<p class="hero__pay-row"><span class="hero__wrap">' + K.fmt(s.card.payLabel, { hours: SHIFT_HOURS }) + '</span>' +
            '<span class="hero__pay-value">' + K.fmt(s.card.payValue, { range: payRange }) + '</span></p>' +
          '<p class="hero__pay-terms">' + s.card.payTerms + '</p>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  K.section('hero', {
    render: function () {
      var s = K.t('hero');
      var c = K.t('common');
      var options = SCENARIO_IDS.map(function (id) { return { value: id, label: c.categories[id] }; });

      var chips = TRUST_CHIPS.map(function (chip) {
        return '<li class="hero__chip">' +
          '<span class="hero__chip-icon hero__chip-icon--' + chip.tone + '">' + K.ui.icon(chip.icon, 'icon-4') + '</span>' +
          '<span class="hero__wrap">' + s.trust[chip.key] + '</span></li>';
      }).join('');

      // From desktop width (lg) the copy and the example card sit side by side from the top:
      // the headline lives in the left column, with the card level with it. Below lg everything stacks.
      return '<section class="hero"><div class="hero__container"><div class="hero__grid">' +
        '<div class="hero__copy">' +
          K.ui.pill({ wrap: true, tone: 'biz', icon: 'MapPin', html: s.pilot }) +
          // Below lg the headline takes two lines (lead, then accent), so it can stay larger than
          // the section headings. From lg it flows as one sentence and wraps within the left column.
          // Sizes are in rem and nothing is nowrap, so enlarged text wraps instead of overflowing.
          '<h1 class="hero__title"><span class="hero__lead">' + s.headline.lead + '</span> <span class="hero__accent">' + s.headline.accent + '</span></h1>' +
          // One line on phones too: sized to fit from 320px wide.
          '<p class="hero__tagline">' + c.tagline + '</p>' +
          '<p class="hero__intro">' + s.intro + '</p>' +
          '<div class="hero__buttons">' +
            K.ui.button({ variant: 'biz', size: 'lg', cls: 'hero__btn', attrs: { 'data-join': 'business' }, html: c.cta.needWorkers + K.ui.icon('ArrowRight', 'icon-5 hero__shrink-0') }) +
            // Both filled: the two sides get equal weight, each in its own colour.
            K.ui.button({ variant: 'worker', size: 'lg', cls: 'hero__btn', attrs: { 'data-join': 'worker' }, html: c.cta.wantWork + K.ui.icon('ArrowRight', 'icon-5 hero__shrink-0') }) +
          '</div>' +
          // A plain wrapping row on phones and tablets; flat chips under a hairline on desktop.
          '<ul class="hero__chips">' + chips + '</ul>' +
        '</div>' +
        '<div class="hero__side">' +
          K.ui.card({
            tone: 'white',
            html: '<h2 class="sr-only">' + s.card.title + '</h2>' +
              K.ui.segmented({ options: options, value: active, ariaLabel: s.card.switchLabel }) +
              '<div class="hero__scenario">' + scenarioHtml(s, c) + '</div>' +
              '<p class="hero__note">' + c.exampleRateNote + '</p>',
          }) +
        '</div>' +
      '</div></div></section>';
    },

    mount: function (el) {
      var buttons = el.querySelectorAll('.seg__btn');
      var holder = el.querySelector('.hero__scenario');
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function () {
          var value = btn.getAttribute('data-value');
          if (value === active) return;
          active = value;
          // Update in place (not a full re-render) so the focused button keeps focus.
          Array.prototype.forEach.call(buttons, function (b) {
            b.setAttribute('aria-pressed', b.getAttribute('data-value') === active ? 'true' : 'false');
          });
          holder.innerHTML = scenarioHtml(K.t('hero'), K.t('common'));
        });
      });
    },
  });
})();
