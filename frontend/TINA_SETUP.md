# Tina CMS admin setup

## Get the admin to open

1. **Build the admin** (uses `--skip-cloud-checks` so it works before Tina Cloud has indexed your branch):
   ```bash
   npm run build:admin
   ```
   This generates `public/admin/` and `tina/__generated__/`.

2. **Commit and push the `tina` folder** so Tina Cloud can index your branch:
   - Ensure `frontend/tina/` is **not** in `.gitignore` (including `tina/__generated__/`).
   - Commit and push to `main`:
     ```bash
     git add frontend/tina/
     git commit -m "Add Tina schema and generated files"
     git push origin main
     ```

3. **In Tina Cloud** ([app.tina.io](https://app.tina.io) → your project → **Configuration**):
   - Click **Refresh Branches**. After a few minutes, `main` should appear.
   - Under **Site URLs**, add `http://localhost:5173` (and your production URL when you deploy).

4. **Open the admin**: run `npm run dev`, then go to [http://localhost:5173/admin](http://localhost:5173/admin).

## Env vars (in `frontend/.env`)

- `TINA_CLIENT_ID` or `Tins_client` – from Tina Cloud project
- `TINA_TOKEN` or `Tina_token` – from Tina Cloud project  
- `TINA_BRANCH` (optional) – default is `main`

## Scripts

- `npm run build:admin` – builds the admin (skips cloud branch check so it works before indexing).
- `npm run build:admin:local` – same as above (explicit name).

Once your branch is indexed in Tina Cloud, you can remove `--skip-cloud-checks` from the script in `package.json` if you want the build to verify the branch in CI.
