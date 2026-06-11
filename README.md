# Stock California — Homepage Redesign Mockup

Animated, modern, playful homepage mockup for [StockCalifornia.com](https://stockcalifornia.com) — a value toy retailer with two LA showrooms (Glendale & Tujunga).

**"California's Toy Box" — Big brands. Little prices.**

## What this is

A single-file HTML mockup (`index.html`) of the full homepage redesign, built per the rebrand spec. No build step, no frameworks — Google Fonts via CDN and vanilla JS only. Intended for approval review before porting to Shopify OS 2.0 sections.

## Sections

1. Rotating announcement bar (free shipping / showrooms)
2. Sticky header with two-tone wordmark + cart bubble
3. Hero with floating animated shapes + staggered headline + product collage
4. Infinite brand marquee (pause on hover)
5. Shop by Age — 4 colorful tiles with hover wiggle
6. Category grid — 9 tiles
7. Best Sellers — 8 real products with live Shopify CDN images & prices
8. Showrooms split banner (Glendale & Tujunga)
9. Trust strip
10. Newsletter with confetti micro-animation
11. Footer

## Design system

- **Colors:** coral `#FF5A5F`, sunny yellow `#FFB703`, sky `#06AED5`, lime `#8AC926`, purple `#9B5DE5`, ink `#1D2B3A`, warm cream `#FFF9F0`
- **Type:** Baloo 2 (headings) + Nunito (body)
- **Motion:** CSS-first animations, scroll reveal via IntersectionObserver, `prefers-reduced-motion` respected

## Product data

Best Sellers use real titles, prices, and image URLs verified against the live
`https://stockcalifornia.com/products.json` feed at build time (several image↔title
pairings in the original spec were corrected against the live feed).

## Run locally

Open `index.html` in a browser. That's it.

## Next step (after approval)

Port to Shopify OS 2.0 sections: announcement, hero, marquee, age-grid, category-grid, featured-collection (mapped to a `best-sellers` collection), locations, newsletter — plus the platform fixes in the spec (301 redirects for misspelled collection handles, ≤60-char product titles, prices on all cards, static marquee instead of GIF banners).
