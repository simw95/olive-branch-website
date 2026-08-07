'use strict';

/* Creates a Razorpay order for the contents of a cart.
 *
 * The single job of this file is to work out the amount SERVER-SIDE. The
 * browser sends only hamper ids and quantities — never a price and never a
 * total. Everything is recomputed here from the same catalogue the site
 * renders from, so editing prices in data.js is all that is ever needed.
 *
 * No npm dependencies: Razorpay's REST API over fetch, Basic auth.
 */

var OLIVE = require('../../assets/js/data.js');

var MAX_QTY   = 999;   // a single line beyond this is a bulk order, not a cart
var MAX_LINES = 25;
var SHIPPING  = 250;   // must match the figure shown in the cart summary

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  var keyId     = process.env.RAZORPAY_KEY_ID;
  var keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return json(503, { error: 'Payments are not configured' });
  }

  var payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Malformed request' });
  }

  var items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) { return json(400, { error: 'Your cart is empty' }); }
  if (items.length > MAX_LINES) { return json(400, { error: 'Too many lines' }); }

  /* ---- recompute the amount from the catalogue ------------------------- */
  var subtotal = 0;
  var summary = [];

  for (var i = 0; i < items.length; i++) {
    var hamper = OLIVE.getHamper(String(items[i].id));
    if (!hamper) { return json(400, { error: 'Unknown hamper' }); }

    var qty = Math.floor(Number(items[i].qty));
    if (!isFinite(qty) || qty < 1 || qty > MAX_QTY) {
      return json(400, { error: 'Invalid quantity' });
    }

    var unit = OLIVE.priceAt(hamper, qty);   // the quantity band, applied here
    subtotal += unit * qty;
    summary.push(hamper.name + ' x' + qty);
  }

  var shipping = subtotal >= OLIVE.config.freeShipping ? 0 : SHIPPING;
  var amount   = Math.round((subtotal + shipping) * 100);   // Razorpay uses paise

  if (amount < 100) { return json(400, { error: 'Amount too small' }); }

  /* ---- create the order ------------------------------------------------ */
  var auth = Buffer.from(keyId + ':' + keySecret).toString('base64');
  var res;

  try {
    res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Basic ' + auth
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'INR',
        receipt: 'olive-' + Date.now(),
        notes: {
          items: summary.join(', ').slice(0, 240),
          note_card: String(payload.note || '').slice(0, 240)
        }
      })
    });
  } catch (e) {
    console.error('Razorpay unreachable:', e && e.message);
    return json(502, { error: 'Could not reach the payment provider' });
  }

  if (!res.ok) {
    // Log the detail for us; never return it to the browser.
    console.error('Razorpay order failed', res.status, await res.text());
    return json(502, { error: 'Could not start the payment' });
  }

  var order = await res.json();

  return json(200, {
    orderId:  order.id,
    amount:   order.amount,
    currency: order.currency,
    keyId:    keyId            // public key — safe to send; the secret never leaves
  });
};
