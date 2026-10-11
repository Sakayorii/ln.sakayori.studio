---
name: Sakayori Studio
description: Ink-violet library navigation and a reader whose appearance belongs to the reader.
colors:
  ink: "#242331"
  paper: "#f7f7fa"
  accent: "#554183"
  border: "#dfdee8"
  muted: "#646272"
  header-bg: "#302642"
  header-text: "#f6f2fc"
  header-hover: "#493b60"
  primary-hover: "#403063"
  white: "#fff"
  violet-sheet: "#ede8f4"
  violet-sheet-text: "#584876"
  title-plate: "#443360"
  title-plate-text: "#f8f3ff"
  title-plate-muted: "#ded1ee"
  title-plate-border: "#615075"
  focus: "#8e75ba"
  header-focus: "#dbc6ff"
  selection: "#d8c9f0"
  read-hako-bg: "#f4ecd8"
  read-hako-fg: "#3d3428"
  read-cream-bg: "#faf7ef"
  read-cream-fg: "#2c2c2c"
  read-gray-bg: "#d8d8d8"
  read-gray-fg: "#333333"
  read-dark-bg: "#18181b"
  read-dark-fg: "#d4d4d8"
  utility-ink: "#1c1917"
typography:
  library-heading:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "clamp(28px, 3vw, 36px)"
    fontWeight: 700
    letterSpacing: "-.025em"
  novel-heading:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "clamp(26px, 3vw, 36px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-.025em"
  book-title:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "clamp(23px, 3vw, 32px)"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-.025em"
  chapter-title:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "clamp(24px, 3.8vw, 32px)"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  title-plate:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.035em"
  summary:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "15px"
    lineHeight: 1.85
  chapter-row:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "14px"
    lineHeight: 1.6
  header-action:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
  reader-default:
    fontFamily: "'Noto Serif', 'LN Punctuation', Georgia, serif"
    fontSize: "18px"
    lineHeight: 1.8
  reader-sans:
    fontFamily: "'Be Vietnam Pro', 'LN Punctuation', system-ui, -apple-system, sans-serif"
    fontSize: "18px"
    lineHeight: 1.8
  metadata:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "13px"
  settings-label:
    fontFamily: "'Be Vietnam Pro', sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.05em"
rounded:
  reader-small: "4px"
  row: "6px"
  control: "7px"
  resume: "8px"
  library-modal: "10px"
  title-plate: "3px 10px 10px 3px"
spacing:
  compact: "6px"
  small: "8px"
  control-gap: "12px"
  base: "16px"
  gutter-mobile: "20px"
  gutter: "24px"
  section: "32px"
  entry-gap: "40px"
  layout-gap: "48px"
components:
  action-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
  action-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  header-action:
    textColor: "{colors.header-text}"
    typography: "{typography.header-action}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  header-action-hover:
    backgroundColor: "{colors.header-hover}"
  text-link:
    textColor: "{colors.accent}"
  resume-reading:
    backgroundColor: "{colors.violet-sheet}"
    rounded: "{rounded.resume}"
    padding: "22px 24px"
  chapter-row:
    typography: "{typography.chapter-row}"
    rounded: "{rounded.row}"
    padding: "15px 12px"
  chapter-row-current:
    backgroundColor: "{colors.violet-sheet}"
    textColor: "{colors.accent}"
  title-plate:
    backgroundColor: "{colors.title-plate}"
    textColor: "{colors.title-plate-text}"
    rounded: "{rounded.title-plate}"
    padding: "24px"
  search-input:
    textColor: "{colors.ink}"
    rounded: "{rounded.row}"
    padding: "12px"
  reader-nav-link:
    backgroundColor: "transparent"
    textColor: "var(--read-fg)"
    rounded: "{rounded.control}"
    padding: "12px"
  theme-swatch:
    backgroundColor: "transparent"
    textColor: "var(--read-fg)"
    rounded: "{rounded.reader-small}"
    padding: "8px 10px"
---

# Design System: Sakayori Studio

## Overview

**Creative North Star: "Ink-violet reading library"**

This is the user-approved world implemented in the library, novel contents and chapter reader: ink-violet wayfinding, cool neutral sheets, compact rounded controls and open chapter lists. Interface typography is a clear Vietnamese sans; the default narrative face is serif. The reader can choose a sans narrative face without changing the interface hierarchy.

The library's identity does not repaint the reading page. Reading backgrounds and foregrounds remain paired presets, while reader chrome derives from the chosen pair. The title plate is an authored typographic link, not a publisher cover or an official-edition claim. No sales or marketing landing-page treatment belongs to this remake.

**Key Characteristics:**
- Ink-violet navigation on a cool neutral library ground.
- Open lists and bounded reading columns rather than a repeated card grid.
- Sans interface hierarchy; user-controlled prose typography and paper.
- Explicit reading-state text, not color-only continuity.
- Small state transitions; settings is an explicitly opened reading pause.

**Evidence and scope:** Extracted on 2026-10-11 from `src/styles/global.css`, `src/styles/reader.css`, both layouts, library/contents/reader routes, shared components and `src/utils/reader-settings.ts`. The route-specific contract remains in `.impeccable/surface-briefs/ln-remake.md`; this document does not replace it. The supplied fresh finish verdict was **ship**, scoring six fixes resolved, with opening-reader evidence only. It is not whole-site, all-chapter, accessibility or backend certification. This documentation pass did not run another UI review.

## Colors

### Primary

Ink violet (`accent`) identifies primary actions, contents headings, Arc links and reading-location highlights. Deeper violet (`header-bg`) carries the library masthead; its hover and focus treatments are separate from the neutral-page focus treatment. The typographic title plate uses its own violet field and subdued pale lettering.

### Neutral

Cool paper (`paper`), ink (`ink`), muted text (`muted`) and pale borders (`border`) form the library ground. Pale violet sheets (`violet-sheet`) distinguish the resume block, hovered chapter rows and current reading row. The selected chapter also displays “Đang đọc” and receives `aria-current="location"`.

### Reader pairs

The frontmatter records the exact background/foreground pairs for Hako, cream, gray and dark. `--read-bg` and `--read-fg` resolve to the selected pair; Hako is the default. These are compatibility settings, not replacements for the library palette.

**The Reader Pair Rule.** Derive reader chrome from the selected foreground and background rather than importing fixed library text colors. The reader masthead mixes background (92%) with foreground; its border mixes foreground (18%) with transparency. Control borders use foreground (25%), hover fills (8%); header-action hover uses foreground (10%). Reader focus and range accent use foreground directly. Reader selection reverses foreground and background.

Library selection uses the selection token with ink text. Global focus is a visible outline (3px, offset 4px); the masthead substitutes its pale focus token, and the reader substitutes its current foreground. Utility toast/report/back-to-top colors retain the separate utility-ink/Hako-paper pairing. Those legacy utility colors are not a second brand accent.

## Typography

**Interface font:** Be Vietnam Pro, sans-serif fallback. **Default prose font:** Noto Serif, LN Punctuation, Georgia, serif. **Alternate prose font:** Be Vietnam Pro, LN Punctuation, system-ui, -apple-system, sans-serif. Fonts are served locally, not via a hosted stylesheet.

Hierarchy and measured declarations live in frontmatter. The library heading, novel title and chapter opener are bold sans, not serif display typography. Book titles are bounded (28ch); novel headings (32ch); library summaries (65ch), expanded novel descriptions (70ch). There is no uniform computed type-scale ratio or explicitly declared global body size to document.

- Reader prose uses configurable variables; defaults are the `reader-default` role. UI offers size (15–24px, step 1), line height (1.5, 1.8, 2.1) and width (650, 750, 900px). These are offered choices, not proof that every stored numeric value is validated: the utility clamps size, while stored line height and width are accepted as numbers.
- Prose is left-aligned, wraps long words, and has no first-line indentation. Paragraph spacing is relative to the selected type (1.35em). Prose subheadings are centered (1.25em, weight 700, margins 2.2em 0 1em, tracking .04em).
- Blockquotes use a foreground-derived left rule (35%), italic text, padding (1.25em) and margins (1.6em 0). CSS scene-break styling uses a centered diamond between decorative dashes; this is not a license to add em dashes to UI copy.
- Metadata and breadcrumbs are compact (13px desktop, 12px mobile). Chapter numbers use tabular numerals. Settings labels are uppercase with tracked lettering; ordinary navigation is not uppercase.
- The actual self-hosted faces are Be Vietnam Pro normal (400/700), Noto Serif normal and italic (400/700). Some utility styles request 500/600; separate font files for those weights are not present.

**Punctuation coverage:** `LN Punctuation` is the local `public/fonts/noto-dialogue-punctuation.ttf` subset, limited to U+3008–U+3011 and U+3014–U+301B. It follows the primary prose face and covers source dialogue delimiters, not all Japanese text. Source and SIL OFL 1.1 provenance are in `public/fonts/dialogue-provenance.txt` and `public/fonts/OFL-noto-dialogue.txt`. This remake shipped no raster asset or sourced cover; the punctuation subset is the new asset, alongside existing local text fonts.

## Layout

The shell is a full-height flex column. Library header, main and footer use an outer maximum (1168px), with desktop horizontal padding (24px), yielding the contract's maximum content width (1120px). Library main padding is (48px 24px 80px).

Library entries use a title-plate column (220px), flexible information column and gap (40px). The title plate has a 2:3 aspect ratio. Actions and Arc shortcuts wrap. Contents use a left Arc index (200px), flexible chapter column and gap (48px); the index is sticky (top 24px). Chapter rows have columns (44px, remaining title width, marker, arrow), gap (12px). Arc sections use native disclosure controls, initially closed unless opened by a matching hash or saved reading location.

Reader outer maximum is `calc(var(--read-width) + 48px)` with padding (48px 24px 80px), leaving the chosen prose width at a sufficiently wide viewport. The reader header has a separate outer maximum (1120px); it does not inherit the narrow prose column. Chapter navigation sits above and below prose; desktop columns are (1fr, minmax(120px, 1.3fr), 1fr), gap (12px).

### Mobile behavior

The sole layout breakpoint in these styles is `max-width: 700px`:
- Header padding becomes (12px 16px), hides “Studio” and reduces control typography. Reader brand becomes (14px), header controls (12px), horizontal control padding (7px).
- Library and reader main padding becomes (32px 20px 56px).
- Book entries use a smaller plate column (96px) and gap (20px). Title/author sit alongside it; description/actions/Arc links span the full row. The plate title becomes (16px), main title (21px); secondary plate lettering is hidden.
- Resume blocks wrap; footer stacks. Contents becomes one column, gap (24px); the Arc index is no longer sticky and its navigation scrolls horizontally.
- Chapter row columns become (32px, remaining width, arrow), gap (8px), padding (14px 4px). The reading marker moves below the title, not into a color-only indicator.
- Reader previous/next share the first row; the chapter selector spans the second row. This is responsive reflow, not a mobile-only feature fork.

Search overlays have viewport padding (20px); library cards cap at (540px), reader cards at (480px), height (85dvh) with internal scrolling. Settings is a full-height right drawer, width `min(420px, 100vw)`, internal padding (24px 20px), scrolling when needed.

## Elevation & Depth

Most surfaces are flat and divided by borders or pale tonal changes. Shadows are limited to the title plate, modal surfaces, settings drawer and utility overlays; there is no blanket card elevation or glass effect. Exact shadow values are in the sidecar, extracted without creating an elevation scale.

Settings/backdrop layering is (900/899), typo selection action (500), back-to-top (400), search/report modal and progress rail/toast (1000), skip link (2000). These are implemented layer values, not proof that all possible overlapping dialogs have been tested.

Motion is state feedback, not page-entry choreography. The reader changes background/text with (0.2s ease); navigation transitions use (0.15s ease); the settings drawer translates horizontally with (0.25s cubic-bezier(0.16, 1, 0.3, 1)). Progress is scaleX from the left (0.1s linear). Toast opacity/translation uses (0.2s ease).

The reduced-motion media rule sets CSS transition and animation durations to zero and CSS scroll behavior to auto. Back-to-top still explicitly requests smooth scrolling in JavaScript; do not claim that all scripted motion is suppressed.

## Shapes

Controls are compact rounded rectangles, not pill silhouettes despite some settings class names. Repeated radii are captured in frontmatter: reader small controls, rows/fields, library actions and reader navigation, resume blocks and modals. The title plate has asymmetric spine-like corners. Dividers are generally thin (1px); comment-section separation uses a heavier rule (2px). Theme preview dots are circles (14px); back-to-top is a circle (40px). Avoid interpreting those utility circles as a universal shape language.

## Components

### Masthead and actions

`SiteHeader.astro` is the shared non-sticky masthead, with inline book/search/settings SVGs. Library branding is bold (18px); header actions have minimum height (44px), compact padding and violet hover fill. Reader rendering adapts colors to the selected preset and exposes contents/settings controls. Preserve text labels, visible focus and the settings trigger's expanded/control relationship.

### Primary actions and text links

Primary library actions are bold (14px), minimum height (46px), violet fill and white text; hover deepens the fill. Text links are underlined violet (14px). Do not replace chapter routes with JavaScript-only navigation. Reader navigation uses transparent foreground-derived controls rather than the solid library primary-action style.

### Title plate and resume block

The plate is a text composition linked to contents, not raster cover art. The resume block is hidden until matching local data supplies a valid same-origin chapter path; no fabricated empty reading history appears. On contents it filters by novel, marks the saved row with “Đang đọc”/`aria-current`, and opens its parent Arc disclosure. Its primary action remains separate from its descriptive text.

### Contents navigation and chapter rows

Arc shortcuts and the contents index link to `#arc-{number}`; clicking or loading such a hash opens the corresponding native disclosure. Chapter rows are full-row anchors with number, wrapping title, optional current-reading text and decorative arrow. Hover/current backgrounds use the pale violet sheet; current text is bold. Do not add an invented active-Arc state: the implementation styles index hover but does not track an active index tab.

### Chapter opener and navigation

The opener uses wrapping breadcrumbs, a sans heading and restrained metadata. Reading-time metadata is an estimate from whitespace-separated words divided by 220, not a measured duration. Top and bottom navigation repeat previous/next anchors and a native selector grouped by Arc. At a sequence boundary, the absent link is a non-interactive `span` with `aria-disabled` and opacity (.35).

Arrow-left/right navigation ignores editable targets, input/textarea/select, modifier keys (Alt/Ctrl/Meta), and an open settings drawer or modal. Native selector changes navigate to the selected URL. Preserve routes `/{novel}/arc-{number}/chuong-{number}`, including resume matching; do not rewrite them as a visual-system cleanup.

### Settings pause

`ReaderSettings.astro` opens a labeled modal drawer with a dark backdrop (`#0008`), body scroll lock, focus on close, Tab wrap over its buttons/inputs, Escape/backdrop dismissal and focus return to its trigger. Hidden drawers use both translated positioning and visibility. Opening the drawer is a deliberate pause, not a guarantee that a drawer and prose are simultaneously readable.

Theme buttons use labeled dots in two columns; active state adds foreground border/outline. Font/line-height/width choices are compact rectangular groups; active choices add fill/border/weight. These selections also update `aria-pressed`. Size is a native range input with a visible numeric value. Settings persist under `ln-reader-settings`; progress under `ln-resume-progress`. A synchronous head script applies saved reader variables before first paint; this is the implemented flash-avoidance mechanism, not a browser-universal zero-flash certification.

### Search and forms

`SearchModal.astro` provides a labeled search field and polite live results/status. Opening locks scroll and focuses the field; closing clears the query/results, returns focus and invalidates pending results. Tab wraps within current button/input/result links. Escape, backdrop click and the close button dismiss; `/` or Ctrl/Cmd+K opens when not typing. Pagefind loads lazily, search input waits (200ms), and at most eight results render. Empty/loading/no-match/load-failure copy is implemented; returned links are same-origin and excerpts render as text.

Library fields use thin borders, transparent backgrounds, ink text and rounded corners (6px); reader overrides use selected foreground and smaller corners (4px). Reader modal/report/comment controls retain existing styles below the chapter, with local text colors rather than branding them as primary library actions. Production submission behavior depends on API and environment configuration; styling is not evidence those services work.

### Reading utilities

The fixed progress rail is (3px) with the violet focus token as its fill. Back-to-top becomes visible after scrollY (400px); typo reporting has a contextual floating selection action. Thus the normal opening reader has no persistent floating action over prose, but the implementation does contain later/contextual floating utilities. Comments and the non-commercial rights footer follow the lower navigation; they do not interrupt the chapter's main column.

## Do's and Don'ts

### Do:
- **Do** use the library palette for discovery and selected reader pairs for chapter chrome.
- **Do** retain sans interface headings and user-controlled narrative typography.
- **Do** retain open chapter rows, native Arc disclosures and visible reading-state text.
- **Do** preserve chapter URLs, storage keys and existing reader preset values.
- **Do** keep the punctuation fallback local and retain its source and OFL files.
- **Do** describe verification at its actual scope: six resolved fixes and opening-reader evidence.

### Don't:
- **Don't** turn this reading portal into a sales or marketing landing page.
- **Don't** present the typographic title plate as sourced publisher cover artwork.
- **Don't** replace the reader presets with the library's cool-paper/violet palette.
- **Don't** claim whole-site accessibility, every-chapter QA, backend readiness or universal zero-flash behavior from this review.
- **Don't** claim that all reading utilities are non-floating or all scripted motion respects reduced motion.
- **Don't** change story content, UI factual claims or product capabilities while applying these visual rules.
