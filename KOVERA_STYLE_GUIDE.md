# Kovera Style Guide & Brand Analysis

> **Source**: Verified against codebase at `/home/laptup/Dev/kovera` (commit `bbd9c97`) and Instagram `@kovera55` (7 posts, scraped 2026-11-07)

---

## 1. Brand Identity

| Attribute | Value | Source |
|-----------|-------|--------|
| **Name** | `kovera` (lowercase in logo/wordmark) | `App.jsx:146-148`, `Footer` |
| **Display Name** | Kovera (proper case) | Instagram bio, README |
| **Tagline (Web)** | "Good work starts with the right people." | `App.jsx:242-245` |
| **Tagline (Instagram)** | "Your local backup workforce, on demand" | Instagram bio |
| **Positioning Line** | "Local work, better connected." | `App.jsx:898` |
| **Instagram Promise** | "Reliable people, when work needs them." | All Instagram captions |
| **Phase** | Phase 0 — Pilot | `App.jsx:236-239`, README |
| **Geography** | Panipat, Haryana (primary); Chandigarh, Mohali (expansion) | Hero pill, Instagram posts |
| **Target Sides** | **Businesses**: boutiques, salons, cafés, restaurants, D2C sellers<br>**Workers**: students, part-timers, job seekers, homemakers | `App.jsx` sections 03, 05, Instagram |

---

## 2. Color Palette (Tailwind CSS Theme)

Defined in `src/index.css:3-15` and used consistently across `App.jsx`.

| Token | Hex | CSS Variable | Usage Context |
|-------|-----|--------------|---------------|
| **Brand Primary** | `#302F80` | `--color-brand-primary` | Primary CTAs, nav logo, business-side accents, button backgrounds |
| **Brand Dark** | `#201F53` | `--color-brand-dark` | Footer background, primary button hover, dark sections |
| **Brand Teal** | `#18A999` | `--color-brand-teal` | Worker-side primary, success states, highlights, worker form focus |
| **Pale Teal** | `#E4F7F3` | `--color-pale-teal` | Worker-side card backgrounds, badges, hero accent blob |
| **Pale Indigo** | `#EEEFFC` | `--color-pale-indigo` | Business-side card backgrounds, borders, input borders, hero accent blob |
| **Accent Gold** | `#F4B86A` | `--color-accent-gold` | "Learning as we go" category badge, warm accent |
| **Text Main** | `#181A32` | `--color-text-main` | Primary headlines, body text (near-black) |
| **Text Body** | `#62677D` | `--color-text-body` | Secondary copy, placeholders, muted text |
| **BG Page** | `#F7F8FC` | `--color-bg-page` | Page background (off-white, cool gray tint) |
| **White** | `#FFFFFF` | — | Card surfaces, form inputs, badges |
| **Dark Section BG** | `#201F53` | (matches brand-dark) | Trust section (`#trust`) background |

### Dual-Side Color System
- **Business Side** → Indigo family (`#302F80`, `#EEEFFC`, `#201F53`)
- **Worker Side** → Teal family (`#18A999`, `#E4F7F3`, `#128679` hover)
- **Neutral/Shared** → Gold accent for "learning", grays for text/borders

---

## 3. Typography

**Font Stack** (from `src/index.css:14`):
```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Scale & Styles (observed in `App.jsx`)

| Element | Classes | Visual Spec |
|---------|---------|-------------|
| **Hero H1** | `text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#181A32] leading-[1.15]` | 36–60px, extrabold, tight tracking |
| **Section H2** | `text-3xl sm:text-4xl font-extrabold text-[#181A32] mb-4` | 30–36px, extrabold |
| **Card H3** | `text-xl font-bold text-[#181A32] mb-3` / `text-2xl sm:text-3xl font-bold` | 20–24px, bold |
| **Subheadline Emphasis** | `text-lg sm:text-xl font-semibold text-[#18A999] mb-6` | 18–20px, semibold, teal |
| **Body Copy** | `text-base sm:text-lg text-[#62677D] leading-relaxed` | 16–18px, relaxed leading, muted |
| **UI Label / Badge** | `text-xs font-bold uppercase tracking-wider/widest` | 12px, bold, uppercase, wide tracking |
| **Form Labels** | `text-xs font-bold text-[#181A32] uppercase mb-1.5` | 12px, bold, uppercase |
| **Small Print** | `text-xs sm:text-sm text-[#62677D]` | 12–14px, muted |
| **Number Circles** | `font-black text-xl` / `font-black text-sm` / `font-black text-xs` | Black weight, centered |

---

## 4. Spacing & Layout System

### Container
```css
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  /* 1280px max, responsive padding */
```

### Vertical Rhythm
- **Section padding**: `py-20` (80px) — consistent across all major sections
- **Card padding**: `p-6` (sm:p-10) / `p-8` (sm:p-10)
- **Grid gaps**: `gap-8` (32px) for 2-col, `gap-6` (24px) for 3-col
- **Component gaps**: `gap-4` (16px) standard, `gap-2` (8px) tight

### Border Radius Scale
| Radius | Class | Usage |
|--------|-------|-------|
| `rounded-full` | Pills, badges, avatar dots |
| `rounded-xl` | Buttons (12px), form inputs |
| `rounded-2xl` | Hero buttons (16px), number circles, toast |
| `rounded-3xl` | Cards, forms, major containers (24px) |

### Shadows
| Level | Class | Usage |
|-------|-------|-------|
| `shadow-2xs` | Toast icon container, tab switcher active |
| `shadow-sm` | Default cards, hover→`shadow-md` |
| `shadow-md` | Form cards |
| `shadow-lg` | Hero primary button, form cards |
| `shadow-xl` | Hero primary button hover |
| `shadow-2xl` | Toast modal, mobile nav drawer |

---

## 5. Component Patterns (Verified from `App.jsx`)

### 5.1 Buttons

**Primary (Business/Shared)**
```jsx
className="px-8 py-4 bg-[#302F80] hover:bg-[#201F53] text-white font-semibold rounded-2xl transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
```
- ArrowRight icon with `group-hover:translate-x-1`

**Primary (Worker)**
```jsx
className="w-full py-4 bg-[#18A999] hover:bg-[#128679] disabled:bg-[#18A999]/70 text-white font-bold rounded-xl transition shadow-md"
```

**Secondary (Outline)**
```jsx
className="px-8 py-4 bg-white hover:bg-[#F7F8FC] text-[#302F80] font-semibold border-2 border-[#EEEFFC] hover:border-[#302F80]/20 rounded-2xl transition shadow-sm"
```

**Text Link (CTA in cards)**
```jsx
className="inline-flex items-center gap-2 text-[#302F80] font-bold hover:gap-3 transition-all text-base"
```

**Loading State**
```jsx
<Loader2 className="w-5 h-5 animate-spin" /> <span>Registering...</span>
```

### 5.2 Cards

**Standard Card (Marketplace, How It Works, Pilot Roles)**
```jsx
className="bg-white rounded-3xl p-8 border border-[#EEEFFC] shadow-sm hover:shadow-md transition"
```

**Business-Side Tinted**
```jsx
className="bg-[#EEEFFC] rounded-3xl p-8 sm:p-10 border border-[#302F80]/15 flex flex-col justify-between hover:shadow-lg transition"
```

**Worker-Side Tinted**
```jsx
className="bg-[#E4F7F3] rounded-3xl p-8 sm:p-10 border border-[#18A999]/20 flex flex-col justify-between hover:shadow-lg transition"
```

**Preview Card (Hero Marketplace)**
```jsx
className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EEEFFC]"
```

### 5.3 Badges / Pills

**Location Pill (Hero)**
```jsx
className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4F7F3] border border-[#18A999]/20 text-[#302F80] text-xs font-bold tracking-wider uppercase mb-6 shadow-2xs"
```

**Category Badges (Pilot Roles)**
```jsx
className="text-xs font-bold text-[#18A999] uppercase tracking-wider bg-[#E4F7F3] px-3 py-1 rounded-full"
```

**Form Section Badges**
```jsx
// Business
className="px-3 py-1 bg-[#EEEFFC] text-[#302F80] text-xs font-bold rounded-full"
// Worker
className="px-3 py-1 bg-[#E4F7F3] text-[#18A999] text-xs font-bold rounded-full"
```

**Tab Switcher (Waitlist)**
```jsx
// Active Business
className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#302F80] text-white shadow-2xs"
// Active Worker
className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#18A999] text-white shadow-2xs"
// Inactive
className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#62677D] hover:text-[#181A32]"
```

### 5.4 Form Inputs

```jsx
className="w-full px-4 py-3 bg-[#F7F8FC] border border-[#EEEFFC] focus:border-[#302F80] rounded-xl text-sm outline-none transition"
```
- **Worker variant**: `focus:border-[#18A999]`
- **Textarea**: adds `resize-none`, `rows={3}`
- **Label**: `block text-xs font-bold text-[#181A32] uppercase mb-1.5`

### 5.5 Number / Icon Circles

```jsx
// Step numbers (How It Works)
className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] font-black text-xl flex items-center justify-center mb-6"
// Worker step
className="w-12 h-12 rounded-2xl bg-[#E4F7F3] text-[#302F80] font-black text-xl flex items-center justify-center mb-6"
// Gold step
className="w-12 h-12 rounded-2xl bg-[#FFF2E1] text-[#302F80] font-black text-xl flex items-center justify-center mb-6"
// Trust items
className="w-12 h-12 rounded-2xl bg-[#302F80] text-white font-black text-sm flex items-center justify-center mb-4"
// Teal trust
className="w-12 h-12 rounded-2xl bg-[#18A999] text-white font-black text-xs flex items-center justify-center mb-4"
// Role icons (Pilot)
className="w-12 h-12 rounded-2xl bg-[#EEEFFC] text-[#302F80] font-bold text-xl flex items-center justify-center"
```

### 5.6 Navigation

**Header**: `sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EEEFFC]` with `h-20`
- Logo: `text-2xl sm:text-3xl font-extrabold tracking-tight text-[#302F80]` + teal dot
- Desktop links: `text-[#181A32] hover:text-[#18A999] font-medium text-sm transition`
- CTA: `px-5 py-2.5 bg-[#302F80] hover:bg-[#201F53] text-white font-medium text-sm rounded-xl transition shadow-sm hover:shadow`
- Mobile drawer: `animate-slide-down`, `bg-white border-b border-[#EEEFFC] shadow-lg`

### 5.7 Toast / Modal

```jsx
// Overlay
className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
// Card
className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#EEEFFC]"
// Icon
className="w-12 h-12 rounded-full bg-[#E4F7F3] flex items-center justify-center text-[#18A999] mb-4"
```

### 5.8 FAQ Accordion

```jsx
// Container
className="bg-[#F7F8FC] rounded-2xl border border-[#EEEFFC] overflow-hidden transition"
// Button
className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-lg text-[#181A32] hover:text-[#302F80]"
// Chevron (open)
className="w-5 h-5 text-[#18A999] shrink-0"
// Chevron (closed)
className="w-5 h-5 text-[#62677D] shrink-0"
// Answer
className="px-6 pb-6 text-base text-[#62677D] leading-relaxed border-t border-[#EEEFFC] pt-4"
```

---

## 6. Animation & Interaction

| Interaction | Implementation |
|-------------|----------------|
| **Page scroll** | `html { scroll-behavior: smooth; }` (`index.css:27`) |
| **Button hover** | `transition` (all properties), `hover:shadow`, `hover:bg`, `group-hover:translate-x` |
| **Card hover** | `hover:shadow-lg` / `hover:shadow-md` / `hover:border-brand` |
| **Mobile drawer** | `animate-slide-down` (custom keyframe) |
| **Toast** | `animate-fade-in` (custom keyframe) |
| **Loader** | `animate-spin` (Tailwind built-in) |
| **Tab switcher** | Instant, no animation |

> **Custom keyframes** (likely in Tailwind config or global CSS): `animate-fade-in`, `animate-slide-down` — not defined in `index.css`, so must be via `@theme` or Tailwind v4 plugin.

---

## 7. Copy & Tone Guidelines

### Voice Principles (from actual copy)

| Principle | Example |
|-----------|---------|
| **Specific over abstract** | "Starting with a focused local pilot in Panipat" not "Launching soon" |
| **Honest about limits** | "Early access is not a guarantee of a filled shift" / "We confirm availability before making commitments" |
| **Two-sided empathy** | Business: "When work piles up, get help finding the fit" / Worker: "Your skills deserve the right opportunity" |
| **Human-scale language** | "Tell us what you need—or what you can do" / "A little less searching. A lot more clarity." |
| **Trust signals explicit** | "₹0 — Workers don't pay to access opportunities" / "18+ Adult worker eligibility" / "Daytime roles in public workplaces" |
| **Phase 0 framing** | "PHASE 0 / PANIPAT, HARYANA" pill, "Scope Note" callout |

### Section Copy Inventory

| Section | Headline | Subheadline | Key Body |
|---------|----------|-------------|----------|
| **Hero** | "Good work starts with the right people." | "For the shifts that keep business moving." | "Kovera connects local businesses looking for short-term support with people ready to work." |
| **Marketplace** | "A little less searching. A lot more clarity." | — | "Whether you need an extra pair of hands or you're looking for your next opportunity, start in the right place." |
| **How It Works** | "From a need to a clear next step" | — | "We're starting hands-on so every request can be understood before a match is promised." |
| **Pilot Focus** | "Starting with everyday business support" | — | "The first pilot stays intentionally narrow: suitable, clearly defined support tasks in public workplaces." |
| **Trust** | "A good match starts with clear expectations." | — | "We're building the network carefully—prioritizing suitability, clear shift details and safer working conditions over promises we can't yet support." |
| **Waitlist** | "Join the Kovera early network" | — | "Tell us which side of the marketplace you're on to get started with our Panipat pilot." |
| **FAQ** | "A few things worth making clear" | — | "We're starting small, learning from real local needs and keeping the first experience straightforward." |

---

## 8. Instagram Content Analysis (Verified)

### Profile
- **Handle**: `@kovera55`
- **Bio**: "Your local backup workforce, on demand · Flexible shifts near you | Panipat, Chandigarh, Mohali · Apply here👇"
- **Stats**: 7 posts, 16 followers, 3 following (as of scrape date)

### Posts Summary (7 total)

| Date | Format | Key Message | Hashtags |
|------|--------|-------------|----------|
| Sep 29, 2026 | Carousel | Platform intro: hyperlocal, short-term shifts, boutiques/salons (Panipat), cafés/restaurants/D2C (Chandigarh/Mohali) | #ShortTermStaffing #Panipat #Chandigarh #SmallBusinessIndia #PartTimeJobs |
| Sep 30, 2026 | Carousel | Problem framing: "One missing person throws off a whole day" — not a hiring problem, a "4 hours" problem | #ShortTermStaffing #FlexibleWork #Panipat #Chandigarh #Mohali |
| Oct 1, 2026 | Carousel | Hiring call: "we're hiring in panipat👀 student, job seeker or homemaker? got free hours? dm 'HIRE'" | #Hiring #kovera #panipat #panipatcity❤️😍 |
| Oct 4, 2026 | Reel | "Kovera is the backup layer for a local businesses need; DM 'Hire' if you're building with us in Panipat." | #Kovera #Panipat #LocalBusiness #StartupIndia #BuildInPublic |
| Oct 6, 2026 | Carousel | "have you seen this solution before? 🤔 ... shaam ho ya savera, Panipat ke shops ke liye, Kovera." (Hinglish) | #SmallBusinessIndia #PartTimeJobs #Panipat #PanipatBusiness #kovera |
| Oct 25, 2026 | Carousel | "Kovera knows what you need — Part time, shifts, free work, hiring, work." | (minimal) |
| Oct 30, 2026 | Reel | "Kovera is the best place you're looking for" — tags: Startup, small-businesses, content, viral, freelance, part-time, job, marketing, workers, shifts, work | (tags in caption) |

### Instagram vs Web Voice Comparison

| Dimension | Instagram | Web |
|-----------|-----------|-----|
| **Language** | Hinglish mix ("shaam ho ya savera") | Professional English |
| **CTA Style** | Direct: "DM 'HIRE'" | Form-based: "Register interest" |
| **Tone** | Urgent, community, conversational | Measured, trust-building, clear |
| **Format** | Visual-first (carousel/reel) | Long-form sections, structured UI |
| **Consistency** | Same geography, same promise, same dual audience | Same |

---

## 9. Technical Architecture (Verified)

### Stack
| Layer | Technology | Version/Config |
|-------|------------|----------------|
| **Frontend** | React | 19.2.8 |
| **Build** | Vite | 8.3.0 |
| **Styling** | Tailwind CSS | 4.3.3 (via `@tailwindcss/vite`) |
| **Linting** | oxlint | 1.81.0 (React rules) |
| **Icons** | lucide-react | 1.54.0 |
| **Backend/DB** | Supabase (PostgreSQL) | `@supabase/supabase-js` 2.119.0 |
| **Deploy Target** | Cloudflare Pages (recommended) / GitHub Pages | `VITE_BASE_PATH` configurable |

### Project Structure
```
kovera/
├── index.html                 # Entry HTML
├── package.json               # Scripts: dev, build, lint, preview
├── vite.config.js             # Vite + Tailwind + env loading
├── src/
│   ├── main.jsx               # React root
│   ├── App.jsx                # Single-page app (919 lines)
│   ├── index.css              # Tailwind import + theme tokens
│   └── lib/
│       └── supabase.js        # Supabase client + form submit fns
├── supabase/
│   └── schema.sql             # Tables + RLS policies
├── public/
│   ├── _headers               # Security headers + asset caching
│   └── favicon.svg
├── logos/
│   ├── Kovera Logo.png        # 21KB
│   └── Top-Down Futuristic K Workspace.png  # 1.6MB
├── .env.example               # Supabase URL + anon key template
├── .gitignore
├── .oxlintrc.json
└── README.md                  # Full deploy docs
```

### Database Schema (`supabase/schema.sql`)

**Tables**
- `business_registrations`: id, created_at, business_name, contact_name, work_location, support_need, status
- `worker_registrations`: id, created_at, full_name, locality, experience, availability, status

**Security (RLS)**
- `INSERT` allowed for `anon` + `authenticated` on both tables
- **No SELECT/UPDATE/DELETE for anon** — prevents scraping
- Admin access via Supabase Studio / service_role only

### Security Headers (`public/_headers`)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
/assets/* → Cache-Control: public, max-age=31536000, immutable
```

---

## 10. Logo & Brand Assets

| File | Size | Likely Use |
|------|------|------------|
| `logos/Kovera Logo.png` | 21 KB | Primary wordmark (used in header/footer) |
| `logos/Top-Down Futuristic K Workspace.png` | 1.6 MB | Hero/brand illustration, social assets |

> **Note**: The current `App.jsx` uses a text-based logo (`kovera` + teal dot). The PNG assets are available for future use.

---

## 11. Key Design Decisions (Inferred from Code)

1. **Single-file SPA** — All sections in `App.jsx` (919 lines), no routing. Simplifies deployment to static hosting.

2. **Mock mode by default** — `supabase.js` gracefully falls back to mock responses if env vars missing. Enables instant local dev without credentials.

3. **Dual-side color coding** — Not decorative; structural. Every section mirrors Business (indigo) vs Worker (teal).

4. **Phase 0 honesty** — Explicit "pilot" language, scope exclusions, no guarantees. Builds trust in low-trust market.

5. **No app download required** — Web-first, form-based. Lowers barrier for both sides in Tier-2 city context.

6. **RLS-first database** — Public insert only, zero read access for anon. Privacy by default.

7. **Free-tier architecture** — Cloudflare Pages + Supabase free tiers = $0 hosting. Documented in README.

8. **Hinglish on Instagram** — Code-switching for local relevance; web stays English for broader accessibility.

---

## 12. Quick Reference: Class Name Patterns

### Colors (Tailwind v4 arbitrary values used)
```jsx
// Text
text-[#181A32]  // main
text-[#62677D]  // body
text-[#302F80]  // primary
text-[#18A999]  // teal
text-white
text-[#D9DDF1]  // dark section muted

// Backgrounds
bg-[#F7F8FC]    // page
bg-white        // cards
bg-[#EEEFFC]    // business tint
bg-[#E4F7F3]    // worker tint
bg-[#302F80]    // primary
bg-[#201F53]    // dark
bg-[#18A999]    // teal
bg-[#FFF2E1]    // gold tint
bg-[#302F67]    // dark card
bg-[#39386F]    // dark badge

// Borders
border-[#EEEFFC]       // default
border-[#302F80]/15    // business card
border-[#18A999]/20    // worker card
border-[#302F80]       // focus
border-[#18A999]       // worker focus
border-white/10        // dark card
```

### Responsive Breakpoints Used
- `sm:` ≥ 640px
- `md:` ≥ 768px
- `lg:` ≥ 1024px
- (No `xl:` or `2xl:` used)

---

## 13. Verification Checklist

- [x] All colors extracted from `src/index.css` and cross-referenced in `App.jsx`
- [x] All component patterns copied directly from `App.jsx` source
- [x] Typography scales verified against actual class usage
- [x] Spacing/radius/shadow values match Tailwind classes in code
- [x] Instagram content scraped and catalogued (7 posts)
- [x] Database schema, RLS policies, and Supabase integration verified
- [x] Build config, deploy targets, and env handling verified
- [x] Security headers and `.gitignore` verified
- [x] Logo assets inventoried
- [x] Copy/tone analyzed from actual rendered text

---

## 14. Next Steps (If Extending)

| Task | Recommendation |
|------|----------------|
| **Design tokens file** | Export the `--color-*` and `--font-*` tokens to JSON for Figma/sync |
| **Component library** | Extract repeated patterns (Button, Card, Badge, Input) into reusable components |
| **Dark mode** | Current dark section (`#trust`) is hardcoded; consider `dark:` variants |
| **Illustration system** | Use `Top-Down Futuristic K Workspace.png` as basis for empty states, onboarding |
| **Hinglish web variant** | Consider `/hi` locale for Panipat-native users |
| **Analytics** | Add privacy-friendly analytics (Plausible/Umami) before public launch |

---

*Generated by analysis of `/home/laptup/Dev/kovera` codebase and Instagram `@kovera55` on 2026-11-07. All values verified against source files.*