/*
 * Waitlist: the two-path chooser, then the business or worker form.
 * Plain-JS twin of src/sections/Waitlist.jsx.
 *
 * In React, App.jsx owned `side`, `context` and `joinCount` and passed them
 * down. Here they live in this closure and arrive through the join bus
 * (K.onJoin), with the same semantics as App.jsx's onJoin.
 *
 * Rendering: the whole section re-renders only on discrete changes (side
 * switch, chooser click, join, success, "add another", removing the picked
 * context, language switch). Typing never re-renders: per-field things
 * (phone formatting, error and hint lines, the submit alert, the spinner) are
 * patched in place, so the caret and IME composition (Hindi) are never lost.
 */
(function () {
  var ui = K.ui;

  function emptyValues(side) {
    return side === 'business'
      ? { businessName: '', contactName: '', phone: '', email: '', city: '', state: '', locality: '', supportNeed: '' }
      : { fullName: '', phone: '', email: '', city: '', state: '', locality: '', experience: '', availability: [] };
  }

  var REQUIRED = {
    business: ['businessName', 'contactName', 'phone', 'city'],
    worker: ['fullName', 'phone', 'city'],
  };

  // Every field that can fail validation, in the order it appears in the form:
  // focus goes to the first one that failed. Email is optional, but is checked
  // when something is typed.
  var CHECKED = {
    business: ['businessName', 'contactName', 'phone', 'email', 'city'],
    worker: ['fullName', 'phone', 'email', 'city'],
  };

  // Not required to submit, but not labelled "optional" either: the team wants
  // them filled in whenever the visitor knows them.
  var UNLABELLED = ['state', 'locality'];

  // The database refuses longer text (supabase/schema.sql, section 6). Its caps
  // are higher than these, because what is saved also carries the picked
  // category in front and joins area, city and state into one field.
  var MAX_LENGTH = {
    businessName: 100,
    contactName: 60,
    fullName: 60,
    city: 60,
    state: 60,
    locality: 100,
    supportNeed: 800,
    experience: 300,
    email: K.EMAIL_MAX_LENGTH,
  };

  // Example pay for a worker, across every shop type, for one standard shift.
  var SHIFT_HOURS = 4;
  var RATE_LIST = Object.keys(K.EXAMPLE_RATES).map(function (k) { return K.EXAMPLE_RATES[k]; });
  var WORKER_PAY_RANGE = K.inrRange(
    Math.min.apply(null, RATE_LIST.map(function (r) { return r.min; })) * SHIFT_HOURS,
    Math.max.apply(null, RATE_LIST.map(function (r) { return r.max; })) * SHIFT_HOURS
  );

  /** The two paths in the chooser card, in order. Text lives in strings (waitlist.chooser). */
  var PATHS = [
    { side: 'business', tone: 'biz', icon: 'Store' },
    { side: 'worker', tone: 'worker', icon: 'UserRound' },
  ];

  var AVAILABILITY_KEYS = ['weekdayMornings', 'weekdayAfternoons', 'weekends'];

  // What is saved is always English, whichever language the visitor reads in,
  // so the team's sheet stays sortable.
  var SAVED_WAITLIST = K.t('waitlist', 'en');

  function isInvalid(field, value) {
    if (field === 'phone') return !K.isValidIndianMobile(value);
    // Empty is fine for email; anything typed has to be a full address.
    if (field === 'email') return Boolean(String(value).trim()) && !K.isValidEmail(value);
    return !String(value).trim();
  }

  // The category names saved with a registration. The page now shows shorter
  // names (common.categories); these stay as they were, so earlier and later
  // rows in the team's sheet use the same labels.
  var SAVED_CATEGORY = {
    boutique: 'Boutique & studio',
    handloom: 'Handloom & textiles',
    cafe: 'Café & quick bites',
    salon: 'Salon',
  };

  function savedContext(side, context) {
    if (!context || !context.category || context.side !== side) return null;
    var parts = [SAVED_CATEGORY[context.category]];
    if (side === 'business' && context.hours) parts.push(context.hours + ' hours');
    return '[' + parts.join(' · ') + ']';
  }

  function joinParts(parts, separator) {
    return parts.map(function (part) { return (part == null ? '' : part).trim(); }).filter(Boolean).join(separator) || null;
  }

  // React's `import.meta.env.DEV`: only a local preview may pretend a demo-mode
  // submission was saved. A deployed site without Supabase config shows the error.
  function isLocalPreview() {
    if (typeof location === 'undefined') return false;
    return location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/.test(location.hostname);
  }

  /* ---------- state (what App.jsx and Waitlist.jsx kept in React state) ---------- */

  var state = {
    // App.jsx: which form is open (null = not chosen yet), what was picked further down the page, join counter.
    side: null,
    context: null,
    joinCount: 0,
    // Waitlist.jsx
    values: { business: emptyValues('business'), worker: emptyValues('worker') },
    errors: { business: {}, worker: {} },
    // Which side is sending / failed to send, so one form's state never shows on the other.
    submittingSide: null,
    failedSide: null,
    done: null,
  };

  var root = null;         // the placeholder element, set in mount
  var boundRoot = null;    // listeners are delegated on the placeholder once
  var lastCardKey = null;  // React keyed the card; animate only when it changes
  var caret = null;        // caret of the focused field, carried across a re-render

  // render() runs while the old DOM is still in place (app.js and rerender
  // both call it before swapping innerHTML): note where the caret was, so a
  // language switch mid-word does not throw it to the start of the field.
  function captureCaret() {
    caret = null;
    if (typeof document === 'undefined' || !root) return;
    var el = document.activeElement;
    if (!el || !root.contains(el) || !el.getAttribute('data-input')) return;
    try {
      if (el.selectionStart != null) caret = { id: el.id, start: el.selectionStart, end: el.selectionEnd, dir: el.selectionDirection };
    } catch (e) { /* type=email has no selection API */ }
  }

  function restoreCaret() {
    if (!caret) return;
    var el = document.getElementById(caret.id);
    if (el) {
      try { el.setSelectionRange(caret.start, caret.end, caret.dir || 'none'); } catch (e) { /* not supported */ }
    }
    caret = null;
  }

  /** Every "join" button on the page lands here (App.jsx onJoin). */
  K.onJoin(function (nextSide, nextContext) {
    if (nextSide) {
      state.side = nextSide;
      // A plain "join" clears any earlier pick, so nothing stale is saved with the form.
      state.context = nextContext ? Object.assign({}, nextContext, { side: nextSide }) : null;
    }
    state.joinCount += 1;
    // Synchronous: K.join focuses #waitlist-heading right after this returns.
    rerender();
  });

  /* ---------- markup ---------- */

  function errorHtml(id, message) {
    return '<p id="' + id + '-error" class="waitlist__error">' + ui.icon('AlertCircle', 'waitlist__msg-icon') +
      '<span>' + message + '</span></p>';
  }

  /** The error or hint line under a field (same helper for render and in-place patches). */
  function messagesHtml(s, side, field) {
    var id = side + '-' + field;
    var hint = s.fields[field].hint;
    var error = state.errors[side][field] ? s.errors[field] : null;
    if (error) return errorHtml(id, error);
    if (hint) return '<p id="' + id + '-hint" class="waitlist__hint">' + hint + '</p>';
    return '';
  }

  function describedBy(s, side, field) {
    var id = side + '-' + field;
    if (state.errors[side][field]) return id + '-error';
    return s.fields[field].hint ? id + '-hint' : null;
  }

  function fieldHtml(s, side, field, control) {
    var id = side + '-' + field;
    var optional = REQUIRED[side].indexOf(field) !== -1 || UNLABELLED.indexOf(field) !== -1 ? null : s.optional;
    return '<div data-field="' + field + '">' +
      '<label for="' + id + '" class="waitlist__label">' + s.fields[field].label +
      (optional ? '<span class="waitlist__optional"> (' + optional + ')</span>' : '') + '</label>' +
      control + messagesHtml(s, side, field) + '</div>';
  }

  /**
   * One input or textarea, wired like React's inputProps(). `before` holds the
   * element-specific attributes (type, autocomplete…); `cls` extra classes.
   */
  function controlHtml(s, side, field, opts) {
    var id = side + '-' + field;
    var hasError = Boolean(state.errors[side][field]);
    var a = Object.assign({}, opts.before || {}, {
      id: id,
      'data-input': field,
      placeholder: s.fields[field].placeholder,
      maxlength: MAX_LENGTH[field],
      'aria-required': REQUIRED[side].indexOf(field) !== -1 ? 'true' : null,
      'aria-invalid': hasError ? 'true' : null,
      'aria-describedby': describedBy(s, side, field),
      class: K.cx('waitlist__input', opts.cls, hasError && 'is-invalid'),
    });
    if (opts.tag === 'textarea') {
      // The value is set in mount (markup would eat a leading newline).
      return '<textarea' + ui.attrs(a) + '></textarea>';
    }
    a.value = state.values[side][field];
    return '<input' + ui.attrs(a) + '>';
  }

  function headingHtml(s) {
    return '<div class="waitlist__head">' +
      '<h2 id="waitlist-heading" tabindex="-1" class="waitlist__title">' + s.title + '</h2>' +
      '<p class="waitlist__sub">' + s.sub + '</p></div>';
  }

  /*
   * Before a side is chosen: one card with both paths side by side, equal
   * weight, each in its own colour. Choosing one opens its form below,
   * where the switch lets the visitor change their mind.
   */
  function chooserHtml(s, c) {
    var paths = PATHS.map(function (p) {
      var path = s.chooser[p.side];
      return '<div class="waitlist__path">' +
        '<div class="waitlist__pills">' + ui.pill({ tone: p.tone, icon: p.icon, html: c.side[p.side] }) + '</div>' +
        '<h3 class="waitlist__path-title">' + path.title + '</h3>' +
        '<p class="waitlist__path-body">' + K.fmt(path.body, { range: WORKER_PAY_RANGE, hours: SHIFT_HOURS }) + '</p>' +
        '<ul class="check-list waitlist__points">' + path.points.map(function (point) {
          return ui.checkItem({ tone: p.tone, cls: 'waitlist__point', html: point });
        }).join('') + '</ul>' +
        '<div class="waitlist__path-foot"><div class="waitlist__path-action">' +
        // Not data-join: that would count as a join from elsewhere on the page.
        ui.button({
          variant: p.tone, size: 'lg', cls: 'waitlist__full',
          attrs: { id: 'waitlist-choose-' + p.side, 'data-choose': p.side },
          html: (p.side === 'worker' ? c.cta.wantWork : c.cta.needWorkers) + ui.icon('ArrowRight', 'icon-5'),
        }) +
        '</div></div></div>';
    }).join('');

    return '<div class="waitlist__chooser">' +
      '<div class="waitlist__band">' +
      '<p class="waitlist__band-main"><span class="waitlist__band-dot" aria-hidden="true"></span><span class="min-w-0">' + s.chooser.band + '</span></p>' +
      '<p class="waitlist__band-note">' + s.chooser.bandNote + '</p></div>' +
      '<div class="waitlist__paths">' + paths + '</div>' +
      '<p class="waitlist__footnote">' + c.exampleRateNote + '</p></div>';
  }

  function doneHtml(s, c, tone, animate) {
    var done = state.done;
    var esc = K.esc;
    return ui.card({
      cls: animate ? 'animate-swap' : null,
      attrs: { role: 'status' },
      html: '<span class="waitlist__done-icon waitlist__done-icon--' + tone + '">' + ui.icon('CheckCircle2', 'icon-6') + '</span>' +
        '<h3 id="waitlist-done-heading" tabindex="-1" class="waitlist__card-title">' + K.fmt(s.success.title, { name: esc(done.name) }) + '</h3>' +
        '<p class="waitlist__done-text">' + (done.business
          ? K.fmt(s.success.business, { business: esc(done.business), place: esc(done.place) })
          : K.fmt(s.success.worker, { place: esc(done.place) })) + '</p>' +
        '<p class="waitlist__done-text">' + K.fmt(s.success.next, { phone: esc(done.phone) }) + '</p>' +
        (done.mock ? '<p class="waitlist__demo">' + s.success.demo + '</p>' : '') +
        '<div class="waitlist__done-actions">' +
        ui.button({
          variant: 'whatsapp',
          href: K.whatsappUrl(done.side === 'worker' ? c.whatsapp.joinedWorker : c.whatsapp.joinedBusiness),
          attrs: { id: 'waitlist-done-whatsapp', target: '_blank', rel: 'noopener noreferrer' },
          html: ui.whatsappIcon('icon-5') + s.success.whatsapp,
        }) +
        ui.button({
          variant: tone === 'worker' ? 'link-worker' : 'link-biz',
          attrs: { id: 'waitlist-again', 'data-again': '' },
          html: s.success.again,
        }) +
        '</div>',
    });
  }

  function contextText(s, c, side, context) {
    return [
      c.categories[context.category],
      side === 'business' && context.hours ? K.fmt(c.hours, { n: context.hours }) : null,
      side === 'worker' && context.shiftsPerWeek
        ? (context.shiftsPerWeek === 1 ? s.context.oneShift : K.fmt(s.context.shifts, { n: context.shiftsPerWeek }))
        : null,
    ].filter(Boolean).join(' · ');
  }

  function alertHtml(s) {
    return '<div role="alert" class="waitlist__alert">' + ui.icon('AlertCircle', 'waitlist__msg-icon') +
      '<span>' + s.errors.submit + '</span></div>';
  }

  function submitInnerHtml(s, copy, submitting) {
    return submitting
      ? ui.icon('Loader2', 'icon-5 animate-spin') + s.submitting
      : copy.submit + ui.icon('ArrowRight', 'icon-5');
  }

  function formHtml(s, c, side, tone, animate) {
    var copy = s[side];
    var context = state.context;
    var showContext = context && context.category && context.side === side;
    var form = state.values[side];
    var f = function (field, control) { return fieldHtml(s, side, field, control); };
    var input = function (field, opts) { return controlHtml(s, side, field, opts || {}); };

    var fields = '';
    if (side === 'business') {
      fields += f('businessName', input('businessName', { before: { type: 'text', autocomplete: 'organization' } }));
      fields += f('contactName', input('contactName', { before: { type: 'text', autocomplete: 'name' } }));
    } else {
      fields += f('fullName', input('fullName', { before: { type: 'text', autocomplete: 'name' } }));
    }
    fields += f('phone', '<div class="waitlist__phone">' +
      '<span class="waitlist__prefix">+91</span>' +
      input('phone', { before: { type: 'tel', inputmode: 'tel', autocomplete: 'tel-national' }, cls: 'waitlist__input--phone' }) +
      '</div>');
    fields += f('email', input('email', { before: { type: 'email', inputmode: 'email', autocomplete: 'email', autocapitalize: 'none', spellcheck: 'false' } }));
    fields += '<div class="waitlist__row">' +
      f('city', input('city', { before: { type: 'text', autocomplete: 'address-level2' } })) +
      f('state', input('state', { before: { type: 'text', autocomplete: 'address-level1' } })) +
      '</div>';
    fields += f('locality', input('locality', { before: { type: 'text' } }));
    if (side === 'business') {
      fields += f('supportNeed', input('supportNeed', { tag: 'textarea', before: { rows: '3' }, cls: 'waitlist__input--textarea' }));
    } else {
      fields += f('experience', input('experience', { before: { type: 'text' } }));
      fields += '<fieldset><legend class="waitlist__label waitlist__legend">' + s.fields.availability.label +
        '<span class="waitlist__optional"> (' + s.optional + ')</span></legend>' +
        '<div class="waitlist__avail">' + AVAILABILITY_KEYS.map(function (key) {
          return availabilityChoiceHtml(s, key, form.availability.indexOf(key) !== -1);
        }).join('') + '</div>' +
        '<p class="waitlist__hint">' + s.fields.availability.hint + '</p></fieldset>';
    }

    if (state.failedSide === side) fields += alertHtml(s);

    var submitting = state.submittingSide === side;
    fields += ui.button({
      type: 'submit', variant: tone === 'worker' ? 'worker' : 'biz', size: 'lg', cls: 'waitlist__full',
      attrs: { id: side + '-submit', disabled: submitting },
      html: submitInnerHtml(s, copy, submitting),
    });

    return ui.card({
      cls: animate ? 'animate-swap' : null,
      html: '<h3 id="waitlist-form-heading" tabindex="-1" class="waitlist__card-title">' + copy.heading + '</h3>' +
        '<p class="waitlist__card-sub">' + copy.sub + '</p>' +
        (showContext
          ? '<div class="waitlist__context waitlist__context--' + tone + '">' +
            '<p class="min-w-0">' + s.context.label + ': <span class="waitlist__context-value">' + K.esc(contextText(s, c, side, context)) + '</span></p>' +
            '<button type="button" id="waitlist-clear-context" data-clear-context aria-label="' + K.esc(s.context.remove) + '" class="waitlist__context-remove">' +
            ui.icon('X', 'icon-5') + '</button></div>'
          : '') +
        '<form id="' + side + '-form" novalidate class="waitlist__form">' + fields + '</form>' +
        '<p class="waitlist__disclaimer">' + copy.disclaimer + '</p>',
    });
  }

  function availabilityChoiceHtml(s, key, selected) {
    return ui.choice({
      tone: 'worker', selected: selected,
      attrs: { id: 'worker-availability-' + key, 'data-avail': key },
      html: '<span class="waitlist__avail-text">' + s.availabilityOptions[key] + '</span>',
    });
  }

  function render(ctx) {
    captureCaret();
    var s = K.t('waitlist');
    var c = (ctx && ctx.c) || K.t('common');
    var side = state.side;
    var inner = headingHtml(s);
    var cardKey = null;

    if (!side) {
      inner += chooserHtml(s, c);
    } else {
      var tone = side === 'worker' ? 'worker' : 'biz';
      var done = state.done;
      // A join button pressed elsewhere on the page since then opens a fresh form, not the old confirmation.
      var showDone = done && done.side === side && done.joinCount === state.joinCount;
      cardKey = showDone ? 'done-' + side : side;
      var animate = cardKey !== lastCardKey;
      inner += '<div class="waitlist__column">' +
        ui.segmented({
          ariaLabel: s.chooserLabel,
          value: side,
          cls: 'waitlist__seg',
          options: [
            // The same words as the join buttons that lead here.
            { value: 'business', label: c.cta.needWorkers, tone: 'biz' },
            { value: 'worker', label: c.cta.wantWork, tone: 'worker' },
          ],
        }) +
        (showDone ? doneHtml(s, c, tone, animate) : formHtml(s, c, side, tone, animate)) +
        '</div>';
    }
    lastCardKey = cardKey;

    // Wide for the two-path chooser; the form keeps a narrow, readable column.
    return '<section id="waitlist" class="waitlist"><div class="waitlist__container">' + inner + '</div></section>';
  }

  /* ---------- in-place patches (no re-render while typing) ---------- */

  function syncField(field) {
    if (!root || !state.side) return;
    var side = state.side;
    var s = K.t('waitlist');
    var id = side + '-' + field;
    var input = document.getElementById(id);
    var wrap = root.querySelector('[data-field="' + field + '"]');
    if (!input || !wrap) return;
    var hasError = Boolean(state.errors[side][field]);
    if (hasError) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    var described = describedBy(s, side, field);
    if (described) input.setAttribute('aria-describedby', described); else input.removeAttribute('aria-describedby');
    input.classList.toggle('is-invalid', hasError);
    ['-error', '-hint'].forEach(function (suffix) {
      var old = document.getElementById(id + suffix);
      if (old && old.parentNode === wrap) wrap.removeChild(old);
    });
    wrap.insertAdjacentHTML('beforeend', messagesHtml(s, side, field));
  }

  /** The submit alert and the submit button (spinner, disabled) for the open form. */
  function syncStatus() {
    if (!root || !state.side) return;
    var side = state.side;
    var formEl = document.getElementById(side + '-form');
    var button = document.getElementById(side + '-submit');
    if (!formEl || !button) return;
    var s = K.t('waitlist');
    var alert = formEl.querySelector('.waitlist__alert');
    var failed = state.failedSide === side;
    if (failed && !alert) button.insertAdjacentHTML('beforebegin', alertHtml(s));
    if (!failed && alert) alert.parentNode.removeChild(alert);
    var submitting = state.submittingSide === side;
    if (button.disabled !== submitting) {
      button.disabled = submitting;
      button.innerHTML = submitInnerHtml(s, s[side], submitting);
    }
  }

  /* ---------- state changes ---------- */

  function rerender() {
    if (!root) return;
    // Like React, keep focus on an element that survives the update.
    var active = document.activeElement;
    var inside = active && root.contains(active);
    var focusId = inside && active.id;
    var focusKey = inside && active.getAttribute('data-focus-key');
    var ctx = { lang: K.lang, t: K.t, c: K.t('common') };
    root.innerHTML = render(ctx);
    mount(root, ctx);
    if (!inside) return;
    var target = (focusKey && root.querySelector('[data-focus-key="' + focusKey + '"]')) || (focusId && document.getElementById(focusId));
    if (target && target !== document.activeElement) target.focus({ preventScroll: true });
  }

  function focusById(id) {
    var el = document.getElementById(id);
    if (el) el.focus();
  }

  function setField(field, value) {
    var side = state.side;
    state.values[side][field] = value;
    if (state.errors[side][field]) {
      state.errors[side][field] = false;
      syncField(field);
    }
    if (state.failedSide === side) {
      state.failedSide = null;
      syncStatus();
    }
  }

  // Check a required field as soon as the visitor leaves it with something typed.
  function checkOnBlur(field) {
    var side = state.side;
    var value = state.values[side][field];
    if (value && isInvalid(field, value)) {
      state.errors[side][field] = true;
      syncField(field);
    }
  }

  function toggleAvailability(key) {
    var current = state.values.worker.availability;
    setField('availability', current.indexOf(key) !== -1
      ? current.filter(function (k) { return k !== key; })
      : current.concat([key]));
    var btn = document.getElementById('worker-availability-' + key);
    if (!btn) return;
    var hadFocus = document.activeElement === btn;
    btn.outerHTML = availabilityChoiceHtml(K.t('waitlist'), key, state.values.worker.availability.indexOf(key) !== -1);
    if (hadFocus) focusById('worker-availability-' + key);
  }

  // Re-formatting the number would otherwise throw the caret to the end,
  // which makes fixing one digit in the middle error-prone.
  function handlePhoneInput(el) {
    var before = K.digitsBefore(el.value, el.selectionStart == null ? el.value.length : el.selectionStart);
    var formatted = K.formatPhone(el.value);
    setField('phone', formatted);
    if (el.value !== formatted) el.value = formatted;
    requestAnimationFrame(function () {
      if (document.activeElement !== el) return;
      var caret = K.caretAfterDigits(formatted, before);
      el.setSelectionRange(caret, caret);
    });
  }

  function handleSubmit() {
    var side = state.side;
    var form = state.values[side];
    var found = {};
    CHECKED[side].forEach(function (field) {
      if (isInvalid(field, form[field])) found[field] = true;
    });
    state.errors[side] = found;
    CHECKED[side].forEach(syncField);
    var firstInvalid = null;
    for (var i = 0; i < CHECKED[side].length; i += 1) {
      if (found[CHECKED[side][i]]) { firstInvalid = CHECKED[side][i]; break; }
    }
    if (firstInvalid) {
      focusById(side + '-' + firstInvalid);
      return;
    }

    // Snapshot what React's closure held for the whole submission.
    var sentSide = side;
    var context = state.context;
    var joinCount = state.joinCount;
    state.submittingSide = sentSide;
    state.failedSide = null;
    syncStatus();

    var place = joinParts([form.locality, form.city, form.state], ', ');
    var phone = K.formatPhone(form.phone);
    var email = K.normalizeEmail(form.email);
    var name;
    var business = sentSide === 'business' ? form.businessName.trim() : null;
    var request;
    try {
      if (sentSide === 'business') {
        name = form.contactName.trim();
        request = K.submitBusinessRegistration({
          businessName: form.businessName.trim(),
          contactName: name,
          phone: phone,
          email: email,
          workLocation: place,
          supportNeed: joinParts([savedContext('business', context), form.supportNeed], ' '),
        });
      } else {
        name = form.fullName.trim();
        var shifts = context && context.side === 'worker' && context.shiftsPerWeek
          ? context.shiftsPerWeek + ' shift' + (context.shiftsPerWeek > 1 ? 's' : '') + '/week'
          : null;
        request = K.submitWorkerRegistration({
          fullName: name,
          phone: phone,
          email: email,
          locality: place,
          experience: joinParts([savedContext('worker', context), form.experience], ' '),
          // Listed in a fixed order, not click order, so identical answers save identically.
          availability: joinParts(AVAILABILITY_KEYS.filter(function (key) { return form.availability.indexOf(key) !== -1; })
            .map(function (key) { return SAVED_WAITLIST.availabilityOptions[key]; }).concat([shifts]), ', '),
        });
      }
    } catch (err) {
      request = Promise.reject(err);
    }

    Promise.resolve(request).then(function (result) {
      // Without a database nothing was saved. Only a local preview may pretend otherwise.
      if (result && result.mock && !isLocalPreview()) {
        throw new Error('Supabase is not configured, so the registration was not saved.');
      }
      state.done = { side: sentSide, joinCount: joinCount, name: name, business: business, place: place, phone: phone, mock: Boolean(result && result.mock) };
      state.values[sentSide] = emptyValues(sentSide);
      if (state.context && state.context.side === sentSide) state.context = null;
      state.submittingSide = null;
      // On the other form nothing visible changed: leave it (and its caret) alone.
      if (state.side !== sentSide) return;
      rerender();
      // After a successful submit, move focus to the confirmation so it is announced.
      focusById('waitlist-done-heading');
    }).catch(function (err) {
      console.error(err);
      state.failedSide = sentSide;
      state.submittingSide = null;
      syncStatus();
    });
  }

  /* ---------- events ---------- */

  function bind(el) {
    el.addEventListener('click', function (event) {
      var t = event.target;
      var choose = t.closest('[data-choose]');
      if (choose) {
        state.side = choose.getAttribute('data-choose');
        rerender();
        // The button removed the card it sat in: hand focus to the form that replaces it.
        focusById('waitlist-form-heading');
        return;
      }
      var seg = t.closest('.waitlist__seg .seg__btn');
      if (seg) {
        var next = seg.getAttribute('data-value');
        if (next === state.side) return;
        state.side = next;
        rerender();
        return;
      }
      var avail = t.closest('[data-avail]');
      if (avail) { toggleAvailability(avail.getAttribute('data-avail')); return; }
      if (t.closest('[data-clear-context]')) {
        state.context = null;
        rerender();
        return;
      }
      if (t.closest('[data-again]')) {
        state.done = null;
        rerender();
        // "Add another response" removed the button that had focus: hand focus to the form.
        focusById('waitlist-form-heading');
      }
    });

    el.addEventListener('input', function (event) {
      var t = event.target;
      var field = t.getAttribute && t.getAttribute('data-input');
      if (!field || !state.side) return;
      if (field === 'phone') handlePhoneInput(t);
      else setField(field, t.value);
    });

    el.addEventListener('focusout', function (event) {
      var t = event.target;
      var field = t.getAttribute && t.getAttribute('data-input');
      if (!field || !state.side || CHECKED[state.side].indexOf(field) === -1) return;
      // Some browsers fire blur when a re-render removes the focused field;
      // React never removed it, so only a real blur counts.
      Promise.resolve().then(function () {
        if (t.isConnected) checkOnBlur(field);
      });
    });

    el.addEventListener('submit', function (event) {
      if (!event.target.closest('.waitlist__form')) return;
      event.preventDefault();
      handleSubmit();
    });
  }

  function mount(el) {
    root = el;
    if (boundRoot !== el) {
      bind(el);
      boundRoot = el;
    }
    // Lets app.js (and rerender) keep focus on the segment after a re-render.
    el.querySelectorAll('.waitlist__seg .seg__btn').forEach(function (btn) {
      btn.setAttribute('data-focus-key', 'waitlist-side-' + btn.getAttribute('data-value'));
    });
    var ta = document.getElementById('business-supportNeed');
    if (ta) ta.value = state.values.business.supportNeed;
    // Focus is restored after mount (by app.js or rerender); the selection set here survives it.
    restoreCaret();
  }

  K.section('waitlist', { render: render, mount: mount });
})();
