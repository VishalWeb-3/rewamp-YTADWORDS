# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: creators and small channels on YouTube who want to grow reach and credibility, buying views, subscribers, likes and watch hours. They arrive wary of bans and fake engagement, and compare several storefronts before paying.

Secondary (present in the catalog, not confirmed as a core audience): local businesses buying Google reviews, local guide reviews, ads traffic and app downloads.

## Product Purpose

An online storefront for social-growth and Google-ads services. Visitors pick a service page, configure a package, add to cart, and check out; they then track orders. Success is a visitor trusting the site enough to complete a purchase and return to their orders.

## Positioning

Real-people, safe delivery: engagement that is genuine and policy-safe, so a creator's channel is not put at risk. This is the claim competitors selling bot traffic could not truthfully copy.

## Operating Context

- Service catalog spans YouTube (views, likes, subscribers, watch hours), Google reviews (male, female, age group, local guide), Google ads views (skip, display), website traffic and app downloads.
- Accounts, cart, orders, order detail, shareable payment links and payment success/failure flows exist.
- Content is editable through TinaCMS; blog is part of the site.

## Capabilities and Constraints

- Stack: React 18 + Vite, Tailwind CSS 3, react-router, Firebase (hosting/auth), TinaCMS; Express + Prisma + Neon PostgreSQL backend.
- Deployed to Firebase Hosting (`yt-adwords`); backend on Render.
- Existing global fonts loaded: Inter and Playfair Display.

## Evidence on Hand

- Real client logos are available (TrustedClients section).
- Real reviews/ratings were reported as available, but the same answer also marked "none verified". Treat specific ratings, order counts and statistics as unverified: do not invent or newly assert figures; reuse only what already ships in the site's content.

## Product Principles

1. Trust before conversion: a wary buyer needs safety, delivery and refund clarity before any push to buy.
2. Never overclaim: no invented stats, testimonials, guarantees or results.
3. Package choice must be fast to scan and compare across many near-identical service pages.
4. Checkout and order tracking are the product's core loop; keep them calm and unambiguous.
5. One consistent voice across the many service pages.
