'use strict';

/* Tells the cart whether card and UPI payment is available.
 *
 * This is why the site needs no "payments on/off" flag to keep in sync: the
 * cart asks, and the answer is simply whether the keys are present in the
 * host's environment. Locally, and before the keys are set, the cart falls
 * back to completing the order over WhatsApp.
 *
 * Deliberately reports only a boolean — never the key itself.
 */

exports.handler = async function () {
  var enabled = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    body: JSON.stringify({ enabled: enabled })
  };
};
