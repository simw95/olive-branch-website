/* ==========================================================================
   Renderers — collection grids, product pages, the cart.
   Everything is driven from OLIVE.hampers so adding a hamper is a one-file
   change. Loaded before site.js so injected images exist when zoom binds.
   ========================================================================== */

(function () {
  'use strict';

  function el(html) {
    var d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstChild;
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;');
  }
  function qs(name) {
    var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }

  /* --------------------------------------------------- hamper card grid */
  function hamperCard(h, i) {
    var d = (i % 3) === 0 ? '' : (i % 3 === 1 ? ' reveal-d1' : ' reveal-d2');
    return '' +
      '<a class="card reveal' + d + '" href="product.html?id=' + h.id + '">' +
        '<div class="card-media"><img src="' + h.image + '" alt="' + esc(h.name) +
          '" loading="lazy" style="object-position:' + (h.focal || '50% 50%') + '"></div>' +
        '<h3 class="card-title">' + esc(h.name) + '</h3>' +
        '<p class="small" style="margin:0">' + esc(h.lede) + '</p>' +
        '<div class="card-meta">' +
          '<span class="card-from">' + esc(h.size) + '</span>' +
          '<span class="card-price">' + OLIVE.inr(h.price) + '</span>' +
        '</div>' +
      '</a>';
  }

  function renderGrid(mount, hampers) {
    if (!mount) { return; }
    mount.className = 'grid grid-3';
    mount.innerHTML = hampers.map(hamperCard).join('');
  }

  /* A collection that carries named sections draws them as blocks, each with
     its own heading and an id the nav can link to. Celebration is the case:
     the Diwali hampers sit together rather than scattered among the rest.
     A collection with no sections renders exactly as it always did. */
  function renderCollectionGrid(mount, slug) {
    if (!mount) { return; }
    var split = OLIVE.sectionsIn(slug);
    if (!split.sections.length) {
      renderGrid(mount, OLIVE.hampersIn(slug));
      return;
    }

    mount.className = '';
    var html = '<div class="grid grid-3">' +
                 split.main.map(hamperCard).join('') +
               '</div>';

    split.sections.forEach(function (sec) {
      html +=
        '<div class="collection-section" id="' + esc(sectionId(sec.name)) + '">' +
          '<div class="centred collection-section-head">' +
            '<span class="label">' + esc(sec.name) + '</span>' +
            '<h2 class="d-m">' + esc(sectionHeading(sec.name)) + '</h2>' +
          '</div>' +
          '<div class="grid grid-3">' + sec.hampers.map(hamperCard).join('') + '</div>' +
        '</div>';
    });
    mount.innerHTML = html;
  }

  /* The anchor the nav links to, and the line above the block. Kept here
     rather than in data.js so a section needs only its name there. */
  function sectionId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  var SECTION_HEADINGS = {
    Diwali: 'For the festival of lights.'
  };
  function sectionHeading(name) {
    return SECTION_HEADINGS[name] || name + '.';
  }

  /* ------------------------------------------------- collection gateways */
  function renderCollections(mount) {
    if (!mount) { return; }
    mount.className = 'grid grid-3';
    mount.innerHTML = OLIVE.collections.map(function (c, i) {
      var d = i === 0 ? '' : (i === 1 ? ' reveal-d1' : ' reveal-d2');
      return '' +
        '<a class="card reveal' + d + '" href="' + c.page + '">' +
          '<div class="card-media gate-media"><img src="' + c.image + '" alt="' + esc(c.name) +
            '" loading="lazy"></div>' +
          '<h3 class="card-title">' + esc(c.name) + '</h3>' +
          '<p class="small" style="margin:0 0 0.9rem">' + esc(c.blurb) + '</p>' +
          '<span class="tlink">Explore the collection</span>' +
        '</a>';
    }).join('');
  }

  /* ------------------------------------------------------- bulk enquiry */
  /* A table of five quantity bands used to sit here, on every product page.
     Bulk is quoted on enquiry now, so the table is one line and a message. */
  function bulkLine(h) {
    return '<p class="notes" style="margin-top:2rem">' +
             '<a href="' + esc(OLIVE.whatsappLink(
               'Hello, I would like to enquire about the catalogues and bulk prices for ' +
               h.name + '.')) + '">' +
             'Send us a message to enquire about the catalogues and bulk prices.</a></p>';
  }

  /* -------------------------------------------------------- product page */
  function renderProduct() {
    var mount = document.getElementById('product');
    if (!mount) { return; }

    var h = OLIVE.getHamper(qs('id'));
    if (!h) {
      mount.innerHTML = '<div class="empty"><h1 class="d-m">We could not find that hamper.</h1>' +
        '<p class="muted">It may have been renamed or retired.</p>' +
        '<p style="margin-top:1.5rem"><a class="btn" href="collections.html">See every collection</a></p></div>';
      return;
    }

    var coll = OLIVE.getCollection(h.collection);
    document.title = h.name + ' — ' + OLIVE.config.brand;
    var md = document.querySelector('meta[name="description"]');
    if (md) { md.setAttribute('content', h.lede); }
    document.body.setAttribute('data-wa', 'Hello, I would like to enquire about the ' + h.name + '.');

    var qty = 1;
    /* One photograph unless the hamper lists more. */
    var views = (h.gallery && h.gallery.length) ? h.gallery : [h.imageFull];

    mount.innerHTML = '' +
      '<div class="product">' +
        '<div>' +
          '<div class="product-media reveal">' +
            '<img src="' + views[0] + '" alt="' + esc(h.name) + '" data-zoom="' + views[0] + '" ' +
              'style="aspect-ratio:' + h.ratio.toFixed(3) + '">' +
            // Wording is set by site.js, which knows whether this visitor gets
            // the hover panel or the tap overlay. "Click" would be a lie on a
            // phone. Empty here so nothing wrong flashes before that runs.
            '<span class="zoom-hint"></span>' +
          '</div>' +
          /* A hamper photographed more than once offers the other views here.
             One view draws nothing at all, so every other product page is
             exactly as it was. */
          (views.length > 1
            ? '<div class="product-views" data-views>' +
                views.map(function (src, i) {
                  return '<button type="button" class="product-view" data-view="' + esc(src) + '"' +
                         (i === 0 ? ' aria-current="true"' : '') +
                         ' aria-label="View ' + (i + 1) + ' of ' + views.length + '">' +
                         '<img src="' + esc(src) + '" alt="" loading="lazy">' +
                         '</button>';
                }).join('') +
              '</div>'
            : '') +
          '<div class="product-detail">' +
            '<div class="reveal">' +
              '<span class="label">About this hamper</span>' +
              '<p>' + esc(h.description) + '</p>' +
            '</div>' +
            '<div class="reveal" style="margin-top:2.5rem">' +
              '<span class="label">What is inside</span>' +
              '<ul class="manifest">' +
                h.contents.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') +
              '</ul>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="product-buy">' +
          '<span class="label"><a href="' + coll.page + '" style="text-decoration:none">' + esc(coll.name) + '</a></span>' +
          '<h1 class="d-l" style="margin-bottom:1rem">' + esc(h.name) + '</h1>' +
          '<p class="lede" style="margin-bottom:1.75rem">' + esc(h.lede) + '</p>' +
          '<div class="price-now" data-price></div>' +
          '<p class="price-tax">' + esc(OLIVE.config.taxNote) + '</p>' +
          '<div style="display:flex;gap:1rem;align-items:center;margin:1.5rem 0">' +
            '<div class="qty">' +
              '<button type="button" data-step="-1" aria-label="Reduce quantity">−</button>' +
              '<input type="number" min="1" value="1" data-qty aria-label="Quantity">' +
              '<button type="button" data-step="1" aria-label="Increase quantity">+</button>' +
            '</div>' +
          '</div>' +
          '<div class="stack-sm">' +
            '<button class="btn btn-solid btn-block" type="button" data-add>Add to cart</button>' +
            '<button class="btn btn-block" type="button" data-buy>Buy now</button>' +
          '</div>' +
          '<p class="small" style="margin-top:1.25rem">' +
            '<a href="bulk.html?hamper=' + h.id + '">Enquire for ' + OLIVE.config.bulkThreshold + '+ hampers</a>' +
            ' — bespoke branding and GST invoicing.</p>' +
          bulkLine(h) +
          '<p class="notes" style="margin-top:1.5rem">' + esc(h.notes) + '</p>' +
        '</div>' +
      '</div>';

    /* ---- interactive bits ---- */
    /* Swapping src and data-zoom on the SAME element keeps the magnifier
       working: site.js bound to that element once, and reads data-zoom at the
       moment of the click rather than caching it. */
    var viewBar = mount.querySelector('[data-views]');
    if (viewBar) {
      viewBar.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-view]');
        if (!b) { return; }
        var src = b.getAttribute('data-view');
        var main = mount.querySelector('.product-media img');
        if (!main || main.getAttribute('src') === src) { return; }
        main.setAttribute('src', src);
        main.setAttribute('data-zoom', src);
        main.style.transform = '';          // drop any magnification mid-swap
        Array.prototype.forEach.call(viewBar.querySelectorAll('button'), function (o) {
          o.removeAttribute('aria-current');
        });
        b.setAttribute('aria-current', 'true');
      });
    }

    var input = mount.querySelector('[data-qty]');
    var priceEl = mount.querySelector('[data-price]');
    function paint() {
      var unit = OLIVE.priceAt(h);
      // The total only earns its place once there is more than one.
      priceEl.innerHTML = OLIVE.inr(unit) +
        '<span class="price-each">each' +
        (qty > 1 ? ' · ' + OLIVE.inr(unit * qty) + ' for ' + qty : '') +
        '</span>';
    }

    function setQty(n) {
      qty = Math.max(1, parseInt(n, 10) || 1);
      input.value = qty;
      paint();
    }

    mount.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        setQty(qty + parseInt(b.getAttribute('data-step'), 10));
      });
    });
    input.addEventListener('change', function () { setQty(input.value); });

    mount.querySelector('[data-add]').addEventListener('click', function (e) {
      Cart.add(h.id, qty);
      e.target.textContent = 'Added to cart ✓';
      setTimeout(function () { e.target.textContent = 'Add to cart'; }, 1800);
    });
    mount.querySelector('[data-buy]').addEventListener('click', function () {
      Cart.add(h.id, qty);
      location.href = 'cart.html';
    });

    // Prefill the guest count if the visitor arrived from a collection page.
    var pre = parseInt(qs('qty'), 10);
    setQty(pre > 0 ? pre : 1);

    renderRelated(document.getElementById('related'), h);
    productSchema(h);
    setCanonical(h);
  }

  function renderRelated(mount, current) {
    if (!mount) { return; }
    var same = OLIVE.hampers.filter(function (x) {
      return x.collection === current.collection && x.id !== current.id;
    });
    var other = OLIVE.hampers.filter(function (x) { return x.collection !== current.collection; });
    renderGrid(mount, same.concat(other).slice(0, 3));
  }

  /* product.html is one file serving every hamper, so the canonical in its
     head points at the bare file. Left there, all fifteen hampers would claim
     the same URL and a search engine would keep one and drop the rest. This
     rewrites it — and og:url with it — to the hamper actually being shown.
     Only ever absolute: a relative canonical is ignored. */
  function setCanonical(h) {
    var base = (document.querySelector('link[rel="canonical"]') || {}).href || '';
    if (!/^https?:/.test(base)) { return; }
    var url = base.split('?')[0] + '?id=' + encodeURIComponent(h.id);
    document.querySelector('link[rel="canonical"]').href = url;
    var og = document.querySelector('meta[property="og:url"]');
    if (og) { og.setAttribute('content', url); }
    var img = document.querySelector('meta[property="og:image"]');
    if (img && h.imageFull) {
      img.setAttribute('content', base.replace(/\/[^\/]*$/, '/') + h.imageFull);
    }
  }

  function productSchema(h) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: h.name,
      description: h.lede,
      image: h.imageFull,
      brand: { '@type': 'Brand', name: OLIVE.config.brand },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: h.price,
        availability: 'https://schema.org/InStock'
      }
    });
    document.head.appendChild(s);
  }

  /* -------------------------------------------------------------- payments */
  /* Card and UPI checkout, live only on the deployed site with keys set.
     Every path here degrades to WhatsApp: opened from file://, keys absent,
     Razorpay's script blocked, or the network down. The cart never becomes a
     dead end. */

  function apiReachable() {
    // A relative fetch is meaningless on file:// — don't even attempt it.
    return /^https?:$/.test(location.protocol) && typeof fetch === 'function';
  }

  function loadCheckoutScript() {
    return new Promise(function (resolve, reject) {
      if (window.Razorpay) { return resolve(); }
      var s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('The payment window could not load.')); };
      document.head.appendChild(s);
    });
  }

  /* ------------------------------------------------------ delivery address */
  /* Bound to the same fields both checkout routes read, so the address cannot
     be right for one and missing for the other. */
  function addressInputs(mount) {
    var map = {};
    Address.fields.forEach(function (k) {
      map[k] = mount.querySelector('#s-' + (k === 'address' ? 'addr' : k));
    });
    return map;
  }

  function initAddress(mount) {
    var els = addressInputs(mount);
    if (!els.name) { return; }

    // Restore whatever they typed last time — an abandoned cart that makes you
    // retype your address is an abandoned cart twice.
    var saved = Address.read();
    Address.fields.forEach(function (k) {
      if (els[k] && saved[k]) { els[k].value = saved[k]; }
      if (els[k]) {
        els[k].addEventListener('input', function () {
          var now = {};
          Address.fields.forEach(function (j) { now[j] = els[j] ? els[j].value : ''; });
          Address.save(now);
          var err = mount.querySelector('[data-ship-error]');
          if (err && !err.hidden && Address.validate(now).length === 0) { err.hidden = true; }
        });
      }
    });
  }

  /* Returns true when the order may proceed; otherwise says what is missing
     and puts the cursor in the first offending field. */
  function requireAddress(mount) {
    var els = addressInputs(mount);
    if (!els.name) { return true; }

    var a = {};
    Address.fields.forEach(function (k) { a[k] = els[k] ? els[k].value : ''; });
    Address.save(a);

    var missing = Address.validate(a);
    var err = mount.querySelector('[data-ship-error]');
    if (!missing.length) { if (err) { err.hidden = true; } return true; }

    if (err) {
      err.textContent = 'Before we can send this, we need ' +
        (missing.length > 1
          ? missing.slice(0, -1).join(', ') + ' and ' + missing[missing.length - 1]
          : missing[0]) + '.';
      err.hidden = false;
    }
    // Put the cursor in the first field that is actually wrong.
    for (var i = 0; i < Address.fields.length; i++) {
      var k = Address.fields[i];
      if (els[k] && !Address.fieldOk(k, a[k])) { els[k].focus(); break; }
    }
    return false;
  }

  function initPayment(mount) {
    var payBtn  = mount.querySelector('[data-pay]');
    var payNote = mount.querySelector('[data-pay-note]');
    var waBtn   = mount.querySelector('[data-checkout]');
    var waNote  = mount.querySelector('[data-wa-note]');
    var stub    = mount.querySelector('[data-pay-stub]');
    var errBox  = mount.querySelector('[data-pay-error]');
    if (!payBtn || !apiReachable()) { return; }

    function fail(msg) { errBox.textContent = msg; errBox.hidden = false; }
    function idle() { payBtn.removeAttribute('aria-busy'); payBtn.textContent = 'Pay securely'; }

    // Ask the host whether keys are configured, rather than keeping a flag
    // in the repo that could fall out of sync.
    fetch('/api/payment-status')
      .then(function (r) { return r.ok ? r.json() : { enabled: false }; })
      .then(function (d) {
        if (!d || !d.enabled) { return; }
        payBtn.hidden = false;
        payNote.hidden = false;
        stub.hidden = true;
        // WhatsApp stays available, but steps back to the secondary action.
        waBtn.classList.remove('btn-solid');
        waBtn.style.marginTop = '0.85rem';
        waNote.textContent = 'Prefer to confirm the details first? Send the order across and we will reply.';
      })
      .catch(function () { /* silently stays on the WhatsApp route */ });

    payBtn.addEventListener('click', function (e) {
      e.preventDefault();
      if (payBtn.getAttribute('aria-busy') === 'true') { return; }
      // Never open a payment window we cannot ship the result of.
      if (!requireAddress(mount)) { return; }
      errBox.hidden = true;
      payBtn.setAttribute('aria-busy', 'true');
      payBtn.textContent = 'Opening…';

      var note = mount.querySelector('#notecard');
      var addr = Address.read();

      // Only ids and quantities are sent. The amount is computed server-side.
      fetch('/api/create-order', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          items: Cart.items(),
          note: note ? note.value : '',
          address: addr
        })
      })
        .then(function (r) {
          return r.json().then(function (d) {
            if (!r.ok) { throw new Error(d.error || 'Could not start the payment.'); }
            return d;
          });
        })
        .then(function (order) {
          return loadCheckoutScript().then(function () { return order; });
        })
        .then(function (order) {
          idle();
          var rz = new window.Razorpay({
            key:      order.keyId,
            order_id: order.orderId,
            amount:   order.amount,
            currency: order.currency,
            name:        OLIVE.config.brand,
            description: 'Hamper order',
            // Saves the customer retyping what they just gave us.
            prefill: { name: addr.name, email: addr.email, contact: addr.phone },
            theme:  { color: '#5C2233' },
            modal:  { ondismiss: idle },
            handler: function (resp) { confirmPayment(mount, resp, fail); }
          });
          rz.on('payment.failed', function () {
            fail('That payment did not go through, and nothing has been charged. Try again, or send the order on WhatsApp.');
          });
          rz.open();
        })
        .catch(function (err) {
          idle();
          fail((err && err.message) || 'Something went wrong. Please complete the order on WhatsApp instead.');
        });
    });
  }

  function confirmPayment(mount, resp, fail) {
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(resp)
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.ok) { showPaid(mount, resp.razorpay_payment_id); }
        else {
          fail('We could not confirm that payment. Please do not pay again — message us on WhatsApp and we will check it.');
        }
      })
      .catch(function () {
        fail('Your payment went through, but we could not confirm it here. Please message us on WhatsApp before trying again.');
      });
  }

  function showPaid(mount, paymentId) {
    // Marks the cart finished so the cart:change listener does not repaint
    // over this confirmation when the basket is emptied.
    mount.setAttribute('data-done', '1');
    Cart.clear();
    mount.innerHTML =
      '<div class="empty">' +
        '<span class="label">Order received</span>' +
        '<h2 class="d-m">Thank you — that is confirmed.</h2>' +
        '<p class="muted" style="margin-top:0.75rem">A receipt is on its way to you, and we will be in touch about dispatch.</p>' +
        '<p class="small" style="margin-top:1.25rem">Payment reference <strong>' + esc(paymentId) + '</strong></p>' +
        '<p style="margin-top:2rem"><a class="btn" href="collections.html">Explore the collections</a></p>' +
      '</div>';
  }

  /* ------------------------------------------------------------- the cart */
  function renderCart() {
    var mount = document.getElementById('cart');
    if (!mount) { return; }

    function paint() {
      // Once an order is paid, the confirmation stands — don't repaint it.
      if (mount.getAttribute('data-done')) { return; }

      var lines = Cart.lines();

      if (!lines.length) {
        mount.innerHTML = '<div class="empty">' +
          '<h2 class="d-m">Your cart is empty.</h2>' +
          '<p class="muted" style="margin-top:0.75rem">Nothing chosen yet.</p>' +
          '<p style="margin-top:2rem"><a class="btn" href="collections.html">Browse the collections</a></p>' +
          '</div>';
        return;
      }

      var t = Cart.totals();
      var sub = t.subtotal;
      var ship = t.shipping;

      mount.innerHTML = '' +
        '<div class="cart-layout">' +
          '<div>' +
            lines.map(function (l) {
              return '<div class="line">' +
                '<a class="line-media" href="product.html?id=' + l.id + '">' +
                  '<img src="' + l.hamper.image + '" alt="' + esc(l.hamper.name) + '"></a>' +
                '<div>' +
                  '<h3 class="d-s" style="margin-bottom:0.35rem">' +
                    '<a href="product.html?id=' + l.id + '" style="text-decoration:none">' + esc(l.hamper.name) + '</a></h3>' +
                  '<p class="small" style="margin-bottom:0.9rem">' + OLIVE.inr(l.unit) + ' each</p>' +
                  '<div class="qty">' +
                    '<button type="button" data-dec="' + l.id + '" aria-label="Reduce quantity">−</button>' +
                    '<input type="number" min="1" value="' + l.qty + '" data-set="' + l.id + '" aria-label="Quantity for ' + esc(l.hamper.name) + '">' +
                    '<button type="button" data-inc="' + l.id + '" aria-label="Increase quantity">+</button>' +
                  '</div>' +
                  '<div style="margin-top:0.75rem">' +
                    '<button class="linkish" type="button" data-del="' + l.id + '">Remove</button></div>' +
                '</div>' +
                '<div class="line-total">' + OLIVE.inr(l.total) + '</div>' +
              '</div>';
            }).join('') +
          '</div>' +

          '<aside class="summary">' +
            '<h2 class="d-s" style="margin-bottom:1.25rem">Order summary</h2>' +
            '<div class="summary-row"><span>Subtotal</span><span>' + OLIVE.inr(sub) + '</span></div>' +
            '<div class="summary-row"><span>Delivery</span><span>' +
              (ship ? OLIVE.inr(ship) : 'Complimentary') + '</span></div>' +
            (ship ? '<p class="small" style="margin:0.5rem 0 0">Add ' +
              OLIVE.inr(OLIVE.config.freeShipping - sub) + ' for complimentary delivery.</p>' : '') +
            /* Added, not contained: prices are entered before tax, so this
               row is a line the total is still waiting on and a bare "GST" is
               exactly right. If prices ever go inclusive again this has to say
               so, or the customer reads the total as 18% short. */
            '<div class="summary-row"><span>GST</span><span>' +
              OLIVE.inr(t.gst) + '</span></div>' +
            '<div class="summary-row summary-total"><span>Total</span><span>' +
              OLIVE.inr(t.total) + '</span></div>' +
            /* `taxNote` belongs under a PRICE, where it says what the figure
               does not yet contain. It cannot go under this total, which has
               the GST row above it added in — "Exclusive of GST" there would
               be plainly false. The itemised row says everything needed. */
            '<p class="tax-note">GST is itemised above and shown on the invoice.</p>' +

            /* Delivery address. Without this a customer can pay in full and
               leave us with no idea where the hamper goes — Razorpay collects
               a phone and an email, never a postal address. */
            '<div class="ship" data-ship>' +
              '<span class="label" style="margin-bottom:0.2rem">Deliver to</span>' +
              // Every field is required, so say it once rather than hanging an
              // asterisk on all seven.
              '<p class="small" style="margin:0 0 1rem">All fields are required.</p>' +
              '<div class="field-row">' +
                '<label class="field" for="s-name"><span>Recipient name</span>' +
                  '<input type="text" id="s-name" name="ship-name" autocomplete="name" required></label>' +
                '<label class="field" for="s-phone"><span>Recipient phone</span>' +
                  '<input type="tel" id="s-phone" name="ship-phone" autocomplete="tel" ' +
                    'inputmode="numeric" placeholder="10 digits" required></label>' +
              '</div>' +
              '<label class="field" for="s-addr"><span>Address</span>' +
                '<textarea id="s-addr" name="ship-address" rows="2" ' +
                  'placeholder="Flat or house number, building, street, area" required></textarea></label>' +
              '<div class="field-row">' +
                '<label class="field" for="s-city"><span>City</span>' +
                  '<input type="text" id="s-city" name="ship-city" autocomplete="address-level2" required></label>' +
                '<label class="field" for="s-state"><span>State</span>' +
                  '<input type="text" id="s-state" name="ship-state" autocomplete="address-level1" required></label>' +
              '</div>' +
              '<div class="field-row">' +
                '<label class="field" for="s-pin"><span>PIN code</span>' +
                  '<input type="text" id="s-pin" name="ship-pin" autocomplete="postal-code" ' +
                    'inputmode="numeric" maxlength="6" placeholder="6 digits" required></label>' +
                '<label class="field" for="s-email"><span>Your email</span>' +
                  '<input type="email" id="s-email" name="ship-email" autocomplete="email" required></label>' +
              '</div>' +
              '<p class="notes" data-ship-error hidden style="margin-top:0.25rem"></p>' +
            '</div>' +

            '<label class="field" style="margin-top:1.5rem" for="notecard">' +
              '<span>Message for the note card</span>' +
              '<textarea id="notecard" name="notecard" placeholder="Written by hand and tucked inside each hamper."></textarea>' +
            '</label>' +

            '<a class="btn btn-solid btn-block" data-pay href="#" hidden>Pay securely</a>' +
            '<p class="small" data-pay-note hidden style="margin-top:0.75rem">Card, UPI, netbanking and wallets. You will receive a GST invoice by email.</p>' +

            '<a class="btn btn-solid btn-block" data-checkout href="#" style="margin-top:0">Complete order on WhatsApp</a>' +
            '<p class="small" data-wa-note style="margin-top:0.75rem">We confirm availability and dispatch dates, then send a secure payment link.</p>' +

            '<p class="notes" data-pay-error hidden style="margin-top:1rem"></p>' +

            '<div class="stub" data-pay-stub style="margin-top:1.5rem">' +
              '<strong>Card &amp; UPI checkout — not connected here.</strong><br>' +
              'Online payment runs on the deployed site. Opened locally from a file, every order completes over WhatsApp.' +
            '</div>' +

            '<p style="margin-top:1.25rem"><a class="tlink" href="bulk.html">Ordering more than ' +
              OLIVE.config.bulkThreshold + '? Talk to us</a></p>' +
          '</aside>' +
        '</div>';

      initAddress(mount);

      // Checkout hands the composed order to WhatsApp.
      mount.querySelector('[data-checkout]').addEventListener('click', function (e) {
        e.preventDefault();
        if (!requireAddress(mount)) { return; }
        var note = mount.querySelector('#notecard');
        var text = Cart.summaryText();   // carries the address once it is valid
        if (note && note.value) { text += '\n\nNote card: ' + note.value; }
        window.open(OLIVE.whatsappLink(text), '_blank', 'noopener');
      });

      initPayment(mount);

      mount.querySelectorAll('[data-inc]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-inc');
          Cart.setQty(id, Cart.items().filter(function (i) { return i.id === id; })[0].qty + 1);
        });
      });
      mount.querySelectorAll('[data-dec]').forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-dec');
          Cart.setQty(id, Cart.items().filter(function (i) { return i.id === id; })[0].qty - 1);
        });
      });
      mount.querySelectorAll('[data-set]').forEach(function (i) {
        i.addEventListener('change', function () { Cart.setQty(i.getAttribute('data-set'), i.value); });
      });
      mount.querySelectorAll('[data-del]').forEach(function (b) {
        b.addEventListener('click', function () { Cart.remove(b.getAttribute('data-del')); });
      });
    }

    paint();
    document.addEventListener('cart:change', paint);
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    renderCollections(document.getElementById('collections'));

    var grid = document.getElementById('hampers');
    if (grid) {
      var slug = grid.getAttribute('data-collection');
      if (slug) { renderCollectionGrid(grid, slug); }
      else { renderGrid(grid, OLIVE.hampers); }
    }

    renderProduct();
    renderCart();

    // Bulk form: preselect the hamper the visitor came from.
    var pick = document.getElementById('bulk-hamper');
    if (pick) {
      OLIVE.hampers.forEach(function (h) {
        var o = document.createElement('option');
        o.value = h.name;
        o.textContent = h.name;
        pick.appendChild(o);
      });
      var from = qs('hamper');
      if (from && OLIVE.getHamper(from)) { pick.value = OLIVE.getHamper(from).name; }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
