# The Olive Branch — website

A zero-build static site. No Node, no npm, no install. Open `index.html` in a
browser and the whole thing works, cart included.

---

## Everything you will want to change lives in one file

`assets/js/data.js`

That file holds business details, the hamper catalogue, prices, price bands and
journal posts. Nothing else needs editing for day-to-day changes.

### Change a price

Find the hamper in `OLIVE.hampers` and edit its `prices` array. The five numbers
map, in order, to the five quantity bands in `OLIVE.tiers`:

```js
prices: [6900, 6490, 6140, 5860, 5520]
//        1-9   10-24  25-49  50-99  100+
```

The product page, the cart, the tier table and the guest-count calculator all
read from this. Change the numbers and everything follows.

### Add a hamper

Copy an existing block in `OLIVE.hampers`, change the `id` (lowercase, hyphens,
no spaces), and drop two images into `assets/images/<collection>/`:

* `<slug>-full.jpg` — around 1800px on the long edge, for the product page
* `<slug>-card.jpg` — around 1000px on the long edge, for grids

Set `ratio` to the full image's width ÷ height so the product page shows it
uncropped.

### Switch the Bridesmaid collection back on

Photography is already processed and waiting in `assets/images/bridesmaid/`.
In `data.js`, uncomment two blocks — the collection in `OLIVE.collections` and
the two hampers at the foot of `OLIVE.hampers` — then create
`collection-bridesmaid.html` by copying `collection-celebration.html` and
changing `data-collection="bridesmaid"`. The navigation updates itself.

### Business details

The top of `data.js` holds the WhatsApp number, email, city, GSTIN, Instagram
link and the announcement bar text. Items marked `TODO` still need real values.

---

## Still to be filled in

| Item | Where |
|---|---|
| Real email address | `OLIVE.config.email` |
| GSTIN | `OLIVE.config.gstin` |
| Instagram handle | `OLIVE.config.instagram` |
| City, if not Mumbai | `OLIVE.config.city` |
| Real hamper names and prices | `OLIVE.hampers` |

---

## How the site is put together

```
index.html                     Home
collections.html               All three collections + full catalogue
collection-*.html              One page per collection
product.html?id=…              Individual hamper, rendered from data.js
bulk.html                      Bulk & corporate — the main conversion page
enquiry.html                   Contact and consultation requests
cart.html                      Cart and checkout
about.html                     Brand story
journal.html + journal-*.html  Three gifting guides
policies.html                  Delivery, returns, privacy, terms

assets/css/olive.css           The entire design system
assets/js/data.js              ← the file you edit
assets/js/cart.js              Cart, stored in the browser
assets/js/render.js            Builds grids, product pages, the cart
assets/js/motion.js            Scroll animation
assets/js/site.js              Header, footer, menu, zoom, forms
```

**Header and footer are injected by `site.js`**, so a navigation change is a
one-file change rather than a fourteen-file change.

**The collection dropdowns build themselves.** Hovering Wedding, Celebration or
Corporate opens a panel listing that collection's hampers with their lowest
price. It reads straight from `OLIVE.hampers`, so adding a hamper adds it to the
menu — there is no menu to maintain. The panel is hidden below 860px, where the
nav becomes a drawer and hover has no meaning.

**Product pages are data-driven.** `product.html?id=wedding-hamper` renders from
`data.js`. Adding a hamper never means creating an HTML file.

---

## Two deliberate constraints

**No `fetch()` and no ES modules.** Both are blocked by browser security on
`file://` pages. Avoiding them is why you can double-click `index.html` and have
the entire site work without a server.

**Payments are not connected.** There is no backend, so card and UPI checkout
cannot exist yet. The cart is complete and honest about this: it composes the
full order and hands it to WhatsApp, where you confirm and send a payment link.
The stub is visible in the cart summary so nobody is misled.

---

## Turning on card & UPI payments

The code is already written. It switches itself on when the keys are present.

### 1. Get your Razorpay keys

Sign up at razorpay.com, complete KYC (business PAN, bank account, address
proof), then **Settings → API Keys → Generate**. You get two values:

* **Key ID** — public, safe to share
* **Key Secret** — private, **never** put this in the repo or send it to anyone

### 2. Deploy to Netlify and add the keys

Connect this repository to Netlify. `netlify.toml` already tells it what to do,
and there is still no build step.

Then in **Site settings → Environment variables**, add:

| Name | Value |
|---|---|
| `RAZORPAY_KEY_ID` | your Key ID |
| `RAZORPAY_KEY_SECRET` | your Key Secret |

Redeploy. That is the whole setup — the cart notices the keys and swaps
"Pay securely" in as the main button by itself. There is no flag to flip in
the code, so nothing can fall out of sync.

To switch payments off again, delete the two variables and redeploy. The cart
returns to the WhatsApp route on its own.

### How it works

```
Cart  ──POST ids + quantities──▶  /api/create-order
                                  recomputes the price from data.js
                                  creates the Razorpay order
      ◀──── order_id ────────────
Razorpay Checkout opens (card, UPI, netbanking, wallets)
      ──POST signature──────────▶  /api/verify-payment
                                  HMAC check against your secret
      ◀──── confirmed ───────────
```

**The browser never sends a price.** It sends hamper ids and quantities; the
function recomputes the amount from `data.js` — the same file the site renders
from. Change a price there and both sides change together. If a customer edits
the total in dev tools, nothing happens: that number is never used.

The three functions live in `netlify/functions/` and have **no npm
dependencies** — the Razorpay REST API over `fetch`, and Node's built-in
`crypto` for the signature. Nothing to install, nothing to keep updated.

### Still on the WhatsApp route

Both paths stay live. Card and UPI suit single hampers at list price; bulk
orders are quoted, so those still run through WhatsApp and a payment link. The
WhatsApp button never disappears, it just becomes the secondary action.

### Worth adding later

Right now a payment is confirmed by the browser calling `/api/verify-payment`.
If someone pays and closes the tab immediately, the payment succeeds at
Razorpay but your site never records it. The fix is a **Razorpay webhook**
pointing at a fourth function, so confirmation does not depend on the customer's
browser staying open. Worth doing before volume gets serious.

---

## Previewing

Double-clicking `index.html` works. For a better preview, use the **Live Server**
extension in VS Code (no Node install required) — some things like social share
previews only behave correctly over `http://`.

## Publishing

Drag the whole folder onto [Netlify Drop](https://app.netlify.com/drop) or
Cloudflare Pages. There is no build command and no configuration.

---

## Notes on the images

`Hamper Photos/`, `Collection Name Images/` and `Hero Image.png` are your
untouched originals. Nothing reads from them at runtime — the site uses the
processed JPEGs in `assets/images/`, which are roughly fifteen times smaller.

Two things were done during processing:

* **7% cropped from the right and bottom** of each hamper photo, to remove the
  Gemini watermark.
* **The hero was cropped away from its baked-in headline.** Baked text cannot
  reflow on a phone, cannot be selected or indexed, and cannot be translated —
  so that headline is now live HTML. Two crops are produced from the original:

  | File | Size | Used |
  |---|---|---|
  | `hero.jpg` | 1666 × 454 | Desktop — a full-width band from below the headline |
  | `hero-narrow.jpg` | 970 × 694 | Phones and small tablets, via `<picture>` |

  The narrow crop exists because the wide band, cropped to a phone's shape,
  shows little but the empty front of the box. To replace the hero, supply a
  wide photograph with **no text baked into it** and re-cut both files.

When you replace the photography, keep the same filenames in `assets/images/`
and nothing else needs to change.

The current photographs are AI-generated placeholders. Two known issues, both
disappearing when real photography arrives: some product labels contain garbled
text, and six of the eight boxes are branded "The Olive Project" rather than
"The Olive Branch".
