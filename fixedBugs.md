# Fixed Bugs

Date: 2026-10-25 · Branch: `feat/ui-revamp` · Bug IDs match [bugsFound.md](bugsFound.md).
Items that are only partly fixed say so, and the remaining part is in [bugNotFixed.md](bugNotFixed.md).

## How the fixes were verified

| Check | Result |
| --- | --- |
| Backend API tests (`cd backend && npm test`) | **26 / 26 passed** (new Vitest + Supertest suite, one test per probe in bugsFound.md) |
| Backend type check (`npx tsc --noEmit`) | Passed |
| Frontend build (`npx vite build`) | Passed; main bundle **991 kB → 370 kB** |
| Frontend lint (`npm run lint`) | 0 errors (39 warnings left in older code) |
| Backend `npm audit` | **21 → 0** vulnerabilities |
| Frontend `npm audit` | **69 → 27** (the rest need breaking upgrades, see bugNotFixed.md) |
| Browser re-test (Playwright, local backend + Postgres 16) | Cart, checkout, Buy now, share link, Google reviews, signup, login, My Orders, order detail, contact, reviews, 404: all working |

> **Before deploying:** the database schema changed (new columns and tables). Run `npx prisma db push`
> (or create a migration) against the production database first. See B6 in bugNotFixed.md.

## Critical

| # | Bug | What was changed |
| --- | --- | --- |
| C1 | Server trusted browser prices | New `backend/lib/catalog.ts` prices every item from the Tina pricing JSON. The browser now sends only `slug` + `tier` + `quantity` (or the Google-review options); any `price` it sends is ignored. Unknown packages get 400. New `POST /api/orders/quote` lets the UI show the server's price. A copy of the pricing data lives in `backend/data/` (refreshed by `npm run build` / `npm run sync-catalog`). |
| C2 | Forged Cryptomus webhooks accepted | Bad or missing signatures now get **401** and nothing changes. Signatures are checked with `timingSafeEqual` against PHP-style JSON (escaped `/`, `\uXXXX`), which is how Cryptomus signs. A "paid" webhook whose amount is below the order total is ignored. |
| C3 | No auth on cart / orders / payment links | Added `requireAuth`. Routes now use the session user, never an ID from the URL or body: `GET /api/cart`, `DELETE /api/cart/clear`, `GET /api/orders`, ownership-checked `/api/orders/detail/:id`, `/api/cart/remove/:id`, `/api/merchant/payment-links`, `/api/payment-links/:id/disable`. Order responses no longer include IP or geolocation fields. |
| C4 | "5.0K" became 5 | `parseQuantity()` (backend `lib/catalog.ts`, frontend `utils/quantity.js`) turns "5.0K" into 5000 and "1.0M" into 1000000. The server stores the parsed amount. Checkout shows "YouTube • 5,000". |
| C5 | Unpaid orders reported as successful | `paymentMethod` must be `card` or `crypto` (else 400). If the gateway isn't configured the API returns **503** and creates no order. The "create order without payment" branch is gone, and so is the frontend's "Order created successfully" path. |

## High

| # | Bug | What was changed |
| --- | --- | --- |
| H1 | Orders attached to any account by email or `userId` | The buyer is the logged-in user. If logged out, an email that belongs to a registered account gets **409 "please log in"**. Otherwise a guest account (`isGuest`) is reused or created. Order creation no longer deletes anyone's cart. |
| H2 | My Orders / Order Detail always empty | Both pages now load `GET /api/orders` (new `utils/orders.js`), group rows paid together, and map DB statuses (`PENDING`, `PROGRESS`, `COMPLETED`, `CANCELED`) to the filter tabs. Logged-out visitors get a log-in prompt. |
| H3 | Uplef signature over re-serialized JSON | `express.json` keeps the raw body. The HMAC is computed on those exact bytes and compared with `timingSafeEqual` (an optional `sha256=` prefix is accepted). *Header format still needs confirming, see B1.* |
| H4 | Pay-by-link gaps | `/pay` checks expiry, status, `ONE_TIME` and `maxPayments`. Both webhooks now update `LinkTransaction` (SUCCESS/FAILED) and mark exhausted links `COMPLETED`. `redirectUrl` (http/https only) is used as the success URL. A missing gateway URL returns 502. The payer's email is required. |
| H5 | Contact and review forms were fake | New `POST /api/tickets` and `POST /api/reviews` (validated, rate-limited, stored in new `Ticket` / `Review` tables; reviews stay `approved: false` until moderated). The contact page and all 11 review forms call them and show real errors. *Email notification still needs a provider, see B4.* |
| H6 | Guest buyers locked out | Guest accounts are flagged `isGuest`, can't log in, and signing up with the same email **claims** the account, keeping its orders. *Email verification and password reset need an email provider, see B4.* |
| H7 | Ban check disabled for orders | Restored for logged-in buyers and guest accounts. |
| H8 | Shared `/pay` link controlled the price | Share links now carry package references only (`?items=…`, no price). `/pay` asks the server for the price, so an edited link is re-priced or rejected. The invented "original price ×1.5" is gone. Multi-item carts can be shared. |
| H9 | Discount popup | The popup only appears if the popup service answers with active settings, so the site no longer advertises a code it can't deliver. A failed signup shows an error instead of fake success. The timer is created and cleared inside the effect. Added Escape to close, dialog role and labels. *The popup service and coupon support are not in this repo, see B5.* |
| H10 | Committed `node_modules` and auto-push script | Ran `git rm -r --cached` on `frontend/node_modules` (63,150 files), `.DS_Store` and `.firebase/`. Added `.DS_Store` and `backend/generated/` to `.gitignore`. Removed the root `npm run git` script (`git add . && commit -m 'update' && push`). |

## Medium

| # | Bug | What was changed |
| --- | --- | --- |
| M1 | No input validation | Every body is validated with **zod** and gets 400 with a readable message. IDs are validated. Invalid JSON gets 400 and oversized bodies 413 (100 kB limit). Login/signup no longer build `OR` filters with `undefined`. |
| M2 | Case-sensitive emails | Emails are trimmed and lowercased on signup, login, checkout, tickets and reviews. Lookups use case-insensitive matching, so existing mixed-case rows still work without a backfill. |
| M3 | Only 9 email domains allowed | `utils/emailValidator.js` now does a plain format check; business emails work (verified in the browser). Error copy changed to "Please enter a valid email address." everywhere. |
| M4 | Real links rejected | `utils/linkValidator.js` rewritten around `new URL()` plus hostname allow-lists. It accepts `m.youtube.com`, `/@handle/videos`, `vm.tiktok.com`, query strings, `google.<any TLD>/maps`, `maps.app.goo.gl`, `g.page` and Google search links. |
| M5 | Cart emptied on reload (dev) | `CartContext` reads localStorage in the `useState` initializer; the save effect can no longer overwrite it with `[]`. Old cart entries without a package reference are dropped. |
| M6 | One link field per platform | Checkout and `/pay` keep one link per item. |
| M7 | Cart cleared before payment | The server never clears the cart at order time; webhooks clear it once payment succeeds. The frontend clears the cart on the success page only after the server confirms **PAID**. The failure page says the cart is still saved. |
| M8 | Success page trusted the redirect | Gateways now return to `/payment/success?order=ORDER_<uuid>`. The page polls the new `GET /api/orders/status/:externalOrderId` and shows paid, pending, failed or not found. The "receipt by email" promise was replaced with "track it in My Orders". |
| M9 | Google-review options dropped | New `Order.details` (JSON) stores add-ons, age groups, genders, custom review texts and tier. New `Order.email` stores the checkout email. |
| M10 | Blocking, spoofable geolocation | `app.set('trust proxy', 1)` and `req.ip` are used instead of the raw `X-Forwarded-For`. Geolocation uses HTTPS (ipwho.is) with a 1.5 s timeout and skips private ranges. *A privacy-policy disclosure is still needed, see bugNotFixed.md.* |
| M11 | No rate limiting | `express-rate-limit`: auth 20, orders 30, forms 10 requests per 15 min per IP; YouTube search 120. |
| M12 | User enumeration | `/api/auth/check/:userId` removed, along with its frontend call (`/api/auth/me` already returns 403 for banned users). `/api/cta-actions/status` now reads the user from the session instead of `?userId=`. |
| M13 | Dev pointed at production | `frontend/.env.development` now leaves `VITE_API_URL` empty, so the Vite proxy sends `/api` to the local backend. |
| M14 | `usePageMetadata` used undefined `client` | Page metadata is now read from the front matter of `content/pages/*.mdx` (the files Tina edits), so `/login`, `/signup`, `/get-started` and others get their real titles. |
| M15 | Blank page for unknown URLs | New `NotFoundPage` on a catch-all route. |
| M16 | Automatic notification prompt | `NotificationPopup.jsx` deleted and removed from `Layout` (it also promised order updates that didn't exist). |
| M17 | Payment-link data exposure | The public `GET /api/payment-links/:token` returns only payer-facing fields (no phone, notes, ID or merchant ID). The token listing requires login and shows only your own links. *`customerEmail` is still returned to the link holder so the form can be pre-filled; the token is a 64-char secret meant for that customer.* |
| M18 | Render build needed devDependencies | `prisma` and `tsx` moved to `dependencies`. `start` is `prisma generate && tsx server.ts`. Unused `SESSION_SECRET` removed from `render.yaml`. |
| M19 | Undeclared `lucide-react` | Added to `frontend/package.json`. |
| M20 | Vulnerable dependencies | `npm audit fix` in both apps: backend 21 → 0, frontend 69 → 27 (remaining ones are breaking, see bugNotFixed.md). |

## Low

| # | Bug | What was changed |
| --- | --- | --- |
| L1 | Generic page titles | `<SEO>` added to checkout, orders, order detail, payment success/failure, Google-reviews get-started and upgrade, and 404. Other pages pick up titles from MDX metadata (M14). `index.html` brand fixed to "YoutubeADwords". |
| L2 | "Save 20% OFF OFF" | The duplicated "OFF" is stripped from the label. |
| L3 | Accessibility | The cart drawer closes on Escape, is a labelled dialog and focuses its close button. Remove buttons and copy buttons have `aria-label`s. Package cards on 11 pages have `role="button"`, `tabIndex`, `aria-pressed` and Enter/Space support. Form fields on checkout and `/pay` have proper `<label htmlFor>`. |
| L4 | 991 kB bundle | All routes except Home are lazy-loaded with `React.lazy` + `Suspense`; the main bundle is now 370 kB. |
| L5 | Duplication | The three duplicated order-creation blocks were replaced by one priced-items path, and the two Uplef/Cryptomus helpers are shared by checkout and pay-links. The unused duplicate video `public/videos/payment-loading.mp4` was removed. *Consolidating the 10 near-identical service pages is deferred, see bugNotFixed.md.* |
| L6 | Unused secret, stale README | `SESSION_SECRET` removed from code, `render.yaml` and `.env.example` (Cryptomus vars added). README rewritten with structure, test setup, pricing notes and the full endpoint table. |
| L7 | Order ID collisions | `ORDER_<crypto.randomUUID()>` and `LINK_<id>_<uuid>`. |
| L8 | HTML 404 for unknown API routes | `app.use('/api', …)` returns `{ "error": "Not found" }`. |
| L9 | No tests or linter | `backend/tests/api.test.ts` (26 tests, `npm test`). The backend is split into `app.ts` (exported for tests) and `server.ts` (listens). Frontend has ESLint 9 with React and react-hooks rules (`npm run lint`). |
| L10 | Blocking `alert()`s | Checkout, `/pay`, `/pay/:token`, Get Started and the Google-reviews upgrade page now show inline error and notice banners (`role="alert"` / `role="status"`). |

## Files touched

- **Backend:** `app.ts` (new; all routes), `server.ts` (now only starts the server), `lib/catalog.ts` (new), `scripts/sync-catalog.mjs` (new), `data/*.json` (new), `prisma/schema.prisma`, `tests/api.test.ts` (new), `vitest.config.ts` (new), `package.json`, `.env.example`.
- **Frontend:** `App.jsx`, `contexts/{Cart,Auth,CtaActions,Content}Context.jsx`, `hooks/useCheckout.js`, `utils/{quantity,orderItems,orders,reviews}.js` (new), `utils/{emailValidator,linkValidator}.js`, `components/{Layout,CartSidebar,DiscountPopup}.jsx`, `pages/{Checkout,SharedPayment,PayLink,MyOrders,OrderDetail,PaymentSuccess,PaymentFailure,GetStarted,GoogleReviewsUpgradeGeneric,GoogleReviewsGetStartedGeneric,Contact,NotFound}Page.jsx`, all 15 `pages/Buy*Page.jsx`, `eslint.config.js` (new), `.env.development`, `index.html`, `package.json`.
- **Root:** `package.json`, `.gitignore`, `render.yaml`, `README.md`.
- **Removed:** `frontend/src/components/NotificationPopup.jsx`, `frontend/public/videos/payment-loading.mp4`; `frontend/node_modules`, `.DS_Store`, `.firebase/` untracked from git (files still on disk).

Nothing was committed or pushed; all changes are in the working tree / index for your review.
