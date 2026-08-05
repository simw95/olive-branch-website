/* ==========================================================================
   Cart — persisted in localStorage, with an in-memory fallback.
   The fallback matters: some browsers restrict storage on file:// pages and
   in private windows, and the cart must never throw and take the page down.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'olive-cart-v1';
  var memory = null;          // used only if localStorage is unavailable
  var usable = (function () {
    try {
      window.localStorage.setItem('__t', '1');
      window.localStorage.removeItem('__t');
      return true;
    } catch (e) {
      return false;
    }
  })();

  function read() {
    if (!usable) { return memory || []; }
    try {
      return JSON.parse(window.localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function write(items) {
    if (usable) {
      try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* quota */ }
    } else {
      memory = items;
    }
    document.dispatchEvent(new CustomEvent('cart:change'));
  }

  var Cart = {

    items: function () {
      // Drop anything whose hamper no longer exists in the catalogue.
      return read().filter(function (it) { return !!OLIVE.getHamper(it.id); });
    },

    count: function () {
      return Cart.items().reduce(function (n, it) { return n + it.qty; }, 0);
    },

    add: function (id, qty) {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      var items = read();
      var found = false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) { items[i].qty += qty; found = true; break; }
      }
      if (!found) { items.push({ id: id, qty: qty }); }
      write(items);
    },

    setQty: function (id, qty) {
      qty = parseInt(qty, 10) || 0;
      var items = read();
      if (qty <= 0) { return Cart.remove(id); }
      for (var i = 0; i < items.length; i++) {
        if (items[i].id === id) { items[i].qty = qty; }
      }
      write(items);
    },

    remove: function (id) {
      write(read().filter(function (it) { return it.id !== id; }));
    },

    clear: function () { write([]); },

    /* Each line carries its own tier price — quantity is per hamper, not
       pooled across the cart, because the discount reflects one production run. */
    lines: function () {
      return Cart.items().map(function (it) {
        var h = OLIVE.getHamper(it.id);
        var unit = OLIVE.priceAt(h, it.qty);
        return {
          id: it.id,
          hamper: h,
          qty: it.qty,
          unit: unit,
          total: unit * it.qty,
          tier: OLIVE.tiers[OLIVE.tierIndex(it.qty)],
          next: OLIVE.nextTier(h, it.qty)
        };
      });
    },

    subtotal: function () {
      return Cart.lines().reduce(function (n, l) { return n + l.total; }, 0);
    },

    /* A formatted order summary, used for the WhatsApp handover. */
    summaryText: function () {
      var lines = Cart.lines();
      if (!lines.length) { return ''; }
      var out = ['Hello The Olive Branch, I would like to place this order:', ''];
      lines.forEach(function (l) {
        out.push('• ' + l.hamper.name + ' × ' + l.qty +
                 ' — ' + OLIVE.inr(l.unit) + ' each = ' + OLIVE.inr(l.total));
      });
      out.push('');
      out.push('Subtotal: ' + OLIVE.inr(Cart.subtotal()));
      return out.join('\n');
    }
  };

  window.Cart = Cart;
})();
