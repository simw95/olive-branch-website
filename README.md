# The Olive Branch — website

A zero-build static site. No Node, no npm, no install. Open `index.html` in a
browser and the whole thing works, cart included.

---

## Everything you will want to change lives in one file

`assets/js/data.js`

That file holds business details, the hamper catalogue and prices. Nothing
else needs editing for day-to-day changes.

### Change a price

Find the hamper in `OLIVE.hampers` and edit its `prices` array. The five numbers
map, in order, to the five quantity bands in `OLIVE.tiers`:

```js
prices: [6900, 6490, 6140, 5860, 5520]
//        1-9   10-24  25-49  50-99  100+
```

The product page and the cart both read from this. Change the numbers and
everything follows.

**Set those figures tax-inclusive.** Whatever you type is exactly what the
customer pays — the site does no tax arithmetic anywhere. It only states the
fact, once under the price on a product page and once under the cart total,
using `OLIVE.config.taxNote` (`'Inclusive of all taxes.'`). Change that one
string to change both places.

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
| GSTIN | A Netlify environment variable, when the invoice needs it — never in `data.js`, which the browser downloads |
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

| Name | Value | Needed for |
|---|---|---|
| `RAZORPAY_KEY_ID` | your Key ID | card & UPI checkout |
| `RAZORPAY_KEY_SECRET` | your Key Secret | card & UPI checkout |
| `RAZORPAY_WEBHOOK_SECRET` | any long random string | the order webhook |
| `RESEND_API_KEY` | from resend.com | the order email |
| `ORDER_EMAIL_FROM` | `The Olive Branch <orders@theolivebranch.in>` | the order email |

Redeploy. That is the whole setup — the cart notices the keys and swaps
"Pay securely" in as the main button by itself. There is no flag to flip in
the code, so nothing can fall out of sync.

Each group is independent. Set only the first two and payments work but no
confirmation email arrives; set none and every order completes over WhatsApp.

**The webhook needs one step in Razorpay too:** Settings → Webhooks → Add New
Webhook, URL `https://<your-site>/api/razorpay-webhook`, secret the same
string you put in `RAZORPAY_WEBHOOK_SECRET`, and tick the **`payment.captured`**
event. Without it, a customer who closes the tab straight after paying leaves
you with a payment in the Razorpay dashboard and no order email.

**Resend needs its sending domain verified** before it will deliver to
`hello@theolivebranch.in`. Until that is done, set `ORDER_EMAIL_FROM` to
`onboarding@resend.dev`, which only delivers to the address you signed up with
— enough to prove the flow works.

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

The five functions live in `netlify/functions/` and have **no npm
dependencies** — the Razorpay REST API over `fetch`, and Node's built-in
`crypto` for the signatures. Nothing to install, nothing to keep updated.

### Still on the WhatsApp route

Both paths stay live. Card and UPI suit single hampers at list price; bulk
orders are quoted, so those still run through WhatsApp and a payment link. The
WhatsApp button never disappears, it just becomes the secondary action.

### Testing it on your own machine

The payment functions need a server, so `file://` cannot run them — the cart
there simply stays on the WhatsApp route. To exercise the real thing:

```
npm i -g netlify-cli      # a developer tool, installed globally.
cp .env.example .env      # The site itself still has no package.json.
netlify dev               # → http://localhost:8888
```

Fill `.env` with your **test** keys (`rzp_test_…`). It is git-ignored and the
deployed site never reads it — Netlify uses its own environment variables.

Razorpay's test credentials, which move no money:

| | |
|---|---|
| Card | `4111 1111 1111 1111`, any future expiry, any CVV |
| UPI | `success@razorpay`, or `failure@razorpay` to test the failure path |

Orders appear in the Razorpay dashboard with **Test Mode** switched on.

The webhook is the one piece this cannot test, because Razorpay has to be able
to reach the URL. Use `netlify dev --live`, or test it on a deploy preview.

---

## Previewing

Double-clicking `index.html` works. For a better preview, use the **Live Server**
extension in VS Code (no Node install required) — some things like social share
previews only behave correctly over `http://`.

## Publishing

Connect the repository to Netlify; `netlify.toml` configures everything.

It runs `tools/publish.sh`, which copies the eleven pages and `assets/` into
`_site/` and uploads that. **Do not publish the folder as it stands** — the
repository also holds 185MB of photographic masters, the AI drafts, the design
notes and `CLAUDE.md`, none of which belong on a public URL, and Netlify
uploads a publish folder whole with no exclude list.

Nothing is compiled or bundled by that script. `index.html` at the repository
root still opens straight from `file://` with the cart working; the script only
decides what gets uploaded. Run `bash tools/publish.sh` yourself to see exactly
what would ship.

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

Every hamper in the wedding, celebration and corporate collections has been
reshot and is branded "The Olive Branch"; the frames they replaced sit in
`assets/images/*/retired/`. The hero and the journal imagery are still
AI-generated placeholders. One issue runs through all of it: some product
labels contain garbled text, which is why hamper contents are read off the
photographs at magnification and anything illegible is left out rather than
guessed at.
