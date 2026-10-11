'use strict';

/* Sending an order confirmation.
 *
 * No npm dependency, in keeping with the other three functions: this is the
 * provider's REST API over `fetch`, exactly as create-order.js talks to
 * Razorpay. Nothing to install and nothing to keep up to date.
 *
 * Configure with two environment variables:
 *
 *   RESEND_API_KEY   from resend.com — free tier covers 3,000 emails a month
 *   ORDER_EMAIL_FROM e.g. "The Olive Branch <orders@theolivebranch.in>"
 *
 * Both optional. Without them nothing is sent and nothing breaks — the same
 * pattern as the Razorpay keys, so a half-configured site degrades quietly
 * rather than failing an order that has already been paid for.
 *
 * The domain in ORDER_EMAIL_FROM must be verified with Resend before it will
 * deliver. Until it is, use their onboarding@resend.dev sender, which only
 * reaches the address you signed up with.
 */

var TO = 'hello@theolivebranch.in';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inr(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

/* The order as the kitchen needs to read it: what to pack, where it goes,
   what was paid. Plain and scannable — this is a work order, not marketing. */
function orderHtml(o) {
  var rows = (o.items || []).map(function (l) {
    return '<tr>' +
      '<td style="padding:6px 12px 6px 0">' + esc(l.name) + '</td>' +
      '<td style="padding:6px 12px 6px 0;text-align:right">' + esc(l.qty) + '</td>' +
      '<td style="padding:6px 0;text-align:right">' + inr(l.total) + '</td>' +
      '</tr>';
  }).join('');

  return '' +
    '<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A17;line-height:1.6">' +
      '<p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#55554C">New order</p>' +
      '<h2 style="font-family:Georgia,serif;font-weight:400;margin:0 0 4px">' + esc(o.reference) + '</h2>' +
      '<p style="margin:0 0 20px;color:#55554C">' + esc(o.paidAt) + '</p>' +

      '<table style="border-collapse:collapse;margin-bottom:8px">' + rows + '</table>' +
      '<p style="margin:0 0 4px">Delivery: ' + (o.shipping ? inr(o.shipping) : 'Complimentary') + '</p>' +
      '<p style="margin:0 0 20px;font-size:16px"><strong>Paid: ' + inr(o.total) + '</strong> ' +
        '<span style="color:#55554C">(inclusive of all taxes)</span></p>' +

      '<p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#55554C;margin-bottom:4px">Deliver to</p>' +
      '<p style="margin:0 0 20px">' +
        esc(o.address.name) + '<br>' +
        esc(o.address.phone) + '<br>' +
        esc(o.address.address) + '<br>' +
        esc(o.address.city) + ', ' + esc(o.address.state) + ' ' + esc(o.address.pin) + '<br>' +
        '<a href="mailto:' + esc(o.address.email) + '">' + esc(o.address.email) + '</a>' +
      '</p>' +

      (o.note
        ? '<p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#55554C;margin-bottom:4px">Note card</p>' +
          '<p style="margin:0 0 20px;padding:12px 14px;background:#EDE9DE;border-left:2px solid #4A5D3A">' +
            esc(o.note) + '</p>'
        : '') +

      '<p style="color:#55554C;font-size:12px;border-top:1px solid rgba(26,26,23,.15);padding-top:12px">' +
        'Razorpay payment ' + esc(o.paymentId) + ' · order ' + esc(o.orderId) +
      '</p>' +
    '</div>';
}

/* Never throws. A confirmation that fails to send must not turn a captured
   payment into an error response — Razorpay would retry the webhook and we
   would double-handle an order that was already fine. */
async function sendOrderEmail(order) {
  var key = process.env.RESEND_API_KEY;
  var from = process.env.ORDER_EMAIL_FROM;

  if (!key || !from) {
    console.log('Order email not configured; skipping', order.reference);
    return { sent: false, reason: 'not-configured' };
  }

  try {
    var res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer ' + key
      },
      body: JSON.stringify({
        from: from,
        to: [TO],
        reply_to: order.address && order.address.email ? order.address.email : undefined,
        subject: 'New order · ' + order.reference + ' · ' + inr(order.total),
        html: orderHtml(order)
      })
    });

    if (!res.ok) {
      console.error('Order email rejected', res.status, await res.text());
      return { sent: false, reason: 'rejected' };
    }
    return { sent: true };
  } catch (e) {
    console.error('Order email failed', e && e.message);
    return { sent: false, reason: 'threw' };
  }
}

module.exports = { sendOrderEmail: sendOrderEmail, TO: TO };
