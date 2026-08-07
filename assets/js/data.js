/* ==========================================================================
   The Olive Branch — site data
   --------------------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT to change business details, hamper
   names, prices, or contents. Nothing here requires a build step.
   Loaded as a plain script (not a module) so the site works from file://.
   ========================================================================== */

/* Declared with `var` rather than assigned onto `window`, so this same file
   also loads under Node inside the payment functions. That matters: the
   server recomputes every price from this catalogue instead of trusting the
   browser, and sharing one file means the two can never disagree. */
var OLIVE = {};
if (typeof window !== 'undefined') { window.OLIVE = OLIVE; }

/* --------------------------------------------------------------------------
   1. BUSINESS DETAILS  —  edit these first
   -------------------------------------------------------------------------- */
OLIVE.config = {
  brand:        'The Olive Branch',
  tagline:      'Curated. Considered. Cherished.',

  whatsapp:     '919920284209',          // country code + number, digits only
  email:        'hello@theolivebranch.in',   // TODO: replace with the real address
  phone:        '+91 99202 84209',
  city:         'Mumbai, India',             // TODO: confirm
  gstin:        '',                          // TODO: add once registered

  instagram:    'https://instagram.com/',    // TODO: add real handle
  pinterest:    '',

  announcement: 'Complimentary delivery across India on orders over ₹5,000.',
  freeShipping: 5000,

  heroImage:    'assets/images/hero.jpg',

  // Quantity at which a customer is nudged toward the bulk enquiry route
  bulkThreshold: 10
};

/* --------------------------------------------------------------------------
   2. PRICE TIERS
   Per-hamper price falls as quantity rises. `min` is the first quantity in
   the band. Each hamper below carries its own `prices` array in this order.
   -------------------------------------------------------------------------- */
OLIVE.tiers = [
  { min: 1,   label: '1 – 9'    },
  { min: 10,  label: '10 – 24'  },
  { min: 25,  label: '25 – 49'  },
  { min: 50,  label: '50 – 99'  },
  { min: 100, label: '100 +'    }
];

/* --------------------------------------------------------------------------
   3. COLLECTIONS
   -------------------------------------------------------------------------- */
OLIVE.collections = [
  {
    slug: 'wedding',
    name: 'The Wedding Collection',
    page: 'collection-wedding.html',
    // Supplied by the client — used once, in its strongest position.
    intro: 'Thoughtfully curated keepsakes to thank your guests for being part of your celebration. Designed to leave a lasting impression long after the wedding day.',
    blurb: 'Favours for the people who travelled, dressed up and stayed to the end.',
    image: 'assets/images/wedding/wedding-hamper-mini-card.jpg',
    imageFull: 'assets/images/wedding/wedding-hamper-mini-full.jpg',
    // Wedding favours are bought by guest count, not by unit.
    byGuestCount: true
  },
  {
    slug: 'celebration',
    name: 'The Celebration Collection',
    page: 'collection-celebration.html',
    intro: 'From birthdays to graduations and every celebration in between, discover beautifully curated gifts that turn life’s moments into lasting memories.',
    blurb: 'For birthdays, anniversaries, new homes and good news.',
    image: 'assets/images/celebration/celebration-hamper-grand-card.jpg',
    imageFull: 'assets/images/celebration/celebration-hamper-grand-full.jpg',
    byGuestCount: false
  },
  {
    slug: 'corporate',
    name: 'The Corporate Collection',
    page: 'collection-corporate.html',
    intro: 'Thoughtfully curated corporate gifts that celebrate partnerships, recognise achievements, and leave a lasting impression.',
    blurb: 'For clients, for Diwali, and for the people who make a company work.',
    image: 'assets/images/corporate/corporate-hamper-card.jpg',
    imageFull: 'assets/images/corporate/corporate-hamper-full.jpg',
    byGuestCount: false
  }

  /* ------------------------------------------------------------------
     PARKED — The Bridesmaid Collection.
     Photography is already processed in assets/images/bridesmaid/.
     Uncomment this block and the two hampers at the foot of OLIVE.hampers
     to switch the collection back on. No other change is needed.

  ,{
    slug: 'bridesmaid',
    name: 'The Bridesmaid Collection',
    page: 'collection-bridesmaid.html',
    intro: 'A thoughtful way to ask, thank, and celebrate the women who make your wedding day even more meaningful.',
    blurb: 'To ask, and to thank, the women standing beside you.',
    image: 'assets/images/bridesmaid/bridesmaid-proposal-box-card.jpg',
    imageFull: 'assets/images/bridesmaid/bridesmaid-proposal-box-full.jpg',
    byGuestCount: false
  }
  ------------------------------------------------------------------ */
];

/* --------------------------------------------------------------------------
   4. HAMPERS
   `prices` maps 1:1 onto OLIVE.tiers above.
   `ratio` is the native aspect ratio of the full image (w/h), used so product
   pages display photography uncropped.
   -------------------------------------------------------------------------- */
OLIVE.hampers = [

  /* ---------------- Wedding ---------------- */
  {
    id: 'wedding-hamper',
    name: 'The Wedding Hamper',
    collection: 'wedding',
    size: 'Full',
    occasions: ['Wedding', 'Favours', 'Thank you'],
    prices: [6900, 6490, 6140, 5860, 5520],
    image: 'assets/images/wedding/wedding-hamper-card.jpg',
    imageFull: 'assets/images/wedding/wedding-hamper-full.jpg',
    ratio: 1800 / 1004,
    focal: '50% 55%',
    lede: 'Olive oil, wild honey and roasted cashews, in a lidded olive box finished with a printed ribbon.',
    description: 'The full hamper is the one you send to the people who shaped the day — immediate family, the friends who flew in, the couple who introduced you. It is a pantry of good things rather than a token: oil to cook with, preserve to keep, honey to finish. Everything is shelf-stable, so it travels and it waits.',
    contents: [
      'Extra virgin olive oil, in a gold-collared bottle',
      'Roasted cashews, lightly salted',
      'Wild berry preserve',
      'Loose-leaf tea in a drawstring linen pouch',
      'Raw honey with a turned wooden dipper',
      'Cold-pressed olive oil soap',
      'Olive leaf seasoning, in a tin',
      'Dried lavender, eucalyptus and rosebuds',
      'Printed satin ribbon and a hand-written note card'
    ],
    notes: 'Presented in a rigid olive gift box. Ribbon wording can be printed to your own text on orders of 25 or more.'
  },
  {
    id: 'wedding-hamper-mini',
    name: 'The Wedding Hamper, Mini',
    collection: 'wedding',
    size: 'Mini',
    occasions: ['Wedding', 'Favours', 'Thank you'],
    prices: [2450, 2300, 2180, 2080, 1960],
    image: 'assets/images/wedding/wedding-hamper-mini-card.jpg',
    imageFull: 'assets/images/wedding/wedding-hamper-mini-full.jpg',
    ratio: 1303 / 1043,
    focal: '50% 50%',
    lede: 'Fig leaf and vetiver, English rose tea, and a keepsake dish. The favour, at guest-list quantities.',
    description: 'This is the hamper most weddings order, and they order it by the hundred. It is small enough to sit on a place setting and considered enough that nobody leaves it behind — a candle, a tea, something sweet, and one thing that stays on a bedside table long after the flowers have gone.',
    contents: [
      'Fig leaf and vetiver scented candle',
      'English rose herbal tea, in a glass vial',
      'Salted caramel almonds in 70% dark chocolate',
      'Scalloped ceramic trinket dish with a gilded olive sprig',
      'A little something sweet — linen drawstring pouch',
      'Letterpress thank-you card, printed with your names'
    ],
    notes: 'The volume favour. Card wording is printed to your text at no extra cost from 50 hampers.'
  },

  /* ---------------- Celebration ---------------- */
  {
    id: 'celebration-hamper',
    name: 'The Celebration Hamper',
    collection: 'celebration',
    size: 'Full',
    occasions: ['Birthday', 'Anniversary', 'Housewarming', 'Thank you'],
    prices: [4200, 3950, 3740, 3570, 3360],
    image: 'assets/images/celebration/celebration-hamper-card.jpg',
    imageFull: 'assets/images/celebration/celebration-hamper-full.jpg',
    ratio: 1043 / 1303,
    focal: '50% 50%',
    lede: 'Bergamot and fig, poured by hand in India. Wild forest honey, raw and unfiltered.',
    description: 'A hamper for the occasions that arrive all year — a birthday, a new flat, an anniversary nobody expected you to remember. Sweet and savoury are balanced deliberately so it suits a household rather than one person, and nothing in it needs to be eaten the same week.',
    contents: [
      'Bergamot and fig scented soy candle, hand poured in India',
      'Wild forest honey, raw and unfiltered — 250g',
      'Artisanal cream truffles',
      'Premium dry fruits — 200g',
      'Olive oil soap with lavender',
      'Turned wooden honey dipper',
      'Dried florals and a linen drawstring pouch'
    ],
    notes: 'Presented in a rigid olive gift box with a hand-tied ribbon.'
  },
  {
    id: 'celebration-hamper-grand',
    name: 'The Celebration Hamper, Grand',
    collection: 'celebration',
    size: 'Grand',
    occasions: ['Birthday', 'Anniversary', 'Housewarming', 'Festive'],
    prices: [5800, 5450, 5160, 4930, 4640],
    image: 'assets/images/celebration/celebration-hamper-grand-card.jpg',
    imageFull: 'assets/images/celebration/celebration-hamper-grand-full.jpg',
    ratio: 1800 / 982,
    focal: '50% 50%',
    lede: 'Sandalwood and amber, fig and walnut, dark milk chocolate with sea salt.',
    description: 'The larger celebration box, laid out long rather than deep so everything is visible the moment the lid comes off. It reads as generous without being loud — the right register for a milestone birthday, a fiftieth anniversary, or a Diwali gift to a household you know well.',
    contents: [
      'Gourmet roasted nuts — almonds, cashews, pistachios',
      'Dark milk chocolate with sea salt',
      'Fig and walnut preserve',
      'Organic chamomile and lavender tea, in linen',
      'Forest honey with a wooden dipper',
      'Sandalwood and amber scented candle',
      'Handmade truffles',
      'Lavender and oat soap on a wooden dish',
      'Dried lavender, eucalyptus and orange'
    ],
    notes: 'Presented in a rigid olive gift box with a printed satin ribbon.'
  },

  /* ---------------- Corporate ---------------- */
  {
    id: 'corporate-hamper',
    name: 'The Corporate Hamper',
    collection: 'corporate',
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Onboarding', 'Milestone'],
    prices: [8500, 7990, 7570, 7230, 6800],
    image: 'assets/images/corporate/corporate-hamper-card.jpg',
    imageFull: 'assets/images/corporate/corporate-hamper-full.jpg',
    ratio: 1800 / 982,
    focal: '50% 50%',
    lede: 'A full-grain leather journal, Belgian truffles, Darjeeling and saffron, and a small brass Ganesha.',
    description: 'The hamper for the relationships a business actually depends on — a long-standing client, a partner who took a risk on you, a director in their tenth year. It carries one thing that lasts, one thing to share around a table, and one thing for the desk. Suited to Diwali, to closing a deal, and to saying thank you when it matters.',
    contents: [
      'Full-grain leather journal',
      'Brass-trimmed pen',
      'Belgian chocolate truffles',
      'Gourmet nuts in a glass clip-top jar',
      'Festive date and fig chutney',
      'Organic Darjeeling and saffron tea',
      'Ceramic keepsake jar with a brass knob',
      'Brass Ganesha and an incense holder',
      'Desk card set with a leather tag'
    ],
    notes: 'Your logo can be foiled onto the box lid and printed on the ribbon from 25 hampers. GST invoice issued on every order.'
  },
  {
    id: 'corporate-hamper-mini',
    name: 'The Corporate Hamper, Mini',
    collection: 'corporate',
    size: 'Mini',
    occasions: ['Diwali', 'Client gifting', 'Onboarding', 'Team'],
    prices: [3200, 3010, 2850, 2720, 2560],
    image: 'assets/images/corporate/corporate-hamper-mini-card.jpg',
    imageFull: 'assets/images/corporate/corporate-hamper-mini-full.jpg',
    ratio: 1800 / 982,
    focal: '50% 50%',
    lede: 'Olive oil, Kalamata tapenade and a soft cheese, with an olive-wood board to serve them on.',
    description: 'The hamper to send to an entire floor. It is a small table rather than a box of snacks — oil, tapenade, cheese and the board to serve them on — which makes it land as a gesture rather than a giveaway, at a price that survives a headcount of three hundred.',
    contents: [
      'Extra virgin olive oil',
      'Kalamata olive tapenade',
      'Soft cheese with an olive-wood board and knife',
      'Almonds in a linen drawstring pouch',
      'Wax-sealed artisan soap',
      'Dried lavender'
    ],
    notes: 'Our most-ordered hamper for company-wide gifting. Ships to multiple addresses at no extra handling cost.'
  }

  /* ------------------------------------------------------------------
     PARKED — Bridesmaid hampers. Uncomment together with the collection
     block above to switch the collection back on.

  ,{
    id: 'bridesmaid-hamper',
    name: 'The Bridesmaid Hamper',
    collection: 'bridesmaid',
    size: 'Full',
    occasions: ['Wedding', 'Bridesmaid', 'Bachelorette'],
    prices: [4800, 4510, 4270, 4080, 3840],
    image: 'assets/images/bridesmaid/bridesmaid-hamper-card.jpg',
    imageFull: 'assets/images/bridesmaid/bridesmaid-hamper-full.jpg',
    ratio: 1800 / 1004,
    focal: '50% 55%',
    lede: 'Olive blossom, twin candles, and a rechargeable fan for a long day in heels.',
    description: 'For the women who answered every message and held the dupatta.',
    contents: [
      'Olive blossom fragrance mist and body set',
      'Twin scented candles',
      'Rechargeable handheld fan',
      'Satin scrunchies',
      'Tea sachets in a drawstring pouch',
      'Compact mirror, engraved to order',
      'Beaded bracelet',
      'Gold-foil chocolates'
    ],
    notes: 'Engraving to your own text is included from 10 hampers.'
  },
  {
    id: 'bridesmaid-proposal-box',
    name: 'The Bridesmaid Proposal Box',
    collection: 'bridesmaid',
    size: 'Mini',
    occasions: ['Wedding', 'Bridesmaid', 'Proposal'],
    prices: [5400, 5070, 4800, 4590, 4320],
    image: 'assets/images/bridesmaid/bridesmaid-proposal-box-card.jpg',
    imageFull: 'assets/images/bridesmaid/bridesmaid-proposal-box-full.jpg',
    ratio: 1303 / 1043,
    focal: '50% 50%',
    lede: 'The way to ask. Blush rose, a trio of fragrance miniatures, and a card that does the talking.',
    description: 'Built around the moment of asking rather than the wedding itself.',
    contents: [
      'Will you be my bridesmaid? — letterpress card',
      'Team Bride satin pouch',
      'Rechargeable handheld fan',
      'A trio of designer fragrance miniatures',
      'Rosé eye masks',
      'Blush rose scented candle',
      'Tinted lip balm',
      'Rosé and peony room spray'
    ],
    notes: 'Card wording is printed to your text at no extra cost.'
  }
  ------------------------------------------------------------------ */
];

/* --------------------------------------------------------------------------
   5. JOURNAL
   -------------------------------------------------------------------------- */
OLIVE.journal = [
  {
    slug: 'journal-wedding-favours.html',
    title: 'How many favours, and what goes in them',
    eyebrow: 'Weddings',
    excerpt: 'Ordering by guest count rather than by guess — a working method for the couple who has three hundred people to thank and six weeks to do it in.',
    image: 'assets/images/wedding/wedding-hamper-mini-card.jpg'
  },
  {
    slug: 'journal-corporate-gifting.html',
    title: 'Corporate gifting, without the guesswork',
    eyebrow: 'Corporate',
    excerpt: 'What to send a client versus what to send a team, why the same box rarely works for both, and how to keep a Diwali list of four hundred from becoming a second job.',
    image: 'assets/images/corporate/corporate-hamper-card.jpg'
  },
  {
    slug: 'journal-choosing-by-occasion.html',
    title: 'Choosing by occasion',
    eyebrow: 'Gifting',
    excerpt: 'A birthday is not an anniversary and neither is a housewarming. A short guide to matching the box to the moment.',
    image: 'assets/images/celebration/celebration-hamper-card.jpg'
  }
];

/* --------------------------------------------------------------------------
   6. HELPERS  —  used across the site
   -------------------------------------------------------------------------- */
OLIVE.inr = function (n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

OLIVE.tierIndex = function (qty) {
  var i = 0;
  for (var t = 0; t < OLIVE.tiers.length; t++) {
    if (qty >= OLIVE.tiers[t].min) { i = t; }
  }
  return i;
};

OLIVE.priceAt = function (hamper, qty) {
  return hamper.prices[OLIVE.tierIndex(qty)];
};

OLIVE.getHamper = function (id) {
  for (var i = 0; i < OLIVE.hampers.length; i++) {
    if (OLIVE.hampers[i].id === id) { return OLIVE.hampers[i]; }
  }
  return null;
};

OLIVE.getCollection = function (slug) {
  for (var i = 0; i < OLIVE.collections.length; i++) {
    if (OLIVE.collections[i].slug === slug) { return OLIVE.collections[i]; }
  }
  return null;
};

OLIVE.hampersIn = function (slug) {
  return OLIVE.hampers.filter(function (h) { return h.collection === slug; });
};

/* Returns the next tier up from `qty`, or null if already at the top. */
OLIVE.nextTier = function (hamper, qty) {
  var i = OLIVE.tierIndex(qty);
  if (i >= OLIVE.tiers.length - 1) { return null; }
  var next = OLIVE.tiers[i + 1];
  return {
    need: next.min - qty,
    at: next.min,
    saving: hamper.prices[i] - hamper.prices[i + 1]
  };
};

/* Builds a wa.me link with a context-aware prefilled message. */
OLIVE.whatsappLink = function (message) {
  var text = message || 'Hello, I would like to enquire about your hampers.';
  return 'https://wa.me/' + OLIVE.config.whatsapp + '?text=' + encodeURIComponent(text);
};

/* Node only — lets the payment functions require() this catalogue.
   Ignored entirely by the browser. */
if (typeof module !== 'undefined' && module.exports) { module.exports = OLIVE; }
