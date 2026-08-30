"use strict";
/**
 * Builds index.html for the Coffeemia website.
 *
 * Two data files drive it: menu.json (what is sold, and for how much) and
 * shop.json (address, phones, hours, map). Change those, run `npm run build`,
 * and the page is rebuilt — no HTML to hand-edit.
 */
const fs = require("fs");
const path = require("path");

const MENU = JSON.parse(fs.readFileSync(path.join(__dirname, "menu.json"), "utf8"));
const shop = JSON.parse(fs.readFileSync(path.join(__dirname, "shop.json"), "utf8"));

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pretty = (p) => p.replace(/^\+91/, "").replace(/(\d{5})(\d{5})/, "$1 $2");

const CUP = '<svg class="cup" viewBox="0 0 44 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M16.6 9.1c-1.9-1.7.5-2.9-1.4-4.6"/><path d="M21.6 9.1c-1.9-1.7.5-2.9-1.4-4.6"/></g><path d="M28.8 13.4h2.6c2.9 0 5.1 1.9 5.1 4.5s-2.2 4.5-5.1 4.5h-2.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M4.4 12.1h25.1v4.4c0 5.4-4 9.2-9.6 9.2h-5.9c-5.6 0-9.6-3.8-9.6-9.2z" fill="currentColor"/><ellipse cx="19.2" cy="28.4" rx="14.6" ry="1.9" fill="currentColor"/></svg>';
const wordmark = (cls) => `<span class="${cls}">${esc(shop.name)}<sup>&#8482;</sup>${CUP}</span>`;

const cat = (name) => MENU.find((c) => c.name === name);
const menuBlock = (c) => `
      <div class="cat">
        <h3>${esc(c.name)} <span class="ta">${esc(c.local)}</span></h3>
        <ul>${c.items.map((i) => `
          <li>
            <span class="item"><span class="en">${esc(i.name)}</span><span class="ta">${esc(i.ta)}</span></span>
            <span class="price">&#8377;${i.price}</span>
          </li>`).join("")}
        </ul>
      </div>`;

const avil = cat("Avil Milk");
const rest = MENU.filter((c) => c.name !== "Avil Milk");
const colA = rest.filter((c) => c.name === "Snacks");
const colB = rest.filter((c) => c.name !== "Snacks");

const WHY = [
  ["100% Natural", "Nothing from a packet — fruit, nuts and milk, made the moment you order.",
   '<path d="M12 21c0-6 3.5-10 9-11-1 6-4 10-9 11z"/><path d="M12 21c-4-1-6.5-4-7-8 4 .5 6.5 3 7 8z"/>'],
  ["Rich in Nutrition", "Aval, dry fruits and seasonal fruit — a glass that actually feeds you.",
   '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8.5 10.5h7"/>'],
  ["Energy Booster", "The four o'clock pick-me-up, whether that is a Sulaimani or a Nuts Avil.",
   '<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7z"/>'],
  ["Easy to Digest", "Light on the stomach — steamed, fresh, and never sitting around.",
   '<path d="M12 20c4 0 7-3 7-7 0-5-4-8-7-10C9 5 5 8 5 13c0 4 3 7 7 7z"/>'],
];

const jsonLd = {
  "@context": "https://schema.org", "@type": "CafeOrCoffeeShop",
  name: shop.name, description: shop.blurb,
  address: { "@type": "PostalAddress", streetAddress: shop.street,
    addressLocality: shop.locality, addressRegion: shop.region, addressCountry: "IN" },
  telephone: shop.phones,
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: shop.opens, closes: shop.closes }],
  servesCuisine: ["Tea", "Coffee", "Snacks", "Juices"], priceRange: "₹₹",
};
if (shop.mapsUrl) jsonLd.hasMap = shop.mapsUrl;
if (shop.siteUrl) jsonLd.url = shop.siteUrl;

const mapPane = shop.mapEmbedUrl
  ? `<iframe class="map" src="${esc(shop.mapEmbedUrl)}" title="Map to ${esc(shop.name)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`
  : `<div class="map map--empty"><p>Add the shop's Google&nbsp;Maps embed link to shop.json and the map appears here.</p></div>`;
const mapsBtn = shop.mapsUrl
  ? `<a class="btn btn--dark" href="${esc(shop.mapsUrl)}" target="_blank" rel="noopener">Open in Google Maps</a>` : "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(shop.name)} — Tea, Coffee &amp; Avil Milk in ${esc(shop.locality)}</title>
<meta name="description" content="${esc(shop.blurb)} Open ${esc(shop.hoursLabel.toLowerCase())} in ${esc(shop.street)}, ${esc(shop.locality)}.">
<meta name="theme-color" content="#12301F">
<meta property="og:title" content="${esc(shop.name)} — ${esc(shop.kicker)}">
<meta property="og:description" content="${esc(shop.blurb)}">
<meta property="og:type" content="website">
${shop.siteUrl ? `<meta property="og:url" content="${esc(shop.siteUrl)}">\n<link rel="canonical" href="${esc(shop.siteUrl)}">` : ""}
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%98%95%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Karla:wght@400;500;600&family=Noto+Sans+Tamil:wght@400;500&display=swap">
<link rel="stylesheet" href="style.css">
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>

<header class="hero">
  <nav class="nav" aria-label="Sections">
    <a href="#avil">Avil Milk</a><a href="#menu">Menu</a><a href="#visit">Visit Us</a>
  </nav>
  <h1>${wordmark("wordmark")}</h1>
  <p class="local">${esc(shop.nameLocal)}</p>
  <p class="rule"><span>${esc(shop.tagline)}</span></p>
  <p class="blurb">${esc(shop.blurb)}</p>
  <div class="cta">
    <a class="btn btn--primary" href="#visit">Find us in ${esc(shop.locality)}</a>
    <a class="btn" href="#menu">See the menu</a>
  </div>
  <p class="meta">Open ${esc(shop.hoursLabel.replace(/^Every day, /, "every day, "))} &nbsp;·&nbsp;
    <a href="tel:${esc(shop.phones[0])}">${esc(pretty(shop.phones[0]))}</a></p>
</header>

<section id="avil" class="band avil">
  <div class="avil__copy">
    <p class="kicker">The one to try</p>
    <h2>${esc(avil.name)}</h2>
    <p class="local gold">${esc(avil.local)}</p>
    <p>Flattened rice soaked in chilled milk, layered with fruit and dry fruits and finished
       with nuts. Cold, filling and properly generous — this is the glass ${esc(shop.name)} is known for.</p>
    <p class="quote">Goodness in Every Glass</p>
  </div>
  <ul class="avil__list">${avil.items.map((i) => `
    <li><span><strong>${esc(i.name)}</strong><span class="ta">${esc(i.ta)}</span></span><span class="price">&#8377;${i.price}</span></li>`).join("")}
  </ul>
</section>

<main id="menu" class="menu">
  <div class="menu__head">
    <p class="kicker">${esc(shop.kicker)}</p>
    <h2>The Menu</h2>
  </div>
  <div class="menu__cols">
    <div>${[avil, ...colA].map(menuBlock).join("")}</div>
    <div>${colB.map(menuBlock).join("")}</div>
  </div>
  <p class="note">Prices in rupees. Everything made fresh to order.</p>
</main>

<section class="band why">
  <h2>Healthy Choice, Tasty Life</h2>
  <ul>${WHY.map(([t, b, d]) => `
    <li>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>
      <h3>${esc(t)}</h3><p>${esc(b)}</p>
    </li>`).join("")}
  </ul>
</section>

<section id="visit" class="visit">
  <div>
    <h2>Visit Us</h2>
    <dl>
      <dt>Where</dt><dd>${esc(shop.street)},<br>${esc(shop.locality)}, ${esc(shop.district)}</dd>
      <dt>Hours</dt><dd>${esc(shop.hoursLabel)}</dd>
      <dt>Call</dt><dd>${shop.phones.map((p) => `<a href="tel:${esc(p)}">${esc(pretty(p))}</a>`).join("<br>")}</dd>
    </dl>
    ${mapsBtn}
  </div>
  ${mapPane}
</section>

<footer>
  <p class="foot-mark">${wordmark("wordmark wordmark--sm")}</p>
  <p>Freshly made · Served warm — thank you, visit again</p>
  <p>${esc(shop.street)}, ${esc(shop.locality)}</p>
</footer>

</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
const items = MENU.reduce((n, c) => n + c.items.length, 0);
console.log(`built index.html — ${MENU.length} categories, ${items} items`);
if (!shop.mapsUrl) console.warn("  note: shop.json has no mapsUrl yet — the Google Maps button is hidden");
if (!shop.mapEmbedUrl) console.warn("  note: shop.json has no mapEmbedUrl yet — the map shows a placeholder");
