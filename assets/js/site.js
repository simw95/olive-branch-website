/* ==========================================================================
   Site chrome — header, footer, navigation, cart count, zoom, forms.
   Header and footer are injected from OLIVE.config + OLIVE.collections so a
   nav change is a one-file change rather than a fourteen-file change.
   ========================================================================== */

(function () {
  'use strict';

  var C = OLIVE.config;
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  /* The olive sprig. The only mark on the site. */
  var LEAF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.15" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 22V7"/>' +
    '<path d="M12 13.5c0-3.2 2.4-5.4 5.6-5.4 0 3.2-2.4 5.4-5.6 5.4z"/>' +
    '<path d="M12 13.5c0-3.2-2.4-5.4-5.6-5.4 0 3.2 2.4 5.4 5.6 5.4z"/>' +
    '<path d="M12 8.2c0-2.6 2-4.4 4.6-4.4 0 2.6-2 4.4-4.6 4.4z"/>' +
    '</svg>';

  function isHere(href) { return href.toLowerCase() === here; }

  /* --------------------------------------------------- collection dropdown */
  /* Built from OLIVE.hampers, so a new hamper appears in the menu with no
     further edit. No imagery — the panel is type only. */
  function megaFor(c) {
    var hampers = OLIVE.hampersIn(c.slug);

    var list = hampers.map(function (h) {
      return '<li><a href="product.html?id=' + h.id + '">' + h.name + '</a></li>';
    }).join('');

    return '<div class="mega"><div class="mega-inner">' +
      '<div class="mega-col">' +
        '<h4>Hampers</h4><ul>' + list + '</ul>' +
      '</div>' +
      '<div class="mega-col mega-note">' +
        '<h4>' + c.name + '</h4>' +
        '<p>' + c.blurb + '</p>' +
        '<a class="mega-cta" href="' + c.page + '">See all →</a>' +
      '</div>' +
    '</div></div>';
  }

  /* ------------------------------------------------------------- header */
  function header() {
    var links = [{ href: 'collections.html', text: 'Shop all' }];
    OLIVE.collections.forEach(function (c) {
      links.push({
        href: c.page,
        text: c.name.replace(/^The\s+/, '').replace(/\s+Collection$/, ''),
        collection: c
      });
    });
    links.push({ href: 'bulk.html',    text: 'Bulk gifting' });
    links.push({ href: 'journal.html', text: 'Journal' });
    links.push({ href: 'about.html',   text: 'About' });

    var nav = links.map(function (l) {
      var a = '<a href="' + l.href + '"' + (isHere(l.href) ? ' aria-current="page"' : '') +
              (l.collection ? ' aria-haspopup="true"' : '') + '>' + l.text + '</a>';
      if (!l.collection) { return a; }
      return '<div class="nav-item">' + a + megaFor(l.collection) + '</div>';
    }).join('');

    return '' +
      '<div class="bar">' + C.announcement + '</div>' +
      '<header class="masthead">' +
        '<div class="masthead-row">' +
          '<div class="mast-left">' +
            '<button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="navrow">' +
              '<span></span><span></span><span></span>' +
            '</button>' +
            '<a class="util" href="enquiry.html">Contact</a>' +
            '<a class="util" href="policies.html">Delivery</a>' +
          '</div>' +
          '<a class="wordmark" href="index.html">' + LEAF + C.brand + '</a>' +
          '<div class="mast-right">' +
            '<a href="bulk.html" class="util">Bulk gifting</a>' +
            '<a href="cart.html">Cart (<span class="cart-count" data-cart-count>0</span>)</a>' +
          '</div>' +
        '</div>' +
      '</header>' +
      '<nav class="nav" aria-label="Collections">' +
        '<div class="nav-row" id="navrow">' + nav + '</div>' +
      '</nav>';
  }

  /* ------------------------------------------------------------- footer */
  function footer() {
    var cols = OLIVE.collections.map(function (c) {
      return '<li><a href="' + c.page + '">' + c.name.replace(/^The\s+/, '') + '</a></li>';
    }).join('');

    return '' +
      '<footer class="footer">' +
        '<div class="shell">' +
          '<div class="footer-grid">' +
            '<div>' +
              '<a class="wordmark" href="index.html" style="color:inherit">' + LEAF + C.brand + '</a>' +
              '<p class="small" style="margin-top:1rem;max-width:30ch">' + C.tagline + '<br>' +
                'Hampers composed in ' + C.city + ' and delivered across India.</p>' +
            '</div>' +
            '<div><h4>Collections</h4><ul>' + cols +
              '<li><a href="collections.html">Shop all</a></li></ul></div>' +
            '<div><h4>Gifting</h4><ul>' +
              '<li><a href="bulk.html">Bulk &amp; corporate</a></li>' +
              '<li><a href="enquiry.html">Request a consultation</a></li>' +
              '<li><a href="journal.html">Journal</a></li>' +
              '<li><a href="about.html">About us</a></li></ul></div>' +
            '<div><h4>Reach us</h4><ul>' +
              '<li><a href="' + OLIVE.whatsappLink('Hello, I would like to enquire about your hampers.') +
                '" target="_blank" rel="noopener">WhatsApp ' + C.phone + '</a></li>' +
              '<li><a href="mailto:' + C.email + '">' + C.email + '</a></li>' +
              '<li><a href="policies.html">Delivery &amp; returns</a></li>' +
              (C.instagram ? '<li><a href="' + C.instagram + '" target="_blank" rel="noopener">Instagram</a></li>' : '') +
            '</ul></div>' +
          '</div>' +
          '<div class="footer-base">' +
            '<span>© ' + new Date().getFullYear() + ' ' + C.brand + '.' +
              (C.gstin ? ' GSTIN ' + C.gstin + '.' : '') + '</span>' +
            '<span><a href="policies.html">Privacy</a> · <a href="policies.html">Terms</a></span>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* ----------------------------------------------------- WhatsApp button */
  function whatsapp() {
    var msg = document.body.getAttribute('data-wa') ||
              'Hello, I would like to enquire about your hampers.';
    return '<a class="wa" href="' + OLIVE.whatsappLink(msg) + '" target="_blank" rel="noopener" ' +
           'aria-label="Enquire on WhatsApp">' +
           '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.22-.17-.47-.29z"/></svg>' +
           '</a>';
  }

  /* ------------------------------------------------------------ mounting */
  function mount() {
    var h = document.getElementById('site-header');
    if (h) { h.innerHTML = header(); }

    var f = document.getElementById('site-footer');
    if (f) { f.innerHTML = footer(); }

    document.body.insertAdjacentHTML('beforeend', whatsapp());

    // Mobile menu
    var burger = document.querySelector('.burger');
    var row = document.getElementById('navrow');
    if (burger && row) {
      burger.addEventListener('click', function () {
        var open = row.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    updateCartCount();
  }

  function updateCartCount() {
    var n = window.Cart ? Cart.count() : 0;
    Array.prototype.forEach.call(document.querySelectorAll('[data-cart-count]'), function (el) {
      el.textContent = n;
    });
  }

  /* ---------------------------------------------------------------- zoom */
  /* Click to zoom, pointer-tracked panning, Escape to close, focus returned. */
  function initZoom() {
    var triggers = document.querySelectorAll('[data-zoom]');
    if (!triggers.length) { return; }

    var overlay = document.createElement('div');
    overlay.className = 'zoom';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Enlarged photograph');
    overlay.innerHTML = '<button class="zoom-close" type="button" aria-label="Close">✕</button><img alt="">';
    document.body.appendChild(overlay);

    var img = overlay.querySelector('img');
    var closeBtn = overlay.querySelector('.zoom-close');
    var opener = null;

    function open(src, alt) {
      img.src = src;
      img.alt = alt || '';
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      img.onload = function () {
        var s = Math.max(window.innerWidth / img.naturalWidth,
                         window.innerHeight / img.naturalHeight) * 1.6;
        img.style.width = (img.naturalWidth * s) + 'px';
        img.style.height = 'auto';
        pan(0.5, 0.5);
      };
      closeBtn.focus();
    }

    function close() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      img.removeAttribute('src');
      if (opener) { opener.focus(); opener = null; }
    }

    function pan(rx, ry) {
      var dx = (0.5 - rx) * Math.max(0, img.offsetWidth - window.innerWidth);
      var dy = (0.5 - ry) * Math.max(0, img.offsetHeight - window.innerHeight);
      img.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    }

    Array.prototype.forEach.call(triggers, function (t) {
      t.style.cursor = 'zoom-in';
      t.addEventListener('click', function () {
        opener = t;
        open(t.getAttribute('data-zoom'), t.getAttribute('alt') || t.getAttribute('data-alt'));
      });
    });

    overlay.addEventListener('click', function (e) {
      if (e.target !== img) { close(); }
    });
    overlay.addEventListener('mousemove', function (e) {
      pan(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) { close(); }
    });
  }

  /* --------------------------------------------------------------- forms */
  /* No backend exists, so an enquiry is handed to WhatsApp fully composed.
     Every field the visitor filled in arrives in the first message. */
  function initForms() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-wa-form]'), function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var intro = form.getAttribute('data-wa-form') || 'Enquiry';
        var out = [intro, ''];

        Array.prototype.forEach.call(form.elements, function (el) {
          if (!el.name || el.type === 'submit' || !el.value) { return; }
          var lab = form.querySelector('label[for="' + el.id + '"] span');
          var name = lab ? lab.textContent : el.name;
          out.push(name + ': ' + el.value);
        });

        window.open(OLIVE.whatsappLink(out.join('\n')), '_blank', 'noopener');
        var done = form.querySelector('[data-sent]');
        if (done) { done.hidden = false; }
      });
    });
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    mount();
    initZoom();
    initForms();
    document.addEventListener('cart:change', updateCartCount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
