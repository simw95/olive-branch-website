# The Olive Branch — Luxury Hamper Website

## Context

A new luxury hamper business in India needs a website whose **single objective is to inspire multiple / bulk hamper purchases**. It must feel premium, calm and immersive, and every design decision should serve that one goal.

The machine has **git only — no Node.js, no npm, no Python**, so this is a zero-build static site that opens by double-clicking a file and deploys by drag-and-drop.

Decisions locked with the user:

| Decision | Choice |
|---|---|
| Brand name | **The Olive Branch** |
| Collections in v1 | **Wedding, Celebration, Corporate** — Bridesmaid parked |
| Conversion model | **Hybrid** — cart + buy now, plus a separate bulk/corporate enquiry track |
| Payments | UI built, payment step **clearly stubbed** for a developer to wire Razorpay later |
| Visual direction | Olive & Bone, **burgundy as accent only** |
| Reference | **Aesop — the stated favourite and the north star.** The Langley (centred symmetry, full-bleed rhythm) is secondary; the wellness site contributed the appetite for motion only |
| Stack | Zero-build static HTML + CSS + vanilla JS |
| Photography | Use as-is — AI placeholders, to be replaced later |
| Hero image | **User will supply**; interim placeholder in place |
| Image zoom | Enabled |
| Scroll motion | Required — image movement through the scroll |
| Branded props | Genericise — no third-party trademarks named in copy |
| WhatsApp | **+91 99202 84209** |

**Intended outcome:** a site where the path of least resistance is ordering *more than one* hamper.

---

## The bulk objective, made structural

The reference copy reframed this. The Wedding collection is described as *"keepsakes to thank your guests"* — **favours, not a couple's gift**. An Indian wedding needs those in the hundreds. The site's lead collection is therefore inherently a volume product, and the design leans on that rather than treating bulk as an afterthought.

1. **Wedding is sold by guest count, not by unit.** The collection page opens on a guest-count input — *"How many guests are you thanking?"* — which sets quantity and lands the visitor directly in the right price tier. Single-unit purchase remains available but is not the default framing.
2. **Tiered pricing on every hamper page** — 1–9 / 10–24 / 25–49 / 50+ / 100+, per-hamper price falling at each tier. Volume is visibly better value without a single "SALE" badge.
3. **Cart tier nudge** — when a line sits below a boundary: *"Four more reaches the 10-hamper price — ₹340 less per hamper."*
4. **"Enquire for 10+"** on every product, deep-linking to the bulk form with that hamper pre-selected.
5. **The Multiplication** — the home page's Gifting at Scale moment (see Signature).
6. **Minis positioned as the volume tier** on Wedding and Corporate, with the full hamper as premium.

---

## Design direction — Aesop-led

The user named **Aesop** as their favourite kind of website. Aesop is a discipline, not a look, and following it means overruling parts of the earlier direction:

| Aesop does | Consequence for this build |
|---|---|
| Sets almost everything in a neutral **sans**, serif reserved for the wordmark | **Bodoni Moda is dropped** as the workhorse display face |
| Writes headings in **sentence case with full stops** | All-caps section headings are dropped |
| Never shouts with scale | **The oversized bleeding type is cut** — it was the one genuinely un-Aesop element |
| Uses **no UI accent colour**; photography carries all colour | Burgundy is rationed harder still |
| Square corners, hairline rules, outlined text CTAs with an arrow | 0px border-radius everywhere; buttons restyled |
| Names things precisely — *"Cool Coriander Seed. Warm Black Pepper."* | Copy register shifts from "thoughtfully curated" to naming the actual contents |

Retained from **The Langley**: centred symmetry and the alternating full-bleed / calm-text rhythm — which Aesop shares. Retained from the **wellness reference**: the appetite for scroll motion only. **The elliptical masks are cut** alongside the oversized type.

### Palette

```
--bone        #F7F4EC   page ground, warm off-white
--bone-2      #EDE9DE   alternating sections
--ink         #1A1A17   near-black, body text
--olive       #4A5D3A   brand base
--olive-deep  #2A3423   announcement bar, footer, dark bands
--burgundy    #5C2233   commerce actions and the scale band, nothing else
--rule        ink @ 15%  hairlines
```

Brass is gone as a token — it was decorative once photography carried the gold. Per-collection accent tints stay cut. Colour comes from the photographs.

### Typography

- **Body and UI — Schibsted Grotesk.** Neutral grotesque with a little humanist warmth; the closest free relative of the Suisse-derived sans Aesop uses. Carries nav, body, labels, prices, buttons.
- **Display and wordmark — EB Garamond.** Old-style, literary, unhurried — the serif of a library rather than a fashion masthead. It suits a brand named for a classical symbol far better than a didone does, and it is the one place the site is allowed to be beautiful rather than plain.
- **Utility — Schibsted Grotesk uppercase, ~0.12em letterspacing, small.** Eyebrows, labels, prices.

Sentence case throughout. Google Fonts with a system fallback stack.

### Layout — the Aesop header

Adopted wholesale, because it is both the favourite reference and better for commerce than a hamburger:

1. Thin olive-deep announcement bar — *"Complimentary delivery on orders over ₹5,000."*
2. Bone header — wordmark centred, utility links left, cart and enquiry right.
3. Horizontal category nav — Shop all · Wedding · Celebration · Corporate · Bulk gifting · Journal · About.

Below that, alternating full-bleed photography and centred text blocks on a narrow measure. Collection cards use a consistent **4:3** ratio with per-image `object-position`; product pages display each photo at its **native** ratio.

**Buttons:** hairline outlined rectangle with a trailing arrow for editorial CTAs; solid fill for commerce actions only (add to cart, submit enquiry). No rounded corners anywhere.

### Signature — The Multiplication

Retained, but restyled to Aesop's restraint. In the *Gifting at scale* section a single hamper sits centred; as the section scrolls, it assembles into a precisely aligned, flat grid of identical hampers — a still life of a hundred and fifty boxes — resolving into the bulk enquiry CTA with one quiet caption beneath.

No ticking counter, no receding 3D perspective; both read as startup marketing rather than considered luxury. The idea survives because it is the business objective rendered as image — one gesture, repeated exactly — and no template has it.

**The drawn olive-branch spine stays cut.** The leaf glyph survives only where it does real work: bulleting contents manifests and marking cart steps.

### Motion

Implemented with a single `requestAnimationFrame` scroll loop that writes a `--p` progress value (0→1) onto observed elements; CSS consumes it. Transforms and opacity only — no layout-triggering properties. `IntersectionObserver` gates which elements are live. No animation library, so no CDN dependency and nothing to build.

| Element | Movement |
|---|---|
| Full-bleed photography | Parallax — image translates ~12% slower than the scroll, inside a clipped frame |
| Section entry | Clip-path reveal, frame opening from a slim band to full height |
| Collection gateways | Elliptical mask with a slow scale from 1.08 → 1.0 |
| Oversized display lines | Horizontal drift across the scroll range |
| Gifting at Scale | The Multiplication, driven by section scroll progress |
| Hover states | Slow and small — 400ms, subtle |

`prefers-reduced-motion: reduce` disables all of it and renders the static end state of every animation. This is a hard switch, not a reduction.

---

## Catalogue — 6 hampers across 3 collections

Each hamper has exactly **one** photograph, so product pages are built around a single large image with zoom plus a detailed contents manifest — not a thumbnail gallery.

| Collection | Hamper | Source file | Contents (as visible) |
|---|---|---|---|
| Wedding | The Wedding Hamper | `Wedding Hamper.png` | Roasted cashews, extra virgin olive oil, berry preserve, loose-leaf tea in linen, honey with wooden dipper, artisan soap, olive-leaf seasoning, dried florals |
| Wedding | The Wedding Hamper, Mini | `Wedding Hamper Mini.png` | "A little something sweet" linen pouch, English rose herbal tea, salted caramel almonds in 70% dark chocolate, fig leaf & vetiver candle, scalloped ceramic trinket dish, thank-you card |
| Celebration | The Celebration Hamper | `Celebration Hamper 1.png` | Bergamot & fig soy candle (hand poured in India), wild forest honey, artisanal cream truffles, premium dry fruits, lavender olive oil soap, wooden honey dipper |
| Celebration | The Celebration Hamper, Grand | `Celebration Hamper 2.png` | Gourmet roasted nuts, dark milk chocolate & sea salt, fig & walnut preserve, organic chamomile & lavender tea, forest honey, sandalwood & amber candle, handmade truffles, lavender & oat soap |
| Corporate | The Corporate Hamper | `Corporate Hamper.png` | Leather journal, brass-trim pen, Belgian chocolate truffles, gourmet nuts in a clip-top jar, date & fig chutney, Darjeeling & saffron tea, ceramic keepsake jar, brass Ganesha, incense holder |
| Corporate | The Corporate Hamper, Mini | `The Corporate Hamper Mini.png` | Extra virgin olive oil, Kalamata olive tapenade, soft cheese on an olive-wood board with knife, almonds in linen, wax-sealed artisan soap, dried lavender |

**Names and prices are placeholders** pending the user's real list. Both live in one file.

**Parked, not deleted:** the two Bachelorette photos and the Bridesmaid collection card stay in place, and `data.js` keeps a commented-out Bridesmaid block so the collection switches on later without rework.

---

## Copy and voice

`Thoughtful Lines/Website Copy write..docx` establishes the voice — warm, unhurried, focused on the recipient rather than the product. Its lines map to collections and will be used directly:

- **Wedding** — *"Thoughtfully curated keepsakes to thank your guests for being part of your celebration. Designed to leave a lasting impression long after the wedding day."*
- **Celebration** — *"From birthdays to graduations and every celebration in between, discover beautifully curated gifts that turn life's moments into lasting memories."*
- **Corporate** — *"Thoughtfully curated corporate gifts that celebrate partnerships, recognise achievements, and leave a lasting impression."*

One deliberate deviation: six of the seven supplied lines open with "thoughtfully/beautifully curated". Verbatim reuse across a single page reads as formulaic and undercuts the premium feel. Each line is used **once**, in its strongest position.

**Everything written around them shifts to the Aesop register** — Aesop never says "thoughtfully curated", it names the thing: *"Cool Coriander Seed. Warm Black Pepper."* So the surrounding copy names black fig, raw honey, vetiver, Darjeeling, brass. The hero headline draws directly from what is visible in the hero photograph:

> **Black fig, raw honey, and a note in your own hand.**
> Hampers composed for weddings, milestones, and the people who make a company work.

---

## Architecture

**Critical constraint:** the site must work from `file://`. That rules out `fetch()` and ES modules — both CORS-blocked on local files. All data loads via a classic `<script>` tag assigning to a global.

Hamper pages are **data-driven**, not hand-written: one entry in one file adds a hamper. Essential given the catalogue and photography will both be replaced, and the owner is not a developer.

```
index.html                     Home
collections.html               The three collections
collection-wedding.html        ┐
collection-celebration.html    │ thin pages, shared renderer
collection-corporate.html      ┘
product.html?id=…              Individual hamper page
bulk.html                      Bulk & Corporate — the money page
enquiry.html                   Consultation / contact
about.html                     The Olive Branch story
journal.html                   Gifting guides index
journal-*.html                 3 seed articles
cart.html                      Cart + checkout UI (payment stubbed)
policies.html                  Shipping, returns, privacy, terms

assets/
  css/olive.css                Single token-led stylesheet
  js/data.js                   window.OLIVE = { config, collections, hampers, journal }
  js/cart.js                   localStorage cart, INR formatting, tier logic
  js/render.js                 Collection grid, product, cart renderers
  js/motion.js                 rAF scroll engine, parallax, The Multiplication
  js/site.js                   Nav, cart drawer, zoom, forms
  images/                      Processed photography
```

`product.html?id=` trades some per-hamper SEO for a maintainable catalogue with no build step. Mitigated with per-product JSON-LD and fully crawlable collection pages; the upgrade path to generated static pages goes in the README.

### Image handling

Originals are **copied, never moved** — `Hamper Photos/` and `Collection Name Images/` stay untouched as masters.

1. Copy to `assets/images/<collection>/<slug>.png`, cropping the Gemini ✦ watermark from the bottom-right corner.
2. Record each image's native aspect ratio and focal `object-position` in `data.js`.
3. **Hero** — `Hero Image.png` supplied by the user. It carries a **baked-in headline** ("THOUGHTFUL GIFTS, BEAUTIFULLY CURATED.") occupying the right third. Baked text cannot reflow, cannot be selected, indexed or translated, and on a phone it either crops away or shrinks past legibility. The right third is therefore **cropped off** and the headline set live in HTML.

   **Deviation found during build:** the cropped photograph is near-square (1024 × 944). Forcing it to `cover` a full-bleed 16:9 hero scaled it 1.4× and reduced the composition to a close-up of two jars, with the subheading unreadable over the labels. The hero is therefore a **split panel — photograph left, type right on bone** — which fits the source ratio, shows the whole composition including the olive branch, and reproduces the layout of the supplied image itself. It stacks on mobile.
4. **Zoom** on product pages — click to zoom with pointer-tracked panning, Escape to close, focus returned to the trigger.
5. The four "Collection Name Images" are **not photographs** — black serif text on off-white. Not used; that type is set live in HTML instead. Sharper, responsive, accessible, on-brand, 16MB lighter.

---

## Page-by-page

**Home** — Full-bleed hero with the wordmark centred over it. Three collection gateways in elliptical masks. *Gifting at Scale* with The Multiplication. How it works (curate → personalise → dispatch). Trust strip. Journal teaser. Enquiry CTA.

**Collections** — The three, each with its own voice line and full-bleed band.

**Collection pages** — Grid with filtering (occasion, price band, size). Wedding opens on the guest-count input; Minis framed as the volume tier on Wedding and Corporate.

**Product page** — Single large native-ratio photo with zoom; contents manifest bulleted with the leaf glyph; quantity stepper; **tiered pricing table**; Add to Cart and Buy Now; *Enquire for 10+*; personalised note-card option; dispatch notes; related hampers.

**Bulk & Corporate** — The primary conversion page, and the second rupture moment. Volume tiers, branding and personalisation, multi-address dispatch, GST invoicing, sample-box request, and a qualifying form: occasion, quantity, budget per hamper, date needed, branding needs, delivery cities.

**Cart** — Line items with quantity steppers, INR totals in Indian digit grouping (₹1,25,000), tier-upgrade nudges, note-card message, and a clearly stubbed payment step.

**Journal** — Three seed guides (wedding favour planning by guest count, corporate gifting etiquette, choosing by occasion).

**Policies** — Shipping, returns, privacy, terms. Needed for trust now and required by payment gateways later.

---

## E-commerce essentials included

Cart persisted in `localStorage` · mini-cart drawer · Indian currency formatting · product image zoom · WhatsApp float button · newsletter capture · related products · collection filtering · meta and Open Graph tags · JSON-LD Organization and Product schema · SVG wordmark and favicon · visible keyboard focus · alt text throughout · responsive to 360px.

## WhatsApp enquiry button

Floating burgundy button, bottom-right, every page:

```
https://wa.me/919920284209?text=<prefilled>
```

Opens a direct chat in the app on mobile and WhatsApp Web on desktop. The prefill is **context-aware** — from a hamper page it names that hamper, from the bulk page it opens a bulk enquiry. The number lives in one constant in `data.js`.

---

## Verification

No Node or Python is installed, so there is no local dev server by default.

1. **Open `index.html` directly in a browser.** The architecture avoids `fetch()` and ES modules specifically so the full site — product pages and cart included — works over `file://`.
2. **Better preview:** the VS Code **Live Server** extension, which needs no Node install.
3. **Walkthrough:** home → collection → product → add two hampers → confirm totals, Indian digit grouping and the tier nudge → reload to confirm cart persistence → follow *Enquire for 10+* and confirm the bulk form pre-selects that hamper.
4. **Bulk path:** on the Wedding collection page, enter a guest count of 150 and confirm it sets quantity and surfaces the correct tier price.
5. **Motion:** scroll the home page and confirm parallax tracks smoothly, the oversized line drifts, and The Multiplication runs to 250 and resolves. Check no jank at 60fps and no horizontal scrollbar from the bleeding type.
6. **WhatsApp:** click the float button on a product page and confirm the chat opens to +91 99202 84209 with that hamper named.
7. **Zoom:** open, pan, close with Escape, and confirm focus returns to the trigger.
8. **Responsive:** 360px, 768px, 1440px. Confirm the oversized type still bleeds without causing overflow and panels stack cleanly.
9. **Accessibility:** tab the whole page and confirm focus is always visible; enable OS "reduce motion" and confirm every animation renders its static end state.
10. **Images:** confirm all six hampers render and no ✦ watermark survives.
11. **Deploy:** drag the folder onto Netlify Drop or Cloudflare Pages — no build command needed.

---

## Still needed from you

1. **Hero image** — interim placeholder in place until it arrives.
2. Real hamper names and prices (placeholders used until then).
3. Email, city, GSTIN, social handles.
