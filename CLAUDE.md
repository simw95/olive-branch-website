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
index.html, collection-*.html, product.html, ...   15 hand-written pages
assets/css/olive.css      the entire design system, one file
assets/js/data.js         ← business details, hampers, prices, journal
assets/js/cart.js         cart in localStorage, with in-memory fallback
assets/js/render.js       builds grids, product pages, the cart
assets/js/motion.js       scroll reveals and parallax
assets/js/site.js         header, footer, nav dropdowns, zoom, forms
assets/images/            processed web JPEGs
Hamper Photos/            original PNG masters — never referenced at runtime
docs/design-notes.md      the full design rationale
```

**`data.js` is the only file needed for content changes.** Prices, hamper
names, contents, WhatsApp number, journal posts. Script load order matters:
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
| `body { overflow-x: hidden }` | Makes `<body>` a scroll container and silently breaks `position: sticky` on descendants (masthead, product buy panel) | `overflow-x: clip` |
| `font-variant-numeric: tabular-nums` on prices | Schibsted Grotesk's tabular comma is full-width, so ₹1,28,700 renders as "₹1 , 28 , 700" | `lining-nums` for any INR figure |
| Editing files with PowerShell `Get-Content`/`Set-Content` | Reads UTF-8 as ANSI and re-encodes, mojibaking every `—`, `’`, `→`, `▸` in the file | Use the Edit tool, or `[System.IO.File]::ReadAllText(path, [Text.Encoding]::UTF8)` |
| Two `.section` blocks in a row | Stacked padding leaves a ~170px gap | Put `style="padding-bottom:0"` on the first, or alternate `section-alt` |
| `hidden` attribute on a `.btn` | The UA's `[hidden]{display:none}` loses to `.btn{display:inline-flex}`, so the element stays visible | `[hidden]{display:none!important}` is already in section 1 — keep it |
| Trusting any price sent from the browser | The cart total is client-side and trivially editable in dev tools | `create-order.js` recomputes every amount from `data.js`. Never accept an amount over the wire |

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
- **Quantity bands are per hamper type, not pooled** across the cart. Ten Minis
  earn the band; five Minis plus five full hampers do not.
- **No zoom on the home or collection pages**, only on product pages.

---

## The photography is placeholder

All current images are AI-generated and will be replaced by real photography.
Two known issues that disappear when they are:

1. Several product labels contain garbled text.
2. Most boxes are branded **"The Olive Project"** — the old name. Only the
   hero, the wedding Mini and the band above Weddings say "The Olive Branch".

Replacements should keep the same filenames in `assets/images/`; nothing else
needs to change. Originals stay untouched in `Hamper Photos/`.

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
15 pages. It has caught two real bugs that were invisible in screenshots.

Also check: `prefers-reduced-motion` renders every animated element at its
finished state (it is a hard off switch, not a reduction), and the cart
survives a reload.
