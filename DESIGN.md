---
name: Kovera
description: Hyperlocal backup workforce network connecting local businesses and flexible workers, starting in Panipat
colors:
  ink: "#181A32"
  body: "#62677D"
  page: "#F7F8FC"
  line: "#EEEFFC"
  line-strong: "#8A8FA8"
  biz: "#302F80"
  biz-dark: "#201F53"
  biz-pale: "#EEEFFC"
  biz-body: "#3B3A6F"
  worker: "#0E7490"
  worker-dark: "#155E75"
  worker-bright: "#0891B2"
  worker-pale: "#E0F7FA"
  worker-glow: "#67E8F9"
  gold: "#F4B86A"
  gold-pale: "#FFF2E1"
  gold-ink: "#8F5B10"
  navy-soft: "#D9DDF1"
  danger: "#B91C1C"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.biz}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.biz-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-worker:
    backgroundColor: "{colors.worker}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-worker-hover:
    backgroundColor: "{colors.worker-dark}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.biz}"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  card-standard:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "24px 32px"
  card-business:
    backgroundColor: "{colors.biz-pale}"
    rounded: "{rounded.lg}"
    padding: "24px 32px"
  card-worker:
    backgroundColor: "{colors.worker-pale}"
    rounded: "{rounded.lg}"
    padding: "24px 32px"
  input-field:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: Kovera

## Overview

**Creative North Star: "The Civic Dispatch"**

The Civic Dispatch embodies reliable, trustworthy, civic-minded utility balancing municipal clarity with modern digital efficiency. Built for tier-2 commerce ecosystems like Panipat, where the pilot starts, Kovera’s visual world communicates institutional dependability without bureaucratic inertia, and marketplace speed without predatory gig-economy detachment.

The visual language is grounded in approachable, dependable, and civic optimism. Generous tactile forms (12px inputs, 16px buttons, 24px cards, and full-radius pill tags) convey welcoming neighborhood warmth. Dual-sided architectural balance grants equal visual weight and dignity to local business owners and ready-to-work individuals.

Kovera deliberately rejects the cold, sterile data grids of corporate gig apps and the hyperactive visual clutter of promotional classifieds (loud flashing badges, neon starbursts, abrasive discount stickers). Every surface maintains daylight readability, generous breathing room, and tranquil, high-contrast clarity.

**Key Characteristics:**
- **Dual-Sided Marketplace Symmetry:** Purposeful structural pairing of Deep Civic Indigo for business needs and Worker Cyan for worker opportunities.
- **Flat Tonal Layering:** Subtle tinted card surfaces (`biz-pale` and `worker-pale`) with 1px hairline borders. No shadows, gradients or decorative shapes.
- **Tactile Ergonomics:** Pill badges, friendly rounded containers and 44px-minimum controls make participation welcoming and frictionless on mobile screens.
- **High-Integrity Clarity:** Strict avoidance of hype, opaque tech terminology, or false urgency.

## Colors

The palette establishes a clear two-sided marketplace architecture: deep authoritative indigo anchors business operations, cyan activates workforce opportunity, warm gold highlights notes, and cool neutral grays maintain effortless readability.

JSX uses Tailwind token utilities defined in `@theme` in `src/index.css` (`bg-biz`, `text-worker`, `border-line`, `text-body`, and so on), never hex literals. The token names below are those utilities.

### Business (indigo)
- **Deep Civic Indigo** (`biz`, `#302F80`): Primary brand identifier. Used for the logo wordmark, business CTAs, business-side headings, selected business options and the default focus outline.
- **Midnight Indigo** (`biz-dark`, `#201F53`): Primary button hover, the navy sections and footer.
- **Pale Indigo** (`biz-pale`, `#EEEFFC`): Business container background.
- **Indigo Body** (`biz-body`, `#3B3A6F`): Body text on business surfaces.

### Worker (cyan)
- **Worker Cyan** (`worker`, `#0E7490`): Text and solid fills for the worker side: worker buttons, selected worker options, worker headings. White on it is 5.36:1, and it is 5.36:1 on white.
- **Deep Worker Cyan** (`worker-dark`, `#155E75`): Worker button hover, and body text on pale cyan.
- **Bright Worker Cyan** (`worker-bright`, `#0891B2`): Icons, the logo dot and accents only. Never text (3.68:1 on white).
- **Pale Cyan** (`worker-pale`, `#E0F7FA`): Worker surfaces. `worker` on it is 4.81:1.
- **Worker Glow** (`worker-glow`, `#67E8F9`): Accents on the dark navy sections only.

### Tertiary
- **Sunrise Gold** (`gold`, `#F4B86A`): Warm accent tone for small highlights.
- **Pale Gold** (`gold-pale`, `#FFF2E1`): Background tint for callout notes and gold pills.
- **Gold Ink** (`gold-ink`, `#8F5B10`): Text on pale gold.

### Neutral
- **Ink Navy** (`ink`, `#181A32`): High-contrast primary text color for headlines, titles, and interactive labels.
- **Slate Body** (`body`, `#62677D`): Body copy, helper text and placeholders (5.27:1 on the page background).
- **Off-White Canvas** (`page`, `#F7F8FC`): Global page background, a cool, glare-free backdrop.
- **Hairline** (`line`, `#EEEFFC`): Default 1px card borders.
- **Control Border** (`line-strong`, `#8A8FA8`): Borders of buttons, inputs and unselected options (3.19:1 on white).
- **Navy Soft** (`navy-soft`, `#D9DDF1`): Supporting text on the navy sections.
- **Danger** (`danger`, `#B91C1C`): Error messages.
- **White** (`#FFFFFF`): Card surfaces and form fields.

The logo image file (`src/assets/kovera-logo.*`) still contains the old teal. This is a known mismatch with the cyan palette and has not been changed.

### Named Rules
**The Dual-Sided Symmetry Rule.** Business elements must never use Worker Cyan as their primary fill, and worker elements must never use Civic Indigo as their primary fill. Color serves a structural role separating demand from supply, never a purely decorative one.

**The Daylight Safety Rule.** Dark backgrounds are restricted to the navy sections (`biz-dark`, `#201F53`) and the footer. General interactive forms and workflow surfaces operate on light canvas tones (`page`, white) to reinforce daytime safety and open commercial environments.

## Typography

**Font stack (all roles):** `system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif`

No web font is loaded. Earlier versions named Inter but never loaded it, so visitors always saw their system font; the stack now says so honestly. It also covers Hindi (Devanagari).

**Character:** A plain, robust system type setup engineered for instant legibility and fast loading on low-end phones. Weights range from extra-bold for headlines to regular for effortless mobile reading.

### Hierarchy
- **Display** (Extrabold 800, `clamp(2.25rem, 5vw, 3.75rem)` / 36–60px, line-height 1.15, letter-spacing -0.025em): Hero value proposition.
- **Headline** (Extrabold 800, `text-3xl sm:text-4xl` / 30–36px): Section headers (`h2`).
- **Title** (Bold 700, `1.25rem`–`1.5rem` / 20–24px, line-height 1.4): Card titles (`h3`).
- **Body** (Regular 400, `text-base` / 16px, up to 18px for section subheads, line-height 1.625): Core explanatory text. Max line length constrained to 65–75 characters.
- **Label** (Semibold 600, `text-sm` / 14px, sentence case): Field labels, pills, table and fact labels. No uppercase and no letter-spacing.

### Rules
- Body is `text-base` (16px). Nothing is smaller than 14px (`text-sm`), footnotes included.
- No uppercase labels and no letter-spaced labels; labels are sentence case.
- Weights: extrabold for h1/h2 and one key number per card, bold for h3, semibold for labels and buttons, regular otherwise.
- In Hindi, letter-spacing is reset to normal and heading line-height is 1.4 so matras are not clipped.

### Named Rules
**The Scannable Clarity Rule.** Headings must never exceed three lines on mobile screens. Subheadings must deliver immediate operational context rather than abstract marketing fluff.

## Layout

The spatial model relies on a responsive single-column mobile foundation that expands into a 1152px (`max-w-6xl`) centered grid on desktop (`max-w-4xl` for narrow sections).

- **Page structure:** `src/App.jsx` composes `src/sections/*.jsx`, built from the shared primitives in `src/ui.jsx`. Order: header, hero (with the example match card), WhatsApp/call band, waitlist form, "a 4-hour problem", shifts & rates, areas, for businesses / for workers, how it works, approach, questions, footer.
- **Container Bounds:** `max-w-6xl` centered with responsive horizontal gutters: `px-4` on mobile (16px), `px-6` on tablet (24px), and `px-8` on desktop (32px).
- **Vertical Rhythm:** `py-16 md:py-20` (64px, 80px from md up) padding for all top-level sections.
- **Section tones:** `page` (canvas), `white` (white with hairline top and bottom borders) and `navy` (the approach band: white cards, indigo top edge for business commitments, cyan for worker commitments).
- **Grid Models:**
  - 2-Column Marketplace Split: `grid grid-cols-1 lg:grid-cols-2 gap-8` for symmetric Business vs. Worker comparisons.
  - 3-Column Feature Cards: `grid grid-cols-1 md:grid-cols-3 gap-6` for step-by-step processes and role overviews.
- **Card and form padding:** `p-6` (24px) on mobile scaling to `p-8` (32px) from sm up.

## Elevation & Depth

Depth comes from tonal surface layering and hairline borders. Cards, forms and lists are flat at rest and stay flat on hover.

### Shadow Vocabulary
- **Cards, forms, lists:** None. 1px border (`border-line`) and surface tint only.
- **Floating WhatsApp button:** `shadow-lg`. It appears only after the hero, contact band and form have scrolled out of view.
- **Open mobile menu:** a shadow, since it overlays the page.

### Named Rules
**The Flat-At-Rest Rule.** All content cards, form containers, and lists remain flat, distinguished only by surface tint and 1px hairline strokes. The only shadows are on the floating WhatsApp button and the open mobile menu. No gradients, blurred background shapes or decorative animation.

## Shapes

The geometric vocabulary balances clean structural boundaries with friendly, approachable curves.

- **Pills (`rounded-full` / 9999px):** Status badges, category tags and count badges. A pill with a longer phrase that may run to two lines uses `rounded-2xl`.
- **Inputs & Controls (`rounded-xl` / 12px):** Text inputs, select dropdowns, textareas and segmented-control segments.
- **Buttons and choices (`rounded-2xl` / 16px):** Buttons, selectable options and the segmented-control container.
- **Cards & Enclosures (`rounded-3xl` / 24px):** Major content containers, form cards and informational panels.

## Components

All shared pieces live in `src/ui.jsx`: `Section`, `SectionHeading`, `Card`, `Button`, `Pill`, `Choice`, `Segmented`, `CheckItem`, `Fact`.

### Buttons
- **Shape:** 16px rounding (`rounded-2xl`), `min-h-11` (44px), `text-base font-semibold`, padding `px-5 py-2.5` (md) or `px-7 py-3.5` (lg).
- **Primary Business CTA (`biz`):** Background `biz`, white text, hover `biz-dark`.
- **Primary Worker CTA (`worker`):** Background `worker`, white text, hover `worker-dark`.
- **Outline / Outline worker:** White background, `biz` or `worker` text, 1px `line-strong` border; hover shifts the border to the side colour.
- **Soft worker:** `worker-pale` background, `worker-dark` text, hover to white.
- **White:** White background with `biz` text, for use on navy.
- **Text Link (`link-biz`, `link-worker`):** Side-colour text, underline on hover, no padding.

### Chips & Badges
- **Pill:** `text-sm font-semibold`, 1px border, padding `px-3 py-1`, sentence case. Tones: neutral, white, biz, worker, gold. Never shrinks to make room for a neighbour.
- **Segmented control:** Two or three options in one strip (white, `line-strong` border). The selected segment is solid `biz` or `worker` with white text.

### Selected state
One style everywhere (`Choice`, `Segmented`): solid side colour, white text and a check mark. `Choice` is a toggle button with `aria-pressed`; the compact variant puts the check as a corner badge.

### Cards & Containers
- **Standard Card:** White, 1px `line` border, radius 24px, padding 24px–32px.
- **Business Card:** `biz-pale`, border `biz/15`.
- **Worker Card:** `worker-pale`, border `worker/25`.

### Inputs & Fields
- **Container:** Border `line-strong`, radius 12px, at least 44px tall. Required fields are plain; optional fields are marked as optional.
- **Focus State:** One global outline (`2px solid biz`, 2px offset; white on dark sections). No per-element focus rings.
- **Labels:** Sentence case, `text-sm font-semibold`.

### Navigation
- **Header:** Solid white sticky bar with a bottom hairline. No backdrop blur. It wraps instead of overflowing at large text sizes, and stops sticking on very narrow screens with very large text. Holds the Hindi/English switch.
- **Logo:** Lowercase bold wordmark `kovera` in `biz` followed by a `worker-bright` dot.
- **Mobile menu:** Solid white, with a shadow while open.

### Confirmation
- **Success:** Shown inline in the form card, not in a modal.

### Motion
The only animation is a short fade (`animate-swap`) when chosen content swaps, plus the FAQ accordion. Both respect `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** maintain strict visual symmetry between Business and Worker content blocks across all comparison surfaces.
- **Do** use the Tailwind tokens from `src/index.css` (`bg-biz`, `text-worker`, `border-line`, `text-body`) instead of one-off hexes.
- **Do** keep cards flat at rest, with no shadows.
- **Do** use one selected style everywhere: solid side colour, white text, check mark.
- **Do** make every control at least 44px tall.
- **Do** keep informative text at 14px or larger; footnotes included.
- **Do** write labels in sentence case.
- **Do** frame all shifts around daylight hours (8 AM to 8 PM) and public commercial workspaces.
- **Do** write concise, scannable microcopy with explicit ₹0 worker guarantees.

### Don't:
- **Don't** use flashy discount banners, sticker badges, or countdown timers that evoke spam classifieds.
- **Don't** mix business indigo and worker cyan within the same component button or badge.
- **Don't** use `worker-bright` for text; it is for icons, the logo dot and accents.
- **Don't** use gradients, blurred background shapes, backdrop blur or decorative animation.
- **Don't** use uppercase or letter-spaced labels.
- **Don't** add per-element focus ring classes; the global outline is the only focus style.
- **Don't** use pure black (`#000000`) for text or backgrounds; always use Ink Navy (`ink`) or Midnight Indigo (`biz-dark`).
- **Don't** introduce dense, enterprise-style data tables without mobile card fallbacks.
- **Don't** hide or obscure the pilot disclaimer; transparency is core to building local trust.
