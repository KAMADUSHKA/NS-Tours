/**
 * NS Travel And Tours - Interactive Web Application Logic (Clean & Robust)
 * Features:
 * - Live Multi-Currency Conversion (USD, EUR, GBP, AUD, LKR)
 * - Interactive Transport Fare Calculator
 * - Tour Packages Filter & Dynamic Cards
 * - Rich Itinerary Modal with Timeline
 * - One-Click Pre-populated WhatsApp Booking
 * - FAQ Accordions & Mobile Navigation
 */

const WHATSAPP_PHONE = '94703050177';

// Currency conversion rates relative to 1 USD
const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  CHF: { symbol: 'Fr', rate: 0.80, label: 'CHF (Fr)' },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD (A$)' },
  LKR: { symbol: 'Rs.', rate: 305, label: 'LKR (Rs)' }
};

let currentCurrency = 'EUR'; // Main market is Europe

// Base distances and sedan rates in USD
const ROUTE_DATA = {
  'CMB Airport_Mirissa': { km: 175, time: '2h 15m', usd: 85 },
  'CMB Airport_Galle': { km: 155, time: '1h 55m', usd: 75 },
  'CMB Airport_Bentota': { km: 105, time: '1h 30m', usd: 55 },
  'CMB Airport_Colombo': { km: 35, time: '35m', usd: 28 },
  'CMB Airport_Kandy': { km: 115, time: '3h 00m', usd: 65 },
  'CMB Airport_Sigiriya': { km: 148, time: '3h 30m', usd: 80 },
  'CMB Airport_Ella': { km: 210, time: '4h 30m', usd: 115 },
  'CMB Airport_Yala': { km: 245, time: '4h 00m', usd: 125 },
  'Colombo_Galle': { km: 125, time: '1h 40m', usd: 65 },
  'Galle_Ella': { km: 170, time: '3h 30m', usd: 90 },
  'Kandy_Ella': { km: 135, time: '3h 45m', usd: 75 },
  'Kandy_Sigiriya': { km: 90, time: '2h 15m', usd: 55 }
};

const VEHICLE_RATES = {
  sedan: { label: 'Sedan (1-3 Pax)', factor: 1.0 },
  van: { label: 'KDH Luxury Van (4-8 Pax)', factor: 1.35 },
  suv: { label: 'Premium SUV (1-4 Pax)', factor: 1.50 },
  coach: { label: 'Mini Coach (9-18 Pax)', factor: 2.10 }
};

// Tour Packages Database
const TOURS = [
  // ---------------- Half-Day Tours ----------------
  {
    id: 'madu-river-half',
    category: 'halfday',
    tag: 'Half-Day Tour',
    featured: false,
    title: 'Madu River Safari & Cultural Tour',
    duration: 'Half Day',
    badge: 'Half-Day Tour',
    image: 'assets/images/ocean.jpg',
    basePriceUSD: null,
    description: 'A 2-hour boat safari through the Madu River mangroves and cinnamon island, plus the giant Buddha, a turtle hatchery, a moonstone mine, the Tsunami Museum and an Ayurveda herbal garden.',
    inclusions: ['Madu River Boat Safari (2 Hours)', 'Turtle Hatchery', 'Moonstone Mine', 'Tsunami Museum'],
    itinerary: [
      { title: 'Tsunami Honganji Viharaya', desc: 'Visit the impressive giant Buddha statue.' },
      { title: 'Madu River Boat Safari (2 Hours)', desc: 'Enjoy a scenic boat ride through the beautiful mangrove forests and visit a cinnamon island to discover traditional cinnamon cultivation and production.' },
      { title: 'Turtle Hatchery', desc: 'Learn about sea turtle conservation and protection.' },
      { title: 'Moonstone Mine', desc: 'Explore a traditional moonstone mine and discover Sri Lanka’s gemstone industry.' },
      { title: 'Tsunami Museum', desc: 'Learn about the history and impact of the 2004 tsunami.' },
      { title: 'Ayurveda Herbal Garden', desc: 'Discover traditional Sri Lankan Ayurvedic medicine and herbal plants.' }
    ]
  },
  {
    id: 'galle-city-half',
    category: 'halfday',
    tag: 'Half-Day Tour',
    featured: false,
    title: 'Galle City Tour',
    duration: 'Half Day',
    badge: 'Half-Day Tour',
    image: 'assets/images/galle.jpg',
    basePriceUSD: null,
    description: 'Explore the UNESCO-listed Galle Fort and lighthouse, Jungle Beach and Rumassala Temple, with visits to a gem museum, silk factory, herbal garden and local fruit market.',
    inclusions: ['Galle Fort (UNESCO)', 'Galle Lighthouse', 'Jungle Beach', 'Gem & Jewellery Museum'],
    itinerary: [
      { title: 'Galle Fort', desc: 'Explore the historic Dutch Fort, a UNESCO World Heritage Site.' },
      { title: 'Galle Lighthouse', desc: 'Visit the iconic lighthouse overlooking the Indian Ocean.' },
      { title: 'Hindu Kovil', desc: 'Discover a traditional Hindu temple.' },
      { title: 'Jungle Beach', desc: 'Enjoy the beautiful tropical beach surrounded by greenery.' },
      { title: 'Rumassala Buddhist Temple', desc: 'Visit the peaceful Buddhist temple at Rumassala.' },
      { title: 'Ayurveda Herbal Garden', desc: 'Learn about traditional Sri Lankan Ayurvedic treatments and medicinal plants.' },
      { title: 'Gem & Jewellery Factory and Museum', desc: 'Discover Sri Lanka’s precious gemstones and traditional jewellery-making process.' },
      { title: 'Local Fruit Market', desc: 'Explore a local market and experience Sri Lanka’s variety of fresh tropical fruits.' },
      { title: 'Natural Silk Factory', desc: 'Visit a local silk factory and discover the traditional silk-making process, from raw silk to beautifully crafted silk products.' }
    ]
  },
  {
    id: 'elephant-half',
    category: 'halfday',
    tag: 'Half-Day Tour',
    featured: false,
    title: 'Elephant Experience',
    duration: 'Half Day',
    badge: 'Half-Day Tour',
    image: 'assets/images/safari.jpg',
    basePriceUSD: null,
    description: 'Enjoy a unique opportunity to interact with elephants, riding, feeding and bathing them under the supervision of experienced elephant handlers.',
    inclusions: ['Elephant Riding', 'Feeding the Elephant', 'Elephant Bathing'],
    itinerary: [
      { title: 'Elephant Riding', desc: 'Ride an elephant under the supervision of experienced elephant handlers.' },
      { title: 'Feeding the Elephant', desc: 'Get close and hand-feed the elephants.' },
      { title: 'Elephant Bathing', desc: 'Help bathe the elephants in a unique hands-on experience.' }
    ]
  },
  {
    id: 'nilwala-river-half',
    category: 'halfday',
    tag: 'Half-Day Tour',
    featured: false,
    title: 'Nilwala River Safari & Crocodile Adventure',
    duration: 'Half Day',
    badge: 'Half-Day Tour',
    image: 'assets/images/safari.jpg',
    basePriceUSD: null,
    description: 'An exciting boat safari on the Nilwala River to see wild crocodiles, monkeys and colourful birdlife among lush mangroves, with fresh tropical fruit and king coconut.',
    inclusions: ['Crocodile Watching', 'River Boat Safari', 'Bird & Monkey Watching', 'Tropical Fruit & King Coconut'],
    itinerary: [
      { title: 'Crocodile Watching', desc: 'Enjoy an exciting boat safari and observe wild crocodiles in their natural habitat.' },
      { title: 'Scenic River Boat Safari', desc: 'Explore the beautiful Nilwala River, surrounded by lush greenery and mangrove vegetation.' },
      { title: 'Bird Watching', desc: 'Spot colourful kingfishers, eagles, herons, egrets, and other native bird species.' },
      { title: 'Monkey Watching', desc: 'Observe wild monkeys living along the riverbanks.' },
      { title: 'Wildlife Photography', desc: 'Capture memorable photographs of crocodiles, birds, monkeys, and the beautiful river scenery.' },
      { title: 'Tropical Fruit & King Coconut Experience', desc: 'Enjoy fresh seasonal tropical fruits and refreshing king coconut during the boat trip, where provided.' }
    ]
  },
  // ---------------- One-Day Tours ----------------
  {
    id: 'ella-udawalawe-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Ella + Udawalawe One-Day Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/videos/hero-train-poster.jpg',
    basePriceUSD: null,
    description: 'See young elephants at the Udawalawe Elephant Transit Home, then Ella’s highlights: Ravana Waterfall, Little Adam’s Peak, Nine Arch Bridge, a scenic train ride and tea country.',
    inclusions: ['Udawalawe Elephant Transit Home', 'Nine Arch Bridge', 'Little Adam’s Peak', 'Scenic Train Ride'],
    itinerary: [
      { title: 'Udawalawe Elephant Transit Home', desc: 'Observe young elephants at the elephant rehabilitation centre.' },
      { title: 'Ravana Waterfall', desc: 'Visit one of Sri Lanka’s beautiful natural waterfalls.' },
      { title: 'Little Adam’s Peak', desc: 'Enjoy a scenic hike and breathtaking mountain views.' },
      { title: 'Nine Arch Bridge', desc: 'Discover the famous railway bridge surrounded by lush green landscapes.' },
      { title: 'Scenic Train Ride', desc: 'Experience one of Sri Lanka’s most beautiful train journeys.' },
      { title: 'Tea Plantation & Tea Shop', desc: 'Explore Sri Lanka’s tea plantations and discover the traditional tea-making process.' },
      { title: 'Ayurveda & Spice Garden', desc: 'Learn about traditional Sri Lankan herbal medicine and spices.' }
    ]
  },
  {
    id: 'yala-safari-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Yala National Park Safari',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/safari.jpg',
    basePriceUSD: null,
    description: 'A 4-hour jeep safari in one of Sri Lanka’s most famous national parks, home to leopards, elephants, crocodiles, bears and many bird species.',
    inclusions: ['4-Hour Jeep Safari', 'Experienced Safari Driver-Guide'],
    itinerary: [
      { title: '4-Hour Jeep Safari at Yala National Park', desc: 'Experience an exciting wildlife adventure in one of Sri Lanka’s most famous national parks. Explore the natural habitat of leopards, elephants, crocodiles, bears, and various bird species with an experienced safari driver-guide.' }
    ]
  },
  {
    id: 'ella-yala-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Ella + Yala One-Day Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/hero.jpg',
    basePriceUSD: null,
    description: 'Ella’s waterfalls, mountain views, Nine Arch Bridge, train ride and tea country, combined with a 4-hour jeep safari in Yala National Park.',
    inclusions: ['Ella Sightseeing', 'Nine Arch Bridge', 'Yala Jeep Safari (4 Hours)'],
    itinerary: [
      { title: 'Ravana Waterfall', desc: 'Enjoy the beautiful natural scenery.' },
      { title: 'Little Adam’s Peak', desc: 'Explore the scenic mountain viewpoint.' },
      { title: 'Nine Arch Bridge', desc: 'Visit the iconic railway bridge.' },
      { title: 'Scenic Train Ride', desc: 'Enjoy the beautiful landscapes of Sri Lanka’s hill country.' },
      { title: 'Tea Plantation & Tea Shop', desc: 'Discover Sri Lanka’s famous tea industry.' },
      { title: 'Ayurveda & Spice Garden', desc: 'Explore traditional herbal plants and spices.' },
      { title: 'Yala National Park Safari (4 Hours)', desc: 'Enjoy an exciting jeep safari to discover Sri Lanka’s incredible wildlife.' }
    ]
  },
  {
    id: 'kandy-ambuluwawa-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Kandy + Ambuluwawa One-Day Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/hero.jpg',
    basePriceUSD: null,
    description: 'The Temple of the Sacred Tooth Relic, panoramic views from Ambuluwawa Tower, Pinnawala Elephant Orphanage, a tea factory and a herbal & spice garden.',
    inclusions: ['Temple of the Tooth', 'Ambuluwawa Tower', 'Pinnawala Elephant Orphanage', 'Tea Factory'],
    itinerary: [
      { title: 'Temple of the Sacred Tooth Relic', desc: 'Visit one of Sri Lanka’s most important Buddhist religious sites.' },
      { title: 'Ambuluwawa Tower', desc: 'Enjoy spectacular panoramic views from the famous multi-religious tower.' },
      { title: 'Pinnawala Elephant Orphanage', desc: 'Discover the elephants and learn about their care and conservation.' },
      { title: 'Tea Plantation & Tea Factory', desc: 'Explore the tea-growing process and discover the production of world-famous Ceylon tea.' },
      { title: 'Herbal & Spice Garden', desc: 'Discover traditional Sri Lankan spices, herbs and Ayurvedic plants.' }
    ]
  },
  {
    id: 'kandy-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Kandy One-Day Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/hero.jpg',
    basePriceUSD: null,
    description: 'The Temple of the Sacred Tooth Relic, the Royal Botanical Gardens in Peradeniya, the Kandy Wax Museum, a tea factory and a herbal & spice garden.',
    inclusions: ['Temple of the Tooth', 'Peradeniya Botanical Gardens', 'Kandy Wax Museum', 'Tea Factory'],
    itinerary: [
      { title: 'Temple of the Sacred Tooth Relic', desc: 'Explore the historic Buddhist temple in Kandy.' },
      { title: 'Royal Botanical Gardens, Peradeniya', desc: 'Discover beautiful gardens and a wide variety of tropical plants.' },
      { title: 'Kandy Wax Museum', desc: 'Explore the wax figures and displays.' },
      { title: 'Tea Plantation & Tea Factory', desc: 'Explore the tea-growing process and discover the production of world-famous Ceylon tea.' },
      { title: 'Herbal & Spice Garden', desc: 'Discover traditional Sri Lankan spices, herbs and Ayurvedic plants.' }
    ]
  },
  {
    id: 'sigiriya-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Sigiriya One-Day Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/sigiriya.jpg',
    basePriceUSD: null,
    description: 'Climb Sigiriya Rock Fortress or Pidurangala Rock, experience a Sigiriya village tour, and visit the Dambulla Golden Temple, a herbal & spice garden and a silk factory.',
    inclusions: ['Sigiriya or Pidurangala Rock', 'Sigiriya Village Tour', 'Dambulla Golden Temple', 'Silk Factory'],
    itinerary: [
      { title: 'Sigiriya Rock Fortress or Pidurangala Rock', desc: 'Explore the famous UNESCO World Heritage Site of Sigiriya or enjoy breathtaking panoramic views of Sigiriya Rock from Pidurangala.' },
      { title: 'Sigiriya Village Tour', desc: 'Experience traditional Sri Lankan village life, local culture and traditional activities.' },
      { title: 'Dambulla Golden Temple', desc: 'Visit the famous Golden Temple and explore its historic Buddhist cave temple complex.' },
      { title: 'Herbal & Spice Garden', desc: 'Discover traditional Sri Lankan spices, medicinal herbs and Ayurvedic plants.' },
      { title: 'Silk Factory', desc: 'Discover the silk production process and learn how beautiful silk fabrics are made. Explore a collection of traditional Sri Lankan dresses, cultural outfits and other silk products.' },
      { title: 'Optional: Elephant Riding Experience', desc: 'Enjoy an elephant riding experience and get a closer opportunity to interact with these magnificent animals.' }
    ]
  },
  {
    id: 'sinharaja-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Sinharaja Rainforest & Seven Waterfalls Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/hero.jpg',
    basePriceUSD: null,
    description: 'Explore Sri Lanka’s UNESCO-listed Sinharaja Rainforest, rich in endemic wildlife, and discover seven beautiful waterfalls in lush tropical vegetation.',
    inclusions: ['Sinharaja Rainforest (UNESCO)', 'Seven Waterfalls'],
    itinerary: [
      { title: 'Sinharaja Rainforest', desc: 'Explore Sri Lanka’s famous UNESCO World Heritage tropical rainforest, known for its rich biodiversity and endemic wildlife.' },
      { title: 'Seven Waterfalls', desc: 'Discover seven beautiful waterfalls surrounded by lush tropical vegetation and enjoy the natural beauty of Sri Lanka.' }
    ]
  },
  {
    id: 'colombo-city-day',
    category: '1day',
    tag: 'One-Day Tour',
    featured: false,
    title: 'Colombo City Tour',
    duration: '1 Day',
    badge: '1-Day Tour',
    image: 'assets/images/fleet.jpg',
    basePriceUSD: null,
    description: 'Lotus Tower, the Red Mosque, Independence Square, a Hindu kovil and Gangaramaya Temple, finishing with shopping at Colombo’s popular malls.',
    inclusions: ['Lotus Tower', 'Red Mosque', 'Gangaramaya Temple', 'Shopping Malls'],
    itinerary: [
      { title: 'Lotus Tower', desc: 'Visit Sri Lanka’s iconic observation tower and enjoy panoramic city views.' },
      { title: 'Red Mosque (Jami Ul-Alfar Mosque)', desc: 'Discover the famous red-and-white architectural landmark in Pettah.' },
      { title: 'Independence Square', desc: 'Explore this important historical monument commemorating Sri Lanka’s independence.' },
      { title: 'Hindu Kovil', desc: 'Visit a traditional Hindu temple and discover its colourful architecture.' },
      { title: 'Gangaramaya Buddhist Temple', desc: 'Explore one of Colombo’s most famous Buddhist temples.' },
      { title: 'Shopping Malls', desc: 'Enjoy shopping at some of Colombo’s popular shopping destinations.' }
    ]
  }
];

// Water Sports & Ocean Adventures
const WATER_SPORTS = [
  { icon: '🎣', image: 'assets/images/ocean.jpg', title: 'River Fishing Experience', desc: 'Enjoy a relaxing fishing experience along Sri Lanka’s beautiful rivers and lagoons using traditional or modern fishing methods.' },
  { icon: '🐟', image: 'assets/videos/hero-beach-poster.jpg', title: 'Deep-Sea Fishing & Cooking Experience', desc: 'Experience an exciting fishing adventure in the Indian Ocean with experienced local fishermen. Try catching different varieties of ocean fish. After your fishing trip, enjoy a special cooking session where your freshly caught fish can be prepared and cooked, allowing you to experience authentic Sri Lankan flavours.' },
  { icon: '🏄', image: 'assets/videos/hero-beach-poster.jpg', title: 'Surfing & Surfing Lessons', desc: 'Enjoy Sri Lanka’s beautiful waves, whether you are a beginner or an experienced surfer. Professional surfing lessons are available for beginners.' },
  { icon: '🤿', image: 'assets/images/ocean.jpg', title: 'Snorkelling', desc: 'Explore the underwater world and discover colourful tropical fish, coral reefs and fascinating marine life.' },
  { icon: '🐠', image: 'assets/images/ocean.jpg', title: 'Scuba Diving & Underwater Exploration', desc: 'Discover the beauty of the Indian Ocean through guided scuba diving experiences. Explore colourful coral reefs, fascinating marine life and underwater landscapes. Suitable options are available for beginners and certified divers.' },
  { icon: '⚓', image: 'assets/images/ocean.jpg', title: 'Wreck Diving', desc: 'Explore fascinating underwater shipwrecks and discover marine life around these historic sites with qualified diving professionals.' },
  { icon: '🌊', image: 'assets/videos/hero-beach-poster.jpg', title: 'Jet Ski Riding', desc: 'Enjoy an exciting high-speed adventure across the water on a jet ski while experiencing the beautiful coastal scenery.' },
  { icon: '🛶', image: 'assets/images/ocean.jpg', title: 'Kayaking', desc: 'Explore beautiful rivers, lagoons and coastal waterways by kayak while enjoying Sri Lanka’s natural surroundings.' },
  { icon: '🚤', image: 'assets/videos/hero-beach-poster.jpg', title: 'Glass-Bottom Boat Ride', desc: 'Discover the underwater beauty of Sri Lanka without getting into the water. Enjoy fascinating views of colourful fish, coral reefs and marine life through the glass bottom of a specially designed boat.' }
];

// Document Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initCurrency();
  initBookingTabs();
  initTransportCalculator();
  renderTourCards('all');
  initTourFilters();
  renderWaterSports();
  refreshToursDots = initCardSlider('toursGrid', 'toursDots');
  initCardSlider('waterSportsGrid', 'waterDots');
  initToursMegaMenu();
  initFaqAccordion();
  initMobileMenu();
  initHeaderScroll();
  initHeroVideo();
  initScrollAnimations();
  initGallery();
  initGallerySlider();
  initVehicleCards();
  initPlannerForm();
  updateRouteTablePrices();
  updateVehicleCardPrices();
});

/* ==========================================================================
   CURRENCY CONVERSION SYSTEM
   ========================================================================== */
function initCurrency() {
  // Header selector (desktop) and mobile-menu selector stay in sync
  const selectors = ['currencySelector', 'currencySelectorMobile']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  selectors.forEach(selector => {
    selector.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      selectors.forEach(other => { other.value = currentCurrency; });
      updateAllPrices();
    });
  });
}

function formatPrice(amountUSD) {
  const curr = CURRENCIES[currentCurrency] || CURRENCIES.USD;
  const converted = Math.round(amountUSD * curr.rate);
  return `${curr.symbol} ${converted.toLocaleString()}`;
}

function updateAllPrices() {
  renderTourCards(getActiveFilter());
  calculateFare();
  updateRouteTablePrices();
  updateVehicleCardPrices();
  renderToursMegaMenu();
}

function updateVehicleCardPrices() {
  document.querySelectorAll('.vehicle-price[data-price-usd]').forEach(el => {
    el.textContent = formatPrice(Number(el.dataset.priceUsd));
  });
}

/* ==========================================================================
   BOOKING TABS
   ========================================================================== */
function initBookingTabs() {
  const tabs = document.querySelectorAll('.booking-tab-item, .booking-tab-btn');
  const panels = document.querySelectorAll('.booking-pane, .booking-tab-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

/* ==========================================================================
   TRANSPORT CALCULATOR
   ========================================================================== */
function initTransportCalculator() {
  const pickupEl = document.getElementById('calcPickup');
  const dropoffEl = document.getElementById('calcDropoff');
  const vehicleEl = document.getElementById('calcVehicle');
  const dateEl = document.getElementById('calcDate');
  const timeEl = document.getElementById('calcTime');
  const paxEl = document.getElementById('calcPax');
  const bookBtn = document.getElementById('btnBookTransport');

  if (pickupEl) pickupEl.addEventListener('change', calculateFare);
  if (dropoffEl) dropoffEl.addEventListener('change', calculateFare);
  if (vehicleEl) vehicleEl.addEventListener('change', calculateFare);

  if (dateEl) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateEl.value = tomorrow.toISOString().split('T')[0];
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const pickup = pickupEl ? pickupEl.options[pickupEl.selectedIndex].text : '';
      const dropoff = dropoffEl ? dropoffEl.options[dropoffEl.selectedIndex].text : '';
      const vehicle = vehicleEl ? vehicleEl.options[vehicleEl.selectedIndex].text : '';
      const date = dateEl ? dateEl.value : '';
      const time = timeEl ? timeEl.value : '';
      const pax = paxEl ? paxEl.value : '2';
      const quotePrice = document.getElementById('calcQuotePrice').textContent;

      // Fields hidden on the page are left out of the message
      const shown = (el) => el && el.closest('.input-box').style.display !== 'none';
      const vehicleLine = shown(vehicleEl) ? `*Vehicle:* ${vehicle}\n` : '';
      const paxLine = shown(paxEl) ? `*Passengers:* ${pax}\n` : '';

      const message = `Hello NS Travel And Tours!\n\nI would like to book a private transfer:\n\n*Pickup:* ${pickup}\n*Drop-off:* ${dropoff}\n${vehicleLine}*Date:* ${date} at ${time || 'Flexible'}\n${paxLine}*Estimated Rate:* ${quotePrice}\n\nPlease confirm availability and driver details. Thank you!`;

      openWhatsApp(message);
    });
  }

  calculateFare();
}

function calculateFare() {
  const pickupEl = document.getElementById('calcPickup');
  const dropoffEl = document.getElementById('calcDropoff');
  const vehicleEl = document.getElementById('calcVehicle');
  const priceDisplay = document.getElementById('calcQuotePrice');
  const routeMeta = document.getElementById('calcRouteMeta');

  if (!pickupEl || !dropoffEl || !priceDisplay) return;

  const pVal = pickupEl.value;
  const dVal = dropoffEl.value;
  const vVal = vehicleEl ? vehicleEl.value : 'sedan';

  const routeKey1 = `${pVal}_${dVal}`;
  const routeKey2 = `${dVal}_${pVal}`;
  const route = ROUTE_DATA[routeKey1] || ROUTE_DATA[routeKey2];

  let baseUsd = 70;
  let kmText = 'Est. 120 km';
  let timeText = 'Approx 2h 00m';

  if (pVal === dVal) {
    priceDisplay.textContent = formatPrice(25);
    if (routeMeta) routeMeta.textContent = 'Local transfer / within city limits';
    return;
  }

  if (route) {
    baseUsd = route.usd;
    kmText = `${route.km} km`;
    timeText = route.time;
  } else {
    baseUsd = 90;
  }

  const factor = (VEHICLE_RATES[vVal] && VEHICLE_RATES[vVal].factor) || 1.0;
  const totalUsd = Math.round(baseUsd * factor);

  priceDisplay.textContent = formatPrice(totalUsd);
  if (routeMeta) {
    routeMeta.textContent = `${kmText} • ${timeText} • Highway Tolls & Fuel Included`;
  }
}

/* ==========================================================================
   POPULAR ROUTES TABLE
   ========================================================================== */
function updateRouteTablePrices() {
  const rows = document.querySelectorAll('.route-row');
  rows.forEach(row => {
    const usd = parseFloat(row.dataset.usd);
    const priceCell = row.querySelector('.route-price-tag');
    if (usd && priceCell) {
      priceCell.textContent = formatPrice(usd);
    }
  });
}

/* ==========================================================================
   TOUR CARDS & FILTERING
   ========================================================================== */
/* ==========================================================================
   TOURS MEGA MENU (header dropdown)
   ========================================================================== */
function renderToursMegaMenu() {
  const dayList = document.getElementById('megaDayTours');
  const multiList = document.getElementById('megaMultiTours');
  if (!dayList || !multiList) return;

  const item = (tour) => `
    <li>
      <button type="button" class="tours-mega-item" data-tour-id="${tour.id}">
        <span class="mega-item-text">
          <span class="mega-item-title">${tour.title}</span>
          <span class="mega-item-meta">${tour.duration}</span>
        </span>
        ${tour.basePriceUSD == null ? '' : `<span class="mega-item-price">${formatPrice(tour.basePriceUSD)}</span>`}
      </button>
    </li>`;

  dayList.innerHTML = TOURS.filter(t => t.category === 'halfday').map(item).join('');
  multiList.innerHTML = TOURS.filter(t => t.category === '1day').map(item).join('');

  const waterList = document.getElementById('megaWaterSports');
  if (waterList) {
    waterList.innerHTML = WATER_SPORTS.map((sport, i) => `
      <li>
        <button type="button" class="tours-mega-item mega-water-item" data-water-index="${i}">
          <span class="mega-item-title">${sport.title}</span>
        </button>
      </li>`).join('');
  }
}

function initToursMegaMenu() {
  const mega = document.getElementById('toursMega');
  if (!mega) return;

  renderToursMegaMenu();

  mega.addEventListener('click', (e) => {
    // Water activity: jump to the water sports section and slide to its card
    const waterBtn = e.target.closest('.mega-water-item');
    if (waterBtn) {
      const section = document.getElementById('water-sports');
      const grid = document.getElementById('waterSportsGrid');
      const card = grid && grid.children[Number(waterBtn.dataset.waterIndex)];
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      if (card) grid.scrollTo({ left: card.offsetLeft - grid.firstElementChild.offsetLeft, behavior: 'smooth' });
      waterBtn.blur();
      return;
    }

    // Tour row: open its details popup
    const tourBtn = e.target.closest('.tours-mega-item');
    if (tourBtn) {
      openTourModal(tourBtn.dataset.tourId);
      tourBtn.blur();
      return;
    }

    // Quick filter link: apply the matching filter on the tours section
    const filterLink = e.target.closest('[data-menu-filter]');
    if (filterLink) {
      const pill = document.querySelector(`.filter-pill-btn[data-filter="${filterLink.dataset.menuFilter}"]`);
      if (pill) pill.click();
      filterLink.blur();
    }
  });
}

function getActiveFilter() {
  const activeBtn = document.querySelector('.filter-pill-btn.active, .filter-btn.active');
  return activeBtn ? activeBtn.dataset.filter : 'all';
}

function initTourFilters() {
  const buttons = document.querySelectorAll('.filter-pill-btn, .filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTourCards(btn.dataset.filter);
      const grid = document.getElementById('toursGrid');
      if (grid) grid.scrollTo({ left: 0, behavior: 'auto' });
    });
  });
}

function renderTourCards(filter = 'all') {
  const grid = document.getElementById('toursGrid');
  if (!grid) return;

  const filtered = filter === 'all' 
    ? TOURS 
    : TOURS.filter(t => t.category === filter);

  grid.innerHTML = filtered.map(tour => {
    return `
      <article class="package-card" data-category="${tour.category}">
        <img src="${tour.image}" alt="${tour.title}" class="package-img" loading="lazy">
        <div class="package-shade"></div>
        <div class="package-duration-pill">
          <span>⏱️ ${tour.duration}</span>
        </div>
        ${tour.featured ? '<div class="package-badge-top">Top Pick</div>' : ''}

        <div class="package-body">
          <span class="package-tag">${tour.tag}</span>
          <h3 class="package-title">${tour.title}</h3>
          <div class="package-price-row">
            ${tour.basePriceUSD == null
              ? '<span class="price-num">Price on request</span>'
              : `<span class="price-sub">From</span>
            <span class="price-num">${formatPrice(tour.basePriceUSD)}</span>
            <span class="price-sub">/ person</span>`}
          </div>

          <div class="package-reveal">
            <div class="package-reveal-inner">
              <p class="package-summary">${tour.description}</p>
              <div class="package-features">
                ${tour.inclusions.map(inc => `<span class="feature-tag">✓ ${inc}</span>`).join('')}
              </div>
              <div class="package-actions">
                <button class="btn-card-details" onclick="openTourModal('${tour.id}')">View Details</button>
                <button class="btn-card-wa" onclick="bookTourWhatsApp('${tour.id}')">
                  <span><svg class="wa-icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg> Book</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('') + CUSTOM_TOUR_CARD;

  if (refreshToursDots) refreshToursDots();
}

/* ==========================================================================
   TOURS SLIDER
   The card grid scrolls sideways with snap points; arrows step one card,
   dots jump to a position, and autoplay advances every TOURS_INTERVAL.
   ========================================================================== */
const TOURS_INTERVAL = 4500;
let refreshToursDots = null;

function initCardSlider(trackId, dotsId) {
  const track = document.getElementById(trackId);
  const dots = document.getElementById(dotsId);
  if (!track || !dots) return null;

  const slider = track.closest('.tours-slider');
  dots.style.setProperty('--slider-interval', `${TOURS_INTERVAL}ms`);

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 26;
    return card ? card.offsetWidth + gap : track.clientWidth;
  };

  // One dot per reachable start position (cards minus those already in view)
  const positions = () => {
    const perView = Math.max(1, Math.round(track.clientWidth / step()));
    return Math.max(1, track.children.length - perView + 1);
  };

  const updateActive = () => {
    const index = Math.round(track.scrollLeft / step());
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  const refreshDots = () => {
    dots.innerHTML = '';
    for (let i = 0; i < positions(); i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        track.scrollTo({ left: i * step(), behavior: 'smooth' });
        restart();
      });
      dots.appendChild(dot);
    }
    updateActive();
  };

  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

  const goNext = () => {
    if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  };

  const goPrev = () => {
    if (track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: -step(), behavior: 'smooth' });
  };

  slider.querySelector('.slider-next').addEventListener('click', () => { goNext(); restart(); });
  slider.querySelector('.slider-prev').addEventListener('click', () => { goPrev(); restart(); });

  let scrollTick = null;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollTick);
    scrollTick = requestAnimationFrame(updateActive);
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshDots, 150);
  });

  refreshDots();

  // Autoplay (skipped for reduced motion), paused on hover/focus/touch and when off-screen
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer = null;
  let inViewport = false;
  let paused = false;

  const start = () => {
    if (reduceMotion || timer || !inViewport || paused) return;
    timer = setInterval(goNext, TOURS_INTERVAL);
    dots.classList.add('is-playing');
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
    dots.classList.remove('is-playing');
  };
  // Restart the countdown so the progress dot animation stays in sync
  function restart() {
    stop();
    start();
  }

  const pause = () => { paused = true; stop(); };
  const resume = () => { paused = false; start(); };

  slider.addEventListener('mouseenter', pause);
  slider.addEventListener('mouseleave', resume);
  slider.addEventListener('focusin', pause);
  slider.addEventListener('focusout', (e) => {
    if (!slider.contains(e.relatedTarget)) resume();
  });
  track.addEventListener('touchstart', pause, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) start();
      else stop();
    }, { threshold: 0.4 }).observe(slider);
  }

  return refreshDots;
}

// Always-last card that invites visitors to build their own itinerary
const CUSTOM_TOUR_CARD = `
  <article class="package-card custom-tour-card">
    <div class="custom-tour-inner">
      <span class="custom-tour-icon">🧭</span>
      <span class="package-tag">Tailor-Made</span>
      <h3 class="custom-tour-title">Design Your Own Sri Lanka Journey</h3>
      <p class="custom-tour-text">
        Can't find the perfect trip? Tell us your dates, interests and travel style, and we'll plan a private day-by-day itinerary just for you.
      </p>
      <ul class="custom-tour-points">
        <li>✓ Any length, from 1 day to 3 weeks</li>
        <li>✓ Private vehicle &amp; English-speaking chauffeur</li>
        <li>✓ Free itinerary within 2 hours</li>
      </ul>
      <div class="custom-tour-actions">
        <a href="#planner" class="btn-book-cta">Plan My Trip →</a>
        <button class="btn-card-wa" onclick="openWhatsApp('Hello NS Travel And Tours!\\n\\nI would like a custom Sri Lanka itinerary. Could you help me plan my trip?')">
          <span><svg class="wa-icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg> Ask on WhatsApp</span>
        </button>
      </div>
    </div>
  </article>
`;

/* ==========================================================================
   WATER SPORTS
   ========================================================================== */
function renderWaterSports() {
  const grid = document.getElementById('waterSportsGrid');
  if (!grid) return;

  // Same photo card as the tour packages, so both sliders look alike
  grid.innerHTML = WATER_SPORTS.map((sport, i) => `
    <article class="package-card">
      <img src="${sport.image}" alt="${sport.title}" class="package-img" loading="lazy">
      <div class="package-shade"></div>
      <div class="package-duration-pill">
        <span>${sport.icon} Water Activity</span>
      </div>

      <div class="package-body">
        <span class="package-tag">Water Sports &amp; Ocean</span>
        <h3 class="package-title">${sport.title}</h3>
        <div class="package-price-row">
          <span class="price-num">Price on request</span>
        </div>

        <div class="package-reveal">
          <div class="package-reveal-inner">
            <p class="package-summary">${sport.desc}</p>
            <div class="package-actions">
              <button class="btn-card-wa" onclick="bookWaterSportWhatsApp(${i})">
                <span><svg class="wa-icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg> Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function bookWaterSportWhatsApp(index) {
  const sport = WATER_SPORTS[index];
  if (!sport) return;
  openWhatsApp(`Hello NS Travel And Tours!\n\nI am interested in this water activity:\n\n*Activity:* ${sport.title}\n\nPlease share availability, price and details. Thank you!`);
}

/* ==========================================================================
   ITINERARY MODAL
   ========================================================================== */
function openTourModal(tourId) {
  const tour = TOURS.find(t => t.id === tourId);
  if (!tour) return;

  const modal = document.getElementById('tourModal');
  const modalImg = document.getElementById('modalBannerImg');
  const modalTitle = document.getElementById('modalTourTitle');
  const modalCategory = document.getElementById('modalTourCategory');
  const modalDuration = document.getElementById('modalTourDuration');
  const modalPrice = document.getElementById('modalTourPrice');
  const modalTimeline = document.getElementById('modalTimeline');
  const modalInclusions = document.getElementById('modalInclusions');
  const modalBookBtn = document.getElementById('modalBookBtn');

  if (modalImg) modalImg.src = tour.image;
  if (modalTitle) modalTitle.textContent = tour.title;
  if (modalCategory) modalCategory.textContent = tour.tag;
  if (modalDuration) modalDuration.textContent = `⏱️ ${tour.duration}`;
  if (modalPrice) modalPrice.textContent = tour.basePriceUSD == null
    ? 'Price on request'
    : `${formatPrice(tour.basePriceUSD)} (All-inclusive)`;

  if (modalTimeline) {
    modalTimeline.innerHTML = tour.itinerary.map((step, i) => `
      <div class="timeline-row">
        <span class="timeline-time-badge">${step.time || `Stop ${i + 1}`}</span>
        <h4 class="timeline-title-text">${step.title}</h4>
        <p class="timeline-desc-text">${step.desc}</p>
      </div>
    `).join('');
  }

  if (modalInclusions) {
    modalInclusions.innerHTML = tour.inclusions.map(inc => `
      <span class="feature-tag">✓ ${inc}</span>
    `).join('');
  }

  if (modalBookBtn) {
    modalBookBtn.onclick = () => bookTourWhatsApp(tour.id);
  }

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeTourModal() {
  const modal = document.getElementById('tourModal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

/* ==========================================================================
   WHATSAPP INTEGRATION
   ========================================================================== */
function bookTourWhatsApp(tourId) {
  const tour = TOURS.find(t => t.id === tourId);
  if (!tour) return;

  const priceLine = tour.basePriceUSD == null ? '' : `*Price:* From ${formatPrice(tour.basePriceUSD)} / person\n`;
  const message = `Hello NS Travel And Tours!\n\nI would like to book this tour package:\n\n*Tour:* ${tour.title}\n*Duration:* ${tour.duration}\n${priceLine}\nPlease let me know availability, price and pickup options. Thank you!`;

  openWhatsApp(message);
}

function initVehicleCards() {
  document.querySelectorAll('.vehicle-box').forEach(card => {
    const book = () => {
      const title = card.querySelector('.vehicle-title')?.textContent.trim() || 'Private Vehicle';
      const model = card.querySelector('.vehicle-sub')?.textContent.trim() || '';
      const route = card.querySelector('.vehicle-fare-footer span')?.textContent.trim() || '';
      const rate = card.querySelector('.vehicle-fare-footer strong')?.textContent.trim() || '';
      const message = `Hello NS Travel And Tours!\n\nI would like to book this vehicle:\n\n*Vehicle:* ${title} (${model})\n*Example Route:* ${route}\n*Rate:* ${rate}\n\nPlease share availability and a quote for my trip. Thank you!`;
      openWhatsApp(message);
    };

    card.addEventListener('click', book);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        book();
      }
    });
  });
}

function openWhatsApp(customText) {
  const encoded = encodeURIComponent(customText);
  const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encoded}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   CUSTOM PLANNER FORM
   ========================================================================== */
function initPlannerForm() {
  const plannerBtn = document.getElementById('btnSubmitCustomPlan');
  if (!plannerBtn) return;

  plannerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('planName') ? document.getElementById('planName').value : 'Traveler';
    const days = document.getElementById('planDays') ? document.getElementById('planDays').value : '5 Days';
    const vibes = document.getElementById('planVibe') ? document.getElementById('planVibe').value : 'Wildlife & Heritage';
    const guests = document.getElementById('planGuests') ? document.getElementById('planGuests').value : '2 Adults';
    const notes = document.getElementById('planNotes') ? document.getElementById('planNotes').value : 'No special requests';

    const msg = `Hello NS Travel And Tours!\n\nI want to design a *Custom Sri Lanka Tour*:\n\n*Name:* ${name}\n*Duration:* ${days}\n*Preferred Style:* ${vibes}\n*Travelers:* ${guests}\n*Special Interests:* ${notes}\n\nPlease share a recommended custom itinerary and private chauffeur quote. Thank you!`;

    openWhatsApp(msg);
  });
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const cards = document.querySelectorAll('.faq-card, .faq-item');
  cards.forEach(card => {
    const btn = card.querySelector('.faq-q-btn, .faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = card.classList.contains('active');
        cards.forEach(c => c.classList.remove('active'));
        if (!isOpen) {
          card.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const menu = document.getElementById('navMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
      toggle.textContent = menu.classList.contains('open') ? '✕' : '☰';
      updateHeaderState();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.textContent = '☰';
        updateHeaderState();
      });
    });
  }
}

/* ==========================================================================
   SCROLL ANIMATIONS
   Elements fade/slide in as they enter the viewport. Classes are added here
   (not in the HTML) so content stays visible if JavaScript fails to load.
   ========================================================================== */
const REVEAL_GROUPS = [
  // [selector, direction, stagger siblings]
  ['.section-head', 'up', false],
  ['.about-media', 'left', false],
  ['.about-content', 'right', false],
  ['.guarantee-item', 'up', true],
  ['.filter-tabs-row', 'up', false],
  ['.booking-card', 'zoom', false],
  ['.fleet-box', 'up', false],
  ['.vehicle-box', 'up', true],
  ['.routes-card-table', 'up', false],
  ['.planner-wrapper', 'up', false],
  ['.review-item', 'up', true],
  ['.faq-card', 'up', true],
  ['.gallery-item', 'up', true],
  ['.gallery-slider', 'up', false],
  ['.gallery-cta', 'up', false],
];

function initScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  REVEAL_GROUPS.forEach(([selector, direction, stagger]) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
      if (direction !== 'up') el.dataset.reveal = direction;
      if (stagger && el.parentElement) {
        const index = Array.from(el.parentElement.children).indexOf(el);
        el.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 0.1}s`);
      }
      observer.observe(el);
    });
  });

  initStatCounters();
}

// Count the About stats up from 0 (e.g. "12,000+") when they scroll into view
function initStatCounters() {
  const stats = document.querySelectorAll('.about-stat strong');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el = entry.target;
      const match = el.textContent.trim().match(/^([\d,]+)(.*)$/);
      if (!match) return;

      const target = parseInt(match[1].replace(/,/g, ''), 10);
      const suffix = match[2];
      const duration = 1600;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });

  stats.forEach(stat => observer.observe(stat));
}

/* ==========================================================================
   GALLERY + LIGHTBOX
   ========================================================================== */
function initGallery() {
  // Any element with data-gallery (home slider or gallery page grid)
  const items = Array.from(document.querySelectorAll('[data-gallery]'));
  const lightbox = document.getElementById('lightbox');
  const media = document.getElementById('lightboxMedia');
  const caption = document.getElementById('lightboxCaption');
  if (!items.length || !lightbox || !media) return;

  let current = 0;
  let lastFocused = null;

  // Video tiles preview on hover (desktop)
  items.filter(item => item.dataset.type === 'video').forEach(item => {
    const video = item.querySelector('video');
    item.addEventListener('mouseenter', () => {
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
    });
    item.addEventListener('mouseleave', () => video.pause());
  });

  const show = (index) => {
    current = (index + items.length) % items.length;
    const item = items[current];
    const text = item.querySelector('figcaption')?.textContent || '';

    if (item.dataset.type === 'video') {
      media.innerHTML = `<video src="${item.dataset.src}" autoplay muted loop playsinline controls></video>`;
    } else {
      media.innerHTML = `<img src="${item.dataset.src}" alt="${text}">`;
    }
    caption.textContent = `${text}  ·  ${current + 1} / ${items.length}`;
  };

  const open = (index) => {
    lastFocused = document.activeElement;
    show(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  };

  const close = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    media.innerHTML = '';
    if (lastFocused) lastFocused.focus();
  };

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(current + 1));

  // Click on the dark backdrop closes
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Swipe left / right on touch screens
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
}

// Home page gallery slider: arrows, swipe, autoplay, focus effect and progress dots
const SLIDER_INTERVAL = 2500;

function initGallerySlider() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;

  const slider = track.closest('.gallery-slider');
  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  const prev = slider.querySelector('.slider-prev');
  const next = slider.querySelector('.slider-next');
  slider.style.setProperty('--slider-interval', `${SLIDER_INTERVAL}ms`);

  // Progress dots, one per slide
  const dots = document.createElement('div');
  dots.className = 'slider-dots';
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
    dot.addEventListener('click', () => {
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' });
    });
    dots.appendChild(dot);
  });
  slider.after(dots);

  // Focus effect: fully visible slides are "in view"; the first one drives the dots
  const visible = new Set();
  const updateDots = () => {
    const first = slides.findIndex(sl => visible.has(sl));
    Array.from(dots.children).forEach((dot, i) => dot.classList.toggle('active', i === first));
  };

  const focusObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const inView = entry.intersectionRatio >= 0.6;
      entry.target.classList.toggle('in-view', inView);
      if (inView) visible.add(entry.target);
      else visible.delete(entry.target);
    });
    updateDots();
  }, { root: track, threshold: [0, 0.6, 1] });
  slides.forEach(sl => focusObserver.observe(sl));

  const step = () => {
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    return slides[0] ? slides[0].offsetWidth + gap : track.clientWidth;
  };

  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;

  const goNext = () => {
    if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
    else track.scrollBy({ left: step(), behavior: 'smooth' });
  };

  const goPrev = () => {
    if (track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: -step(), behavior: 'smooth' });
  };

  next.addEventListener('click', goNext);
  prev.addEventListener('click', goPrev);

  // Autoplay (skipped for reduced motion), paused on hover/touch and when off-screen
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let timer = null;
  let inViewport = false;
  const start = () => {
    if (timer || !inViewport) return;
    timer = setInterval(goNext, SLIDER_INTERVAL);
    dots.classList.add('is-playing');
  };
  const stop = () => {
    clearInterval(timer);
    timer = null;
    dots.classList.remove('is-playing');
  };

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  track.addEventListener('touchstart', stop, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inViewport = entry.isIntersecting;
      if (inViewport) start();
      else stop();
    }, { threshold: 0.4 }).observe(slider);
  }
}

/* ==========================================================================
   HERO BACKGROUND VIDEO PLAYLIST
   Two stacked <video> elements: one plays while the other preloads the next
   clip, then they crossfade shortly before the current clip ends.
   ========================================================================== */
function initHeroVideo() {
  const wrap = document.querySelector('.hero-video-wrap');
  if (!wrap) return;

  // Respect users who prefer less motion: keep the static hero image
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const clips = (wrap.dataset.videos || '').split(',').map(c => c.trim()).filter(Boolean);
  const players = Array.from(wrap.querySelectorAll('.hero-video'));
  if (!clips.length || players.length < 2) return;

  const FADE_SECONDS = 1.2;
  let clipIndex = 0;
  let activePlayer = 0;
  let switching = false;

  const play = (video) => {
    video.muted = true;
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };

  const preloadNext = () => {
    const nextPlayer = players[1 - activePlayer];
    nextPlayer.src = clips[(clipIndex + 1) % clips.length];
    nextPlayer.load();
  };

  const switchClip = () => {
    if (switching) return;
    switching = true;

    const current = players[activePlayer];
    const next = players[1 - activePlayer];

    next.currentTime = 0;
    play(next);
    next.classList.add('is-active');
    current.classList.remove('is-active');

    setTimeout(() => {
      current.pause();
      activePlayer = 1 - activePlayer;
      clipIndex = (clipIndex + 1) % clips.length;
      switching = false;
      preloadNext();
    }, FADE_SECONDS * 1000);
  };

  players.forEach((video, i) => {
    video.addEventListener('timeupdate', () => {
      if (i !== activePlayer || !video.duration) return;
      if (video.duration - video.currentTime <= FADE_SECONDS) switchClip();
    });
    // Safety net in case timeupdate fires too late on a slow device
    video.addEventListener('ended', () => {
      if (i === activePlayer) switchClip();
    });
  });

  players[0].src = clips[0];
  play(players[0]);
  preloadNext();

  // Pause while the hero is off-screen to save battery and CPU
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const current = players[activePlayer];
      if (entry.isIntersecting) play(current);
      else current.pause();
    }).observe(wrap);
  }
}

/* ==========================================================================
   HEADER: TRANSPARENT OVER HERO, SOLID ON SCROLL
   ========================================================================== */
function updateHeaderState() {
  const header = document.querySelector('.main-header');
  const menu = document.getElementById('navMenu');
  if (!header) return;

  const menuOpen = menu && menu.classList.contains('open');
  header.classList.toggle('is-transparent', window.scrollY < 20 && !menuOpen);

  // Floating WhatsApp button appears once the visitor scrolls past most of the hero
  const waFloat = document.querySelector('.wa-float-btn');
  if (waFloat) waFloat.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
}

function initHeaderScroll() {
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}
