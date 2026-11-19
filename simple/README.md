# Kovera — plain HTML/CSS/JS edition

A dependency-free copy of the landing page in `src/` (React + Tailwind). No build step, no packages:
open `index.html` or serve the folder with any static server, e.g. `python3 -m http.server -d simple 8080`.

- `index.html` — page shell; each section renders into a `<div data-section="…">` placeholder.
- `css/base.css` — design tokens, reset and shared components; `css/sections/*.css` per section.
- `js/core.js` — `K` namespace: i18n (English/Hindi), helpers, section registry, the "join" bus.
- `js/ui.js` — HTML builders for the shared components (button, card, pill, choice, …).
- `js/strings/*.js` — copy, same files as `src/i18n/strings/` (keep the two in sync).
- `js/sections/*.js` — one file per section; `js/app.js` renders them and re-renders on language switch.
- `js/supabase.js` — waitlist sign-ups via Supabase's REST API (plain `fetch`).

## Saving sign-ups
Fill in `js/config.js` with the Supabase project URL and the **publishable** key (the same pair as
`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`). Empty values run the forms in demo mode: on localhost
they show a demo note, while on a deployed site a submission shows the send error, as the React production build does.
