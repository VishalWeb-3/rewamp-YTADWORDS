---
name: YouTube AdWords
description: A trusted storefront for social-growth and Google-ads services; one red buy signal on clean white and gray, rounded cards with soft lift.
colors:
  signal-red: "#E53935"
  signal-red-deep: "#C62828"
  google-blue: "#4285F4"
  google-blue-deep: "#3367D6"
  slate-ink: "#1E293B"
  confirm-green: "#22C55E"
  confirm-green-tint: "#DCFCE7"
  paper-white: "#FFFFFF"
  shelf-gray: "#F9FAFB"
  field-gray: "#F3F4F6"
  hairline-gray: "#E5E7EB"
  border-gray: "#D1D5DB"
  body-gray: "#4B5563"
  headline-ink: "#111827"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.33
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
  button-secondary:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.headline-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-google:
    backgroundColor: "{colors.google-blue}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "14px 32px"
  button-google-hover:
    backgroundColor: "{colors.google-blue-deep}"
  card-service:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "40px"
  input-field:
    backgroundColor: "{colors.shelf-gray}"
    textColor: "{colors.headline-ink}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  badge-pill:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.headline-ink}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
---

# Design System: YouTube AdWords

## Overview

**Creative North Star: "The Trusted Storefront"**

A familiar, high-street-clear online shop for a buyer who is wary of being burned. Surfaces are white and pale gray, type is one confident sans, and a single red is reserved for the thing you should press. Service pages swap in Google blue as a brand-colored wash so each product line feels distinct without changing the grammar. Nothing is cryptic: the layout is the same card-on-shelf pattern everywhere, so a visitor comparing packages never relearns the page.

The mood is friendly, confident, and promotional. Buttons are bold and obvious, cards are generously rounded and lift softly off the page, and badges and counters (delivered, active, last order) are allowed to push urgency. Promotion sits on top of calm structure, never in place of it.

**Key Characteristics:**
- White and gray surfaces; red is the buy signal, blue is the Google-service signal.
- One typeface (Inter), weight carries hierarchy.
- Rounded-2xl cards with soft shadow, scale up slightly on hover.
- Dotted gray backdrop on the home hero as the one decorative texture.
- Wordmark: plain black text with the "Ad" segment set in a solid red block.

## Colors

A neutral white-and-gray field with one red action color and one blue service color, plus green only for confirmation.

### Primary
- **Signal Red** (#E53935): The primary CTA fill, accent words in the hero headline ("Google Ads", "TikTok"), the "Ad" block in the wordmark, and input focus rings.
- **Signal Red Deep** (#C62828): Hover state for every red button. Also used directly as a fill on some buy buttons.

### Secondary
- **Google Blue** (#4285F4): The service-page brand color: primary buttons, headings, check badges and accent rules on Google review, ads and traffic pages.
- **Google Blue Deep** (#3367D6): Hover state for blue buttons.

### Tertiary
- **Confirm Green** (#22C55E): Check marks and the trust badge in the hero. Meaning is "verified/done", nothing else.
- **Confirm Green Tint** (#DCFCE7): Circle behind the green check.

### Neutral
- **Paper White** (#FFFFFF): Page background, cards, pills, the cart drawer.
- **Shelf Gray** (#F9FAFB): Alternate section background and input fill.
- **Field Gray** (#F3F4F6): Hero background under the dot pattern.
- **Hairline Gray** (#E5E7EB): Card and badge borders.
- **Border Gray** (#D1D5DB): Input borders, secondary-button border, hero dots.
- **Body Gray** (#4B5563): Supporting paragraphs and subtitles.
- **Headline Ink** (#111827): Headlines and primary text.
- **Slate Ink** (#1E293B): Dark panels on a few sections.

Service-specific brands (YouTube #FF0000, TikTok-style accents, Google green #34A853) appear per page through a `brandColor` prop and are not part of the core palette.

### Named Rules
**The One Buy Signal Rule.** Red marks the action to take and the words to remember. On any screen, a second red fill competing with the primary CTA is a bug.

**The Blue Is a Service Rule.** Google Blue belongs to Google-service pages as a whole-page accent. It does not appear next to red CTAs on the same page as a second action color.

## Typography

**Display Font:** Inter (with system-ui, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Mono Font:** none

**Character:** A single neutral grotesque used loudly at the top (bold, tight leading) and quietly below. Hierarchy comes from size and weight, never from a second family. Playfair Display is configured and loaded but barely used (two places); treat it as legacy, not part of the system.

### Hierarchy
- **Display** (700, 2rem to 3rem responsive, 1.25): Hero headline.
- **Headline** (700, 1.875rem to 2.25rem, 1.25): Section titles, centered above a short colored rule.
- **Title** (700, 1.5rem, 1.33): Subsection titles, cart header, card headings.
- **Body** (400, 1rem to 1.125rem, 1.625): Descriptions in `body-gray`. Keep to 65ch or narrower; hero copy sits in a ~36rem column.
- **Label** (600, 0.875rem to 1rem): Buttons, badges, metadata like "Last Order: 15 mins ago".

### Named Rules
**The Weight Is the Hierarchy Rule.** No second typeface. Step up with size and bold (700), step down with regular and gray.

## Layout

A centered column on a standard container (max-w 7xl on the home page, 6xl and 4xl on service and content pages), with 16px side gutters on mobile and 24px from the sm breakpoint. Home hero is two columns on large screens (copy left, product image right) and stacks on mobile. Sections run on 64-80px vertical padding. Card grids are one column on mobile and two on large screens with 32px gaps; list items inside cards use 16px spacing. Content pages and legal text sit in narrow single columns.

Spacing follows the Tailwind 4px scale; 8, 16, 24, 32 and 64px are the working steps.

## Elevation & Depth

Hybrid: layered tonal surfaces with soft shadows at rest. White cards sit on gray-50 or gray-100 shelves and carry `shadow-lg` or `shadow-md` by default; the cart drawer and modals use `shadow-2xl` over a 50% black scrim. Hover raises interactive cards by scaling to 1.02 rather than deepening the shadow.

### Shadow Vocabulary
- **Rest, card** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`): Service and benefit cards (Tailwind shadow-lg).
- **Rest, inline** (`0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`): Pills and small blocks inside cards (shadow-md).
- **Badge** (`0 1px 2px 0 rgb(0 0 0 / 0.05)`): The hero trust pill (shadow-sm).
- **Overlay** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): Cart drawer and dialogs (shadow-2xl).

### Named Rules
**The Lift, Not Glow Rule.** Depth is neutral black shadow only. No colored glows, and no blur-heavy translucency on content cards.

## Shapes

Soft and rounded. Cards are 16px (rounded-2xl) and the most common form; buttons and inputs are 8px (rounded-lg); inner tiles are 12px (rounded-xl); promotional panels go to 24px; badges, avatars and icon chips are fully round. Borders are 1px hairline gray on light surfaces, 2px on the secondary button. Check-mark icons sit in solid round chips filled with the page brand color.

## Components

### Buttons
- **Shape:** 8px radius (rounded-lg), 14px by 32px padding on desktop, slightly tighter on mobile.
- **Primary:** Signal Red fill, white 600-weight label. Hover to Signal Red Deep, 150ms color transition.
- **Secondary:** White fill, 2px Border Gray stroke, Headline Ink label; hover darkens the border and tints the fill to Shelf Gray.
- **Google / service:** Same shape in Google Blue, hover Google Blue Deep. Used on Google-service pages in place of red.
- **Neutral utility:** Field Gray fill, gray label (e.g. Logout).

### Cards / Containers
- **Corner Style:** 16px (rounded-2xl).
- **Background:** White on a gray-50 section.
- **Shadow Strategy:** Soft rest shadow (see Elevation); scale 1.02 on hover when the card is a link.
- **Border:** Usually none; hairline gray on pills and badges.
- **Internal Padding:** 32px, 40px on large screens.
- Benefit lists inside cards use brand-colored round check chips with 16px row spacing.

### Inputs / Fields
- **Style:** Shelf Gray fill, 1px Border Gray stroke, 8px radius, 12px by 16px padding, Headline Ink text.
- **Focus:** Outline removed, 2px Signal Red ring, border made transparent.
- **Error / Disabled:** Not consistently styled in the code; define before adding new forms.

### Navigation
- Text wordmark at left: black "YouTube" and "words" with "Ad" in a red block, bold and tight tracking, scaling from base to xl size at the sm breakpoint. Header carries cart and account entry points.

### Trust Pill (signature)
A white pill with a hairline border and soft shadow, holding a green check chip and one line of proof text. It sits above the hero headline. Its numbers come from CMS content and must not be invented.

### Cart Drawer
Right-anchored white panel (full width on mobile, max-w-md from sm), 24px padding, hairline-divided header, centered empty state with a large light-gray icon and a red primary action.

## Do's and Don'ts

### Do:
- **Do** use Signal Red (#E53935) for the single primary action per view, with hover to #C62828.
- **Do** keep service-page accents in one brand color per page, passed through the same card layout.
- **Do** use Inter at 700 for headlines and 400 for body in `body-gray`.
- **Do** put cards on a gray-50 shelf with `rounded-2xl` and `shadow-lg`.
- **Do** keep touch targets at least 44px tall on mobile buttons.

### Don't:
- **Don't** introduce a second action color beside the page's primary CTA.
- **Don't** add a second typeface; Playfair Display is legacy.
- **Don't** use colored glows, gradients on text, or heavy translucency on content cards.
- **Don't** invent figures in the trust pill, counters or testimonials; render only content supplied by the CMS.
- **Don't** hardcode hex in markup when a token exists (`brand-red`, `brand-green`); several `#C62828` and `#4285F4` literals should be consolidated.
