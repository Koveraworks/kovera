# Kovera Web App

Landing page & lead network for Kovera — connecting local businesses looking for short-term support with ready-to-work individuals, starting in Panipat, Haryana. The site is in English (India) and Hindi.

Built with **React 19**, **Vite**, and **Tailwind CSS**, integrated with **Supabase** for PostgreSQL backend/waitlist data, and deployed for **100% free** on **Cloudflare Pages** (or **GitHub Pages**).

---

## Free Fullstack Architecture

| Layer | Service | Free Tier Capabilities |
| :--- | :--- | :--- |
| **Frontend & CDN** | [Cloudflare Pages](https://pages.cloudflare.com/) *(or GitHub Pages)* | Unlimited bandwidth, global 300+ PoP edge network, free SSL, zero-config git CI/CD |
| **Backend & Database** | [Supabase](https://supabase.com/) | 500MB PostgreSQL, auto-generated REST API, Row Level Security (RLS) |
| **Code & Workflows** | [GitHub](https://github.com/Koveraworks/kovera) | Git repository, Pull Request previews, GitHub Actions CI |
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
   Fill in your Supabase credentials. *(If omitted, local development runs in fallback mock mode. In a production build, with no database configured the forms show an error instead of pretending to save).*

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
scripts/check-i18n.mjs   Checks that en and hi strings have identical shapes
supabase/schema.sql      Database schema and RLS policies
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
3. Paste and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. Copy your **Project URL** and **anon public key** from **Project Settings** -> **API**.

### Security & Privacy (Row Level Security)
- Anyone can submit the Business or Worker waitlist form (`INSERT` allowed for `anon`).
- Anonymous visitors **cannot** read, query, update, or delete any records (`SELECT` forbidden for `anon`).
- Only you as admin can view and export records in your Supabase dashboard.

---

## Deploying to Cloudflare Pages (Recommended)

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select the repository `Koveraworks/kovera`.
4. Set build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Under **Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Save and Deploy**. Any subsequent `git push origin main` will deploy automatically in seconds!

---

## Deploying to GitHub Pages (Alternative)

1. In your GitHub repo settings, go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, choose **GitHub Actions**.
3. Go to **Settings** -> **Secrets and variables** -> **Actions** and add repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Under the **Actions** tab, trigger the **Deploy to GitHub Pages** workflow.
