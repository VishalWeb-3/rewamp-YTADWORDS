# Cloudflare migration plan

Date: 2026-10-30

**The old backend and database are gone (2026-11-02).** We no longer have access to Render or the Neon database, so the API and its data are being rebuilt on Cloudflare: the database is **D1**, with no data carried over, so every user has to sign up again. `youtubeadwords.onrender.com` returns "Service Suspended", and the live site still calls it, so login, checkout and tickets can't work until Phase 5 ships.

The live frontend bundle also dates from 18 March 2026, so it's about seven months behind this code.

## Target setup

One Worker serves both the frontend and `/api/*` on `youtubeadwords.com`. The database is Cloudflare D1, bound straight to the Worker. Three things improve as a result:

- **Cookies:** login cookies stop being cross-site.
- **Pricing:** prices and frontend ship together, which fixes the redeploy half of B3 ([bugNotFixed.md](bugNotFixed.md)).
- **Cold starts:** Render's free-tier cold starts go away.

| Phase | What moves | User risk | Rollback |
| --- | --- | --- | --- |
| 0 | Nothing, preparation only | None | Not needed |
| 1 | Frontend on a preview URL | None | Delete it |
| 2 | DNS to Cloudflare, proxy off | Low (email) | Restore GoDaddy nameservers |
| 3 | Frontend goes live | Low | Point DNS back to Firebase |
| 4 | API ported, on preview only | None | Not live |
| 5 | API goes live | High (payments) | Roll back the Worker, if Render is alive |
| 6 | Not used (was Hyperdrive; D1 needs no connection pool) | None | Not needed |
| 7 | Shut down old hosts | Low | Only after a quiet period |

## Cloudflare services used

Listed in the order the plan first uses them.

1. **Workers Paid plan (Phase 0, optional).** The paid tier of Workers. It is no longer needed for password hashing, because the browser does the slow work. It still lifts the Free plan's 100,000 requests a day cap, which matters if traffic spikes.
2. **Workers (Phases 1 and 4).** Runs code on Cloudflare's network with no server to manage. It replaces Render, and it doesn't sleep, so the free-tier cold starts go away. One Worker can serve the site and the API, which keeps them on the same domain.
3. **Workers Static Assets (Phase 1).** Serves the built frontend files from that same Worker. It replaces Firebase Hosting, and its single-page app fallback does the same job as the rewrite in `firebase.json`. It's chosen over a separate Pages project so that frontend and API deploy as one unit.
4. **Wrangler (Phases 1 and 4).** Cloudflare's command-line tool. It holds the Worker config in `wrangler.jsonc`, deploys, sets secrets, applies D1 migrations and rolls back.
5. **Workers Builds (Phase 1).** Builds and deploys from the GitHub repo. It replaces the manual `npm run deploy`, so a Tina price edit pushed to `main` can reach both the site and the API without a manual step.
6. **Cloudflare DNS (Phase 2).** Answers for `youtubeadwords.com` instead of GoDaddy's nameservers. Custom domains on a Worker need the domain's DNS on Cloudflare, so this has to happen before the frontend can go live. The domain registration itself can stay at GoDaddy.
7. **Workers Custom Domains (Phase 3).** Connects `youtubeadwords.com` and `www` to the Worker, and Cloudflare creates the DNS records and HTTPS certificate. It's the switch that takes the site live, and removing it is the rollback.
8. **Secrets (Phase 4).** Encrypted values stored on the Worker. They replace the Render environment variables for the Uplef, Cryptomus and YouTube keys, so none of them sit in the repo.
9. **Durable Objects (Phase 4).** Small pieces of stored state that every request can reach. `express-rate-limit` keeps counts in one server's memory, which doesn't work across Workers. A Durable Object gives one shared count and keeps the current 15-minute windows, which the built-in rate limit binding can't do.
10. **D1 (Phase 4).** Cloudflare's SQLite database, bound to the Worker as `DB`. It replaces Neon, so there are no connection strings, pooling or Hyperdrive. Prisma reaches it through `@prisma/adapter-d1`, and the schema lives as SQL files in `backend/migrations`. Time Travel can restore it to any point in the last 30 days.

One Cloudflare setting is deliberately left off: **Bot Fight Mode**. It can't be skipped on the Free plan, so it could block payment webhooks.

## Phase 0: Prepare

- **Render:** find out why it's suspended. Unless it's quick to fix, leave it off and treat Phase 5 as the restoration.
- **Database:** nothing to back up, because the old Neon database is gone. The D1 database `youtubeadwords-db` is created and migrated (see Phase 4).
- **Admin service:** treated as gone. `backend/lib/admin.ts` now provides the admin API (see Phase 4).
- **DNS:** export the full zone file from GoDaddy, because DKIM records can't be discovered from outside.
- **Payments:** get the Uplef and Cryptomus webhook details (B1, B2).
- **Release:** choose the commit to ship, and sort out the uncommitted Tina and lockfile changes.
- **Account:** Workers Paid is optional now. The Free plan covers hashing, but caps requests at 100,000 a day.

## Phase 1: Frontend on a preview URL

**Status (2026-10-30): waiting on values and dashboard access.** The site is live on the preview URL `https://youtubeadwords.long-bar-2706.workers.dev`, using a `vite build` without the Tina step.

Still to finish:

1. Add these to `frontend/.env` (it's ignored by git): `TINA_CLIENT_ID`, `TINA_TOKEN`, the seven `VITE_FIREBASE_*` values and `VITE_GOOGLE_PLACES_API_KEY`.
2. Add the preview URL to Site URLs in Tina Cloud. Until then, Tina rejects the preview and `/blog` shows "Could not load blog posts."
3. Run `npm run deploy:cloudflare`, which does the full Tina build. `/admin` needs this, because the local `frontend/public/admin/index.html` is a development copy that points to `localhost:4001`. Then check that `localhost:4001` isn't in `frontend/dist`, and discard any changes under `frontend/tina/` that point to it.
4. Retest `/admin`, `/blog` and a blog post.
5. Push the code, then connect the repo under Workers Builds in the Cloudflare dashboard, using the settings below. Add the same values from step 1 as build variables.

| Setting | Value |
| --- | --- |
| Root directory | `/` |
| Build command | `npm ci && npm --prefix frontend ci && npm --prefix backend ci --omit=dev && npm --prefix backend run generate && npm run build` |
| Deploy command | `npx wrangler deploy` |

`--omit=dev` keeps the local-only `better-sqlite3` native module out of the Cloudflare build. The build command hasn't been run in Workers Builds yet. Both lockfiles passed `npm ci --dry-run` locally.

- Add `wrangler.jsonc` with static assets, single-page app fallback, and `/api/*` sent to the Worker first.
- Set up deploys from GitHub. There's no CI today, and deploys are manual with `npm run deploy`.
- Move the build variables: `VITE_FIREBASE_*`, `VITE_GOOGLE_PLACES_API_KEY` and the Tina values.
- Add the preview host to Tina's Site URLs and to any referrer restriction on the Google key.

**Done when:** every page, `/admin` and direct links to deep pages all work on the preview URL.

## Phase 2: Move DNS, proxy off

- Copy every record from the export, including apex and `www`, the `mail` A and MX records, SPF, DMARC, DKIM, and the Cryptomus, Google and Firebase TXT records.
- Lower TTLs first, and turn off DNSSEC at GoDaddy if it's on.
- Keep `mail` set to DNS-only permanently.
- Leave **Bot Fight Mode off**. It can't be skipped on the Free plan, so it could block payment webhooks.

**Done when:** the site still loads from Firebase, and email sends and receives.

## Phase 3: Frontend goes live

- Attach apex and `www` to the Worker as custom domains.
- Keep HTTPS working from the first minute, because the site already sends HSTS for a year.
- Leave Firebase Hosting deployed as the fallback.

**Done when:** the site is served by Cloudflare and analytics still reports.

## Phase 4: Port the API, no live traffic

**Status (2026-11-02): code and database done, waiting on the gateway keys.** The schema is now SQLite and runs on D1. `youtubeadwords-db` (id `adf5fd15-f4bf-4d26-a652-da68176c56b0`) is created, bound as `DB` in `wrangler.jsonc`, and `backend/migrations/0001_init.sql` is applied to it. The 26 Node tests pass against a throwaway SQLite file built from the same migrations. In Cloudflare's local runtime on D1, signup, login, sessions, case-insensitive usernames, batched order inserts with JSON details and idempotent payment updates all work.

Changes the move to D1 forced:

- **Usernames:** SQLite can't compare case-insensitively through Prisma, so `User.usernameLower` is a unique lowercased copy that signup and login use. Emails were already stored lowercased.
- **Orders:** `$transaction` is replaced by one `createManyAndReturn` insert, because D1 has no interactive transactions. One INSERT means all orders are created or none.
- **Webhooks:** `applyPaymentResult` only moves orders and pay-link transactions out of `PENDING`. A repeated or late webhook can't reopen or cancel an order that was already handled, and the cart is only cleared the first time.
- **Indexes:** `0003_indexes.sql` indexes the columns the API filters on (orders by user, `externalOrderId`, `uplefOrderId` and status; sessions; cart; tickets; reviews). Without them every lookup scans the whole table, which gets slower as orders grow and counts as rows read on D1.
- **Migrations:** the deploy command doesn't apply them. Run `npx wrangler d1 migrations apply youtubeadwords-db --remote` before any deploy that adds a migration. All three are applied now.
- **Client:** `lib/prisma.ts` is one shared client. `#db-adapter` in `backend/package.json` picks the D1 adapter on Workers and a local SQLite file elsewhere, like `#prisma-client`.

Still to finish:

1. Set the Worker secrets with `npx wrangler secret put`: `UPLEF_API_KEY`, `UPLEF_API_SECRET`, `WEBHOOK_SECRET`, `CRYPTOMUS_MERCHANT_ID`, `CRYPTOMUS_API_KEY`, `YOUTUBE_API_KEY`, plus the two below. `DATABASE_URL` is no longer used. These need the real keys, which are still to come.
2. Generate a long random `PASSWORD_PEPPER` and set it as a Worker secret. It must never change once users exist.
3. Generate a long random `ADMIN_API_KEY` and set it as a Worker secret. Without it, `/api/admin/*` answers 503.
4. Test a real purchase on the preview with gateway test keys. The order and webhook paths are tested with mocked gateways only.
5. Seed `CtaAction` rows if they were ever used. Missing rows default to enabled, and the admin API creates them on first switch.

**Admin API.** Every route under `/api/admin` needs `Authorization: Bearer <ADMIN_API_KEY>`, is rate limited, and never returns password hashes. Lists take `page` and `pageSize` (max 100).

| Route | Does |
| --- | --- |
| `GET /users`, `GET /users/:id` | List (`search`, `banned`) or inspect users |
| `POST /users/:id/ban` `{reason}`, `POST /users/:id/unban` | Ban ends their sessions at once |
| `GET /orders` (`status`, `userId`, `externalOrderId`), `GET /orders/:id`, `PATCH /orders/:id` `{status}` | Review orders and move them between `PENDING`, `PROGRESS`, `COMPLETED`, `CANCELED` |
| `GET /reviews` (`approved`), `POST /reviews/:id/approve`, `DELETE /reviews/:id` | Moderate reviews |
| `GET /tickets` (`status`), `PATCH /tickets/:id` `{status}` | Close or reopen tickets |
| `GET /cta-actions`, `PUT /cta-actions/:key`, `PUT` or `DELETE /users/:id/cta-actions/:key` | Global and per-user CTA switches |

These replace the old admin service's actions. There's no admin UI yet, and nothing sends paid orders to a supplier (B7), so orders only reach `COMPLETED` when someone sets it here.

**Password hashing.** The Worker does no slow hashing, so it fits the Free plan's 10 ms CPU limit and `bcryptjs` is gone. The browser stretches the password with PBKDF2-HMAC-SHA256 (600,000 iterations, `frontend/src/utils/passwordKey.js`) and sends only the 64-character derived key. The Worker stores `HMAC-SHA256(PASSWORD_PEPPER, key)`, one fast call.

- **Signup** sends `salt` (16 random bytes as 32 hex characters) and `passwordKey`. The salt is stored in `User.passwordSalt`.
- **Login** first calls `POST /api/auth/salt`, then sends `passwordKey`. For unknown accounts and guests the salt endpoint returns a stable fake salt, so it doesn't reveal who has an account.
- **Guest accounts** get an unusable placeholder password.
- **Trade-offs:** the server can't check password length or strength any more, so the signup form is the only check. Non-browser clients must derive the key the same way. Changing the iteration count or `PASSWORD_PEPPER` locks out every account, so don't.
- **Rate limits** on login, signup and salt are the main defence against guessing, since the pepper only protects a stolen database.

Keep Express, since Cloudflare supports it through `httpServerHandler`, so most of `app.ts` stays the same.

| File or feature | Change |
| --- | --- |
| `bcrypt` | Done: removed. Browser-side PBKDF2 plus a server HMAC, see below |
| `lib/prisma.ts` | Done: one shared client on the D1 binding |
| `lib/catalog.ts` | Replace `fs` reads with JSON imports |
| `express-rate-limit` | Replace with a small Durable Object, which keeps the current 15-minute windows (the built-in binding only allows 10 or 60 seconds) |
| `trust proxy` / `req.ip` | Read `CF-Connecting-IP`, or all users could share one rate-limit bucket |
| Cookies | Change to `SameSite=Lax` |
| `dotenv`, `server.ts` | Add a Worker entry point; keep `server.ts` for local tests |

- Test with gateway test keys, in this order: health and quotes, then forms, auth and cart, orders and pay links, and webhooks last.
- `backend/tests/api.test.ts` must stay green throughout.

**Done when:** a full purchase works on preview, with webhooks marking the order paid.

## Phase 5: API goes live

1. Apply the migrations to the remote D1 (`wrangler d1 migrations apply youtubeadwords-db --remote`). Already done for `0001_init.sql`.
2. Build with `VITE_API_URL` empty, and set `API_URL` to the main domain.
3. Update the hardcoded fallback at `backend/app.ts:31`.
4. Change the webhook URL in the Uplef dashboard. Cryptomus callbacks are set per invoice, so they switch automatically.
5. Make one real low-value payment through each gateway. The card minimum is $35.
6. Check for orders stuck in `PENDING`.

Every user gets logged out once, because the cookies live on the Render host. If Render stays suspended, rollback isn't available, so any problem has to be fixed forward.

## Phase 6: Not used

This was Hyperdrive in front of Neon. D1 is a binding with no connection to pool, so there is nothing to add.

## Phase 7: Shut down

- After about two quiet weeks, remove Render and Firebase Hosting.
- Keep the Firebase project, because Analytics still uses it.
- Update `README.md` and `.env.example`, and remove `render.yaml` and `firebase.json`.

## Open decisions

1. **Render:** resume it, or leave it down until Phase 5? Leaving it down is the better default unless the fix is quick, because the code on Render may not match the new frontend.

## Sources

- [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Express on Workers](https://developers.cloudflare.com/workers/tutorials/deploy-an-express-app/)
- [Rate limit binding](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- [D1 limits](https://developers.cloudflare.com/d1/platform/limits/)
- [Prisma with D1](https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1)
- [Cloudflare storage options](https://developers.cloudflare.com/workers/platform/storage-options/)
- [Cloudflare Postgres discussion (third-party)](https://www.runxbuild.com/blog/cloudflare-postgres/)
- [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/index.md)
- [Firebase custom domains](https://firebase.google.com/docs/hosting/custom-domain?hl=en)
