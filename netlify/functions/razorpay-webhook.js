'use strict';

/* Razorpay webhook — the order record that does not depend on a browser.
 *
 * WHY THIS EXISTS. verify-payment.js only runs if the customer's browser
 * calls back after paying. Close the tab at the wrong moment, lose signal in a
 * lift, let the phone sleep — the money is taken and nothing on our side ever
 * hears about it. Razorpay, by contrast, retries this endpoint until it gets a
 * 2xx. So this, not the browser callback, is what makes an order real.
 *
 * SET UP IN RAZORPAY:
 *   Dashboard → Settings → Webhooks → Add New Webhook
 *   URL     https://<your-site>/api/razorpay-webhook
 *   Secret  any long random string — put the same value in RAZORPAY_WEBHOOK_SECRET
 *   Event   payment.captured        (that one event is enough)
 *
 * The signature here is NOT the one verify-payment.js checks. That one is
 * HMAC(order_id|payment_id) with your key secret; this is HMAC(raw body) with
 * the webhook secret. Different secret, different payload — mixing them up is
 * the usual reason a webhook silently 400s.
 */

var crypto = require('crypto');
var email = require('./_email.js');

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') { return json(405, { ok: false }); }

  var secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set');
    return json(503, { ok: false });
  }

  /* Sign the raw body exactly as received. Parsing and re-serialising changes
     key order and whitespace, and the signature stops matching. */
  var raw = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : (event.body || '');

  var sent = event.headers['x-razorpay-signature'] ||
             event.headers['X-Razorpay-Signature'] || '';

  var expected = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  var a = Buffer.from(expected, 'utf8');
  var b = Buffer.from(String(sent), 'utf8');

  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('Webhook signature mismatch');
    return json(400, { ok: false });
  }

  var body;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    return json(400, { ok: false });
  }

  /* Anything other than a captured payment is acknowledged and ignored, so
     Razorpay does not retry events we have no use for. */
  if (body.event !== 'payment.captured') {
    return json(200, { ok: true, ignored: body.event });
  }

  var pay = (body.payload && body.payload.payment && body.payload.payment.entity) || {};
  var notes = pay.notes || {};

  /* The address was written into the order notes by create-order.js, which is
     why it survives all the way to here without a database. */
  var parts = String(notes.ship_addr || '').split(',');
  var tail = (parts.pop() || '').trim().split(' ');
  var pin = tail.pop() || '';

  var order = {
    reference: pay.order_id || pay.id,
    orderId:   pay.order_id || '',
    paymentId: pay.id || '',
    paidAt:    new Date((pay.created_at || Date.now() / 1000) * 1000)
                 .toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    total:     Math.round((pay.amount || 0) / 100),
    shipping:  0,
    items:     [],
    note:      notes.note_card || '',
    address: {
      name:    notes.ship_name || '',
      phone:   notes.ship_phone || '',
      address: parts.slice(0, -1).join(',').trim() || notes.ship_addr || '',
      city:    (parts[parts.length - 1] || '').trim(),
      state:   tail.join(' ').trim(),
      pin:     pin,
      email:   notes.ship_email || ''
    }
  };

  /* Items are a summary string in notes ("The Wedding Hamper x2, …"), which is
     all we need to pack the order. */
  order.items = String(notes.items || '').split(',').map(function (s) {
    var m = /^(.*)\sx(\d+)$/.exec(s.trim());
    return m ? { name: m[1], qty: +m[2], total: '' } : null;
  }).filter(Boolean);

  var sentMail = await email.sendOrderEmail(order);

  /* 200 regardless. The payment is captured and the signature checked; if the
     email failed we log it and move on rather than inviting a retry storm
     against an order that is already good. */
  console.log('Order captured', order.reference, 'email:', sentMail.sent);
  return json(200, { ok: true });
};
