# Kovera Web App

Landing page & lead network for Kovera — connecting local businesses looking for short-term support with ready-to-work individuals, starting in Panipat, Haryana. The site is in English (India) and Hindi.

Built with **React 19**, **Vite**, and **Tailwind CSS**, integrated with **Supabase** for PostgreSQL backend/waitlist data, and deployed for **100% free** on **Cloudflare Workers** (or **GitHub Pages**).

---

## Free Fullstack Architecture

| Layer | Service | Free Tier Capabilities |
| :--- | :--- | :--- |
| **Frontend & CDN** | [Cloudflare Workers static assets](https://developers.cloudflare.com/workers/static-assets/) *(or GitHub Pages)* | Free and unlimited static asset requests, global edge network, free SSL, builds from git |
| **Backend & Database** | [Supabase](https://supabase.com/) | 500MB PostgreSQL, auto-generated REST API, Row Level Security (RLS). Free projects are paused after about a week without database activity |
| **Code & Workflows** | [GitHub](https://github.com/Koveraworks/kovera) | Git repository, GitHub Actions CI, scheduled database health check |
| **Admin Operations** | [Supabase Studio](https://supabase.com/dashboard) | Web spreadsheet UI to review, search, and export lead submissions to CSV |

---

## Quick Start (Local Development)

1. **Clone and install dependencies**:
   ```bash
   git clone https://github.com/Koveraworks/kovera.git
   cd kovera
   npm install
   ```

2. **Configure environment variables (Optional for local test)**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials. *(If omitted, local development runs in fallback mock mode. In a production build, with no database configured the forms show an error instead of pretending to save).* Set both variables or neither: with only one of them set, `npm run dev` and `npm run build` stop with an error, because the forms could not save anything.

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Lint and build**:
   ```bash
   npm run lint
   npm run build
   ```

5. **Check the translations** (English and Hindi strings must have the same shape):
   ```bash
   node scripts/check-i18n.mjs
   ```

---

## Project Structure

```
src/
  App.jsx            Page order and the floating WhatsApp button
  index.css          Design tokens (@theme), global focus, Hindi type rules, motion
  ui.jsx             Shared primitives: Section, Card, Button, Pill, Choice, Segmented, ...
  sections/*.jsx     One file per page section (Header, Hero, ContactBand, Waitlist,
                     Problem, ShiftsRates, Areas, TwoSides, HowItWorks, Trust, Faq, Footer)
  i18n/              Language provider and hook; strings/<section>.js hold the text
  lib/               Helpers (phone.js normalises phone numbers, supabase.js, contact.js)
  components/        Logo and WhatsApp icon
scripts/check-i18n.mjs         Checks that en and hi strings have identical shapes
scripts/check-waitlist-db.mjs  Checks that the database refuses what it should (see below)
supabase/schema.sql            Database schema, RLS policies and the hardening for public inserts
```

Page order: header, hero (with the example match card), WhatsApp/call band, waitlist form, "a 4-hour problem", shifts & rates, areas, for businesses / for workers, how it works, approach, questions, footer.

Styling uses the colour tokens in `src/index.css` (`bg-biz`, `text-worker`, `border-line`, ...) rather than hex values. Indigo is the business side, cyan the worker side. See `DESIGN.md`.

---

## Languages and Text

The site is in English (India) and Hindi. Visitors switch from the header; the choice is remembered in `localStorage` (`kovera-lang`), and Hindi is the default when the browser language is Hindi.

- All text lives in `src/i18n/strings/<section>.js`, each file exporting `{ en, hi }` with identical shapes.
- To change text, edit both `en` and `hi` in the matching file. To add text, add the same key to both, then read it in the section with `useStrings('<section>')`.
- Run `node scripts/check-i18n.mjs` to check the shapes match. A missing Hindi value falls back to English at runtime.
- What the forms save to the database stays in English whichever language is shown.

---

## 1-Click Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the left sidebar.
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql). It is safe to run again later.
4. Copy your **Project URL** and **publishable key** (`sb_publishable_...`) from **Project Settings** -> **API**. The key goes in `VITE_SUPABASE_ANON_KEY`. Supabase is deprecating the older `anon` key, so use the publishable one.

### Security & Privacy

The forms write to the database straight from the visitor's browser, using a key that is public by design. So the database itself decides what is allowed (section 6 of `supabase/schema.sql`):

- Anyone can submit the Business or Worker waitlist form, and nothing else. Visitors **cannot** read, update, or delete any records, and cannot set a row's `id`, `created_at` or `status`.
- Each submitted row must have a valid Indian mobile number and the required names, and every text field has a length cap. Email is optional; when given it must look like an address. The form's own `maxLength` values (`MAX_LENGTH` in `src/sections/Waitlist.jsx`) sit below those caps.
- Submissions are rate-limited: 30 an hour per IP address and 300 an hour in total across both forms. If the database cannot tell which address a row came from, only the total applies to that row. Change these in `private.intake_config` (Supabase Studio, schema `private`). When the total is reached, every signup fails for the rest of that hour and the visitor is told to try again or use WhatsApp. The limits slow a script down; they do not replace looking at the table now and then.
- Only you as admin can view and export records in your Supabase dashboard. `private.business_latest` and `private.worker_latest` show the latest row per phone number.
- Rows you add or edit in Supabase Studio are not checked or limited.

When a form gains a field, add its column to the matching `GRANT INSERT (...)` in section 6 and re-run the file, or the form will fail with a permission error.

### Checking the database

`scripts/check-waitlist-db.mjs` sends the requests a hostile script would and reports what the database did with them. Run it against a **scratch** Supabase project (the free plan allows two), not the live one: it saves a few rows named "TEST delete me" that only you can remove.

```bash
# .env holds the scratch project's URL and publishable key
node scripts/check-waitlist-db.mjs

# Also test the rate limit. First run in the SQL Editor:
#   update private.intake_config set per_ip_per_hour = 3;
#   delete from private.intake_log;
node scripts/check-waitlist-db.mjs --limit=3
# Afterwards: update private.intake_config set per_ip_per_hour = 30;
```

With `--limit`, the script also sends a made-up `X-Forwarded-For` and `CF-Connecting-IP` header. A `WARN` there means a script can dodge the per-IP limit on your project, and only the total limit protects you.

Then open `private.intake_log` in Studio and look at the `ip` column. It should hold your own public address. If it is empty, the database is not being told visitor addresses, the per-IP limit is skipped, and only the total limit is in effect.

After running `schema.sql` on the live project, submit the live form once per side straight away and confirm both rows in Studio. If a form fails, run the rollback block at the end of `schema.sql`.

---

## Deploying to Cloudflare Workers (Live Setup)

The live site is a Cloudflare Worker that serves the built files as static assets, built and deployed by Cloudflare each time `main` changes (Workers Builds).

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** -> **Create application** and import the repository `Koveraworks/kovera`.
3. Set build settings:
   - **Build command**: `npm run build`
   - **Deploy command**: `npx wrangler deploy`
   - **Branch**: `main`
4. In the Worker's build settings, add **both** build variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy. Any subsequent `git push origin main` builds and deploys automatically.

Both variables are read at build time. With only one of them set the build fails on purpose; with neither set the site deploys but the forms show an error instead of saving.

---

## Database Health Check

`.github/workflows/supabase-health.yml` calls the database four times a day. A failed run means the forms' database is unreachable or paused, and GitHub notifies you. The calls also count as database activity, which a free Supabase project needs: Supabase pauses free projects that see too little activity over a week (its docs say a few requests a day is typically enough, so this lowers the risk of a pause rather than ruling it out). A paused project keeps its data and can be restored from the dashboard.

Setup: in **Settings** -> **Secrets and variables** -> **Actions**, add the repository secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then run the workflow once from the **Actions** tab.

GitHub can switch off scheduled workflows in a public repository after about 60 days without repository activity. If the runs stop, re-enable the workflow from the **Actions** tab.

---

## Deploying to GitHub Pages (Alternative)

1. In your GitHub repo settings, go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, choose **GitHub Actions**.
3. Go to **Settings** -> **Secrets and variables** -> **Actions** and add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Under the **Actions** tab, trigger the **Deploy to GitHub Pages** workflow.
