# QSpot Technologies — Corporate Site

A polished, single-page static corporate site for **QSpot Technologies**, the
company behind the QSpot marketplace app. Served at **https://www.qspottechnologies.com**.

Reuses the QSpot brand (logo + aubergine/steel-blue palette) with automatic
light/dark and a manual theme toggle, in English and Canadian French. No frameworks and
no secrets; one small build step writes the French page.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire single-page site (nav, hero, mission, product, approach, contact, footer) |
| `css/corporate.css` | Brand styles + light/dark |
| `js/qspot-lang.js` | Language layer: shared French strings, the FR/EN switcher, the top-bar pill, `QSLang.apply()` |
| `tools/build-i18n.cjs` | Deploy-time build: writes the static French page `/fr/` with hreflang, canonical and French metadata |
| `assets/images/qspot-marche-fr-square.svg` | French "QSpot Marché" square logo (swapped in on the French page) |
| `assets/images/qspot-technologies-horizontal.svg` | QSpot Technologies logo — nav and footer (white on purple, ground baked in) |
| `assets/images/qspot-technologies-square-512.png` | Organization logo in the JSON-LD structured data |
| `assets/images/qspot-marketplace-square.svg` | QSpot Marketplace square logo — hero card and product card (source: `brand/marketplace-logo/`) |
| `assets/images/qspot_logo.png` | QSpot app icon — favicon only |
| `assets/images/app-icon-1024.png` | Apple touch icon |
| `assets/images/og-image.png` | 1200×630 social share card — the QSpot Technologies logo |
| `CNAME` | `www.qspottechnologies.com` (custom domain) |
| `robots.txt`, `sitemap.xml`, `.nojekyll` | SEO + Pages hygiene (the sitemap lists `/` and `/fr/` with hreflang alternates) |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow |

## French version

The English `index.html` is the only source. Its French text lives in an inline
`QSLang.apply({...})` dictionary next to the page script; strings shared by every page
(navigation, footer, theme labels) live in `COMMON_FR` in `js/qspot-lang.js`. Elements opt in
with `data-i18n` (inner HTML) or `data-i18n-attr="attr:key;attr:key"`.

- **At deploy**, `tools/build-i18n.cjs` writes `_site/fr/index.html` (`lang="fr-CA"`, French title,
  description, Open Graph, JSON-LD, the "QSpot Marché" logo) and adds hreflang alternates to both pages.
- **At runtime** the language is chosen from `data-qs-lang`, then `?lang=`, then the remembered choice,
  then the browser language. The FR | EN switcher in the menu (and the pill in the top bar on tablets and phones)
  moves between `/fr/` and `/`.
- **Dictionary links must be absolute** (`https://www.qspotmarketplace.com/...` or root-absolute). The French page
  lives at `/fr/`, so a relative link would resolve to `/fr/...` and 404.
- Links to the marketplace go to its French pages (`/fr/`, `/web/premium.html?lang=fr`, etc.).
- To add a string: put the French in the dictionary, add `data-i18n="key"` to the English element, and keep the
  key names stable. Third-party names carry the owners' credit lines (footer), never our symbols.

To preview locally: `npm i linkedom@0.18.14`, then `node tools/build-i18n.cjs <folder containing a copy of the site>` and
serve that folder.

## Deploy to GitHub Pages

This is a **separate domain** from the marketplace, so it needs its **own repo**
(GitHub Pages serves one site per repo).

1. Create a new repo, e.g. **`qspot-technologies`**, under the same account
   (`qspotappest2024-host`).
2. Put the **contents of this `corporate/` folder at the repo root** — i.e.
   `index.html`, `css/`, `assets/`, `CNAME`, `robots.txt`, `sitemap.xml`,
   `.nojekyll`, and `.github/workflows/deploy.yml`.
3. **Settings → Pages → Source → GitHub Actions** (or "Deploy from a branch →
   main / root" — both work since there's no build).
4. **Settings → Pages → Custom domain →** `www.qspottechnologies.com`, Save.

## Porkbun DNS (for `qspottechnologies.com`)

`www.qspottechnologies.com` is the canonical address; the bare domain `qspottechnologies.com` redirects to it.
Add these records in Porkbun (Details → DNS for qspottechnologies.com):

| Type | Host | Answer |
|---|---|---|
| A | (blank / `@`) | `185.199.108.153` |
| A | (blank / `@`) | `185.199.109.153` |
| A | (blank / `@`) | `185.199.110.153` |
| A | (blank / `@`) | `185.199.111.153` |
| AAAA | (blank / `@`) | `2606:50c0:8000::153` |
| AAAA | (blank / `@`) | `2606:50c0:8001::153` |
| AAAA | (blank / `@`) | `2606:50c0:8002::153` |
| AAAA | (blank / `@`) | `2606:50c0:8003::153` |
| CNAME | `www` | `qspotappest2024-host.github.io` |

(These are identical to the GitHub Pages records already working for
qspotmarketplace.com — only the domain differs. The `www` CNAME points at the
account's Pages host, and GitHub routes by the custom domain.)

Then, once GitHub's "DNS Check" passes, tick **Enforce HTTPS** in Settings → Pages.

## Maintenance

- The site references the marketplace at `https://www.qspotmarketplace.com`,
  its Live Map, Premium, Privacy, and Terms pages — update those links if any move.
- The logo wordmark image still reads "Qspot"; replace `assets/images/qspot_logo.png`
  (and `og-image.png`) with updated artwork when ready — filenames can stay the same.
- Contact is `admin@qspotmarketplace.com`. To switch to `info@qspottechnologies.com`,
  set up email forwarding on the domain in Porkbun and update the two `mailto:`
  links + the JSON-LD `contactPoint` in `index.html`.
