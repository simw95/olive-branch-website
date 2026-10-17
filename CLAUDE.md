# Working on this codebase

Notes for whoever picks this up next — human or AI. `README.md` covers how to
*use* the site. This covers how to *change* it without breaking things.

---

## The one constraint everything follows from

**This is a zero-build static site that must work when opened from `file://`.**

No Node, no npm, no bundler, no framework. You can double-click `index.html`
and the entire site works, cart included. Deployment is dragging the folder
onto a host.

That rules out two things permanently:

- **No `fetch()`** — blocked by CORS on `file://` pages.
- **No ES modules** (`import` / `type="module"`) — same reason.

All data therefore loads through a plain `<script>` tag that assigns to a
global (`window.OLIVE`). If you find yourself wanting a module system, you are
about to break the core property of this project. Discuss it first.

**One deliberate exception.** The cart uses `fetch` for the payment endpoints.
That is allowed because it is *optional* — it is skipped entirely unless
`location.protocol` is http(s), and every failure falls back to the WhatsApp
route. Nothing the site needs in order to render ever goes over `fetch`.

There is no test suite. Verification is visual — see the bottom of this file.

---

## Where things live

```
index.html, collection-*.html, product.html, ...   11 hand-written pages
assets/css/olive.css      the entire design system, one file
assets/js/data.js         ← business details, hampers, prices
assets/js/cart.js         cart in localStorage, with in-memory fallback
assets/js/render.js       builds grids, product pages, the cart
assets/js/motion.js       scroll reveals and parallax
assets/js/site.js         header, footer, nav dropdowns, zoom, forms
assets/images/            processed web JPEGs
Hamper Photos/            original PNG masters — never referenced at runtime
docs/design-notes.md      the full design rationale
```

**The label maker has moved out of this project.** It used to sit at
`label/candle-label.html`; it now lives standalone in the `Label Maker` folder
alongside this one. It was always collateral rather than a web page — nothing
linked to it, it was `noindex`, and it sat outside the 15-page sweep.

It is still styled to this brand: it copies the palette tokens from
`assets/css/olive.css` and the leaf path from `assets/js/site.js`, so a rebrand
here means re-checking it there. Its own README carries the warning that
matters — the brand faces come off the Google Fonts CDN, so **exporting a label
while offline silently prints it in Georgia and Arial**, which is how
`assets/images/candles/pink-peony-label.svg` came to be set in Bodoni MT
without anyone noticing.

**`data.js` is the only file needed for content changes.** Prices, hamper
names, contents, WhatsApp number. Script load order matters:
`data → cart → render → site → motion`. `render.js` must run before `site.js`
so the zoom handler finds the images it injected.

**Header and footer are injected by `site.js`**, not written into each page.
A nav change is a one-file change. The collection dropdowns are generated from
`OLIVE.hampers`, so adding a hamper adds it to the menu automatically.

**Product pages are data-driven.** `product.html?id=wedding-hamper` renders
from `data.js`. Adding a hamper never means creating an HTML file. The
trade-off is weaker per-hamper SEO, mitigated with JSON-LD.

---

## Bugs already found and fixed — don't reintroduce them

| Trap | What happens | Do this instead |
|---|---|---|
| `max-width: 30ch` on a large heading | `ch` scales with the element's own font-size, so a 34px heading wants ~560px and overflows a phone | `max-width: min(30ch, 100%)`, or use `rem` |
| `min-height` together with `aspect-ratio` | The min-height transfers through the ratio into a **minimum width** (320 × 16/7 = 731px) and forces horizontal overflow | Step the `aspect-ratio` responsively; no `min-height` |
| `body { overflow-x: hidden }` | Makes `<body>` a scroll container and silently breaks `position: sticky` on descendants (the product buy panel) | `overflow-x: clip` |
| `position: sticky` on an element whose parent is only as tall as itself | Sticky is bounded by the parent, so it scrolls away and looks broken. The masthead did this for months | Stick to a parent that spans the scroll region, or don't declare it |
| `font-variant-numeric: tabular-nums` on prices | Schibsted Grotesk's tabular comma is full-width, so ₹1,28,700 renders as "₹1 , 28 , 700" | `lining-nums` for any INR figure |
| Editing files with PowerShell `Get-Content`/`Set-Content` | Reads UTF-8 as ANSI and re-encodes, mojibaking every `—`, `’`, `→`, `▸` in the file | Use the Edit tool, or `[System.IO.File]::ReadAllText(path, [Text.Encoding]::UTF8)` |
| Two `.section` blocks in a row | Stacked padding leaves a ~170px gap | Put `style="padding-bottom:0"` on the first, or alternate `section-alt` |
| `hidden` attribute on a `.btn` | The UA's `[hidden]{display:none}` loses to `.btn{display:inline-flex}`, so the element stays visible | `[hidden]{display:none!important}` is already in section 1 — keep it |
| Trusting any price sent from the browser | The cart total is client-side and trivially editable in dev tools | `create-order.js` recomputes every amount from `data.js`. Never accept an amount over the wire |
| Adding a grid item to a grid whose others are auto-placed | Auto-placement fills in *around* explicitly-placed items. Pinning a zoom panel to row 1 / column 2 of `.product` pushed `.product-buy` out to row 2 — the buy panel visibly dropped down the page on hover | Place every child explicitly, or none. Scope it to the breakpoint where the extra column exists |
| `mousemove` for panning anything | Phones never fire it. The zoom overlay opened a hugely magnified crop that a touch visitor could not move at all | `pointermove` covers mouse, touch and pen; add `touch-action: none` or the browser keeps the gesture |

---

## House style — applied consistently, don't drift

- **Sentence case with a full stop** on every heading. Not title case.
- **British spelling**: favours, colours, personalised, jewellery.
- **Spaced em dashes** — like this — not tight—like—this.
- **Typographic apostrophes**: `’` not `'`. Same for quotes.
- **Indian digit grouping** for money: ₹1,28,700. `OLIVE.inr()` handles it.
- **Collection links read "Explore the … →"**, everywhere.
- **Zero border-radius.** The site is square throughout.
- Colour comes from the photography. The palette has seven tokens and each has
  exactly one job — see `olive.css` section 1.
- **Never promise multi-address dispatch, a number of addresses, or "no extra
  handling cost".** That claim was removed from the corporate page, the bulk
  form, the product pricing note, the two meta descriptions and a hamper's
  notes. Dispatch to many individual recipients is the part of a bulk order
  that is hardest to honour, so the site does not commit to it in copy —
  it is discussed on the enquiry.
- **Don't commit to sending a sample box, and don't offer one as a call to
  action.** The two "Request a sample box" links were removed and the copy
  reframed around approval — "Sample boxes are to be approved before you commit
  to a full run", not "we send a sample". Same reasoning as above: it is a
  promise made before we know the order.

Type is **EB Garamond** (display, wordmark) over **Schibsted Grotesk** (body,
UI). The wordmark is set in capitals with wide tracking to match the box lids.

---

## Deliberate decisions that look like omissions

- **Payments are wired but dormant until keys exist.** Three functions in
  `netlify/functions/` handle Razorpay. The cart asks `/api/payment-status`
  and shows the Pay button only if the host has `RAZORPAY_KEY_ID` and
  `RAZORPAY_KEY_SECRET` set. There is deliberately **no on/off flag in the
  repo** — a flag could disagree with reality; asking the server cannot.
- **The Bridesmaid collection is parked, not deleted.** Its photography is
  processed in `assets/images/bridesmaid/` and `data.js` holds a commented-out
  collection block and two hampers. Uncomment both plus a
  `collection-bridesmaid.html` to switch it back on.
- **GST is exclusive: prices are before tax and 18% is added at checkout.**
  Every `price` in `data.js` is the pre-tax figure. `OLIVE.orderTotals()` —
  the single place delivery, GST and the total are worked out, called by both
  the cart and `create-order.js` — multiplies the subtotal by `gstRate`, adds
  that to the sum, then adds delivery after it, untaxed. A hamper listed at
  3,450 is charged at 4,071 plus the flat ₹250 delivery — 4,321. There is no
  free-delivery threshold any more; don't reintroduce one in copy.
  `OLIVE.config.taxNote` reads "Exclusive of GST" and is a plain string: it
  names no rate, so there is nothing to keep in step with `gstRate`.
  **Changing `gstRate` changes what every customer is charged.**

  **This has flipped four times, so check which way round it is before
  touching anything.** Inclusive with no arithmetic → exclusive → inclusive
  with the tax extracted → exclusive again. Two things have to agree and are
  the whole risk:

  1. `gst` is **part of `total`** when prices are exclusive, and **not part
     of it** when they are inclusive.
  2. The cart's row label says which — a bare **GST** when it is being added,
     **GST (included)** when it is not.

  Get those out of step and the customer is charged the tax twice or not at
  all, and `cart-math.js` is written to catch exactly that. If you find copy
  saying "Inclusive of GST" or "GST (included)", it is a leftover from the
  previous arrangement. The GSTIN is still held and still never rendered.
- **The hero moves on load, and keeps breathing.** `@keyframes hero-drop`
  lowers the photograph into its frame — the sprig and wordmark are baked into
  the JPEG, so dropping the image is what makes them glide down — and the copy
  follows on a stagger via `.hero-body > *:nth-child(n)`. Then `hero-breathe`
  scales 1 → 1.045 over 26s, alternating forever, so the hero is never fully
  still. **The overscan invariant matters:** the drop travels 4% while scale
  1.10 hides 5%, and both hit zero together, so no strip of backing colour is
  ever exposed. Raise the travel or lower the scale and you reintroduce the
  parallax bug this image already had. `hero-breathe` never goes below scale 1
  for the same reason. Both are switched off outright under reduced motion —
  zeroing duration alone would leave the stagger delays holding the copy
  invisible.
- **The product zoom magnifies in place, and 1.5× is a ceiling with a reason.**
  Hovering scales the photograph inside `.product-media`, which clips; the
  `transform-origin` follows the cursor. On touch, and below 1025px, tapping
  opens the overlay at the same 1.5× (and never past the source's own pixels).
  `MAX_ZOOM` in `site.js` governs both.
  **Do not raise it.** It used to magnify 2.46× — the source at native 1800px
  over a ~730px column — which is enough to read 8px fine print. Photography
  now comes through generative editing, which holds large type and reliably
  mangles small type: one edited hamper read *50 GMS* where the soap says 55,
  and *COFFEE BEANS* where the tin says *coffee powder added 15%*. At page
  size none of that is legible; at 2.46× all of it was. 1.5× shows texture and
  arrangement and leaves print a smudge.
  Scaling about an origin inside the box also means **no clamping is needed**:
  at any scale ≥ 1 the result still covers the frame, wherever the origin sits,
  so the blank-edge bug the old side panel had to guard against cannot occur.
  Measure `.product-media`, never the image — once scaled, the image's own rect
  reports the scaled box and the sums feed back on themselves.
- **No zoom on the home or collection pages**, only on product pages.
- **A delivery address is required by both checkout routes, and that is new.**
  Neither route asked for one before: Razorpay hands over a payer's phone and
  email and never a postal address, and the WhatsApp handover only listed the
  hampers. An order could be paid in full with nobody knowing where the box
  went. `Address` in `cart.js` holds it, persisted under `olive-address-v1`
  with the same storage guards as the cart, and both routes call
  `requireAddress()` before they proceed. `create-order.js` re-checks it
  server-side, because the browser check only stops honest mistakes.
  The address rides to the webhook inside the Razorpay order **notes** — which
  is how it survives without a database.
- **`razorpay-webhook.js` is the real order record, not `verify-payment.js`.**
  Verify only runs if the customer's browser calls back; close the tab at the
  wrong moment and the money is taken while the site hears nothing. Razorpay
  retries the webhook until it gets a 2xx, so that is what triggers the
  confirmation email. **Its signature is a different one** — HMAC of the raw
  body with `RAZORPAY_WEBHOOK_SECRET`, not HMAC of `order_id|payment_id` with
  the key secret. Sign the body exactly as received; parsing and
  re-serialising reorders keys and the signature stops matching.
  It returns 200 even when the email fails, so a mail outage cannot start a
  retry storm against an order that is already good.
- **The GSTIN is not in this repository at all, and should not be put back.**
  It printed in every page footer once; that was removed because a GSTIN
  belongs on an invoice rather than on every page of a gift shop. It was then
  kept as `OLIVE.config.gstin` for a future invoice and never rendered — which
  looked safe and was not, because `data.js` is served to every visitor. On a
  live site it was readable in view-source. Nothing ever read it.
  When the invoice is built, the number goes in a **Netlify environment
  variable** beside the Razorpay keys and is read server-side. Anything the
  browser downloads is published, whether or not it is displayed.
- **Order email is optional, like the payment keys.** `_email.js` posts to
  Resend over plain `fetch` — no npm, matching the other functions. Without
  `RESEND_API_KEY` and `ORDER_EMAIL_FROM` it logs and returns; nothing breaks.
- **A hamper can sit in more than one collection, and a collection can carry
  named sections.** Three optional fields on a hamper in `data.js` do this:
  `alsoIn: ['celebration']` lists further collections it is shown in, so The
  Grand Edit is **one entry** sold as both a corporate and a celebration
  hamper — edit it once and both pages change. `section: 'Diwali'` puts it in
  its own block on the collection page, which `OLIVE.sectionsIn()` builds and
  the nav links straight to by anchor. `gallery: [a, b]` gives the product page
  more than one photograph: The Little Indulgence is shown open and wrapped.
  All three are optional, and a hamper with none of them behaves exactly as
  every hamper did before. The section heading lives in `SECTION_HEADINGS` in
  `render.js`, not in `data.js`, so a new section needs only its name there.
- **Swapping a product photograph keeps the same `<img>` element.** The view
  buttons change `src` and `data-zoom` on the element already on the page
  rather than replacing it. `site.js` bound the magnifier to that element once
  and reads `data-zoom` at click time, so the zoom follows the swap. Replace
  the element and the magnifier silently stops working on the second view.
- **There are no quantity bands any more.** Every hamper carries one `price`,
  whatever the quantity. Five bands used to print as a table on every product
  page, with a "9 more reaches ₹7,990 each" nudge beside the quantity box;
  `OLIVE.tiers`, `tierIndex()` and `nextTier()` are gone with them, and
  `OLIVE.priceAt(hamper)` now takes one argument. Bulk is quoted on enquiry —
  the product page and `bulk.html` both carry a WhatsApp line instead of a
  table. Don't reintroduce a published table: what moves the figure is the
  hampers chosen, the branding and the number of addresses, and a table can
  price none of those.

---

## The photography is part placeholder

**Every hamper on the three live collections has been reshot**, in three
batches: corporate and celebration in October, wedding after them. Those boxes
are branded "The Olive Branch" and the contents lists in `data.js` are read off
the photographs themselves. The frames they replaced are kept, not deleted —
`assets/images/*/retired/` — because the copy that cited them is easier to
check against the picture it was written from.

What is still placeholder: the hero and the section imagery, and the
parked Bridesmaid set. Two issues go with it, and both disappear when real
photography arrives:

1. Several product labels contain garbled text. The new photography is no
   exception — read any label at magnification before quoting it, and leave
   out what cannot be made out rather than guessing. This is why `MAX_ZOOM`
   is 1.5 and why a brand mark that came out as "B8JEE" is described as
   "almond butter" instead.
2. The older boxes are branded **"The Olive Project"** — the old name.

Replacements should keep the same filenames in `assets/images/`; nothing else
needs to change. Originals stay untouched in `Hamper Photos/`, and the
supplied masters in `Final upload/`.

---

## Verifying a change

There is no test runner. Use headless Chrome, which is already installed:

```powershell
# Screenshot a page
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --headless=new --disable-gpu --no-sandbox --user-data-dir="$env:TEMP\cp" `
  --hide-scrollbars --virtual-time-budget=12000 --window-size=1400,2000 `
  --screenshot="out.png" "file:///C:/Users/Simran/Project%20Olive%20Website/index.html"
```

Gotchas when doing this:

- Chrome is a GUI exe, so PowerShell does **not** wait for it. Use
  `Start-Process -Wait`, or the file will be missing or half-written.
- Headless clamps the window to a **489px minimum width** on Windows. You
  cannot screenshot a true 360px phone; check narrow layouts by measuring
  `document.documentElement.scrollWidth` against `clientWidth` instead.
- `html { scroll-behavior: smooth }` means `window.scrollTo()` animates. Set
  `document.documentElement.style.scrollBehavior = 'auto'` before scrolling in
  a test, or you will capture mid-flight.
- Use a **fresh `--user-data-dir` per run**; a lingering Chrome process holds
  the profile lock and every subsequent run fails.

**Always run the overflow sweep after layout changes.** Inject a script that
compares `scrollWidth` to `clientWidth` at 500 / 760 / 1100 / 1500px across all
11 pages. It has caught two real bugs that were invisible in screenshots.

Also check: `prefers-reduced-motion` renders every animated element at its
finished state (it is a hard off switch, not a reduction), and the cart
survives a reload.
