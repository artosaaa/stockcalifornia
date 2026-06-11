/* Generates location + brand SEO pages, sitemap.xml, robots.txt,
   and injects area/brand link chips into index.html placeholders. */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const SITE = 'https://stockcalifornia.vercel.app'; // swap to https://stockcalifornia.com when ported

const CITIES = [
  ['Glendale', 'glendale', 'tj', 'Our flagship showroom sits right on San Fernando Rd — Glendale is home base.'],
  ['Tujunga', 'tujunga', 'tu', 'Our Foothill Blvd showroom is in the heart of Tujunga — come say hi, neighbor.'],
  ['Burbank', 'burbank', 'gl', 'Just down the 5 from the Media District — closer than the mall, friendlier prices too.'],
  ['Pasadena', 'pasadena', 'gl', 'A quick hop down the 134 and you are surrounded by thousands of toys.'],
  ['La Crescenta', 'la-crescenta', 'tu', 'Foothill families: our Tujunga showroom is practically around the corner.'],
  ['Montrose', 'montrose', 'gl', 'After a stroll on Honolulu Ave, swing by for the good stuff at little prices.'],
  ['La Cañada Flintridge', 'la-canada-flintridge', 'gl', 'Minutes from the 210 — a favorite stop after JPL open houses and soccer games.'],
  ['Sunland', 'sunland', 'tu', 'Sunland kids know the drill: Foothill Blvd, big smiles, full toy aisles.'],
  ['Shadow Hills', 'shadow-hills', 'tu', 'Horse country meets toy country — we are just down the road.'],
  ['Lake View Terrace', 'lake-view-terrace', 'tu', 'A short drive along Foothill and you are in toy heaven.'],
  ['Sun Valley', 'sun-valley', 'tu', 'Skip the big-box lines — real toys, real prices, really close.'],
  ['North Hollywood', 'north-hollywood', 'gl', 'NoHo families: we are an easy drive over the hill-free route on the 134.'],
  ['Studio City', 'studio-city', 'gl', 'Worth the short trip down the 134 — ask our regulars from Studio City.'],
  ['Sherman Oaks', 'sherman-oaks', 'gl', 'Birthday emergency? We gift-wrap smiles for Sherman Oaks parents all the time.'],
  ['Van Nuys', 'van-nuys', 'gl', 'A straight shot across the Valley to thousands of toys at little prices.'],
  ['Toluca Lake', 'toluca-lake', 'gl', 'From Riverside Dr to our door in minutes — easier than parking at the mall.'],
  ['Eagle Rock', 'eagle-rock', 'gl', 'Eagle Rock neighbors: Colorado Blvd runs straight to our Glendale aisles.'],
  ['Highland Park', 'highland-park', 'gl', 'York Blvd to San Fernando Rd — your new favorite toy run.'],
  ['Glassell Park', 'glassell-park', 'gl', 'We are basically your neighborhood toy store — San Fernando Rd connects us.'],
  ['Atwater Village', 'atwater-village', 'gl', 'Cross the river and land in toy paradise — minutes from Atwater Village.'],
  ['Los Feliz', 'los-feliz', 'gl', 'After Griffith Park adventures, reward the crew with a toy-aisle victory lap.'],
  ['Silver Lake', 'silver-lake', 'gl', 'Yes, the rumors are true: big-brand toys at little prices, just up the 5.'],
  ['Echo Park', 'echo-park', 'gl', 'A quick drive up Glendale Blvd — the street literally points the way.'],
  ['Altadena', 'altadena', 'tu', 'Foothill neighbors to the east — our Tujunga showroom is a scenic straight shot.'],
  ['Sierra Madre', 'sierra-madre', 'gl', 'Make a day of it down the 210 — the toy aisles are worth the trip.'],
  ['Arcadia', 'arcadia', 'gl', 'Peacocks not included, but the toy selection more than makes up for it.'],
  ['South Pasadena', 'south-pasadena', 'gl', 'Small-town charm meets big toy selection — minutes apart on the 110/134.'],
  ['San Marino', 'san-marino', 'gl', 'After the Huntington gardens, let the kids pick a treasure of their own.'],
  ['Alhambra', 'alhambra', 'gl', 'Valley Blvd families shop smart — that is why they drive the few minutes to us.'],
  ['Downtown Los Angeles', 'downtown-los-angeles', 'gl', 'DTLA parents: the 110 to the 5 lands you in toy heaven in no time.'],
];

const BRANDS = [
  ['LEGO', 'lego', '🧱', 'Speed Champions, City, Technic and more — build sets for every age and budget.', 'building sets'],
  ['Barbie', 'barbie', '👛', 'Dolls, fashion packs, puzzles and playsets starring everyone’s favorite icon.', 'dolls & playsets'],
  ['Marvel', 'marvel', '🦸', 'Spider-Man, Avengers and friends — action figures, splat balls, sqwooshies and more.', 'action figures'],
  ['Star Wars', 'star-wars', '🌌', 'Lightsabers to collectibles — the galaxy far, far away, priced down to earth.', 'collectibles'],
  ['Hot Wheels', 'hot-wheels', '🏎️', 'Die-cast cars, tracks and surprise puzzles — start (or grow) the collection.', 'die-cast cars'],
  ['Disney', 'disney', '🏰', 'Frozen, Princess, Mickey & Minnie — cups, sunglasses, activity books and toys galore.', 'character toys'],
  ['Paw Patrol', 'paw-patrol', '🐶', 'Chase, Marshall and the whole rescue crew, ready for adventure at little prices.', 'preschool toys'],
  ['Transformers', 'transformers', '🤖', 'Robots in disguise — figures and playsets that convert boredom into fun.', 'action figures'],
  ['Funko', 'funko', '🎁', 'Pop! figures and collectibles for every fandom — start hunting.', 'collectibles'],
  ['COBI', 'cobi', '✈️', 'Premium European building blocks — tanks, planes and ships history buffs love.', 'building sets'],
  ['Melissa & Doug', 'melissa-and-doug', '🪵', 'Classic wooden toys and pretend play that parents trust and kids adore.', 'wooden toys'],
  ['Fisher-Price', 'fisher-price', '🍼', 'Baby and toddler favorites — built to be chewed, thrown and loved.', 'baby toys'],
  ['Hasbro', 'hasbro', '🎲', 'Games, figures and family-night legends from the toy giant.', 'games & figures'],
  ['Mattel', 'mattel', '🎀', 'From Barbie to Hot Wheels — the classics, all in one place.', 'classic toys'],
];

const PRODUCTS = [
  ['Bruder Fire Engine with Ladder', '$79.99', 'https://cdn.shopify.com/s/files/1/0164/3728/0868/files/f_03472_3.webp?v=1781140023'],
  ['Spider-Man Splat Ball', '$4.99', 'https://cdn.shopify.com/s/files/1/0164/3728/0868/files/23DDCC3D-D6C9-4ECE-9189-18F09A90502D.jpg?v=1781134900'],
  ['FC Barcelona Soccer Ball (Size 5)', '$19.99', 'https://cdn.shopify.com/s/files/1/0164/3728/0868/files/Aaec9665a1887401283c6ac97ca600a6cH.jpg?v=1781112738'],
  ['Foam Building Blocks — 60 Pieces', '$27.99', 'https://cdn.shopify.com/s/files/1/0164/3728/0868/files/55902.jpg?v=1781030261'],
];

const STORES = {
  gl: { name: 'Glendale', addr: '6743 San Fernando Rd, Glendale, CA 91201', tel: '+18185115235', telTxt: '(818) 511-5235', maps: 'https://www.google.com/maps/dir/?api=1&destination=6743+San+Fernando+Rd,+Glendale,+CA+91201' },
  tu: { name: 'Tujunga', addr: '7115 Foothill Blvd, Tujunga, CA 91042', tel: '+18182055533', telTxt: '(818) 205-5533', maps: 'https://www.google.com/maps/dir/?api=1&destination=7115+Foothill+Blvd,+Tujunga,+CA+91042' },
  tj: null, // both stores featured equally (Glendale page)
};

const baseCss = `
  :root{--coral:#FF5A5F;--sun:#FFB703;--sky:#06AED5;--lime:#8AC926;--purple:#9B5DE5;--ink:#1D2B3A;--cream:#FFF9F0;--shadow:0 8px 24px rgba(29,43,58,.08);--shadow-lg:0 16px 40px rgba(29,43,58,.14)}
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Nunito',sans-serif;background:var(--cream);color:var(--ink);line-height:1.65}
  h1,h2,h3{font-family:'Baloo 2',cursive;line-height:1.15}
  a{color:inherit;text-decoration:none}
  img{max-width:100%;display:block}
  .wrap{max-width:1000px;margin:0 auto;padding:0 20px}
  header{position:sticky;top:0;z-index:50;background:rgba(255,249,240,.94);backdrop-filter:blur(10px);border-bottom:1px solid rgba(29,43,58,.07)}
  .header-in{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;max-width:1040px;margin:0 auto}
  .logo{font-family:'Baloo 2',cursive;font-weight:800;font-size:22px;display:flex;align-items:center;gap:8px}
  .logo .brick{width:26px;height:18px;background:var(--coral);border-radius:5px;position:relative}
  .logo .brick::before{content:'';position:absolute;top:-5px;left:4px;width:6px;height:5px;background:var(--coral);border-radius:3px 3px 0 0;box-shadow:10px 0 0 var(--coral)}
  .logo .ca{background:linear-gradient(90deg,var(--coral),var(--sun));-webkit-background-clip:text;background-clip:text;color:transparent}
  .hd-call{background:var(--lime);color:#fff;font-weight:800;font-size:14px;border-radius:999px;padding:9px 18px;animation:wob 5s ease-in-out infinite}
  @keyframes wob{0%,90%,100%{transform:rotate(0)}93%{transform:rotate(-2deg)}96%{transform:rotate(2deg)}}
  .hero{position:relative;padding:64px 0 56px;overflow:hidden;text-align:center}
  .hero h1{font-size:clamp(30px,5vw,48px);font-weight:800;max-width:840px;margin:0 auto}
  .hero h1 .hl{background:linear-gradient(90deg,var(--coral),var(--sun));-webkit-background-clip:text;background-clip:text;color:transparent}
  .hero p.sub{font-size:18px;color:#42526a;max-width:640px;margin:16px auto 26px}
  .kicker{display:inline-block;font-weight:800;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--coral);background:rgba(255,90,95,.1);padding:6px 14px;border-radius:999px;margin-bottom:14px}
  .btn{display:inline-flex;align-items:center;gap:8px;font-weight:800;font-size:15px;padding:14px 28px;border-radius:999px;transition:transform .2s,box-shadow .2s}
  .btn-coral{background:var(--coral);color:#fff;box-shadow:0 8px 24px rgba(255,90,95,.35)}
  .btn-ghost{border:3px solid var(--ink)}
  .btn:hover{transform:translateY(-3px)}
  .float{position:absolute;border-radius:50%;filter:blur(2px);opacity:.4;pointer-events:none}
  @keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-24px)}}
  section{padding:44px 0}
  h2{font-size:clamp(24px,3.4vw,34px);margin-bottom:16px}
  .card{background:#fff;border-radius:20px;box-shadow:var(--shadow);padding:28px}
  .two{display:grid;grid-template-columns:1fr 1fr;gap:18px}
  .store-box{background:#fff;border-radius:20px;box-shadow:var(--shadow);padding:26px;transition:transform .25s}
  .store-box:hover{transform:translateY(-5px)}
  .store-box .pin{font-size:30px}
  .store-box h3{font-size:21px;margin:6px 0 4px}
  .store-box p{font-size:14.5px;color:#5b6b7b}
  .store-box .row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
  .tag{display:inline-block;background:rgba(255,183,3,.18);color:#9a6e00;font-weight:800;font-size:12.5px;padding:5px 13px;border-radius:999px}
  .tag.call{background:var(--coral);color:#fff}
  .tag.map{background:var(--sky);color:#fff}
  .chips{display:flex;flex-wrap:wrap;gap:9px}
  .chips a{background:#fff;box-shadow:var(--shadow);border-radius:999px;padding:8px 16px;font-weight:800;font-size:13px;transition:transform .2s,background .2s,color .2s}
  .chips a:hover{transform:translateY(-2px);background:var(--coral);color:#fff}
  .pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .pcard{background:#fff;border-radius:16px;box-shadow:var(--shadow);overflow:hidden;transition:transform .25s}
  .pcard:hover{transform:translateY(-5px)}
  .pcard img{aspect-ratio:1;object-fit:contain;padding:12px;background:#fff}
  .pcard .pb{padding:10px 14px 16px;font-weight:800;font-size:13px}
  .pcard .pp{color:var(--coral);font-size:15px}
  ul.checks{list-style:none;display:grid;gap:9px;font-weight:600}
  ul.checks li::before{content:'✅ ';margin-right:6px}
  footer{background:var(--ink);color:#c6d0da;padding:36px 0;margin-top:48px;text-align:center;font-size:14px;font-weight:600}
  footer a{color:var(--sun);font-weight:800}
  .reveal{opacity:0;transform:translateY(22px);transition:opacity .6s,transform .6s}
  .reveal.vis{opacity:1;transform:translateY(0)}
  @media (max-width:760px){.two{grid-template-columns:1fr}.pgrid{grid-template-columns:1fr 1fr}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
`;

const head = (title, desc, canonical, ld) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🧸</text></svg>">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<style>${baseCss}</style>
</head>`;

const headerHtml = `
<header>
  <div class="header-in">
    <a class="logo" href="/"><span class="brick"></span><span>Stock <span class="ca">California</span></span></a>
    <a class="hd-call" href="tel:+18185115235">📞 (818) 511-5235</a>
  </div>
</header>`;

const storesHtml = (focus) => {
  const both = ['gl', 'tu'];
  const order = focus === 'tu' ? ['tu', 'gl'] : both;
  return `<div class="two">` + order.map(k => {
    const s = STORES[k];
    return `<div class="store-box reveal">
      <span class="pin">📍</span>
      <h3>${s.name} Showroom</h3>
      <p>${s.addr}</p>
      <div class="row">
        <span class="tag">Open daily 10AM–8PM</span>
        <a class="tag call" href="tel:${s.tel}">📞 ${s.telTxt}</a>
        <a class="tag map" href="${s.maps}" rel="nofollow">🗺️ Directions</a>
      </div>
    </div>`;
  }).join('') + `</div>`;
};

const productsHtml = `<div class="pgrid">` + PRODUCTS.map(([t, p, img]) =>
  `<a class="pcard reveal" href="https://stockcalifornia.com/search?q=${encodeURIComponent(t.split('—')[0].trim())}"><img src="${img}" alt="${t}" loading="lazy"><div class="pb">${t}<div class="pp">${p}</div></div></a>`
).join('') + `</div>`;

const footHtml = `
<footer>
  <div class="wrap">
    <p>Stock California — California's Toy Box 🧸 · Glendale &amp; Tujunga, Los Angeles</p>
    <p style="margin-top:8px"><a href="/">← Back to home</a> · <a href="https://stockcalifornia.com/collections/all">Shop all toys online</a></p>
  </div>
</footer>
<script>
(function(){
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('vis');io.unobserve(e.target)}})},{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  } else { document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('vis')}); }
})();
</script>
</body>
</html>`;

const floatShapes = `
  <div class="float" style="width:120px;height:120px;background:var(--sun);top:10%;left:5%;animation:drift 8s ease-in-out infinite"></div>
  <div class="float" style="width:80px;height:80px;background:var(--sky);bottom:12%;right:8%;animation:drift 9s ease-in-out infinite"></div>
  <div class="float" style="width:60px;height:60px;background:var(--purple);top:18%;right:20%;animation:drift 7s ease-in-out infinite"></div>`;

const brandLd = (name, url) => ({
  '@context': 'https://schema.org', '@type': 'WebPage', name, url,
  about: { '@type': 'Brand', name },
  mainEntity: storeLdEntity(),
});
function storeLdEntity() {
  return {
    '@type': 'ToyStore', name: 'Stock California', url: 'https://stockcalifornia.com', telephone: '+18185115235', priceRange: '$',
    address: [
      { '@type': 'PostalAddress', streetAddress: '6743 San Fernando Rd', addressLocality: 'Glendale', addressRegion: 'CA', postalCode: '91201', addressCountry: 'US' },
      { '@type': 'PostalAddress', streetAddress: '7115 Foothill Blvd', addressLocality: 'Tujunga', addressRegion: 'CA', postalCode: '91042', addressCountry: 'US' },
    ],
    openingHours: 'Mo-Su 10:00-20:00',
  };
}

/* ---------- Location pages ---------- */
let cityChipsHome = [];
let cityChipsFoot = [];
for (const [city, slug, near, blurb] of CITIES) {
  const url = `${SITE}/toy-store-${slug}`;
  const title = `Toy Store near ${city}, CA | Stock California — LEGO, Barbie, Marvel & More`;
  const desc = `Looking for a toy store near ${city}? Stock California has two LA showrooms (Glendale & Tujunga) with thousands of toys from LEGO, Barbie, Marvel, Hot Wheels & more — at prices parents love. Open daily 10AM–8PM.`;
  const ld = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    name: `Toy Store near ${city}, CA`, url,
    mainEntity: { ...storeLdEntity(), areaServed: { '@type': 'City', name: city } },
  };
  const otherChips = CITIES.filter(c => c[1] !== slug).slice(0, 12)
    .map(c => `<a href="/toy-store-${c[1]}">${c[0]}</a>`).join('');
  const brandChips = BRANDS.map(b => `<a href="/brands/${b[1]}">${b[2]} ${b[0]}</a>`).join('');
  const html = `${head(title, desc, url, ld)}
<body>
${headerHtml}
<section class="hero">
${floatShapes}
  <div class="wrap">
    <span class="kicker">📍 Serving ${city} &amp; beyond</span>
    <h1>The Toy Store <span class="hl">${city}</span> Families Love</h1>
    <p class="sub">${blurb} Thousands of toys from LEGO, Barbie, Marvel, Hot Wheels &amp; Disney — at prices parents love. Free US shipping over $50 if you'd rather shop from the couch.</p>
    <a class="btn btn-coral" href="https://stockcalifornia.com/collections/all">Shop Toys Online 🎁</a>
    <a class="btn btn-ghost" href="#visit">Visit a Showroom</a>
  </div>
</section>
<section id="visit">
  <div class="wrap">
    <h2>Two showrooms near ${city} <span style="display:inline-block">🌴</span></h2>
    ${storesHtml(near === 'tu' ? 'tu' : 'gl')}
  </div>
</section>
<section>
  <div class="wrap card reveal">
    <h2>Why ${city} parents shop with us</h2>
    <ul class="checks">
      <li>Licensed brands kids beg for — LEGO, Barbie, Marvel, Star Wars, Paw Patrol, Hot Wheels</li>
      <li>Real value prices: most toys $5–$20, plenty under $5</li>
      <li>Family-run, with two real LA showrooms you can walk into every day, 10AM–8PM</li>
      <li>Free US shipping on online orders over $50 — easy returns, all major payments</li>
    </ul>
  </div>
</section>
<section>
  <div class="wrap">
    <h2>Toys ${city} kids are grabbing right now 🔥</h2>
    ${productsHtml}
  </div>
</section>
<section>
  <div class="wrap">
    <h2>Shop by brand</h2>
    <div class="chips">${brandChips}</div>
  </div>
</section>
<section>
  <div class="wrap">
    <h2>Also nearby</h2>
    <div class="chips">${otherChips}<a href="/">All areas →</a></div>
  </div>
</section>
${footHtml}`;
  fs.writeFileSync(path.join(ROOT, `toy-store-${slug}.html`), html);
  cityChipsHome.push(`<a href="/toy-store-${slug}">${city}</a>`);
  cityChipsFoot.push(`<a href="/toy-store-${slug}">Toy store near ${city}</a>`);
}

/* ---------- Brand pages ---------- */
fs.mkdirSync(path.join(ROOT, 'brands'), { recursive: true });
let brandChipsFoot = [];
for (const [brand, slug, emoji, blurb, cat] of BRANDS) {
  const url = `${SITE}/brands/${slug}`;
  const title = `${brand} Toys in Glendale & Tujunga, CA | Stock California`;
  const desc = `Shop ${brand} ${cat} at Stock California — two LA toy showrooms in Glendale & Tujunga plus online with free US shipping over $50. ${blurb}`;
  const otherBrands = BRANDS.filter(b => b[1] !== slug)
    .map(b => `<a href="/brands/${b[1]}">${b[2]} ${b[0]}</a>`).join('');
  const cityChips = CITIES.slice(0, 12).map(c => `<a href="/toy-store-${c[1]}">${c[0]}</a>`).join('');
  const html = `${head(title, desc, url, brandLd(`${brand} Toys at Stock California`, url))}
<body>
${headerHtml}
<section class="hero">
${floatShapes}
  <div class="wrap">
    <span class="kicker">${emoji} Official licensed toys</span>
    <h1><span class="hl">${brand}</span> Toys, Little Prices</h1>
    <p class="sub">${blurb} Browse ${brand} in person at our Glendale &amp; Tujunga showrooms, or shop online — free US shipping over $50.</p>
    <a class="btn btn-coral" href="https://stockcalifornia.com/search?q=${encodeURIComponent(brand)}">Shop ${brand} Online ${emoji}</a>
    <a class="btn btn-ghost" href="#visit">Find It In Store</a>
  </div>
</section>
<section>
  <div class="wrap card reveal">
    <h2>Why buy ${brand} at Stock California?</h2>
    <ul class="checks">
      <li>Genuine licensed ${brand} ${cat} — no knock-offs, ever</li>
      <li>Value pricing: the same brands for less than the big-box stores</li>
      <li>See it, squeeze it, shake it — try before you buy at two LA showrooms</li>
      <li>Free US shipping over $50 · easy returns · Apple Pay, PayPal &amp; Shop Pay</li>
    </ul>
  </div>
</section>
<section id="visit">
  <div class="wrap">
    <h2>Pick up ${brand} today 🌴</h2>
    ${storesHtml('gl')}
  </div>
</section>
<section>
  <div class="wrap">
    <h2>More brands kids love</h2>
    <div class="chips">${otherBrands}</div>
  </div>
</section>
<section>
  <div class="wrap">
    <h2>Looking for ${brand} near you?</h2>
    <div class="chips">${cityChips}<a href="/">All areas →</a></div>
  </div>
</section>
${footHtml}`;
  fs.writeFileSync(path.join(ROOT, 'brands', `${slug}.html`), html);
  brandChipsFoot.push(`<a href="/brands/${slug}">${brand} toys</a>`);
}

/* ---------- sitemap.xml + robots.txt ---------- */
const urls = [`${SITE}/`]
  .concat(CITIES.map(c => `${SITE}/toy-store-${c[1]}`))
  .concat(BRANDS.map(b => `${SITE}/brands/${b[1]}`));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n') + `\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);

/* ---------- inject chips into index.html ---------- */
let idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
idx = idx.replace(/(<div class="areas-chips reveal" id="areasChips">)[\s\S]*?(<\/div>)/,
  `$1${cityChipsHome.join('')}$2`);
idx = idx.replace(/(<div class="foot-areas" id="footAreas">)[\s\S]*?(<\/div>)/,
  `$1<strong style="color:#fff">Areas we serve:</strong> ${cityChipsFoot.join(' · ')}<br><strong style="color:#fff">Popular brands:</strong> ${brandChipsFoot.join(' · ')}$2`);
fs.writeFileSync(path.join(ROOT, 'index.html'), idx);

console.log(`Generated ${CITIES.length} location pages, ${BRANDS.length} brand pages, sitemap (${urls.length} URLs), robots.txt; injected ${cityChipsHome.length} area chips into index.html`);
