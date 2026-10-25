# YouTubeADWORDS: Code & Browser Test Report

Date: 2026-10-25 · Branch: `feat/ui-revamp` · Snapshot **before** any fixes were applied.
Fix status for every item is in [fixedBugs.md](fixedBugs.md) and [bugNotFixed.md](bugNotFixed.md).

## Summary

The site built and every page rendered, but checkout was not safe to run with real money. Using only `curl` and no login, I placed a $0.01 order for 100,000 views and marked it paid with a forged webhook.

- **Tested:** I read all of `backend/server.ts`, the Prisma schema, every context, hook and util, the checkout, auth, orders and payment pages, and sampled the service pages. I ran the build, a type check and dependency audits. Then I started the backend on a throwaway Postgres, sent 22 scripted API requests, and walked 37 routes plus the buy, cart, checkout, login and orders flows in a real browser.
- **Found:** 45 issues (5 critical, 10 high, 20 medium, 10 low), plus 10 that need access or decisions outside the code (B1–B10).

## Project overview

| Part | Stack | Where | Notes |
| --- | --- | --- | --- |
| Frontend | React 18, Vite 5, Tailwind 3, React Router 7, TinaCMS 3 | `frontend/src` | Firebase Hosting; content in `frontend/content` |
| Backend | Express 5, Prisma 7, PostgreSQL (Neon) | `backend/server.ts` (1,134 lines) | Render free tier |
| Card payments | Uplef | `/api/orders/create`, `/api/webhooks/uplef` | $35–$999 only |
| Crypto payments | Cryptomus | same route, `/api/webhooks/cryptomus` | everything else |
| Pay-by-link | Custom | `/api/payment-links/*`, `/pay/:token` | separate from checkout |

## Test results

| Check | Result |
| --- | --- |
| Frontend build (`vite build`) | Passed; one 991 kB JS bundle |
| Backend type check (`tsc --noEmit`) | Passed |
| Prisma generate / db push | Passed (Postgres 16) |
| Automated tests | None existed |
| Lint | No config existed |
| Backend `npm audit` | 21 vulnerabilities (1 critical, 13 high) |
| Frontend `npm audit` | 69 vulnerabilities (6 critical, 40 high) |

### API probes (no login)

| # | Request | Result |
| --- | --- | --- |
| 3 | Signup with no password | 500 `data and salt arguments required` |
| 4b | Login with differently-cased email | 401 (case-sensitive emails) |
| 5–6 | Add to / read user 1's cart, no cookie | Both succeeded |
| 7 | Order with `price: 0.01`, method `paypal`, `userId: 1` | 201; attached to user 1; user 1's cart wiped |
| 8 | Card order, no Uplef keys | 201 "Orders created successfully", no payment |
| 9–10 | Read any user's orders / any order by ID | Returned, including stored IP address |
| 11 | Cryptomus webhook with `sign: "forged"` | `OK`; $0.01 order moved to PROGRESS (paid) |
| 12 | `/api/auth/check/1` vs `/99` | Revealed which user IDs exist |
| 13–15 | Create, disable, list payment links for user 2 | All succeeded; listing exposed tokens |
| 16, 22 | Order with no items; invalid JSON | 500 instead of 400 |
| 19 | Sign up with an email used for guest checkout | "Email already exists" |
| 21 | Unknown `/api/nope` | HTML 404 |

## Browser walkthrough

- All 37 routes loaded without a JS crash, but every page logged a 404 for `/api/popups/public`.
- `/payment/success` showed "Thank You!" to anyone without checking payment. `/does-not-exist` was a blank page.
- Adding a package to the cart, then reloading, emptied the cart (dev mode).
- "YouTube Views - 5.0K" showed in checkout as **"YouTube • 5"**, so 5 views would be ordered instead of 5,000.
- A real link like `m.youtube.com/watch?v=…` or `youtube.com/@MrBeast/videos` was rejected.
- Editing the checkout URL to `price=40` and paying by card gave "Order created successfully" with no payment. My Orders then said "No orders found" while the DB held the order, attached to another account by email.
- Signup with `dave@mycompany.io` was blocked (only 9 consumer email domains allowed).
- The discount popup opened over the cart. The email submit returned 404, no code was given, and checkout has no discount field.

## Bugs found

| # | Severity | Bug | Where | Suggested fix |
| --- | --- | --- | --- | --- |
| C1 | Critical | Server trusts item prices from the browser ($0.01 order accepted) | `server.ts:457,511,575–581`; `CheckoutPage.jsx:68–75` | Send package IDs; price on the server from one catalog |
| C2 | Critical | Cryptomus webhook processes requests with bad signatures | `server.ts:784–787` | Reject on mismatch; PHP-style JSON signing; check amount |
| C3 | Critical | No auth on cart, orders, order detail, payment links | `server.ts:358–451, 905–1025` | `requireAuth` + ownership checks |
| C4 | Critical | "5.0K" parsed with `parseInt` → 5 | `CheckoutPage.jsx:73,81`; `useCheckout.js` | `parseQuantity` helper / numeric quantities |
| C5 | Critical | Unknown payment methods skip card limits; missing gateway keys create unpaid "successful" orders | `server.ts:463,472,672–707`; `CheckoutPage.jsx:190–195` | Whitelist methods; 503 when unconfigured; remove fallback |
| H1 | High | Orders attach to whoever owns the typed email / body `userId`, and wipe their cart | `server.ts:483–485,599` | Use `req.user`; separate guest records |
| H2 | High | My Orders / Order Detail read localStorage nothing writes | `MyOrdersPage.jsx`, `OrderDetailPage.jsx`, `CartContext.jsx` | Fetch from the API |
| H3 | High | Uplef HMAC over re-serialized JSON, non-constant-time compare | `server.ts:728–733` | Raw body + `timingSafeEqual` |
| H4 | High | Pay-by-link: no webhook updates, no expiry check on pay, ONE_TIME/maxPayments not enforced, `redirectUrl` ignored | `server.ts:1028–1113` | Enforce and update in webhooks |
| H5 | High | Contact and review forms fake success; messages lost | `ContactPage.jsx`; 11 service pages | Real endpoints |
| H6 | High | Guest checkout creates locked accounts; later signup fails; no reset | `server.ts:488–499` | Guest flag + claim at signup + reset flow |
| H7 | High | Ban check commented out in order creation | `server.ts:455,501–509` | Restore |
| H8 | High | Shared `/pay` link price/expiry fully URL-controlled; fake "original" price | `SharedPaymentPage.jsx`; `CheckoutPage.jsx` | Server-priced share links |
| H9 | High | Discount popup endpoint missing; submit "succeeds" anyway; timer never cleared | `DiscountPopup.jsx` | Fix timer/submit; implement or remove backend |
| H10 | High | `node_modules` (63,150 files), `.DS_Store`, `.firebase/` committed; root `git add . && commit && push` script | repo root | Untrack; delete script |
| M1 | Medium | No input validation (500s; Prisma `undefined` matches any user) | `server.ts` | zod validation |
| M2 | Medium | Emails case-sensitive | `server.ts` | Normalize |
| M3 | Medium | Email validator allows only 9 consumer domains | `emailValidator.js` | Format check only |
| M4 | Medium | Link validator rejects real links | `linkValidator.js` | Parse with `URL()` |
| M5 | Medium | Cart emptied on reload in dev (StrictMode) | `CartContext.jsx` | Lazy state init |
| M6 | Medium | One link field per platform, shared by all items | `CheckoutPage.jsx` | Key by item |
| M7 | Medium | Cart cleared before payment completes | `CheckoutPage.jsx`; `server.ts` | Clear after confirmed payment |
| M8 | Medium | Success page never verifies payment; promises receipt email | `PaymentSuccessPage.jsx` | Check status |
| M9 | Medium | Google-review add-ons/custom texts dropped by backend | `GoogleReviewsUpgradeGeneric.jsx`; schema | `details Json` column |
| M10 | Medium | Blocking HTTP geolocation call, no timeout, spoofable IP | `server.ts:26–47,480` | trust proxy, `req.ip`, timeout, HTTPS |
| M11 | Medium | No rate limiting | `server.ts` | express-rate-limit |
| M12 | Medium | `/api/auth/check/:userId` user enumeration | `server.ts:324–341` | Remove |
| M13 | Medium | `.env.development` points local dev at production API | `frontend/.env.development` | Empty + Vite proxy |
| M14 | Medium | `usePageMetadata` uses undefined `client` | `ContentContext.jsx:150` | Fix or remove |
| M15 | Medium | No 404 route | `App.jsx` | Catch-all route |
| M16 | Medium | Auto notification-permission prompt after 5 s | `NotificationPopup.jsx` | Remove / user-initiated |
| M17 | Medium | Payment-link GET exposes phone/notes; listing exposes tokens | `server.ts:960–1010` | Select public fields; auth |
| M18 | Medium | `NODE_ENV=production` skips devDeps needed by build/start | `render.yaml`; `backend/package.json` | Move to dependencies |
| M19 | Medium | `lucide-react` imported but undeclared | `SharedPaymentPage.jsx`, `PayLinkPage.jsx` | Declare |
| M20 | Medium | 90 known dependency vulnerabilities | lockfiles | `npm audit fix` |
| L1 | Low | Generic `<title>` on several pages; brand misspelled in `index.html` | various | `<SEO>` per page |
| L2 | Low | Discount button reads "Save 20% OFF OFF" | `DiscountPopup.jsx` | Remove duplicate |
| L3 | Low | Cart drawer ignores Escape; unlabeled icon buttons; div package cards not keyboard-accessible | `CartSidebar.jsx`; service pages | a11y fixes |
| L4 | Low | 991 kB single bundle | `App.jsx` | `React.lazy` routes |
| L5 | Low | Heavy duplication (3 order blocks, 10 near-identical service pages, duplicate assets) | `server.ts`; `pages/Buy*.jsx`; `public/` | Extract helpers/components |
| L6 | Low | `SESSION_SECRET` unused; README stale | `server.ts:96`; `README.md` | Remove / update |
| L7 | Low | `ORDER_${Date.now()}` can collide | `server.ts:515` | `randomUUID()` |
| L8 | Low | Unknown `/api/*` routes return HTML | `server.ts` | JSON 404 |
| L9 | Low | No tests, no linter | repo | Vitest + Supertest, ESLint |
| L10 | Low | Every error is a blocking `alert()` | checkout/pay pages | Inline banners |

## Needs input or access (B1–B10)

| # | Problem | Hurdle |
| --- | --- | --- |
| B1 | Uplef webhook format | No Uplef docs or test keys |
| B2 | Cryptomus end-to-end | No merchant test credentials |
| B3 | Authoritative price source | Owner decision (JSON vs database) |
| B4 | Ticket/receipt/reset emails | No email provider configured |
| B5 | Discount popup backend | Lives in a separate service not in this repo |
| B6 | Production schema changes | No Neon access; no migrations folder |
| B7 | Order fulfilment | No supplier API |
| B8 | Render deploy behaviour | No Render dashboard access |
| B9 | Payment relay via web3task.com | Compliance question (processor terms) |
| B10 | Selling targeted Google reviews | Legal question (FTC 2024 fake-review rule, Google policy) |
