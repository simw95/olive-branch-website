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

  whatsapp:     '919769016925',          // country code + number, digits only
  email:        'hello@theolivebranch.in',
  phone:        '+91 97690 16925',
  city:         'Mumbai, India',
  /* Held for invoicing, deliberately never rendered. It used to print in the
     footer of every page; that was removed because a GSTIN is something a
     customer needs on an invoice, not something a gift shop announces on all
     fifteen pages. Nothing reads this today — keep it anyway, the invoice will. */
  gstin:        '27ADDPW4571E1ZC',

  instagram:    'https://instagram.com/theolivebranch.in',
  pinterest:    '',

  announcement: 'Complimentary delivery across India on orders over ₹5,000.',
  freeShipping: 5000,
  shipping:     250,                         // charged below freeShipping

  /* Every `price` below is the figure the customer pays, GST included. The
     cart and create-order.js both take it as it stands and add only delivery;
     `gstRate` is used to work backwards to the tax component for the cart
     line and the invoice, never to add anything on.

     Changing `gstRate` therefore changes what the invoice splits out, not
     what anyone is charged. To change what is charged, change the prices. */
  gstRate: 0.18,

  heroImage:    'assets/images/hero.jpg',

  // Quantity at which a customer is nudged toward the bulk enquiry route
  bulkThreshold: 10
};

/* --------------------------------------------------------------------------
   2. PRICING
   One price per hamper. There were five quantity bands here, printed as a
   table on every product page; bulk is now quoted on enquiry instead, so the
   table and the band arithmetic are gone. Each hamper kept the figure it
   charged for a single unit, so nothing was re-priced by the change.
   -------------------------------------------------------------------------- */

/* Printed under every price, on the product page and under the cart total.
   Built from `gstRate` rather than written out, so the rate shown and the
   rate the invoice splits out cannot disagree. */
OLIVE.config.taxNote = 'Inclusive of ' +
  +(OLIVE.config.gstRate * 100).toFixed(2) + '% GST.';

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
    image: 'assets/images/wedding/wedding-table-card.jpg',
    imageFull: 'assets/images/wedding/wedding-table-full.jpg'
  },
  {
    slug: 'celebration',
    name: 'The Celebration Collection',
    page: 'collection-celebration.html',
    intro: 'From birthdays to graduations and every celebration in between, discover beautifully curated gifts that turn life’s moments into lasting memories.',
    blurb: 'For birthdays, anniversaries, new homes and good news.',
    image: 'assets/images/celebration/diya-box-card.jpg',
    imageFull: 'assets/images/celebration/diya-box-full.jpg'
  },
  {
    slug: 'corporate',
    name: 'The Corporate Collection',
    page: 'collection-corporate.html',
    intro: 'Thoughtfully curated corporate gifts that celebrate partnerships, recognise achievements, and leave a lasting impression.',
    blurb: 'For clients, for Diwali, and for the people who make a company work.',
    image: 'assets/images/corporate/executive-case-card.jpg',
    imageFull: 'assets/images/corporate/executive-case-full.jpg'
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
    imageFull: 'assets/images/bridesmaid/bridesmaid-proposal-box-full.jpg'
  }
  ------------------------------------------------------------------ */
];

/* --------------------------------------------------------------------------
   4. HAMPERS
   `price` is what one hamper costs, before GST.
   `ratio` is the native aspect ratio of the full image (w/h), used so product
   pages display photography uncropped.
   -------------------------------------------------------------------------- */
OLIVE.hampers = [

  /* ---------------- Wedding ---------------- */
  /* Photographed in October, replacing the first four placeholder frames
     (kept in assets/images/wedding/retired/). Contents below are read off
     those photographs. The almond butter jar and the lids on the navy box
     carry brand marks that the edit garbled; they are described rather than
     named. */
  {
    id: 'wedding-table',
    name: 'The Wedding Table',
    collection: 'wedding',
    size: 'Full',
    occasions: ['Wedding', 'Thank you', 'Family'],
    price: 4500,
    image: 'assets/images/wedding/wedding-table-card.jpg',
    imageFull: 'assets/images/wedding/wedding-table-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Tree-to-bar chocolate, almond butter and three handcrafted goat’s milk soaps, in our olive box.',
    description: 'The hamper for the twenty people who made the day happen — parents, the wedding party, the friends who flew in. Chocolate from three makers, two things to open the moment the box does, soaps that go straight to a guest bathroom, and a scented candle for the end of the day. Nothing in it is there to fill a gap, which is the whole difference between a gift and a favour.',
    contents: [
      'Bon-fiction Lost in an Orange Haze, 64% dark chocolate with candied orange peel and cinnamon',
      'La Folie dark chocolate sea salt cookie',
      'Bombay Sweet Shop bhakarwadi and dates kachori',
      'The Cowboy’s Farm quinoa chips',
      'Three handcrafted goat’s milk soaps — calendula, grapefruit and jasmine — in a wooden tray',
      'Gourmet mixed nuts in a drawstring pouch',
      'Davidoff cappuccino chewing coffee candy',
      'Boojee Almond butter, 250 g, with a wooden swirler',
      'Amber scented candle, 210 g',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid olive gift box.'
  },
  {
    id: 'evergreen',
    name: 'The Evergreen Indulgence',
    collection: 'wedding',
    size: 'Full',
    occasions: ['Wedding', 'Thank you', 'Favours'],
    price: 3300,
    image: 'assets/images/wedding/evergreen-card.jpg',
    imageFull: 'assets/images/wedding/evergreen-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Coffee, honey, tree-to-bar chocolate and a hand-poured candle, in the olive box.',
    description: 'Six things, and every one of them gets used. Coffee for the week after, honey for the toast, a bar worth saving for the evening, and a scented candle for the end of it. It is the thank-you to send the guests who are neither family nor a place setting — the fifty or so people you would have called anyway.',
    contents: [
      'Davidoff Rich Aroma instant coffee',
      'Mixed gourmet nuts in a glass jar',
      'Bon-fiction The Cranberry Chilli Chase, 64% dark chocolate with cranberry, chilli and sea salt',
      'Beelicious raw Kashmir honey with a wooden swirler',
      'Grapefruit goat’s milk soap, 55 g, handcrafted',
      'Peony Blush scented candle, 210 g',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid olive gift box.'
  },
  {
    id: 'something-blue',
    name: 'The Something Blue',
    collection: 'wedding',
    size: 'Mini',
    occasions: ['Wedding', 'Favours', 'Thank you'],
    price: 3850,
    image: 'assets/images/wedding/something-blue-card.jpg',
    imageFull: 'assets/images/wedding/something-blue-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Biscoff, Smoor chocolate and a set of nested wooden bowls, in a powder-blue floral box.',
    description: 'Named for the one thing every wedding is told to include. This is the favour that goes out to the guest list — small enough to sit on a place setting, and built around the two things in it that outlast the week: the nested bowls and the brass elephant. The rest is eaten by Tuesday, which is rather the point.',
    contents: [
      'Lotus Biscoff crunchy spread',
      'Smoor pistachio and kunafa, 70% dark chocolate',
      'Four filled chocolates in a lidded box',
      'Nested wooden bowls, a set of four',
      'Brass elephant',
      'Wooden swirler',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid powder-blue box, printed with a floral pattern.'
  },
  {
    id: 'peacock-box',
    name: 'The Peacock Box',
    collection: 'wedding',
    size: 'Full',
    occasions: ['Wedding', 'Favours', 'Mithai', 'Thank you'],
    price: 2750,
    image: 'assets/images/wedding/peacock-box-card.jpg',
    imageFull: 'assets/images/wedding/peacock-box-full.jpg',
    /* Two views: the trays open, and the same box with its printed lids on,
       which is how it is handed over. The product page offers both. */
    gallery: [
      'assets/images/wedding/peacock-box-full.jpg',
      'assets/images/wedding/peacock-box-closed-full.jpg'
    ],
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Mithai and filled chocolates under printed lids, in a navy box painted with peacocks.',
    description: 'The return gift, and the one guests photograph before they open it. Eight pieces of mithai in one tray and eight chocolates in the other, three lidded tins alongside, and a printed lid over each tray so it travels closed. The box is lacquered rather than wrapped, so it is still in use long after the sweets have gone.',
    contents: [
      'Eight pieces of mithai — coconut, pistachio, saffron and dry fruit',
      'Eight filled chocolates',
      'Three lidded tins, gold-rimmed and printed to match the box',
      'Printed lids over both trays',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid navy box, printed with peacocks and a gold border.'
  },
  {
    id: 'blush-box',
    name: 'The Blush Set',
    collection: 'wedding',
    size: 'Full',
    occasions: ['Wedding', 'Favours', 'Thank you', 'Engagement'],
    price: 4000,
    image: 'assets/images/wedding/blush-box-card.jpg',
    imageFull: 'assets/images/wedding/blush-box-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Rose and pistachio chocolate, blackberry preserves and a stack of lacquered coasters, in blush pink.',
    description: 'Sweet, without being only sweet. A tree-to-bar bar of rose and pistachio, a jar of preserves that gets finished at breakfast, and a stack of lacquered coasters that stays on a coffee table for years. It is the favour to send when the guest list is smaller and you would rather give one good object than three small ones.',
    contents: [
      'Bon-fiction A Rose in Pistachio Skies, 55% dark chocolate with pistachio and rose',
      'Smoor Chocolate Nibbles, Bright Berry Burst',
      'La Folie dark chocolate sea salt cookie',
      'Bonne Maman blackberry preserves',
      'A stack of lacquered coasters, burgundy with a gilded botanical print',
      'Brass elephant',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid blush gift box, printed with a floral pattern.'
  },

  /* ---------------- Celebration ---------------- */
  {
    id: 'breakfast-basket',
    name: 'The Pantry Basket',
    collection: 'celebration',
    size: 'Full',
    occasions: ['Housewarming', 'Thank you', 'New home', 'Birthday'],
    price: 2700,
    image: 'assets/images/celebration/breakfast-basket-card.jpg',
    imageFull: 'assets/images/celebration/breakfast-basket-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Raw Kashmir acacia honey, blackberry preserves and Biscoff, in a round cane basket.',
    description: 'Three jars and a swirler, and every one of them is finished rather than admired. It is the gift for a new flat, a thank you that should not look like an occasion, and the Sunday morning after. Small, useful, and the basket is worth keeping.',
    contents: [
      'Beelicious raw Kashmir acacia honey',
      'Bonne Maman blackberry preserves',
      'Lotus Biscoff crunchy spread',
      'Wooden swirler',
      'Wicker and cane basket'
    ],
    notes: 'Presented in a round cane basket with a handle.'
  },
  {
    id: 'little-basket',
    name: 'The Little Indulgence',
    collection: 'celebration',
    size: 'Full',
    occasions: ['Birthday', 'Thank you', 'Diwali', 'Just because'],
    price: 2750,
    image: 'assets/images/celebration/little-basket-card.jpg',
    imageFull: 'assets/images/celebration/little-basket-full.jpg',
    /* Two views: the basket open, and the same basket wrapped in organza as it
       is delivered. The product page offers both. */
    gallery: [
      'assets/images/celebration/little-basket-full.jpg',
      'assets/images/celebration/little-basket-wrapped-full.jpg'
    ],
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Nutella biscuits, tree-to-bar chocolate, coffee and honey, in a wicker basket.',
    description: 'The smallest thing we send that still reads as a gift. Four good names, nothing filling a gap, and a basket that goes on holding fruit long after. It is what to send when the gesture matters more than the occasion.',
    contents: [
      'Nutella biscuits',
      'Bon-fiction The Mango Menace, 55% dark chocolate with Alphonso mango and chilli',
      'Davidoff Crema Intense coffee',
      'Beelicious honey with a wooden swirler',
      'Wicker and cane basket'
    ],
    notes: 'Presented in a wicker basket, wrapped in organza and ribboned.'
  },
  {
    id: 'slow-morning',
    name: 'The Leisure Edit',
    collection: 'celebration',
    size: 'Full',
    occasions: ['Birthday', 'Thank you', 'New home', 'Get well'],
    price: 3200,
    image: 'assets/images/celebration/slow-morning-card.jpg',
    imageFull: 'assets/images/celebration/slow-morning-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Coffee, honey, chocolate and a hand-poured candle, with a calendula goat’s milk soap on a wooden dish.',
    description: 'An hour rather than an occasion. Coffee worth grinding the morning around, honey for the toast, a bar to break into in the evening, and a scented candle for the end of it. The soap arrives on its own wooden dish, which is the detail people remember.',
    contents: [
      'Davidoff Rich Aroma instant coffee',
      'Calendula goat’s milk soap, 115 g, on a wooden dish',
      'Bon-fiction The Cranberry Chilli Chase, 64% dark chocolate with cranberry, chilli and sea salt',
      'Nutella hazelnut spread',
      'Peony Blush scented candle, 210 g',
      'Beelicious honey with a wooden swirler',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid olive gift box.'
  },

  /* ---------------- Celebration · Diwali ---------------- */
  /* `section` puts these in their own block on the collection page, and the
     nav links straight to it. */
  {
    id: 'diya-box',
    name: 'The Diya Box',
    collection: 'celebration',
    section: 'Diwali',
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Thank you'],
    price: 3600,
    image: 'assets/images/celebration/diya-box-card.jpg',
    imageFull: 'assets/images/celebration/diya-box-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A brass diya urli, three jars of premium nuts and an amber candle, in a burgundy box.',
    description: 'Built around the brass urli at its centre — a ring of lamps that gets filled with oil and lit, and then put away for next year and the year after. Around it, three jars of nuts to hand round and a scented candle. The box most people send when they want the gift to be lit rather than eaten.',
    contents: [
      'Brass diya urli',
      'Premium cashews, 200 g',
      'Premium almonds, 200 g',
      'Premium pistachios, 200 g',
      'Amber scented candle, 210 g',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid burgundy gift box.'
  },
  {
    id: 'puja-box',
    name: 'The Puja Box',
    collection: 'celebration',
    section: 'Diwali',
    size: 'Full',
    occasions: ['Diwali', 'Housewarming', 'Blessing'],
    price: 2800,
    image: 'assets/images/celebration/puja-box-card.jpg',
    imageFull: 'assets/images/celebration/puja-box-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A brass kalash and a brass cow and calf, with nuts, chocolate and a handcrafted goat’s milk soap.',
    description: 'For the part of Diwali that happens before anyone eats. A brass kalash and a cow and calf for the puja, both of them objects that stay out all year, and enough alongside to make it a gift rather than an offering. Also the box to send for a housewarming.',
    contents: [
      'Engraved brass kalash',
      'Brass cow and calf sculpture',
      'Mixed gourmet nuts in a glass jar',
      'Bon-fiction The Cranberry Chilli Chase, 64% dark chocolate with cranberry, chilli and sea salt',
      'Calendula goat’s milk soap, 55 g, handcrafted',
      'Lotus-painted trinket tin',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid olive gift box.'
  },
  {
    id: 'card-table',
    name: 'The Brass Box',
    collection: 'celebration',
    section: 'Diwali',
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Thank you', 'Host gift'],
    price: 3400,
    image: 'assets/images/celebration/card-table-card.jpg',
    imageFull: 'assets/images/celebration/card-table-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'Three jars of gourmet nuts, Davidoff coffee and a candle in hammered brass, in a burgundy box.',
    description: 'Named for the vessel at its centre — a candle hand-poured into hammered brass, which stays out long after the lights come down. Around it, three jars to pass round a table and coffee to keep a late evening going. The same burgundy box as The Diya Box, built for the night rather than the puja.',
    contents: [
      'Gourmet cashews, 300 g',
      'Gourmet almonds, 300 g',
      'Gourmet pistachios, 300 g',
      'Davidoff Fine Aroma instant coffee',
      'Davidoff mocha chewing coffee candy, 50 g',
      'Hand-poured candle in a hammered brass vessel',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid burgundy gift box.'
  },

  /* ---------------- Corporate ---------------- */
  /* Photographed properly in October: a cane basket, an olive box and a navy
     case. Contents below are read off those photographs. Two labels in the
     basket could not be made out — a second Bombay Sweet Shop pouch and the
     Atom Eats flavour — and are left out rather than guessed at. */
  {
    id: 'desk-press',
    name: 'The Desk Press',
    collection: 'corporate',
    size: 'Mini',
    occasions: ['Client gifting', 'Onboarding', 'Team', 'Diwali'],
    price: 1800,
    image: 'assets/images/corporate/desk-press-card.jpg',
    imageFull: 'assets/images/corporate/desk-press-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A glass cafetière with quinoa chips, salted pretzels and gourmet nuts, in a terracotta box.',
    description: 'The one to send a whole team without the figure becoming the problem. A cafetière is the rare desk object that gets used every morning rather than put in a drawer, and the three things packed around it are what people reach for at four o’clock. The smallest box we make for corporate, and the least likely to be passed on.',
    contents: [
      'Glass and steel cafetière',
      'The Cowboy’s Farm quinoa chips',
      'Atom Eats salted mini pretzel knots',
      'Mixed gourmet nuts in a drawstring pouch',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid terracotta gift box.'
  },
  {
    id: 'signature-box',
    name: 'The Signature Box',
    collection: 'corporate',
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Onboarding', 'Team'],
    price: 3850,
    image: 'assets/images/corporate/signature-box-card.jpg',
    imageFull: 'assets/images/corporate/signature-box-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A refined edit of chocolate, nuts and desk-side essentials, presented in our signature olive box.',
    description: 'The one that goes out by the hundred. A journal somebody will actually keep, two chocolates worth stopping for, and a tin of drinking chocolate — enough to read as a gift rather than a giveaway, at a price that survives a headcount. It is the hamper to send a whole floor at Diwali, or to put on a desk on a first morning.',
    contents: [
      'Full-grain leather journal',
      '4700BC Nutty Tuxedo chocolate popcorn',
      'Bon-fiction Lost in an Orange Haze, 64% dark chocolate with candied orange peel and cinnamon',
      'La Folie dark chocolate sea salt cookie',
      'Gourmet mixed nuts in a glass jar',
      'Manam Coffee Milk drinking chocolate',
      'Magnetic lid sturdy box'
    ],
    notes: 'Presented in a rigid olive gift box.'
  },
  {
    id: 'grand-edit',
    name: 'The Festive Collection',
    collection: 'corporate',
    /* Also sold as a celebration hamper. Same box, same price, same
       photograph — one entry, shown on two pages. */
    alsoIn: ['celebration'],
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Thank you', 'Team'],
    price: 5000,
    image: 'assets/images/corporate/grand-edit-card.jpg',
    imageFull: 'assets/images/corporate/grand-edit-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A generous cane basket filled with gourmet treats, coffee, chocolate and nuts.',
    description: 'A basket rather than a box, and meant to be opened in front of people. Chocolate from three makers, coffee, something sweet and something salted — the sort of spread that gets put in the middle of a table and emptied by the afternoon. The basket itself is worth keeping, which is half the point.',
    contents: [
      'Bon-fiction The Mango Menace, 55% dark chocolate with Alphonso mango and chilli',
      'La Folie dark chocolate sea salt cookie',
      'Manam milk chocolate',
      'Davidoff mocha coffee',
      'Lotus Biscoff smooth spread',
      'Bombay Sweet Shop Bombay bhel chikki',
      'Gourmet mixed nuts in a glass jar',
      'Wild honey with a wooden swirler',
      'Wicker and cane basket'
    ],
    notes: 'Presented in a cane basket with leather handles, debossed with the mark.'
  },
  {
    id: 'executive-case',
    name: 'The Executive Case',
    collection: 'corporate',
    size: 'Full',
    occasions: ['Diwali', 'Client gifting', 'Milestone', 'Thank you'],
    price: 6400,
    image: 'assets/images/corporate/executive-case-card.jpg',
    imageFull: 'assets/images/corporate/executive-case-full.jpg',
    ratio: 1536 / 1024,
    focal: '50% 50%',
    lede: 'A statement navy case with a leather journal, premium nuts, honey and tree-to-bar chocolate.',
    description: 'The one you send to the client who stayed through a bad quarter. It arrives as a case with brass catches rather than a box, which is the first thing anyone notices, and it is heavy — three jars of nuts, honey with a swirler, a journal, a candle and chocolate from a maker worth naming. Kept on a shelf long after it is empty.',
    contents: [
      'Full-grain leather journal',
      'Bon-fiction Memories of a Brown Harvest, 64% dark chocolate',
      '4700BC Nutty Tuxedo chocolate popcorn',
      'La Folie dark chocolate sea salt cookie',
      'Three jars of gourmet nuts',
      'Beelicious raw honey with a wooden swirler',
      'Nutella and Lotus Biscoff biscuits',
      'Peony Blush candle, hand-poured in amber glass',
      'Navy and brown vintage trunk'
    ],
    notes: 'Presented in a rigid navy case with brass catches and a leather handle.'
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
    price: 4800,
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
      'Gold-foil chocolates',
      'Magnetic lid sturdy box'
    ],
    notes: 'Engraving to your own text is included from 10 hampers.'
  },
  {
    id: 'bridesmaid-proposal-box',
    name: 'The Bridesmaid Proposal Box',
    collection: 'bridesmaid',
    size: 'Mini',
    occasions: ['Wedding', 'Bridesmaid', 'Proposal'],
    price: 5400,
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
      'Rosé and peony room spray',
      'Magnetic lid sturdy box'
    ],
    notes: 'Card wording is printed to your text at no extra cost.'
  }
  ------------------------------------------------------------------ */
];

/* The Journal — three gifting guides and an index page — was removed on
   2026-10-10, to be brought back when there is something to put in it.
   It lived here as `OLIVE.journal`, rendered by renderJournal() in
   render.js, linked from the header, the footer, the home page and two
   collection pages. Nothing else read it, so putting it back is this
   array, that function, and those links.
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   6. HELPERS  —  used across the site
   -------------------------------------------------------------------------- */
OLIVE.inr = function (n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

/* The one place delivery, GST and the total are worked out. The cart renders
   from it and create-order.js charges from it, so the figure taken can never
   disagree with the figure shown.

   Prices in `prices` are GST-inclusive, so GST is **extracted, not added**:
   a hamper listed at 3,400 is charged at 3,400 and carries 518 of tax inside
   that figure. `gst` is reported so the cart and the invoice can show the
   component, and it is deliberately NOT part of the sum — adding it would
   charge the tax twice. Delivery is added to the listed price as it stands.

   This reverses the arrangement that stood for one week in October, where
   prices were entered before tax and 18% was added at checkout. */
OLIVE.orderTotals = function (subtotal) {
  var shipping = subtotal >= OLIVE.config.freeShipping ? 0 : OLIVE.config.shipping;
  var net = Math.round(subtotal / (1 + OLIVE.config.gstRate));
  return {
    subtotal: subtotal,
    gst:      subtotal - net,          // the tax already inside the subtotal
    shipping: shipping,
    total:    subtotal + shipping
  };
};

/* One price, whatever the quantity. Kept as a function rather than reading
   `hamper.price` at each call site, because the cart, the product page and
   the server-side recompute all go through it — one place to change if
   pricing ever gains a rule again. */
OLIVE.priceAt = function (hamper) {
  return hamper.price;
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

/* A hamper lives in one collection and may be shown in others. The Festive Collection
   is the case this exists for: the same box, the same price and the same
   photograph, sold both as a corporate gift and as a celebration one. It stays
   a single entry, so editing it once changes both pages. */
OLIVE.hampersIn = function (slug) {
  return OLIVE.hampers.filter(function (h) {
    return h.collection === slug ||
           (h.alsoIn || []).indexOf(slug) !== -1;
  });
};

/* Collections can be shown in named blocks. Celebration splits into its
   general hampers and a Diwali block, which the nav links straight to. A
   hamper with no `section` belongs to the collection's main block. */
OLIVE.sectionsIn = function (slug) {
  var all = OLIVE.hampersIn(slug);
  var main = all.filter(function (h) { return !h.section; });
  var named = [];
  all.forEach(function (h) {
    if (!h.section) { return; }
    var found = null;
    for (var i = 0; i < named.length; i++) {
      if (named[i].name === h.section) { found = named[i]; }
    }
    if (!found) { found = { name: h.section, hampers: [] }; named.push(found); }
    found.hampers.push(h);
  });
  return { main: main, sections: named };
};

/* Builds a wa.me link with a context-aware prefilled message. */
OLIVE.whatsappLink = function (message) {
  var text = message || 'Hello, I would like to enquire about your hampers.';
  return 'https://wa.me/' + OLIVE.config.whatsapp + '?text=' + encodeURIComponent(text);
};

/* Node only — lets the payment functions require() this catalogue.
   Ignored entirely by the browser. */
if (typeof module !== 'undefined' && module.exports) { module.exports = OLIVE; }
