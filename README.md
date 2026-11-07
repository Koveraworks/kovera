# Kovera Web App

Landing page & lead network for Kovera — connecting local businesses looking for short-term support with ready-to-work individuals in Panipat, Haryana.

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
   Fill in your Supabase credentials. *(If omitted, the app will run in fallback mock mode without throwing errors).*

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Lint and build**:
   ```bash
   npm run lint
   npm run build
   ```

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
