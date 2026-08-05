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
          '<span class="card-from">' + esc(h.size) + ' · from ' + OLIVE.inr(h.prices[h.prices.length - 1]) + ' at ' + OLIVE.tiers[OLIVE.tiers.length - 1].label + '</span>' +
          '<span class="card-price">' + OLIVE.inr(h.prices[0]) + '</span>' +
        '</div>' +
      '</a>';
  }

  function renderGrid(mount, hampers) {
    if (!mount) { return; }
    mount.className = 'grid grid-3';
    mount.innerHTML = hampers.map(hamperCard).join('');
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

  /* ------------------------------------------------------- journal cards */
  function renderJournal(mount, limit) {
    if (!mount) { return; }
    var posts = limit ? OLIVE.journal.slice(0, limit) : OLIVE.journal;
    mount.className = 'grid grid-3';
    mount.innerHTML = posts.map(function (p, i) {
      var d = i === 0 ? '' : (i === 1 ? ' reveal-d1' : ' reveal-d2');
      return '' +
        '<a class="card reveal' + d + '" href="' + p.slug + '">' +
          '<div class="card-media"><img src="' + p.image + '" alt="" loading="lazy"></div>' +
          '<span class="label" style="margin-bottom:0.5rem">' + esc(p.eyebrow) + '</span>' +
          '<h3 class="card-title">' + esc(p.title) + '</h3>' +
          '<p class="small" style="margin:0">' + esc(p.excerpt) + '</p>' +
        '</a>';
    }).join('');
  }

  /* --------------------------------------------------------- tier table */
  function tierTable(h, qty) {
    var active = OLIVE.tierIndex(qty);
    var rows = OLIVE.tiers.map(function (t, i) {
      return '<tr class="' + (i === active ? 'is-active' : '') + '">' +
               '<td>' + t.label + ' hampers</td>' +
               '<td>' + OLIVE.inr(h.prices[i]) + ' each</td>' +
             '</tr>';
    }).join('');
    return '<table class="tiers"><thead><tr><th>Quantity</th><th>Price</th></tr></thead>' +
           '<tbody>' + rows + '</tbody></table>';
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

    mount.innerHTML = '' +
      '<div class="product">' +
        '<div>' +
          '<div class="product-media reveal">' +
            '<img src="' + h.imageFull + '" alt="' + esc(h.name) + '" data-zoom="' + h.imageFull + '" ' +
              'style="aspect-ratio:' + h.ratio.toFixed(3) + '">' +
            '<span class="zoom-hint">Click to enlarge</span>' +
          '</div>' +
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
          '<div style="display:flex;gap:1rem;align-items:center;margin:1.5rem 0">' +
            '<div class="qty">' +
              '<button type="button" data-step="-1" aria-label="Reduce quantity">−</button>' +
              '<input type="number" min="1" value="1" data-qty aria-label="Quantity">' +
              '<button type="button" data-step="1" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<span class="small" data-tierlabel></span>' +
          '</div>' +
          '<div class="stack-sm">' +
            '<button class="btn btn-solid btn-block" type="button" data-add>Add to cart</button>' +
            '<button class="btn btn-block" type="button" data-buy>Buy now</button>' +
          '</div>' +
          '<p class="small" style="margin-top:1.25rem">' +
            '<a href="bulk.html?hamper=' + h.id + '">Enquire for ' + OLIVE.config.bulkThreshold + '+ hampers</a>' +
            ' — bespoke branding, multiple addresses and GST invoicing.</p>' +
          '<div style="margin-top:2rem" data-tiers>' + tierTable(h, 1) + '</div>' +
          '<p class="notes" style="margin-top:1.5rem">' + esc(h.notes) + '</p>' +
        '</div>' +
      '</div>';

    /* ---- interactive bits ---- */
    var input = mount.querySelector('[data-qty]');
    var priceEl = mount.querySelector('[data-price]');
    var tierEl = mount.querySelector('[data-tierlabel]');
    var tiersEl = mount.querySelector('[data-tiers]');

    function paint() {
      var unit = OLIVE.priceAt(h, qty);
      // The total only earns its place once there is more than one.
      priceEl.innerHTML = OLIVE.inr(unit) +
        '<span class="price-each">each' +
        (qty > 1 ? ' · ' + OLIVE.inr(unit * qty) + ' for ' + qty : '') +
        '</span>';
      tiersEl.innerHTML = tierTable(h, qty);

      var nx = OLIVE.nextTier(h, qty);
      if (nx) {
        tierEl.innerHTML = nx.need + ' more reaches ' + OLIVE.inr(h.prices[OLIVE.tierIndex(qty) + 1]) +
                           ' each.';
      } else {
        tierEl.textContent = 'Best price reached.';
      }
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
  }

  function renderRelated(mount, current) {
    if (!mount) { return; }
    var same = OLIVE.hampers.filter(function (x) {
      return x.collection === current.collection && x.id !== current.id;
    });
    var other = OLIVE.hampers.filter(function (x) { return x.collection !== current.collection; });
    renderGrid(mount, same.concat(other).slice(0, 3));
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
        '@type': 'AggregateOffer',
        priceCurrency: 'INR',
        lowPrice: h.prices[h.prices.length - 1],
        highPrice: h.prices[0],
        availability: 'https://schema.org/InStock'
      }
    });
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------- the cart */
  function renderCart() {
    var mount = document.getElementById('cart');
    if (!mount) { return; }

    function paint() {
      var lines = Cart.lines();

      if (!lines.length) {
        mount.innerHTML = '<div class="empty">' +
          '<h1 class="d-m">Your cart is empty.</h1>' +
          '<p class="muted" style="margin-top:0.75rem">Nothing chosen yet.</p>' +
          '<p style="margin-top:2rem"><a class="btn" href="collections.html">Browse the collections</a></p>' +
          '</div>';
        return;
      }

      var sub = Cart.subtotal();
      var ship = sub >= OLIVE.config.freeShipping ? 0 : 250;

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
            '<div class="summary-row summary-total"><span>Total</span><span>' +
              OLIVE.inr(sub + ship) + '</span></div>' +

            '<label class="field" style="margin-top:1.5rem" for="notecard">' +
              '<span>Message for the note card</span>' +
              '<textarea id="notecard" name="notecard" placeholder="Written by hand and tucked inside each hamper."></textarea>' +
            '</label>' +

            '<a class="btn btn-solid btn-block" data-checkout href="#">Complete order on WhatsApp</a>' +
            '<p class="small" style="margin-top:0.75rem">We confirm availability and dispatch dates, then send a secure payment link.</p>' +

            '<div class="stub" style="margin-top:1.5rem">' +
              '<strong>Card &amp; UPI checkout — not yet connected.</strong><br>' +
              'This build has no backend. A developer can wire Razorpay here; until then every order completes over WhatsApp.' +
            '</div>' +

            '<p style="margin-top:1.25rem"><a class="tlink" href="bulk.html">Ordering more than ' +
              OLIVE.config.bulkThreshold + '? Talk to us</a></p>' +
          '</aside>' +
        '</div>';

      // Checkout hands the composed order to WhatsApp.
      mount.querySelector('[data-checkout]').addEventListener('click', function (e) {
        e.preventDefault();
        var note = mount.querySelector('#notecard');
        var text = Cart.summaryText();
        if (note && note.value) { text += '\n\nNote card: ' + note.value; }
        window.open(OLIVE.whatsappLink(text), '_blank', 'noopener');
      });

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

  /* ------------------------------------------------- guest-count shortcut */
  /* Wedding favours are bought by headcount. This turns a guest number into
     the right quantity and drops the visitor straight into the right band. */
  function initGuestCount() {
    var box = document.getElementById('guestcount');
    if (!box) { return; }

    var input = box.querySelector('[data-guests]');
    var out = box.querySelector('[data-guestout]');
    var slug = box.getAttribute('data-collection');
    var hampers = OLIVE.hampersIn(slug);

    function paint() {
      var n = parseInt(input.value, 10);
      if (!n || n < 1) { out.innerHTML = ''; return; }

      out.innerHTML = hampers.map(function (h) {
        var unit = OLIVE.priceAt(h, n);
        return '<p style="margin-bottom:0.6rem"><a href="product.html?id=' + h.id + '&qty=' + n + '">' +
               esc(h.name) + '</a> — ' + OLIVE.inr(unit) + ' each, ' +
               '<strong>' + OLIVE.inr(unit * n) + '</strong> for ' + n + '.</p>';
      }).join('');
    }

    input.addEventListener('input', paint);
    paint();
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    renderCollections(document.getElementById('collections'));

    var grid = document.getElementById('hampers');
    if (grid) {
      var slug = grid.getAttribute('data-collection');
      renderGrid(grid, slug ? OLIVE.hampersIn(slug) : OLIVE.hampers);
    }

    var j = document.getElementById('journal');
    if (j) { renderJournal(j, parseInt(j.getAttribute('data-limit'), 10) || 0); }

    renderProduct();
    renderCart();
    initGuestCount();

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
