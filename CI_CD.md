# CI/CD

GitHub Actions checks every change, gives every pull request its own Cloudflare preview link, and deploys `main` to production.

## The short version

| When | What runs | Result |
| --- | --- | --- |
| A PR into `main` is opened or gets a new push | Checks, then a preview deploy | A bot comment on the PR with `https://pr-<number>-youtubeadwords.long-bar-2706.workers.dev` |
| The PR is closed or merged | Cleanup | That preview is deleted |
| A push to `main` (a merged PR) | Checks, then a production deploy | The live `youtubeadwords` Worker is updated |
| Actions tab → "Deploy production" → Run workflow | Same as a push to `main` | A manual redeploy |

There is one Worker, `youtubeadwords`, and it serves both the React site and `/api/*`. Frontend and backend are therefore always previewed and deployed together, as one unit, so the site and API never run mismatched versions.

## Files

| File | Job |
| --- | --- |
| `.github/workflows/checks.yml` | The shared quality gate: lint the frontend, typecheck and test the backend, build the frontend, and bundle the Worker as a dry run. It deploys nothing. |
| `.github/workflows/pr-preview.yml` | For PRs: runs the checks, deploys a Cloudflare Preview, comments the link, and deletes the preview when the PR closes. |
| `.github/workflows/deploy.yml` | For `main`: runs the checks, applies new D1 migrations, and runs `wrangler deploy`. |
| `.github/actions/setup/action.yml` | Shared steps: install Node 24, run `npm ci` in the root, `frontend` and `backend`, and generate the Prisma client. |
| `.github/actions/build/action.yml` | Shared step: builds `frontend/dist`. It runs the full Tina build when the Tina secrets exist, and only `vite build` when they don't. |
| `wrangler.jsonc` → `previews` | The settings PR previews run with, which use a separate database. |
| `wrangler.preview-migrations.jsonc` | Lets CI apply `backend/migrations` to the preview database. |

## How a preview stays away from production

PR previews use Cloudflare's Workers Previews feature (`wrangler preview`). It is still in open beta. A preview is a branch of the same `youtubeadwords` Worker, and it does not reuse production settings, which come from the `previews` block in `wrangler.jsonc`:

- **Database:** a separate D1 database, `youtubeadwords-preview-db`. Signups and orders on a preview never reach the production database. All PRs share this one preview database.
- **Rate limits:** each preview automatically gets its own Durable Object storage.
- **Secrets:** previews can't see production secrets. Set preview secrets separately, as described below.
- **URLs:** `FRONTEND_URL` and `API_URL` are set to the preview's own address, so CORS and redirects stay on the preview.

Older Cloudflare "version preview URLs" are not used because they don't work for Workers that contain a Durable Object, and this Worker contains `RateLimitCounter`.

Previews are public links. Put Cloudflare Access in front of them if they need to be private.

## One-time setup

### 1. Cloudflare API token

1. In Cloudflare, click the **profile icon (top right) → My Profile → API Tokens**, or go straight to <https://dash.cloudflare.com/profile/api-tokens>. Then click **Create Token**.
   - Only Super Administrators see **Manage account → Account API Tokens**. A token from My Profile works the same way for CI.
2. Next to **Edit Cloudflare Workers**, click **Use template**.
3. Under **Permissions**, click **+ Add more** and add **Account → D1 → Edit**, which the migrations need.
4. Under **Account Resources**, pick this one account. Under **Zone Resources**, choose **All zones from an account** for that same account.
5. Click **Continue to summary → Create Token**, and copy the token right away, because it is shown only once.
6. **Account ID:** open **Workers & Pages**. The **Account ID** is on the right side of the overview page, or in the **⋯** menu next to the account name on the dashboard home.

### 2. GitHub secrets and variables

Open GitHub → **Settings → Secrets and variables → Actions**.

**Secrets:**

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | The account id from the Cloudflare dashboard |
| `TINA_CLIENT_ID` | Optional. Without it, `/admin` is not built. |
| `TINA_TOKEN` | Optional. Same as above. |

**Variables** (these are the public Firebase web config, the same values as in `frontend/.env`):

`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`

### 3. Preview database

```bash
npx wrangler d1 create youtubeadwords-preview-db
```

Copy the `database_id` it prints into both places that currently say `REPLACE_WITH_PREVIEW_DB_ID`:

- `wrangler.jsonc`, in the `previews` block
- `wrangler.preview-migrations.jsonc`

Until you do this, the preview job fails with a clear error. The checks still run.

### 4. Preview secrets

These are the base secrets that every new preview starts with. Use gateway **test** keys here, never live ones.

```bash
npx wrangler preview base-config secret put PASSWORD_PEPPER
```

Repeat the command for `ADMIN_API_KEY`, `WEBHOOK_SECRET`, `UPLEF_API_KEY`, `UPLEF_API_SECRET`, `CRYPTOMUS_MERCHANT_ID`, `CRYPTOMUS_API_KEY` and `YOUTUBE_API_KEY`. Production secrets are still set with `npx wrangler secret put` as before.

### 5. Recommended GitHub settings

- **Settings → Branches → add a rule for `main`:** require a pull request, and require the status check **Lint, typecheck, test, build**. Broken code then can't be merged.
- **Settings → Environments → production:** add required reviewers if a person should approve each production deploy.

## Day-to-day

- **Database changes:** add a new numbered `.sql` file to `backend/migrations`. The preview applies it to the preview database, and the production deploy applies it to production before the new code goes live. Migrations should only add things, because the old code keeps running for a few seconds during a deploy.
- **Rollback:** run `npx wrangler rollback`, or use the Worker's **Deployments** tab in Cloudflare. A rollback doesn't undo a migration.
- **PRs from forks:** they get the checks only and no preview, because GitHub doesn't give forks the repository secrets.
- **Workers Builds:** don't also connect the repo in Cloudflare's Workers Builds, or every push deploys twice.
