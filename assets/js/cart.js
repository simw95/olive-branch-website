/* ==========================================================================
   Cart — persisted in localStorage, with an in-memory fallback.
   The fallback matters: some browsers restrict storage on file:// pages and
   in private windows, and the cart must never throw and take the page down.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'olive-cart-v1';
  var memory = null;          // used only if localStorage is unavailable
  var amemory = null;         // same, for the delivery address below
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

    /* One price per hamper, whatever the quantity. The five quantity bands
       this used to carry are gone; bulk is quoted on enquiry instead. */
    lines: function () {
      return Cart.items().map(function (it) {
        var h = OLIVE.getHamper(it.id);
        var unit = OLIVE.priceAt(h);
        return {
          id: it.id,
          hamper: h,
          qty: it.qty,
          unit: unit,
          total: unit * it.qty
        };
      });
    },

    subtotal: function () {
      return Cart.lines().reduce(function (n, l) { return n + l.total; }, 0);
    },

    /* Delivery and the payable total, from the shared helper. */
    totals: function () {
      return OLIVE.orderTotals(Cart.subtotal());
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
      var t = Cart.totals();
      out.push('');
      out.push('Subtotal: ' + OLIVE.inr(t.subtotal));
      out.push('Delivery: ' + (t.shipping ? OLIVE.inr(t.shipping) : 'Complimentary'));
      out.push('GST: ' + OLIVE.inr(t.gst));
      out.push('Total: ' + OLIVE.inr(t.total));

      var a = Address.read();
      if (Address.validate(a).length === 0) {
        out.push('');
        out.push('Deliver to:');
        out.push(a.name + ', ' + a.phone);
        out.push(a.address);
        out.push(a.city + ', ' + a.state + ' ' + a.pin);
        out.push('Invoice to: ' + a.email);
      }
      return out.join('\n');
    }
  };

  /* ==========================================================================
     Delivery address.

     Kept beside the cart because it has the same problem: it must survive a
     reload, and localStorage can throw outright on file:// and in private
     windows. Same guards, same fallback.

     It exists at all because neither checkout route asks for one otherwise —
     Razorpay collects a phone and an email and never a postal address, and the
     WhatsApp handover only ever listed the hampers. Both could complete with
     nobody knowing where the box was going.
     ========================================================================== */
  var AKEY = 'olive-address-v1';
  var FIELDS = ['name', 'phone', 'address', 'city', 'state', 'pin', 'email'];

  var Address = {

    fields: FIELDS,

    read: function () {
      var blank = {};
      FIELDS.forEach(function (k) { blank[k] = ''; });
      if (!usable) { return Object.assign(blank, amemory || {}); }
      try {
        return Object.assign(blank, JSON.parse(window.localStorage.getItem(AKEY)) || {});
      } catch (e) {
        return blank;
      }
    },

    save: function (a) {
      if (usable) {
        try { window.localStorage.setItem(AKEY, JSON.stringify(a)); } catch (e) { /* quota */ }
      } else {
        amemory = a;
      }
    },

    /* Returns a list of what is wrong, empty when the address is usable.
       Deliberately forgiving on format and strict on presence: a missing PIN
       stops a parcel, an unusual address line does not. */
    validate: function (a) {
      var bad = [];
      if (!a.name || a.name.trim().length < 2) { bad.push('a recipient name'); }
      // Indian mobile: 10 digits, once +91 / 0 / spaces are stripped.
      if (String(a.phone || '').replace(/[^\d]/g, '').replace(/^(91|0)/, '').length !== 10) {
        bad.push('a 10-digit phone number');
      }
      if (!a.address || a.address.trim().length < 8) { bad.push('a street address'); }
      if (!a.city || !a.city.trim()) { bad.push('a city'); }
      if (!a.state || !a.state.trim()) { bad.push('a state'); }
      if (!/^\d{6}$/.test(String(a.pin || '').trim())) { bad.push('a 6-digit PIN code'); }
      if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(String(a.email || '').trim())) { bad.push('an email address'); }
      return bad;
    },

    /* Per-field, so the form can point at the first thing that is wrong
       rather than making someone hunt for it. */
    fieldOk: function (k, v) {
      v = String(v == null ? '' : v);
      switch (k) {
        case 'name':    return v.trim().length >= 2;
        case 'phone':   return v.replace(/[^\d]/g, '').replace(/^(91|0)/, '').length === 10;
        case 'address': return v.trim().length >= 8;
        case 'city':    return !!v.trim();
        case 'state':   return !!v.trim();
        case 'pin':     return /^\d{6}$/.test(v.trim());
        case 'email':   return /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(v.trim());
        default:        return true;
      }
    },

    /* One flat block, for an order note or an email body. */
    oneLine: function (a) {
      return [a.name, a.phone, a.address, a.city, a.state, a.pin].join(', ').replace(/\s+/g, ' ');
    }
  };

  window.Cart = Cart;
  window.Address = Address;
})();
