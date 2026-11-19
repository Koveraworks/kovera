# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Local Businesses**: Boutiques, salons, cafes, restaurants, and D2C shops, starting in Panipat, Haryana (with future expansion planned for Chandigarh and Mohali). Businesses elsewhere are invited to join the waitlist. Facing sudden, temporary staffing shortfalls ("a 4-hour problem, not a recruitment problem") where a single missing person disrupts daily operations.
- **Flexible Workers**: Ready-to-work individuals including college students, job seekers, and homemakers, starting in Panipat, looking for flexible, daytime hours and reliable supplementary income close to home. Younger visitors are reached with "turn something you enjoy into a shift".
- **Who actually visits**: Mostly people on phones, many of them mid- and low-end phones on LTE, aged about 28–50.

## Product Purpose

Kovera acts as an on-demand, hyperlocal backup workforce layer connecting local business owners needing immediate, short-term support with vetted local individuals ready to fill shifts. It eliminates the friction, cost, and delay of informal word-of-mouth hiring and rigid full-time recruitment channels. Success means businesses smoothly handle peak hours or unexpected absences, while workers access safe, predictable local shift opportunities without gatekeeping fees.

## Positioning

"Your local backup workforce, on demand." Unlike traditional job portals or staffing agencies focused on permanent placement or long recruitment cycles, Kovera solves the immediate "4-hour shift" gap with hands-on suitability vetting, daytime-only public workplace roles, and a strict no-fee policy for workers.

## Operating Context

- Hyperlocal Indian tier-2 city environment (pilot starts in Panipat, Haryana; industrial and commercial hub). The site must not read as Panipat-only: copy says "your area", and anyone in India can join the waitlist by picking their state and district.
- Low-trust commercial environment requiring explicit safety boundaries, transparent expectations, and zero hidden costs.
- Accessible entirely via mobile web without requiring an app store download or complex onboarding hoops.
- Visitors mostly arrive from Facebook ads, often inside Facebook's in-app browser, and most conversations continue on WhatsApp after signup.
- Operating alongside active community outreach on Instagram (`@kovera55`) utilizing bilingual/Hinglish engagement.
- The site itself is available in English (India) and Hindi, switched from the header and remembered in the browser. It defaults to Hindi when the browser language is Hindi.

## Capabilities and Constraints

- **Phase 0 Pilot & Waitlist**: Controlled launch focusing on demand validation, intake registration, and manual/hands-on match curation before opening automated self-serve scheduling or dispatch.
- **What a Shift Looks Like**: One section where a visitor picks a type of shop (boutique, textiles, café, salon) to see the work, its limits and the usual hours, plus what holds for every shift: daytime only, usually 4 hours, pay agreed and shown before every shift, paid directly to the worker when it ends, no platform fee during the pilot and never a fee for workers. Each shop type has a business and a worker join button that carry the chosen type to the form. The site shows no pay figures and no earnings estimate until the pilot produces real numbers.
- **Areas**: A plain list of the Panipat areas where the pilot starts (for example Insar Bazaar, Model Town, Sector 11/12 HUDA, GT Road). Response and match times are stated as targets, not guarantees.
- **WhatsApp / Call Contact**: A WhatsApp and call band near the top, plus a floating WhatsApp button that appears only after the hero and form have scrolled away, for urgent daytime retail coverage.
- **Waitlist Forms**: Kept short. Workers give name, phone, state, district and area; businesses give shop name, contact name, phone, shop type, state, district and area. State and district are required and picked from a fixed list (all 36 states and union territories, 790 districts from India's Local Government Directory) by typing, with closest matches shown as you type; the database refuses a district that is not on the list. Area (town, village or market) is free text and optional. Shop type comes from one shared list of 12 (`src/data/shopTypes.js`). There is no email, experience or availability field: after signing up, a "Continue on WhatsApp" button opens a pre-filled message asking for those details. Placeholders describe each field and show no real names, places or numbers. Phone numbers pasted with +91, 91 or a leading 0 are normalised to 10 digits. What the forms save stays in English whichever language is shown. In production, if no database is configured the form shows an error rather than pretending to save.
- **Privacy**: No names or personal details are shown publicly. A phone number that is already on the list gets "already on the list" and nothing else. URLs, pre-filled messages and AI prompts never carry names or phone numbers. Pilot members' details do not appear on the site.
- **No Made-Up Numbers**: No invented counts, rankings or results anywhere. Any goal bar or count uses real figures from the database.
- **Rewards (planned, must be honoured once shown)**: Founding Member for the first 50 signups per city per side: first to be matched when that city's next batch or launch happens, plus a badge. One confirmed referral gives priority matching in your area; three give the "Kovera Insider" badge and first batch access. Rankings come only after the founding numbers.
- **No Roadmap Section**: The old roadmap no longer appears on the site.
- **Commercial Model**: 100% free pilot to build network trust; workers never pay a fee.
- **Safety Boundaries**: Confined strictly to daytime shifts (8:00 AM – 8:00 PM, no late-night shifts), public and verified workplaces (shops, cafes, retail counters), and age 18+ adult workers.
- **Technical Architecture**: Single-page React 19 application (sections in `src/sections/`, shared primitives in `src/ui.jsx`) built with Vite and Tailwind CSS v4, backed by Supabase PostgreSQL with strict Row Level Security (public write-only, anonymous read-restricted; submitted rows are checked and rate-limited in the database), hosted on Cloudflare Workers as static assets.
- **Planned Backend**: A Cloudflare Worker serves the site and an `/api/*` with bot protection (Turnstile) and a server-side signup function; the browser stops writing to Supabase directly, and the Supabase service-role key lives only in a Worker secret.
- **Hosting and Links**: The site stays on a `*.workers.dev` address for now. Nothing may depend on the domain, and a later domain move must keep old links (including referral links) working.
- **Two Codebases (planned)**: Built in React first; afterwards it may be copied to plain HTML/CSS/JS in `simple/`, which is deployed only if it matches the React site.

## Brand Commitments

- **Name**: Kovera (`kovera` in lower-case wordmark with a cyan dot). Note: the logo image file itself still contains the old teal, a known mismatch with the cyan palette. WhatsApp buttons and links keep their own green (`#0E6E63`), separate from the worker cyan.
- **Voice**: Grounded, specific, and candid about pilot limits. Rejects empty tech-startup hyperbole in favor of explicit commitments ("Good work starts with the right people", "Reliable people, when work needs them"). Copy rules:
  - Times are stated as targets. No pay figures or earnings estimates until the pilot has real numbers: say that pay is agreed and shown before every shift.
  - Fee claims are written in words ("Free to join", "No platform fee during the pilot"), with no rupee amount.
  - No claims of measured results while the service is at waitlist stage.
  - Plain words (match, area, shop) instead of dispatch, ledger, corridor, merchant.
  - Sentence case everywhere.
  - Panipat is where the pilot starts; the site must not read as Panipat-only.
- **Visual Identity Structure**: A dual-sided visual system distinguishing Business interactions (Brand Indigo `#302F80`, Pale Indigo `#EEEFFC`, Dark Navy `#201F53`) from Worker interactions (Worker Cyan `#0E7490`, Pale Cyan `#E0F7FA`), unified by neutral off-white background (`#F7F8FC`) and warm gold accents (`#F4B86A`). Full token list in `DESIGN.md`.
- **Core Assets**: Wordmark, logo assets in `logos/`, and dedicated style guide in `KOVERA_STYLE_GUIDE.md`.

## Evidence on Hand

- Verified single-page web app (`src/App.jsx` composing `src/sections/*.jsx`) implementing the dual-sided waitlist flow. Sections in order: header, hero with example match card, WhatsApp/call band, waitlist form, "a 4-hour problem", what a shift looks like, areas, for businesses / for workers, how it works, approach, questions, footer.
- Database schema and RLS policies at `supabase/schema.sql`; the state and district list the database checks against at `supabase/places.sql`, generated from `src/data/places/source/places.json` (Hindi district names are machine transliterations, not yet reviewed).
- The settled launch plan: GitHub issue #16 (build steps #7–#14, parked ideas #15).
- Brand analysis and Instagram scrape archive (`@kovera55`, 7 posts) recorded in `KOVERA_STYLE_GUIDE.md`.
- Comprehensive product and platform vision document at `vision.md`.
- Logo assets at `logos/Kovera Logo.png` and `logos/Top-Down Futuristic K Workspace.png`.
- Absent evidence: No formal enterprise customer case studies or verified user testimonial quotes yet (must not be fabricated in marketing copy).

## Product Principles

1. **Earn Local Trust First**: Be brutally honest about capacity, scope, and pilot status. Never overpromise instant shift fulfillment before availability is confirmed.
2. **Safety and Dignity by Default**: Shifts must remain daytime, in public workplaces, with pre-agreed expectations and no fees for workers.
3. **Simplicity over Platform Bloat**: Keep the barrier to entry minimal; solve the immediate 4-hour shift need with fast, clear intake rather than requiring complex profiles or app installs.
4. **Dual-Sided Symmetry**: Treat the business owner and the shift worker with equal respect and clarity, reflected across UX, messaging, and visual structure.

## Accessibility & Inclusion

- Multi-device responsive design supporting lower-end mobile devices and mobile browsers prevalent in tier-2 Indian markets.
- High-contrast typography and clear visual cues adhering to WCAG AA guidelines.
- Plain, accessible language in two languages today: English (India) and Hindi. Hinglish (Hindi in Roman letters) comes next; Punjabi, Gujarati and Marathi later. Languages are switched from the header (choice remembered in `localStorage` as `kovera-lang`; Hindi by default when the browser language is Hindi). The font stack covers Devanagari.
- Body text 16px, nothing informative below 14px, every control at least 44px tall, one global focus outline, and reduced-motion respected.
