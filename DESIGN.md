---
name: Kovera
description: Hyperlocal backup workforce network connecting local businesses and flexible workers, starting in Panipat
colors:
  ink: "#181A32"
  body: "#62677D"
  page: "#F7F8FC"
  line: "#EEEFFC"
  line-strong: "#80859F"
  biz: "#302F80"
  biz-dark: "#201F53"
  biz-pale: "#EEEFFC"
  biz-body: "#3B3A6F"
  worker: "#0E7490"
  worker-dark: "#155E75"
  worker-bright: "#0891B2"
  worker-pale: "#E0F7FA"
  worker-glow: "#67E8F9"
  whatsapp: "#0E6E63"
  whatsapp-dark: "#094841"
  whatsapp-pale: "#E4F7F3"
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
    fontSize: "clamp(1.375rem, 4vw, 2.25rem)"
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
- **Flat Tonal Layering:** Subtle tinted card surfaces (`biz-pale` and `worker-pale`) with 1px hairline borders. Flat at rest; a shadow appears only as a response to hover, or on things that float. No decorative shapes.
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

### WhatsApp (green)
Used only on things that open WhatsApp: the contact band's button and icon tile, the floating button, the button on the form's confirmation, and the WhatsApp link under the questions. It is not a side colour and never marks worker content.
- **WhatsApp Green** (`whatsapp`, `#0E6E63`): Fills and link text. White on it is 6.12:1, and it is 6.12:1 on white.
- **Deep WhatsApp Green** (`whatsapp-dark`, `#094841`): Hover.
- **Pale WhatsApp Green** (`whatsapp-pale`, `#E4F7F3`): The icon tile, and the hover fill of the outlined variant. The icon on it is `whatsapp` (5.51:1).

### Tertiary
- **Sunrise Gold** (`gold`, `#F4B86A`): Warm accent tone for small highlights.
- **Pale Gold** (`gold-pale`, `#FFF2E1`): Background tint for callout notes and gold pills.
- **Gold Ink** (`gold-ink`, `#8F5B10`): Text on pale gold.

### Neutral
- **Ink Navy** (`ink`, `#181A32`): High-contrast primary text color for headlines, titles, and interactive labels.
- **Slate Body** (`body`, `#62677D`): Body copy, helper text and placeholders (5.27:1 on the page background).
- **Off-White Canvas** (`page`, `#F7F8FC`): Global page background, a cool, glare-free backdrop.
- **Hairline** (`line`, `#EEEFFC`): Default 1px card borders.
- **Control Border** (`line-strong`, `#80859F`): Borders of buttons, inputs and unselected options (3.64:1 on white, 3.43:1 on the page, 3.18:1 on pale indigo, 3.27:1 on pale cyan).
- **Increased contrast:** when the visitor's system asks for more contrast (`prefers-contrast: more`), card hairlines take the control border's colour and control borders go to `ink`.
- **Navy Soft** (`navy-soft`, `#D9DDF1`): Supporting text on the navy sections.
- **Danger** (`danger`, `#B91C1C`): Error messages.
- **White** (`#FFFFFF`): Card surfaces and form fields.

The logo image file (`src/assets/kovera-logo.*`) still contains the old teal. This is a known mismatch with the cyan palette and has not been changed.

### Named Rules
**Side colours are never decoration.** As a side marker (text, fills, icon tiles, card tints), cyan appears only on worker content. Content that speaks to both sides (the tagline, the how-it-works step numbers, the desktop link underline) uses indigo, which is also the brand colour. Four small brand accents are cyan without marking a side: the logo dot, the middle of the scroll progress bar, the `worker-glow` arrow and cross marks on navy, and the text-selection tint. A promise keeps one colour wherever it appears: "daytime, public workplaces" is a worker commitment, so it is cyan in the hero and in the approach band.

**The Dual-Sided Symmetry Rule.** Business elements must never use Worker Cyan as their primary fill, and worker elements must never use Civic Indigo as their primary fill. Color serves a structural role separating demand from supply, never a purely decorative one.

**The Daylight Safety Rule.** Dark backgrounds are restricted to the navy sections (`biz-dark`, `#201F53`) and the footer. General interactive forms and workflow surfaces operate on light canvas tones (`page`, white) to reinforce daytime safety and open commercial environments.

## Typography

**Font stack (all roles):** `system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Devanagari', 'Nirmala UI', sans-serif`

No web font is loaded. Earlier versions named Inter but never loaded it, so visitors always saw their system font; the stack now says so honestly. It also covers Hindi (Devanagari).

**Character:** A plain, robust system type setup engineered for instant legibility and fast loading on low-end phones. Weights range from extra-bold for headlines to regular for effortless mobile reading.

### Hierarchy
- **Display** (Extrabold 800, 24px to 56px in steps, line-height 1.15, letter-spacing -0.025em): Hero value proposition. Sizes per width are listed under Hero below.
- **Headline** (Extrabold 800, 22px, 24px from 360px wide, 36px from 640px): Section headers (`h2`). Always smaller than the hero headline at the same width.
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

The spatial model relies on a responsive single-column mobile foundation that expands into a 1280px (`max-w-7xl`) centered grid on desktop (`max-w-4xl` for narrow sections). The header is wider still (`max-w-[100rem]`) and 80px tall from lg up.

- **Page structure:** `src/App.jsx` composes `src/sections/*.jsx`, built from the shared primitives in `src/ui.jsx`. Order: header, hero (with the example match card), WhatsApp/call band, waitlist form, "a 4-hour problem", what a shift looks like, areas, for businesses / for workers, how it works, approach, questions, footer.
- **Container Bounds:** `max-w-7xl` centered with responsive horizontal gutters: `px-4` on mobile (16px), `px-6` on tablet (24px), and `px-8` on desktop (32px).
- **Vertical Rhythm:** `py-16 md:py-24` (64px on phones, 96px from md up) for top-level sections; the three emphasis sections (what a shift looks like, for businesses / for workers, approach) take `lg:py-28` (112px). The hero is `md:pt-20 md:pb-32`. Section headings sit `md:mb-14` above their content.
- **Section tones:** `page` (canvas), `white` (white with hairline top and bottom borders) and `navy` (the approach band: white cards, indigo top edge for business commitments, cyan for worker commitments).
- **Grid Models:**
  - 2-Column Marketplace Split: `grid grid-cols-1 lg:grid-cols-2 gap-8` for symmetric Business vs. Worker comparisons.
  - 3-Column Feature Cards: `grid grid-cols-1 md:grid-cols-3 gap-6` for step-by-step processes and role overviews.
- **Card and form padding:** `p-6` (24px) on mobile, `p-8` (32px) from sm, `p-10` (40px) from lg. Card grids use a 32px gap from lg.

## Elevation & Depth

Depth comes from tonal surface layering and hairline borders. Cards, forms and lists are flat, and they do not react to hover because they cannot be clicked. Elevation is a response from things that can: filled buttons lift slightly and gain a shadow on hover.

### Shadow Vocabulary
- **Cards, forms, lists:** None, at rest or on hover. 1px border (`border-line`) and surface tint only.
- **Filled buttons on hover:** rise 2px with `shadow-md`.
- **Floating WhatsApp button:** `shadow-lg`, `shadow-xl` on hover. It appears only after the hero, contact band and form have scrolled out of view. It is a 56px circle (icon only) until the window is 1600px wide, where the label fits beside the content column instead of on top of it.
- **Open mobile menu:** `shadow-xl`, since it overlays the page.

### Named Rules
**The Flat-At-Rest Rule.** All content cards, form containers, and lists are flat at rest, distinguished only by surface tint and 1px hairline strokes. Shadows are reserved for hovered buttons and for the two things that float: the WhatsApp button and the open mobile menu. No blurred background shapes. The one gradient is the scroll progress bar in the header.

## Shapes

The geometric vocabulary balances clean structural boundaries with friendly, approachable curves.

- **Pills (`rounded-full` / 9999px):** Status badges, category tags and count badges. A pill with a longer phrase that may run to two lines uses `rounded-2xl`.
- **Inputs & Controls (`rounded-xl` / 12px):** Text inputs, select dropdowns, textareas and segmented-control segments.
- **Buttons and choices (`rounded-2xl` / 16px):** Buttons, selectable options and the segmented-control container.
- **Cards & Enclosures (`rounded-3xl` / 24px):** Major content containers, form cards and informational panels.

## Components

All shared pieces live in `src/ui.jsx`: `Section`, `SectionHeading`, `Card`, `Button`, `Pill`, `Choice`, `Segmented`, `CheckItem`, `Fact`.

### Buttons
- **Shape:** 16px rounding (`rounded-2xl`), `min-h-11` (44px), `text-base font-semibold`, padding `px-5 py-2.5` (md) or `px-8 py-4` (lg).
- **Primary Business CTA (`biz`):** Background `biz`, white text, hover `biz-dark`.
- **Primary Worker CTA (`worker`):** Background `worker`, white text, hover `worker-dark`.
- **WhatsApp (`whatsapp`, `outline-whatsapp`, `link-whatsapp`):** WhatsApp green, only on things that open WhatsApp.
- **Hover:** filled buttons darken, rise 2px and gain `shadow-md`; a trailing arrow nudges 3px forward. All buttons press in slightly on tap.
- **Outline / Outline worker:** White background, `biz` or `worker` text, 1px `line-strong` border; hover shifts the border to the side colour and fills with that side's pale tint.
- **Soft worker:** `worker-pale` background, `worker-dark` text, hover to white.
- **White:** White background with `biz` text, for use on navy.
- **Text Link (`link-biz`, `link-worker`, `link-whatsapp`):** Coloured text, underline on hover, no padding.

### Chips & Badges
- **Pill:** `text-sm font-semibold`, 1px border, padding `px-3 py-1`, sentence case. Tones: neutral, white, biz, worker, gold. Never shrinks to make room for a neighbour.
- **Segmented control:** Two or three options in one strip (white, `line-strong` border). The selected segment is solid `biz` or `worker` with white text.

### Selected state
One style everywhere (`Choice`, `Segmented`): solid side colour and white text. A `Choice` also shows a check mark (it is a toggle button with `aria-pressed`; the compact variant puts the check as a corner badge). A `Segmented` strip shows the selection by its fill alone, since the strip itself says only one can be chosen. Secondary text inside a selected option is full white, not a tint (white at 85% on worker cyan is 4.35:1).

### Cards & Containers
- **Standard Card:** White, 1px `line` border, radius 24px, padding 24px–32px.
- **Business Card:** `biz-pale`, border `biz/15`.
- **Worker Card:** `worker-pale`, border `worker/25`.

### Inputs & Fields
- **Container:** Border `line-strong`, radius 12px, at least 44px tall. Required fields are plain. The free-text fields that can be skipped are marked optional; State and Area or market can also be left empty but are deliberately not labelled optional. Placeholders describe the field ("Your city") and never show a real name, place or number.
- **Focus State:** One global outline (`2px solid biz`, 2px offset; white on dark sections). No per-element focus rings.
- **Labels:** Sentence case, `text-sm font-semibold`.

### Navigation
- **Header:** Solid white sticky bar with a bottom hairline. No backdrop blur. It wraps instead of overflowing at large text sizes, and stops sticking on very narrow screens with very large text. Holds the Hindi/English switch.
- **Scroll progress bar:** A 3px bar along the header's bottom edge that fills as the page scrolls, in a `biz` → `worker-bright` → `gold` gradient.
- **Skip link:** The first tab stop is "Skip to content", off screen until it has keyboard focus.
- **Desktop links:** `ink`, turning `biz` on hover with a `biz` underline that grows from the left.
- **Logo:** Lowercase bold wordmark `kovera` in `biz` followed by a `worker-bright` dot. On hover the emblem and the dot grow slightly.
- **Menu button (below 1280px):** Three bars that fold into a cross; pale indigo while open.
- **Mobile menu:** Solid white, slides down from under the header and fades in, with a shadow while open. The page behind dims, and a tap on it closes the menu. The header itself stays clear.

### Confirmation
- **Success:** Shown inline in the form card, not in a modal.

### Hero
- **Layout:** From 1024px up, two columns that start at the top: the pilot pill, headline, tagline, intro, buttons and trust row on the left (7fr), the example match card on the right (5fr), level with the headline. Below 1024px everything stacks in that order.
- **Headline:** From 1024px up it flows as one sentence and wraps within the left column (44px, then 56px from 1280px). Below that it takes two lines (lead, then accent) so it stays larger than the section headings: 24px to 30px on phones, 40px from 640px, 44px from 768px. Sizes are in rem and nothing is `nowrap`, so enlarged text wraps instead of overflowing.
- **Tagline:** One line from 320px up.
- **Trust row:** A plain wrapping row of icon + text on phones and tablets. From 1024px up, flat chips (`rounded-xl`, `page` fill, `line` border, small pale icon tile) in a wrapping row under a hairline.

### Waitlist
- **Before a side is chosen:** One wide card (`max-w-5xl`) with an indigo band on top (a one-line description and "Free during the pilot"), then the two paths side by side, each with its side pill, a title, a short description, two check items and a full-width join button in its own colour. Below 768px the paths stack.
- **After a side is chosen:** The card gives way to the narrow column (`max-w-2xl`): the segmented "I need workers / I want work" switch, then that side's form. Focus moves to the form heading.

### Motion
Every animation is feedback for something the visitor did, lasts 150 to 300ms, and is switched off under `prefers-reduced-motion`:
- **Scroll:** the header's progress bar.
- **Hover:** buttons, desktop links and the logo, as described above (pointer devices only). Cards do not react: they are not clickable.
- **Menu:** the button folds into a cross, the menu slides down and the page dims.
- **Floating WhatsApp button:** pops in once the form has scrolled away; lifts on hover, presses in on tap.
- **Choices:** a short fade (`animate-swap`) when chosen content swaps, plus the FAQ accordion.

Nothing animates on its own: no looping, floating or pulsing elements.

## Do's and Don'ts

### Do:
- **Do** maintain strict visual symmetry between Business and Worker content blocks across all comparison surfaces.
- **Do** use the Tailwind tokens from `src/index.css` (`bg-biz`, `text-worker`, `border-line`, `text-body`) instead of one-off hexes.
- **Do** keep cards flat; only things that can be clicked react to hover.
- **Do** use one name for each side everywhere: "I need workers" and "I want work" on the join buttons and in the form's chooser.
- **Do** use one selected style everywhere: solid side colour, white text, check mark.
- **Do** make every control at least 44px tall.
- **Do** keep informative text at 14px or larger; footnotes included.
- **Do** write labels in sentence case.
- **Do** frame all shifts around daylight hours (8 AM to 8 PM) and public commercial workspaces.
- **Do** write concise, scannable microcopy with explicit no-fee guarantees for workers, in words.

### Don't:
- **Don't** show pay figures, rupee amounts or earnings estimates until the pilot has real numbers; say that pay is agreed and shown before every shift.
- **Don't** use flashy discount banners, sticker badges, or countdown timers that evoke spam classifieds.
- **Don't** mix business indigo and worker cyan within the same component button or badge.
- **Don't** use `worker-bright` for text; it is for icons, the logo dot and accents.
- **Don't** use blurred background shapes, backdrop blur, or animation that runs on its own. The scroll progress bar is the only gradient.
- **Don't** use the WhatsApp green for anything that does not open WhatsApp.
- **Don't** use uppercase or letter-spaced labels.
- **Don't** add per-element focus ring classes; the global outline is the only focus style.
- **Don't** use pure black (`#000000`) for text or backgrounds; always use Ink Navy (`ink`) or Midnight Indigo (`biz-dark`).
- **Don't** introduce dense, enterprise-style data tables without mobile card fallbacks.
- **Don't** hide or obscure the pilot disclaimer; transparency is core to building local trust.
