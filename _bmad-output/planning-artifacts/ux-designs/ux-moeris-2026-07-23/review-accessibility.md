---
name: Accessibility Review — Ma table
reviewed:
  - DESIGN.md
  - EXPERIENCE.md
persona: Mame Fatou (peu à l'aise avec le digital) — gros boutons, contraste, zéro jargon
date: 2026-07-23
status: draft
---

# Accessibility Review — Ma table

## Verdict

The spine gets its two headline calls right — `ink-primary` on `accent` for the primary button measures ~10.4:1 (the doc's own "never white text on yellow" instinct is correct and well-argued), and codifying `tap-target-min` (44px) as a first-class spacing token this early is genuinely rare. But the flat, shadow-less surface system leaves cards and secondary buttons almost indistinguishable from the page background (~1.05:1), and the avis star rating distinguishes active from inactive by color alone at a similarly invisible ~1.3:1 — both are real failure modes for an **outdoor terrace, sunlight-glare, low-digital-comfort** context, which is exactly the scenario this product is designed for. Contrast on primary text/CTAs is in good shape; component-boundary contrast, motion, and screen-reader semantics are not yet designed at all.

## Findings

### Critical

**C1 — Avis stars: no accessible name, and active/inactive rely on a ~1.3:1 color-only difference.**
`avis-stars.active` (`#E8C200`) vs `avis-stars.inactive` (`{colors.border}` `#E8E0B8`) computes to roughly **1.3:1** luminance contrast — two light, similar-brightness yellows next to each other. On a phone screen outdoors (this is a restaurant table scenario, plausibly in daylight/glare), a customer may not be able to tell how many stars are filled at a glance. Neither doc specifies an accessible name pattern (e.g. "Note : 3 sur 5 étoiles") or how the optional emoji is exposed to assistive tech — this is a straight WCAG 1.1.1 (non-text content) gap on the one rating mechanism the whole Avis flow depends on, and it's the exact component the review brief called out.
**Fix:** Distinguish active/inactive by *shape* (filled vs. outline star), not hue alone, and pick an inactive fill with real luminance separation from `accent` (target ≥3:1, ideally using `ink-secondary`-adjacent value, not another near-white yellow). Add a visually-hidden accessible name announcing the current/selected value, and decide the emoji's role (decorative → no alt exposed; meaningful → text alternative) before build.

**C2 — Cards and secondary buttons are nearly invisible against the page background.**
`{colors.surface-raised}` (`#FFF8DC`) vs `{colors.surface-base}` (`#FFFEF8`) — the only signal separating `card-menu-item`, `button-secondary`, and message bubbles from the page — computes to **~1.05:1**. `Elevation & Depth` explicitly rules out shadow on menu cards and buttons ("jamais sur les cartes menu ni les boutons"), leaving *only* this tint step to convey "this is a tappable card / button," and `{colors.border}` (the fallback for `button-secondary`'s outline) itself is only ~1.3:1 against the base. This directly undercuts the PRD's own "gros boutons, contraste" requirement for this persona, and will likely be worse in outdoor daylight where subtle tonal shifts wash out almost completely.
**Fix:** Either (a) darken `surface-raised` enough to clear ≥3:1 against `surface-base` (WCAG 1.4.11 non-text contrast for UI boundaries), or (b) reinstate a soft shadow specifically for `card-menu-item` and `button-secondary` — the `[ASSUMPTION]` in Elevation & Depth currently excludes exactly the two components that most need a non-color boundary cue.

### High

**H1 — No focus-visible token anywhere, despite Back-office being explicitly keyboard+mouse.**
`EXPERIENCE.md` states BO targets are "adaptées à un usage tablette/desktop avec clavier et souris," but `DESIGN.md` has zero focus-ring/focus-visible spec across colors, components, or shapes. Without a committed, high-contrast focus indicator (WCAG 2.4.7 / 2.4.11), staff tabbing through `BO Commandes` or `BO Menu` with a keyboard has no way to see where they are.
**Fix:** Add a `focus-ring` token — offset outline, ≥3:1 against both `surface-base` and `accent` — applied uniformly to every interactive element, client and BO.

**H2 — `chip-gout` and star hit-areas are not covered by `tap-target-min`.**
`button-primary`/`button-secondary` both inherit `minHeight: {spacing.tap-target-min}` (44px), but `chip-gout` — the exact component used for one-tap goût-cuisine reapplication on 2nd-visit "Mémoire," a flow built specifically for this persona — has no minimum size at all, and is likely to render pill-sized-to-text (~28–32px). The 1–5 star row has the same problem: five adjacent small icons with no committed hit-area padding invite mis-taps for someone the PRD itself flags as needing large targets.
**Fix:** Extend `tap-target-min` explicitly to `chip-gout` (via padding, not just visual height) and to each star's *tappable* zone (padding around a smaller visual glyph is fine — the hit area is what must hit 44px).

**H3 — No accessible-naming strategy exists anywhere in the spine.**
Beyond the stars (C1), nothing commits to: alt-text behavior for the four `illustration-panel` moments (decorative vs. meaningful), whether the Service catalog's four tiles (serveur/eau/addition/autre) are icon+label or icon-only, or how `status-pill-bo` communicates to screen readers beyond "label texte + couleur" (good instinct, stated once in `EXPERIENCE.md`, never turned into a rule that survives into component specs).
**Fix:** Add an "Accessible naming" subsection to `DESIGN.md` fixing: illustrations = `alt=""` (decorative, message copy already carries the meaning) unless a moment ever ships without accompanying text; Service tiles = icon **and** visible text label, never icon-only, non-negotiable given the persona; status pills = text label mandatory (already true in copy, needs to be a hard component rule, not a floating note).

### Medium

**M1 — Typography scale is locked to fixed px with no resize/zoom stance.**
All seven type tokens (`display` 28px → `meta` 12px) are specified as literal pixel values. Nothing addresses WCAG 1.4.4 (200% resize) or 1.4.10 (reflow) — if implementation ships literal `px` instead of `rem`, a user who bumps their phone's default font size gets nothing, and pill-shaped buttons with a fixed 44px `minHeight` risk clipping label text at high zoom. `meta` at 12px is also on the small side for a likely-older, low-digital-comfort persona, even bold.
**Fix:** Author the scale in `rem`, verify layouts (especially pill buttons and chips) reflow cleanly at 200% zoom without clipped or truncated text, and consider raising `meta`'s floor or guaranteeing it never carries sole meaning.

**M2 — `status-pill-bo` "reçue" text/background contrast is borderline (~4.9:1).**
`ink-secondary` (`#6B6B3A`) on `accent-soft` (`#FFF3A8`) lands just above the 4.5:1 AA floor with almost no safety margin — on a glare-prone tablet screen mid-service, that margin can effectively disappear.
**Fix:** Darken the text or the background slightly to bank a safer margin (target ≥5.5:1) rather than skating the legal minimum on a status a server needs to read at a glance.

**M3 — Pattern/illustration accent opacity has no numeric ceiling.**
`pattern-background.opacity` is specified qualitatively ("low, décoratif uniquement") with no number. That's a reasonable *intent*, but as more screens get built post-V1 by different hands, "low" will drift; there's currently nothing to catch a pattern that creeps behind body text and reduces legibility.
**Fix:** Commit a numeric max (e.g. ≤8–10% opacity) and a hard rule that pattern strokes never underlap a text block, not just "shouldn't."

### Low

**L1 — `{colors.border}` (~1.3:1 against `surface-base`) is fine today as a pure divider, but nothing not-yet-designed should inherit it as a sole boundary.**
The Contact form (phone/email opt-in) isn't specced visually yet, and `border` is the obvious default reach for "an input outline." At its current contrast that outline would be nearly invisible.
**Fix:** When the Contact form gets its own component entry, explicitly require a stronger-than-`border` outline (or a filled background) for input fields, and don't let `border`'s low-contrast rationale ("plus bas contraste lisible" for dividers) get silently reused for anything users need to *locate* rather than just visually segment.

**L2 — No font-loading fallback stance for Fredoka/Nunito Sans.**
Users land on this experience immediately after a QR scan, often on venue wifi of unknown quality. Nothing addresses FOIT/FOUT behavior or a system-font fallback stack, which matters more here than on a typical site because first paint is the "Pose-toi" welcome moment the whole brand voice is built around.
**Fix:** Note a `font-display: swap` + close-metric fallback stack decision alongside the typography tokens; low cost, avoids a blank-text flash at exactly the moment the product wants to feel warm.

## What's already strong

- **`ink-primary` on `accent` for the primary button (~10.4:1)** — the doc correctly identified and pre-empted the most likely real mistake (white text on yellow, ~1.7:1, called out explicitly as a Don't) and replaced it with a comfortably AAA-passing pairing.
- **`tap-target-min` (44px) as a named, reused spacing token**, applied to both button variants and explicitly reasoned from the persona ("cohérent avec l'exigence PRD « gros boutons, contraste »") rather than bolted on later.
- **Body text on background is exceptional** — `ink-primary` on `surface-base` measures ~17.8:1, and `chip-gout` text on `accent-soft` ~15.9:1. No normal-text contrast failures anywhere in the core reading experience.
- **`EXPERIENCE.md`'s Accessibility Floor already bakes in real behavioral commitments most specs skip**: BO status distinguishable by label *and* color (not color alone), no auto-playing or non-disablable illustration animation, Avis fully completable without a keyboard, Contact form shows one field at a time. These are the right calls — they just haven't been carried into `DESIGN.md` component tokens yet (see Gaps below).
- **Rejecting chat/free-text for Service and a mandatory comment field for Avis** removes typing entirely from the two places a low-digital-comfort user would otherwise be most likely to get stuck.
- **Photos, not illustrations, for the Menu** keeps the highest-stakes decision screen (what am I ordering) literal and recognizable rather than abstract.

## Gaps in the spines (a11y decisions not committed)

- Star rating and emoji avis: no accessible-name pattern, no ARIA role decision (radiogroup vs. button-group vs. slider), no shape distinction for active/inactive beyond color — **must be decided before build** (see C1).
- No `focus-ring` / keyboard-focus token exists anywhere, despite BO requiring keyboard support (H1).
- The Service catalog (4 tiles: serveur/eau/addition/autre) has **zero entry in `DESIGN.md`'s Components section** — it only exists as a behavioral row in `EXPERIENCE.md`'s Component Patterns table. No color, sizing, or icon+label commitment for a surface used every visit.
- No motion/animation section exists in `DESIGN.md` (duration, easing, reduced-motion fallback) even though `EXPERIENCE.md` already promises "no non-disablable illustration animation" — there's a behavioral commitment with no visual/technical spec to make it real.
- No numeric ceiling on pattern/illustration accent opacity (M3).
- Typography scale has no rem/zoom/reflow stance (M1).
- Contact form fields (input outline, label association, error state) are entirely unspecced, and the one available "outline" token (`border`) is too low-contrast to reuse as-is (L1).
- Dark mode is explicitly out of scope and stated as such (not a hidden gap) — but forced-colors / OS high-contrast mode isn't mentioned either way, worth a one-line explicit call rather than silence.
