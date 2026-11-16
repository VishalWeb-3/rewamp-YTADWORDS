# Bugs Not Fixed: Need Your Input or Access

Date: 2026-10-25 · Bug IDs match [bugsFound.md](bugsFound.md). Everything else is in [fixedBugs.md](fixedBugs.md).

Each item says what's blocking it and exactly what's needed to finish it.

## Must do before the next deploy

| # | Problem | Hurdle | What I need from you |
| --- | --- | --- | --- |
| B6 | **Production database schema is now behind the code.** The fixes add `User.isGuest`, `Order.email`, `Order.details` and the new `Ticket` and `Review` tables. Deploying the new backend without them will make orders, signup and the forms fail. | I have no access to the Neon database, and the repo has no `prisma/migrations` folder (it uses `db push`). All changes are additive (new nullable columns or defaults, new tables), so `db push` should not lose data, but someone with access must run it. | Run `cd backend && npx prisma db push` with the production `DATABASE_URL`, or tell me to set up `prisma migrate` with a baseline migration instead. |
| B1 | **Uplef webhook signature format** (H3) | The code now HMACs the raw body with `WEBHOOK_SECRET` and compares against `x-uplef-signature` (accepting an optional `sha256=` prefix). I couldn't confirm Uplef's actual header name, encoding or payload (`event`, `data.orderId`) because their docs and test mode aren't in the repo. If the format differs, **every card payment webhook will be rejected (401)** and card orders will stay "Awaiting payment". | Uplef webhook documentation, or test-mode keys so I can capture a real callback. |
| B2 | **Cryptomus end-to-end** (C2, H4) | Webhooks are now rejected unless the signature matches the PHP-encoded or plain JSON body. That matches Cryptomus's documented scheme, but I couldn't prove it against a real callback. | Cryptomus test merchant ID and payment API key, or a sample signed webhook payload from their dashboard. |
| B8 | **Render build** (M18) | `npm run build` now also copies the pricing JSON into `backend/data/` (if `../frontend` exists), and `prisma`/`tsx` are now regular dependencies. I can't see Render's build logs to confirm the deploy works. | Render dashboard access, or watch the next deploy's logs. |

## Decisions only you can make

| # | Problem | Hurdle | Options |
| --- | --- | --- | --- |
| B3 | **Where prices live** (C1) | I made the Tina pricing JSON (`frontend/content/pricing`, `google-pricing`) the single source of truth, read by the server (copied into `backend/data/` at build time). A Tina price edit now needs a backend redeploy as well as the frontend rebuild. | (a) Keep it this way. (b) Move prices into the database with an admin screen, so price changes don't need deploys. |
| B9 | **Payment relay through web3task.com** | `frontend/src/utils/paymentRelay.js` sends card buyers through `web3task.com/pay-relay.html` so the card processor records web3task.com instead of youtubeadwords.com as the referrer. Hiding the real merchant site from a processor can breach its merchant terms. This is a compliance question, not a code bug, so I left it unchanged. | Confirm with Uplef that this is allowed, or remove the relay and call `window.location.href = paymentUrl` directly. |
| B10 | **Legal exposure of the product** | Several pages sell Google reviews targeted by gender, age and Local Guide status. The US FTC rule in force since Oct 2024 prohibits selling fake reviews, and Google's policies forbid them. Pages also show hard-coded claims ("204 users online", "100k+ satisfied customers", "4.9/5"), which consumer-protection rules treat as advertising claims that must be true. | Owner or legal review. |
| — | **Privacy policy disclosure** (follow-up to M10) | Orders store the buyer's IP address and approximate location (city, region, country, lat/long). The privacy policy text in `content/legal` should say so, and how long it's kept. | Legal wording, or approve a draft. |

## Need an external service

| # | Problem | Hurdle | What's needed |
| --- | --- | --- | --- |
| B4 | **Emails** (H5, H6, M8) | Tickets and reviews are now stored in the database, but nobody is notified. There are no order receipts, no email verification, and no password reset. Without email verification, anyone who signs up with a guest buyer's email address can claim that guest account and see its orders (links and packages only; IP data is never returned). | An email provider (SMTP, Resend, Postmark…) plus the support inbox address. Then I can add ticket notifications, receipts, verification-before-claim and "forgot password". |
| B5 | **Discount popup backend** (H9) | `/api/popups/public` and `/api/popups/submit-email` aren't in this repo; they seem to belong to a separate admin service. The popup now stays hidden until that service answers. Checkout has no coupon field, so a "20% off" code could never be applied anyway. | That service's URL or code, and a decision on whether coupons should exist (then I'd add server-side coupon validation to the price catalog). Otherwise, delete the popup. |
| B7 | **Order fulfilment** | Nothing sends paid orders to a supplier panel, so orders stay "Processing" forever and never become "Completed". | The supplier/panel API you use and its keys. |

## Deferred work (needs your OK because of size or risk)

| # | Problem | Why not done now |
| --- | --- | --- |
| M20 (rest) | **27 frontend vulnerabilities** remain (19 high, 6 moderate, 2 low). | They are in TinaCMS's dependency tree and need `npm audit fix --force`, which upgrades TinaCMS / `@tinacms/cli` across a major version and could break the CMS. Installing also fails to rebuild `better-sqlite3` (a TinaCMS dependency) on Node 24 on this machine, so it needs a careful upgrade pass on its own. |
| L5 (rest) | **10 near-identical service pages** (~900–990 lines each). | Merging them into one data-driven `ServicePage` component is a large UI refactor touching every product page. Worth doing, but separately from security fixes so it can be reviewed visually. |
| L9 (rest) | **39 lint warnings** in older code (mostly unused variables and React hook dependency hints). | None are errors, and "fixing" hook dependencies blindly can change behaviour; best done page by page. |
| — | **Frontend unit tests** | The backend has 26 API tests. The frontend has none yet; adding Vitest + React Testing Library for checkout and the validators is a natural next step. |

## Repo state

- The fixes are committed on `feat/ui-revamp` (`b4ce65e68`, `18d99cd6b`). Nothing has been pushed.
- `frontend/node_modules`, `.DS_Store` and `.firebase/` are untracked from git (the files are still on disk). `NotificationPopup.jsx` and the duplicate video are deleted.
- The backend test suite needs a running Postgres (`DATABASE_URL`); without one, all 26 tests are skipped.
