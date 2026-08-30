# Coffeemia — website

The public site for **Coffeemia**, Veeramanikkam Nagar, Palayamkottai:
one page with the menu, the Avil Milk, and how to find the shop.

No framework, no build tools to install, no JavaScript on the page. Two data
files and a script that writes the HTML.

## Changing something

| To change | Edit |
| --- | --- |
| A price, an item, a whole category | `menu.json` |
| Phone, hours, address, map link | `shop.json` |
| Colours, spacing, layout | `style.css` |
| Wording and section structure | `build.js` |

Then rebuild:

```bash
npm run build     # rewrites index.html
```

`index.html` is generated — **do not edit it by hand**, the next build
overwrites it. Commit it anyway: static hosts serve it directly.

To see it locally before publishing:

```bash
npm start         # builds, then serves on http://localhost:3000
```

## Adding the map

The Visit section shows a placeholder until you fill these in. On Google Maps,
find the shop, then:

- **Share → Copy link** → paste into `mapsUrl` in `shop.json`
- **Share → Embed a map** → copy the `src="..."` value out of the code it gives
  you → paste into `mapEmbedUrl`

Rebuild, and the button and the map both come alive.

## Publishing

**GitHub Pages** — free, and enough for a site like this. In the repository:
Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/`.
The address is `https://<user>.github.io/<repo>/`.

**Railway** — `railway.json` and `server.js` are here if you would rather host
it beside the till app. Nothing to configure; `npm start` builds and serves.

**Your own domain** — buy one (about ₹800–1,500 a year for a `.in`), then point
it at whichever host you chose. On Pages, add the domain under Settings → Pages
and put it in a `CNAME` file at the repository root.

## About the menu

`menu.json` was taken from the till's menu so the prices matched on the day it
was built. The two are separate projects and will not update each other — after
a price change at the counter, edit `menu.json` here and rebuild, or the website
will keep quoting the old rate.

## Search listings

The page carries structured data (`CafeOrCoffeeShop`) with the address, both
phone numbers and the opening hours, so Google can show them directly in
results. Keep it truthful: it is read as fact.
