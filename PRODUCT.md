# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Local Businesses**: Boutiques, salons, cafes, restaurants, and D2C shops in Panipat, Haryana (with future expansion planned for Chandigarh and Mohali). Facing sudden, temporary staffing shortfalls ("a 4-hour problem, not a recruitment problem") where a single missing person disrupts daily operations.
- **Flexible Workers**: Ready-to-work individuals including college students, job seekers, and homemakers in Panipat looking for flexible, daytime hours and reliable supplementary income close to home.

## Product Purpose

Kovera acts as an on-demand, hyperlocal backup workforce layer connecting local business owners needing immediate, short-term support with vetted local individuals ready to fill shifts. It eliminates the friction, cost, and delay of informal word-of-mouth hiring and rigid full-time recruitment channels. Success means businesses smoothly handle peak hours or unexpected absences, while workers access safe, predictable local shift opportunities without gatekeeping fees.

## Positioning

"Your local backup workforce, on demand." Unlike traditional job portals or staffing agencies focused on permanent placement or long recruitment cycles, Kovera solves the immediate "4-hour shift" gap with hands-on suitability vetting, daytime-only public workplace roles, and a strict ₹0 fee policy for workers.

## Operating Context

- Hyperlocal Indian tier-2 city environment (pilot launched in Panipat, Haryana; industrial and commercial hub).
- Low-trust commercial environment requiring explicit safety boundaries, transparent expectations, and zero hidden costs.
- Accessible entirely via mobile web without requiring an app store download or complex onboarding hoops.
- Operating alongside active community outreach on Instagram (`@kovera55`) utilizing bilingual/Hinglish engagement.

## Capabilities and Constraints

- **Phase 0 Pilot & Waitlist**: Controlled launch focusing on demand validation, intake registration, and manual/hands-on match curation before opening automated self-serve scheduling or dispatch.
- **The 4-Hour Shift & Compensation Ledger**: Transparent upfront rate calculator allowing merchants to budget daytime shift costs (₹750–₹900) and workers to forecast supplementary monthly income with a ₹0 platform fee guarantee.
- **Hyperlocal Pilot Corridors**: Active coverage mapped across Panipat's commercial anchors—Insar Bazaar (textiles/handlooms), Model Town (boutiques/salons), Sector 11/12 HUDA (cafes/dining), and GT Road (showrooms)—guaranteeing 15-to-30 minute match response times.
- **Strategic Evolution Roadmap**: Transparent 3-stage platform progression from Phase 0 (Hyperlocal Pilot) to Phase 1 (Live Dispatch with WhatsApp Bot & Chandigarh/Mohali expansion) to Phase 2 (Regional Shift Grid & retainers).
- **Direct Dispatch Hotline**: Instant WhatsApp coordinator touchpoint for urgent daytime retail coverage.
- **Commercial Model**: 100% free pilot to build network trust; worker participation is strictly ₹0.
- **Safety Boundaries**: Confined strictly to daytime shifts (8:00 AM – 8:00 PM, no late-night shifts), public and verified workplaces (shops, cafes, retail counters), and age 18+ adult workers.
- **Technical Architecture**: Single-page React 19 application built with Vite and Tailwind CSS v4, backed by Supabase PostgreSQL with strict Row Level Security (public write-only, anonymous read-restricted), hosted on Cloudflare Pages.

## Brand Commitments

- **Name**: Kovera (`kovera` in lower-case wordmark with brand teal dot).
- **Voice**: Grounded, specific, and candid about pilot limits. Rejects empty tech-startup hyperbole in favor of explicit commitments ("Good work starts with the right people", "Reliable people, when work needs them").
- **Visual Identity Structure**: A dual-sided visual system distinguishing Business interactions (Brand Indigo `#302F80`, Pale Indigo `#EEEFFC`, Dark Navy `#201F53`) from Worker interactions (Brand Teal `#18A999`, Pale Teal `#E4F7F3`), unified by neutral off-white background (`#F7F8FC`) and warm gold accents (`#F4B86A`).
- **Core Assets**: Wordmark, logo assets in `logos/`, and dedicated style guide in `KOVERA_STYLE_GUIDE.md`.

## Evidence on Hand

- Verified single-page web app at `src/App.jsx` implementing the full dual-sided pilot registration flow, Living Civic Dispatch Simulator, Interactive Shift Explorer, 4-Hour Shift & Compensation Ledger, Panipat Coverage Radar, and Strategic Evolution Roadmap.
- Database schema and RLS policies at `supabase/schema.sql`.
- Brand analysis and Instagram scrape archive (`@kovera55`, 7 posts) recorded in `KOVERA_STYLE_GUIDE.md`.
- Comprehensive product and platform vision document at `vision.md`.
- Logo assets at `logos/Kovera Logo.png` and `logos/Top-Down Futuristic K Workspace.png`.
- Absent evidence: No formal enterprise customer case studies or verified user testimonial quotes yet (must not be fabricated in marketing copy).

## Product Principles

1. **Earn Local Trust First**: Be brutally honest about capacity, scope, and pilot status. Never overpromise instant shift fulfillment before availability is confirmed.
2. **Safety and Dignity by Default**: Shifts must remain daytime, in public workplaces, with pre-agreed expectations and ₹0 fees for workers.
3. **Simplicity over Platform Bloat**: Keep the barrier to entry minimal; solve the immediate 4-hour shift need with fast, clear intake rather than requiring complex profiles or app installs.
4. **Dual-Sided Symmetry**: Treat the business owner and the shift worker with equal respect and clarity, reflected across UX, messaging, and visual structure.

## Accessibility & Inclusion

- Multi-device responsive design supporting lower-end mobile devices and mobile browsers prevalent in tier-2 Indian markets.
- High-contrast typography and clear visual cues adhering to WCAG AA guidelines.
- Plain, accessible language; consideration for bilingual Hindi/Hinglish copy support as the pilot expands.
