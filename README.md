# QSpot Technologies — Corporate Site

A polished, single-page static corporate site for **QSpot Technologies**, the
company behind the QSpot marketplace app. Served at **https://qspottechnologies.com**.

Reuses the QSpot brand (logo + aubergine/steel-blue palette) with automatic
light/dark and a manual theme toggle. No frameworks, no build step, no secrets.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire single-page site (nav, hero, mission, product, approach, contact, footer) |
| `css/corporate.css` | Brand styles + light/dark |
| `assets/images/qspot_logo.png` | Logo (nav, footer, favicon) |
| `assets/images/app-icon-1024.png` | Apple touch icon |
| `assets/images/og-image.png` | 1200×630 social share card (placeholder — replace anytime) |
| `CNAME` | `qspottechnologies.com` (custom domain) |
| `robots.txt`, `sitemap.xml`, `.nojekyll` | SEO + Pages hygiene |
| `.github/workflows/deploy.yml` | GitHub Pages deploy workflow |

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
4. **Settings → Pages → Custom domain →** `qspottechnologies.com`, Save.

## Porkbun DNS (for `qspottechnologies.com`)

The apex `qspottechnologies.com` is the canonical address; `www` redirects to it.
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
