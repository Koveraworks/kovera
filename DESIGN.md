---
name: Kovera
description: Hyperlocal backup workforce network connecting local businesses and flexible workers in Panipat
colors:
  primary: "#302F80"
  primary-dark: "#201F53"
  secondary: "#18A999"
  secondary-hover: "#128679"
  primary-light: "#EEEFFC"
  secondary-light: "#E4F7F3"
  accent: "#F4B86A"
  accent-light: "#FFF2E1"
  text-main: "#181A32"
  text-body: "#62677D"
  bg-page: "#F7F8FC"
  surface-card: "#FFFFFF"
  border-subtle: "#EEEFFC"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
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
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  button-worker:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface-card}"
    rounded: "{rounded.sm}"
    padding: "16px 32px"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "16px 32px"
  card-standard:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.lg}"
    padding: "32px 32px"
  card-business:
    backgroundColor: "{colors.primary-light}"
    rounded: "{rounded.lg}"
    padding: "32px 40px"
  card-worker:
    backgroundColor: "{colors.secondary-light}"
    rounded: "{rounded.lg}"
    padding: "32px 40px"
  input-field:
    backgroundColor: "{colors.bg-page}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
---

# Design System: Kovera

## Overview

**Creative North Star: "The Civic Dispatch"**

The Civic Dispatch embodies reliable, trustworthy, civic-minded utility balancing municipal clarity with modern digital efficiency. Built for Panipat's tier-2 commerce ecosystem, Kovera’s visual world communicates institutional dependability without bureaucratic inertia, and marketplace speed without predatory gig-economy detachment.

The visual language is grounded in approachable, dependable, and civic optimism. Generous tactile forms (12px inputs, 16px buttons, 24px cards, and full-radius pill tags) convey welcoming neighborhood warmth. Dual-sided architectural balance grants equal visual weight and dignity to local business owners and ready-to-work individuals.

Kovera deliberately rejects the cold, sterile data grids of corporate gig apps and the hyperactive visual clutter of promotional classifieds (loud flashing badges, neon starbursts, abrasive discount stickers). Every surface maintains daylight readability, generous breathing room, and tranquil, high-contrast clarity.

**Key Characteristics:**
- **Dual-Sided Marketplace Symmetry:** Purposeful structural pairing of Deep Civic Indigo for business needs and Kinetic Worker Teal for worker opportunities.
- **Tonal Layering at Rest:** Subtle tinted card surfaces (`#EEEFFC` and `#E4F7F3`) with 1px hairline borders; elevation manifests as a response to interaction rather than ambient decoration.
- **Playful & Tactile Ergonomics:** Pill badges, friendly rounded containers, and gentle spring micro-interactions make participation welcoming and frictionless on mobile screens.
- **High-Integrity Clarity:** Strict avoidance of hype, opaque tech terminology, or false urgency.

## Colors

The palette establishes a clear two-sided marketplace architecture: deep authoritative indigo anchors business operations, kinetic teal activates workforce opportunity, warm gold highlights transitional learning, and cool neutral grays maintain effortless readability.

### Primary
- **Deep Civic Indigo** (`#302F80`): Primary brand identifier. Used for core navigation logo, primary business CTAs, business-side headers, and active business tabs. Conveys steadfast local dependability.
- **Midnight Indigo** (`#201F53`): Dark anchor tone. Used for primary button hover states, footer background, and deep contrast trust surfaces.

### Secondary
- **Kinetic Worker Teal** (`#18A999`): Worker-side primary accent. Used for worker registration buttons, active worker tab toggles, affirmative status icons, success checkmarks, and subheading emphasis. Conveys immediate positive opportunity.
- **Deep Worker Teal** (`#128679`): Worker button hover and active state.

### Tertiary
- **Sunrise Gold** (`#F4B86A`): Warm accent tone. Used specifically for "Learning as we go" phase badges and transitional discovery highlights.
- **Pale Gold** (`#FFF2E1`): Background tint for educational step counters and pilot callout notes.

### Neutral
- **Ink Navy** (`#181A32`): High-contrast primary text color for headlines, titles, and interactive labels.
- **Slate Body** (`#62677D`): Secondary text for explanatory body copy, helper text, and subtle icons.
- **Pale Indigo** (`#EEEFFC`): Business container background, default 1px card borders, and input strokes.
- **Pale Teal** (`#E4F7F3`): Worker container background, location pill background, and positive badge surfaces.
- **Off-White Canvas** (`#F7F8FC`): Global page background, providing a cool, glare-free backdrop.
- **Pure White** (`#FFFFFF`): Primary elevated card surface, dropdown backgrounds, and form fields.

### Named Rules
**The Dual-Sided Symmetry Rule.** Business elements must never use Worker Teal as their primary fill, and worker elements must never use Civic Indigo as their primary fill. Color serves a structural role separating demand from supply, never a purely decorative one.

**The Daylight Safety Rule.** Deep dark-mode backgrounds are restricted exclusively to the institutional trust section (`#201F53`) and footer. General interactive forms and workflow surfaces must always operate on light canvas tones (`#F7F8FC`, `#FFFFFF`) to reinforce daytime safety and open commercial environments.

## Typography

**Display Font:** Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif  
**Body Font:** Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif  
**Label/Mono Font:** Inter (uppercase with 0.05em wide letter spacing)

**Character:** A singular, robust neo-grotesque type system engineered for instant legibility across all screen sizes and viewport densities. Weights range from extra-bold for authoritative headlines to relaxed regular for effortless mobile reading.

### Hierarchy
- **Display** (Extrabold 800, `clamp(2.25rem, 5vw, 3.75rem)` / 36–60px, line-height 1.15, letter-spacing -0.025em): Reserved for hero section value proposition and primary campaign banners.
- **Headline** (Extrabold 800, `clamp(1.875rem, 4vw, 2.25rem)` / 30–36px, line-height 1.25, letter-spacing -0.02em): Major section headers (`H2`).
- **Title** (Bold 700, `1.25rem`–`1.5rem` / 20–24px, line-height 1.4): Card titles, feature headlines, and modal titles.
- **Body** (Regular 400, `1rem`–`1.125rem` / 16–18px, line-height 1.625): Core explanatory text and paragraph copy. Max line length constrained to 65–75 characters for scannability.
- **Label** (Bold 700, `0.75rem` / 12px, letter-spacing 0.05em, uppercase): Overline section badges, category chips, table headers, and form field labels.

### Named Rules
**The Scannable Clarity Rule.** Headings must never exceed three lines on mobile screens. Subheadings must deliver immediate operational context rather than abstract marketing fluff.

## Layout

The spatial model relies on a responsive single-column mobile foundation that expands into a 1280px (`max-w-7xl`) centered grid on desktop.

- **Container Bounds:** `max-w-7xl` (1280px) centered with responsive horizontal gutters: `px-4` on mobile (16px), `px-6` on tablet (24px), and `px-8` on desktop (32px).
- **Vertical Rhythm:** Consistent `py-20` (80px) padding for all top-level sections, creating generous breathing space that prevents cognitive overload.
- **Grid Models:**
  - 2-Column Marketplace Split: `grid grid-cols-1 lg:grid-cols-2 gap-8` (32px gap) for symmetric Business vs. Worker comparisons.
  - 3-Column Feature Cards: `grid grid-cols-1 md:grid-cols-3 gap-6` (24px gap) for step-by-step processes and role overviews.
- **Form Card Padding:** `p-6` (24px) on mobile scaling to `p-10` (40px) on desktop to provide comfort and focus during data entry.

## Elevation & Depth

Depth is established through tonal surface layering and hairline borders rather than heavy ambient drop shadows. At rest, cards sit flush against the canvas. Surfaces elevate into physical space primarily in response to user intent (hover, active focus, modal display).

### Shadow Vocabulary
- **Resting Card:** No shadow or micro-shadow (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`) with a crisp 1px border (`border: 1px solid #EEEFFC`).
- **Interactive Hover:** (`box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` / `shadow-lg`): Smoothly lifts interactive cards and primary buttons on pointer hover.
- **Floating Modal / Drawer:** (`box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25)` / `shadow-2xl`): Full-depth elevation for confirmation modals and the mobile navigation overlay.

### Named Rules
**The Flat-At-Rest Rule.** All content cards, form containers, and lists must remain flat at rest, distinguished only by surface tint and 1px hairline strokes. Shadows are reserved for state transitions and foreground interruptions.

## Shapes

The geometric vocabulary balances clean structural boundaries with friendly, approachable curves.

- **Pills (`rounded-full` / 9999px):** Used for location status badges, category tags, count badges, and indicator dots.
- **Inputs & Controls (`rounded-xl` / 12px):** Used for text inputs, select dropdowns, textareas, and tab switchers. Provides a modern, finger-friendly tap target.
- **Buttons (`rounded-2xl` / 16px):** Primary hero buttons and callout CTAs use generous 16px rounding for a confident, welcoming tactile response.
- **Cards & Enclosures (`rounded-3xl` / 24px):** Major content containers, form cards, and informational panels use 24px corner radii, softening rectangular blocks into cohesive modules.

## Components

### Buttons
- **Shape:** Gently rounded corners (12px for standard inputs/worker buttons, 16px for hero CTAs).
- **Primary Business CTA:** Background Deep Civic Indigo (`#302F80`), text Pure White (`#FFFFFF`), padding 16px 32px (`px-8 py-4`), font-weight 600. Includes inline arrow icon shifting 4px right on group hover.
- **Primary Worker CTA:** Background Kinetic Worker Teal (`#18A999`), text Pure White (`#FFFFFF`), full width, padding 16px 32px (`py-4`), font-weight 700.
- **Secondary (Outline):** Background Pure White (`#FFFFFF`), text Deep Civic Indigo (`#302F80`), border 2px solid `#EEEFFC`, padding 16px 32px (`px-8 py-4`). Hover shifts border to 20% brand indigo with light page tint.
- **Text Link:** Deep Civic Indigo (`#302F80`) with trailing arrow icon; spacing expands from 8px to 12px on hover.

### Chips & Badges
- **Location Status Pill:** Background Pale Teal (`#E4F7F3`), border 1px solid `rgba(24, 169, 153, 0.2)`, text Deep Civic Indigo (`#302F80`), text size 12px, font-weight 700, uppercase with wide letter spacing.
- **Category & Role Badges:** Background Pale Teal (`#E4F7F3`) or Pale Indigo (`#EEEFFC`), text color matched to category accent, rounded-full, padding 4px 12px.
- **Tab Switcher:** Pill-style segmented control container (`bg-[#F7F8FC]` with 1px `#EEEFFC` border). Active tab lifts with full contrast background (`#302F80` for business, `#18A999` for worker) and white text.

### Cards & Containers
- **Standard Card:** Background Pure White (`#FFFFFF`), border 1px solid `#EEEFFC`, radius 24px (`rounded-3xl`), padding 24px–32px.
- **Business Highlight Card:** Background Pale Indigo (`#EEEFFC`), border 1px solid `rgba(48, 47, 128, 0.15)`, radius 24px.
- **Worker Highlight Card:** Background Pale Teal (`#E4F7F3`), border 1px solid `rgba(24, 169, 153, 0.20)`, radius 24px.

### Inputs & Fields
- **Container:** Background Canvas Off-White (`#F7F8FC`), border 1px solid `#EEEFFC`, radius 12px (`rounded-xl`), padding 12px 16px, text size 14px.
- **Focus State:** 1px border transition to Deep Civic Indigo (`#302F80`) for business forms or Kinetic Worker Teal (`#18A999`) for worker forms.
- **Labels:** Uppercase bold (`text-xs font-bold text-[#181A32] uppercase mb-1.5`).

### Navigation
- **Header:** Sticky top bar (`h-20`), background `rgba(255, 255, 255, 0.90)` with `backdrop-blur-md` and 1px bottom border (`#EEEFFC`).
- **Logo:** Lowercase bold wordmark `kovera` in Deep Civic Indigo (`#302F80`) followed by a vibrant Kinetic Teal accent dot (`#18A999`).
- **Desktop Links:** Ink Navy (`#181A32`) transitioning to Kinetic Teal (`#18A999`) on hover.
- **Mobile Drawer:** Slides down smoothly (`animate-slide-down`) with solid white background and subtle bottom shadow.

### Modals & Notifications
- **Toast / Confirmation Modal:** Centered dialog (`max-w-md`), Pure White card with 16px radius, `shadow-2xl`, overlaid on `rgba(0, 0, 0, 0.5)` with `backdrop-blur-xs`. Includes 48px round Pale Teal icon circle with bright teal checkmark.

## Do's and Don'ts

### Do:
- **Do** maintain strict visual symmetry between Business and Worker content blocks across all comparison surfaces.
- **Do** use exact semantic token references (`--color-brand-primary`, `--color-brand-teal`) instead of arbitrary one-off color hexes.
- **Do** keep cards flat at rest and let elevation express interaction or foreground focus.
- **Do** frame all shifts around daylight hours (8 AM to 8 PM) and public commercial workspaces.
- **Do** write concise, scannable microcopy with explicit ₹0 worker guarantees.

### Don't:
- **Don't** use flashy discount banners, sticker badges, or countdown timers that evoke spam classifieds.
- **Don't** mix business indigo and worker teal within the same component button or badge.
- **Don't** use pure black (`#000000`) for text or backgrounds; always use Ink Navy (`#181A32`) or Midnight Indigo (`#201F53`).
- **Don't** introduce dense, enterprise-style data tables without mobile card fallbacks.
- **Don't** hide or obscure the Phase 0 pilot disclaimer; transparency is core to building local trust.
