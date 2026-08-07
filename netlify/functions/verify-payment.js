'use strict';

/* Confirms a completed payment really came from Razorpay.
 *
 * Razorpay signs `order_id|payment_id` with your key secret. Recomputing that
 * HMAC here is what makes the success callback trustworthy — without it, a
 * forged callback from the browser would look identical to a real one.
 */

var crypto = require('crypto');

function json(status, body) {
  return {
    statusCode: status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify(body)
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') { return json(405, { ok: false }); }

  var secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) { return json(503, { ok: false }); }

  var p;
  try {
    p = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { ok: false });
  }

  var orderId   = p.razorpay_order_id;
  var paymentId = p.razorpay_payment_id;
  var signature = p.razorpay_signature;

  if (!orderId || !paymentId || !signature) { return json(400, { ok: false }); }

  var expected = crypto
    .createHmac('sha256', secret)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  // Constant-time compare, so a wrong signature cannot be guessed by timing.
  var a = Buffer.from(expected, 'utf8');
  var b = Buffer.from(String(signature), 'utf8');
  var ok = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    console.warn('Signature mismatch for order', orderId);
    return json(400, { ok: false });
  }

  console.log('Payment verified', { orderId: orderId, paymentId: paymentId });
  return json(200, { ok: true, paymentId: paymentId });
};
