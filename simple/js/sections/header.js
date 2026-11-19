(function () {
  var NAV = [
    { key: 'shifts', href: '#shifts' },
    { key: 'areas', href: '#areas' },
    { key: 'how', href: '#how-it-works' },
    { key: 'approach', href: '#trust' },
    { key: 'faq', href: '#faq' },
  ];

  // Menu state lives here so it survives a language switch (which re-renders the header).
  var state = { open: false };
  // The header currently on the page; the document-level listeners below look it up here.
  var current = null;
  var listening = false;

  function menuButton() { return current && current.querySelector('#menu-button'); }

  /** Apply the open/closed state to the live DOM without re-rendering, so the CSS transitions run. */
  function apply() {
    if (!current) return;
    var s = K.t('header');
    current.classList.toggle('is-open', state.open);
    var btn = menuButton();
    if (btn) {
      btn.setAttribute('aria-expanded', state.open ? 'true' : 'false');
      btn.setAttribute('aria-label', state.open ? s.closeMenu : s.openMenu);
    }
    var nav = current.querySelector('#mobile-nav');
    if (nav) {
      nav.inert = !state.open;
      if (state.open) nav.removeAttribute('inert'); else nav.setAttribute('inert', '');
    }
  }

  function setOpen(open) {
    if (state.open === open) return;
    state.open = open;
    apply();
  }

  // Scroll progress bar. Written straight to the element's transform inside
  // requestAnimationFrame: no re-render per scroll event.
  var ticking = false;
  function updateProgress() {
    ticking = false;
    var bar = current && current.querySelector('.header__progress');
    if (!bar) return;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    bar.style.transform = 'scaleX(' + progress + ')';
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }

  // Close the menu on an outside tap or Escape (Escape returns focus to the button).
  function onPointerDown(e) {
    if (state.open && current && !current.contains(e.target)) setOpen(false);
  }
  function onKeyDown(e) {
    if (state.open && e.key === 'Escape') {
      setOpen(false);
      var btn = menuButton();
      if (btn) btn.focus();
    }
  }

  // Registered once for the page; they always act on `current`, so re-rendering never stacks them.
  function listen() {
    if (listening) return;
    listening = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
  }

  function joinButton(cls) {
    var c = K.t('common');
    return K.ui.button({
      variant: 'biz',
      cls: cls,
      attrs: { 'data-header-join': true },
      html: c.cta.join + K.ui.icon('ArrowRight', 'icon-5'),
    });
  }

  K.section('header', {
    render: function () {
      var s = K.t('header');
      var other = K.lang === 'hi' ? 'en' : 'hi';
      var open = state.open;

      var desktopLinks = NAV.map(function (item) {
        return '<a href="' + item.href + '" class="header__link">' + s.nav[item.key] + '</a>';
      }).join('');
      var mobileLinks = NAV.map(function (item) {
        return '<a href="' + item.href + '" class="header__mlink">' + s.nav[item.key] + '</a>';
      }).join('');

      return '<header class="site-header' + (open ? ' is-open' : '') + '">' +
        // A full-width white strip above the menu's dimmed backdrop, so the header itself never dims.
        '<div class="header__strip">' +
          // The row wraps instead of overflowing when text is enlarged.
          '<div class="header__row">' +
            '<a href="#top" aria-label="' + K.esc(s.home) + '" class="header__home logo-link">' + K.ui.logo() + '</a>' +
            '<nav aria-label="' + K.esc(s.navLabel) + '" class="header__nav">' + desktopLinks + '</nav>' +
            '<div class="header__actions">' +
              '<button type="button" id="lang-toggle" aria-label="' + K.esc(s.switchLabel) + '" lang="' + other + '" class="header__lang">' +
                K.ui.icon('Languages', 'icon-4 header__lang-icon') + '<span>' + s.switchTo + '</span></button>' +
              // Below sm the hero buttons and the menu already offer this. The wrapper
              // does the hiding: the button sets its own display.
              '<span class="header__join">' + joinButton('header__join-btn') + '</span>' +
              // Menu button: three bars that fold into a cross.
              '<button type="button" id="menu-button" aria-label="' + K.esc(open ? s.closeMenu : s.openMenu) + '" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="mobile-nav" class="header__menu-btn">' +
                '<span class="header__bars" aria-hidden="true"><span class="header__bar header__bar--top"></span><span class="header__bar header__bar--mid"></span><span class="header__bar header__bar--bot"></span></span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        // Scroll progress along the header's bottom edge.
        '<div class="header__progress" style="transform:scaleX(0)" aria-hidden="true"></div>' +
        // Dimmed page behind the open menu; a tap on it closes the menu. It fills the
        // screen and the header row and menu paint above it, so it needs no fixed
        // header height and adds nothing to the page's scroll length.
        '<div class="header__backdrop" aria-hidden="true"></div>' +
        // The menu slides down from under the header and fades in.
        '<div id="mobile-nav" class="header__menu"' + (open ? '' : ' inert') + '>' +
          '<nav aria-label="' + K.esc(s.navLabel) + '" class="header__menu-nav">' + mobileLinks +
            joinButton('header__menu-join') +
          '</nav>' +
        '</div>' +
      '</header>';
    },

    mount: function (el) {
      var header = el.querySelector('.site-header');
      current = header;
      listen();
      apply();
      updateProgress();

      el.querySelector('#lang-toggle').addEventListener('click', function () {
        K.setLang(K.lang === 'hi' ? 'en' : 'hi');
      });
      el.querySelector('#menu-button').addEventListener('click', function () { setOpen(!state.open); });
      el.querySelector('.header__backdrop').addEventListener('click', function () { setOpen(false); });
      el.querySelector('.header__home').addEventListener('click', function () { setOpen(false); });
      Array.prototype.forEach.call(el.querySelectorAll('.header__mlink'), function (a) {
        a.addEventListener('click', function () { setOpen(false); });
      });
      Array.prototype.forEach.call(el.querySelectorAll('[data-header-join]'), function (b) {
        b.addEventListener('click', function () { setOpen(false); K.join(null); });
      });
      // Tabbing out of an open menu closes it, so it never sits over the content being read.
      header.addEventListener('focusout', function (e) {
        if (state.open && e.relatedTarget && !header.contains(e.relatedTarget)) setOpen(false);
      });
    },
  });
})();
