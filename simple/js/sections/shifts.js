(function () {
  var SHIFT_HOURS = [4, 6, 8];
  var SHIFTS_PER_WEEK = [1, 2, 3, 5];
  /** Worker view: every shift is 4 hours, and a month counts as 4 weeks. */
  var WORKER_SHIFT_HOURS = 4;
  var WEEKS_PER_MONTH = 4;

  // Visitor choices live here so they survive a language switch (render() re-runs).
  var state = { side: 'business', category: K.CATEGORY_IDS[0], hours: 4, shiftsPerWeek: 2 };

  /** Small label for a group of choices, with an optional note beside it. */
  function groupLabel(id, label, note) {
    return '<div class="shifts__group-label"><span id="' + id + '" class="shifts__group-title">' + label + '</span>' +
      (note ? '<span class="shifts__group-note">' + note + '</span>' : '') + '</div>';
  }

  function arrow() { return K.ui.icon('ArrowRight', 'icon-5 shrink-0'); }

  /** The interactive part (segmented strip + card). Re-rendered on every choice. */
  function body() {
    var s = K.t('shifts');
    var c = K.t('common');
    var ids = K.uid('shifts');
    var isBusiness = state.side === 'business';
    var tone = isBusiness ? 'biz' : 'worker';
    var category = state.category, hours = state.hours, shiftsPerWeek = state.shiftsPerWeek;
    var rate = K.EXAMPLE_RATES[category];

    var perShiftMin = rate.min * WORKER_SHIFT_HOURS;
    var perShiftMax = rate.max * WORKER_SHIFT_HOURS;
    var perWeekMin = perShiftMin * shiftsPerWeek;
    var perWeekMax = perShiftMax * shiftsPerWeek;

    var estimate = isBusiness
      ? K.inrRange(rate.min * hours, rate.max * hours)
      : K.inrRange(perWeekMin * WEEKS_PER_MONTH, perWeekMax * WEEKS_PER_MONTH);
    var estimateLabel = isBusiness ? K.fmt(s.bizEstimateLabel, { n: hours }) : s.workerEstimateLabel;

    var seg = K.ui.segmented({
      ariaLabel: s.sideLabel, cls: 'shifts__seg', value: state.side,
      options: [
        { value: 'business', label: s.sideBusiness, tone: 'biz' },
        { value: 'worker', label: s.sideWorker, tone: 'worker' },
      ],
    });

    var categories = K.CATEGORY_IDS.map(function (id) {
      return K.ui.choice({
        tone: tone, selected: category === id, attrs: { 'data-category': id, 'data-focus-key': 'shifts-cat-' + id },
        html: '<span class="shifts__choice-title">' + c.categories[id] + '</span>' +
          '<span class="shifts__choice-sub choice__sub">' + K.inrRange(K.EXAMPLE_RATES[id].min, K.EXAMPLE_RATES[id].max) + ' ' + c.perHour + '*</span>',
      });
    }).join('');

    var second;
    if (isBusiness) {
      second = '<div>' + groupLabel(ids + '-len', s.lengthLabel, s.lengthNote) +
        '<div role="group" aria-labelledby="' + ids + '-len" class="shifts__grid shifts__grid--3">' +
        SHIFT_HOURS.map(function (h) {
          return K.ui.choice({
            compact: true, tone: 'biz', selected: hours === h, attrs: { 'data-hours': h, 'data-focus-key': 'shifts-hours-' + h },
            html: '<span class="shifts__choice-title">' + K.fmt(c.hours, { n: h }) + '</span>' +
              '<span class="shifts__choice-line choice__sub">' + s.lengths[h] + '</span>',
          });
        }).join('') + '</div></div>';
    } else {
      second = '<div>' + groupLabel(ids + '-week', s.perWeekLabel, s.perWeekNote) +
        '<div role="group" aria-labelledby="' + ids + '-week" class="shifts__grid shifts__grid--4">' +
        SHIFTS_PER_WEEK.map(function (n) {
          return K.ui.choice({
            compact: true, tone: 'worker', selected: shiftsPerWeek === n,
            attrs: { 'data-per-week': n, 'data-focus-key': 'shifts-week-' + n, 'aria-label': n === 1 ? s.shiftOne : K.fmt(s.shiftMany, { n: n }) },
            html: '<span class="shifts__count">' + n + '</span>',
          });
        }).join('') + '</div></div>';
    }

    var facts = isBusiness
      ? K.ui.fact({ label: s.pilotFeeLabel, html: s.pilotFeeValue }) +
        K.ui.fact({ label: s.paymentLabel, html: s.paymentValue }) +
        K.ui.fact({ label: s.matchLabel, html: s.matchValue })
      : K.ui.fact({ label: s.perShiftLabel, html: K.inrRange(perShiftMin, perShiftMax) + '*' }) +
        K.ui.fact({ label: s.perWeekFactLabel, html: K.inrRange(perWeekMin, perWeekMax) + '*' }) +
        K.ui.fact({ label: s.workerFeeLabel, html: s.workerFeeValue });

    var cta = isBusiness
      ? K.ui.button({ variant: 'biz', cls: 'w-full', html: s.ctaBusiness + arrow(), attrs: { 'data-shifts-join': 'business' } })
      : K.ui.button({ variant: 'worker', cls: 'w-full', html: s.ctaWorker + arrow(), attrs: { 'data-shifts-join': 'worker' } });

    // The result block is replaced on every choice (re-triggering .animate-swap); the
    // live line above it stays so screen readers hear the new figure, not just "pressed".
    var result =
      '<div class="shifts__result">' +
        '<p class="sr-only" aria-live="polite">' + c.categories[category] + '. ' + estimateLabel + ': ' + estimate + '</p>' +
        '<div class="animate-swap shifts__result-body">' +
          '<div>' +
            '<div class="shifts__result-head"><h3 class="shifts__result-title">' + c.categories[category] + '</h3>' +
              K.ui.pill({ tone: tone, html: c.zeroFee }) + '</div>' +
            '<p class="shifts__work">' + s.work[category] + ' ' + s.limits[category] + '</p>' +
            '<dl class="facts shifts__typical">' + K.ui.fact({ label: s.typicalHoursLabel, html: s.typicalHours[category] }) + '</dl>' +
          '</div>' +
          '<div>' +
            '<p class="shifts__small">' + estimateLabel + '</p>' +
            '<p class="shifts__big shifts__big--' + tone + '">' + estimate + '*</p>' +
            (isBusiness ? '' : '<p class="shifts__small shifts__basis">' + (shiftsPerWeek === 1 ? s.basisOne : K.fmt(s.basisMany, { n: shiftsPerWeek })) + '</p>') +
          '</div>' +
          '<dl class="facts shifts__facts">' + facts + '</dl>' +
          '<div>' + cta + '<p class="shifts__small shifts__note">' + c.exampleRateNote + '</p></div>' +
        '</div>' +
      '</div>';

    return seg + K.ui.card({
      cls: 'shifts__card',
      html: '<div class="shifts__layout"><div class="shifts__choices">' +
        '<div>' + groupLabel(ids + '-cat', s.categoryLabel) +
        '<div role="group" aria-labelledby="' + ids + '-cat" class="shifts__grid shifts__grid--cats">' + categories + '</div></div>' +
        second + '</div>' + result + '</div>',
    });
  }

  K.section('shifts', {
    render: function () {
      var s = K.t('shifts');
      return K.ui.section({
        id: 'shifts', tone: 'page', cls: 'shifts',
        html: K.ui.sectionHeading({ title: s.title, sub: s.sub }) + '<div data-shifts-body>' + body() + '</div>',
      });
    },
    mount: function (el) {
      var host = el.querySelector('[data-shifts-body]');
      if (!host) return;

      function repaint(focusKey, segValue) {
        host.innerHTML = body();
        var target = focusKey && host.querySelector('[data-focus-key="' + focusKey + '"]');
        if (!target && segValue) target = host.querySelector('.seg__btn[data-value="' + segValue + '"]');
        if (target) target.focus({ preventScroll: true });
      }

      host.addEventListener('click', function (event) {
        var btn = event.target.closest && event.target.closest('button');
        if (!btn || !host.contains(btn)) return;
        if (btn.classList.contains('seg__btn')) {
          state.side = btn.getAttribute('data-value');
          return repaint(null, state.side);
        }
        if (btn.hasAttribute('data-category')) {
          state.category = btn.getAttribute('data-category');
        } else if (btn.hasAttribute('data-hours')) {
          state.hours = Number(btn.getAttribute('data-hours'));
        } else if (btn.hasAttribute('data-per-week')) {
          state.shiftsPerWeek = Number(btn.getAttribute('data-per-week'));
        } else if (btn.hasAttribute('data-shifts-join')) {
          // Same context shape as the React onJoin calls.
          if (btn.getAttribute('data-shifts-join') === 'business') {
            return K.join('business', { category: state.category, hours: state.hours });
          }
          return K.join('worker', { category: state.category, shiftsPerWeek: state.shiftsPerWeek });
        } else {
          return;
        }
        repaint(btn.getAttribute('data-focus-key'));
      });
    },
  });
})();
