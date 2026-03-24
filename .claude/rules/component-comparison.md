# Component Comparison -- aegis-docs vs aegis-constitution

*Line-by-line comparison of every shared component. Generated 2026-03-23.*

This document identifies what is identical, what differs, and what is missing -- forming the basis for extracting a shared component library.

---

## Summary

| Component | Status | Shareable? |
|---|---|---|
| AegisLogo.astro | IDENTICAL | Yes -- share as-is |
| AegisWordmark.astro | IDENTICAL | Yes -- share as-is |
| Aside.astro | IDENTICAL | Yes -- share as-is |
| Breadcrumb.astro | NEARLY IDENTICAL (1 text difference + bug) | Yes -- parameterize home label |
| Footer.astro | NEARLY IDENTICAL (link targets differ) | Yes -- parameterize link URLs |
| Header.astro | STRUCTURALLY IDENTICAL (5 text/URL diffs) | Yes -- parameterize site name, GitHub URL, PDF links |
| PrevNext.astro | IDENTICAL (but unused in docs) | Yes -- share as-is |
| Search.astro | IDENTICAL | Yes -- share as-is |
| Sidebar.astro | STRUCTURALLY DIFFERENT | Partial -- share CSS/JS, parameterize nav data |
| TableOfContents.astro | IDENTICAL | Yes -- share as-is |
| DocLayout.astro | STRUCTURALLY IDENTICAL (text diffs) | Yes -- parameterize site name, description |
| remark-asides.mjs | IDENTICAL | Yes -- share as-is |
| rehype-asides.mjs | IDENTICAL | Yes -- share as-is |

**10 of 13 components are identical or near-identical and can be shared directly.**

---

## AegisLogo.astro

**Verdict: IDENTICAL** -- Props, SVG markup, CSS variable usage, and aspect ratio calculation are byte-for-byte identical.

---

## AegisWordmark.astro

**Verdict: IDENTICAL** -- Props (height, width), SVG markup, aspect ratio math, and CSS variables are byte-for-byte identical.

---

## Aside.astro

**Verdict: IDENTICAL** -- Same four types (doctrine, application, constraint, prohibition). Same labels, same shield SVG icon, same color map (light and dark), same CSS classes, same slot usage.

---

## Breadcrumb.astro

**Verdict: NEARLY IDENTICAL -- 1 text difference**

| Aspect | Constitution | Docs |
|---|---|---|
| Home link text | "AEGIS Constitution" | "AEGIS Constitution" (BUG -- should be "AEGIS Docs") |

All other markup, props, CSS, ARIA, and responsive behavior are identical.

**To share:** Parameterize the home link label via a homeName prop.

**Bug:** Docs home link was copied from constitution without updating.

---

## Footer.astro

**Verdict: NEARLY IDENTICAL -- link targets differ**

| Link | Constitution | Docs |
|---|---|---|
| About | /about/ | https://aegissystems.app/about/ |
| Contact | /legal/impressum/#contact | https://aegissystems.app/legal/impressum/#contact |
| Legal | /legal/ | https://aegissystems.app/legal/ |

All other markup, CSS, responsive behavior, and computed values (year, buildDate) are identical.

**To share:** Parameterize the three link URLs.

---

## Header.astro

**Verdict: STRUCTURALLY IDENTICAL -- 5 text/URL differences**

| Aspect | Constitution | Docs |
|---|---|---|
| Site name | "AEGIS Constitution" | "AEGIS Docs" |
| GitHub URL | aegis-initiative/aegis-constitution | aegis-initiative/aegis-docs |
| Print PDF href | /AEGIS_Constitution_print.pdf | /AEGIS_Constitution_print.pdf (BUG) |
| Download PDF href | /AEGIS_Constitution.pdf | /AEGIS_Constitution.pdf (BUG) |
| AegisLogo size | 48 | 48 |

Everything else is identical: imports, version logic, theme toggle script, menu button script, CSS, SVG icons, ARIA attributes.

**To share:** Parameterize siteName, githubUrl, printPdfHref, downloadPdfHref. Make PDF buttons conditionally rendered.

**Bugs in docs:** PDF buttons link to constitution files that do not exist in docs.

---

## PrevNext.astro

**Verdict: IDENTICAL (unused in docs)** -- Props, markup, CSS, responsive behavior, SVG arrows all byte-for-byte identical. The docs slug page does not import or render this component.

---

## Search.astro

**Verdict: IDENTICAL** -- Same props, same web component, same dialog, same Pagefind integration, same recent searches, same keyboard shortcuts, same CSS, same localStorage key.

---

## Sidebar.astro

**Verdict: STRUCTURALLY DIFFERENT**

### Identical Parts

- Accordion mechanism (details/summary, single-group-open JS)
- Mobile drawer (openSidebar/closeSidebar, overlay, body scroll lock)
- isActive() and isGroupActive() helper functions
- Nav link markup pattern
- Overlay markup

### Different Parts

| Aspect | Constitution | Docs |
|---|---|---|
| Version badge | Yes | No |
| Legal nav | Yes (isLegal check, legalNav, flat list) | No |
| Nav groups | 4 groups (38 items) | 6 groups (27 items) |
| CSS structure | Flat rules, proper braces | Missing closing brace, CSS nesting |
| sidebar height | bottom:0; height:calc(100vh - 4rem) | Missing (bug) |
| sidebar z-index | z-index: 40 | Not set at top level |

### CSS Bug in Docs

Docs Sidebar line 105-113 -- missing closing brace on .sidebar causes subsequent rules to nest via CSS nesting. Constitution has proper flat CSS with explicit height/bottom.

### To Share

Extract nav data into a prop. Make legal nav and version badge optional. Use constitution CSS as the base (fixes the bug).

---

## TableOfContents.astro

**Verdict: IDENTICAL** -- Same HTML, CSS, JS (buildToc, renderList, setupScrollSpy, injectHeaderButton, resize handler), same IntersectionObserver config, same click behavior.

---

## DocLayout.astro

**Verdict: STRUCTURALLY IDENTICAL -- text differences only**

| Aspect | Constitution | Docs |
|---|---|---|
| Default description | "The canonical AEGIS governance charter..." | "Official documentation for the AEGIS ecosystem..." |
| Title suffix | "AEGIS Constitution" | "AEGIS Documentation" |
| og:site_name | "AEGIS Constitution" | "AEGIS Documentation" |
| site URL | aegis-constitution.com | aegis-docs.com |

Everything else is identical: imports, all 10 font-face declarations, CSS reset, all CSS variables (50+ vars, both themes), base typography, table styles, page layout, footnotes, watermark, responsive rules, ToC globals, FOUC script, footnote script.

**To share:** Parameterize siteName and defaultDescription. Extract the ~500 lines of shared CSS.

---

## Plugins

### remark-asides.mjs -- IDENTICAL

Same ASIDE_TYPES, LABELS, SHIELD_SVG, visit logic. Dead code in docs (not configured in astro.config.mjs).

### rehype-asides.mjs -- IDENTICAL

Same types, labels, SVG, double-processing check. Dead code in docs.

---

## Missing Pages (not components)

| Page | Constitution | Docs |
|---|---|---|
| 404.astro | Yes (fuzzy route suggestions) | Missing |
| print.astro | Yes (PDF compilation) | Missing |

---

## Slug Page Differences

| Feature | Constitution | Docs |
|---|---|---|
| Imports | DocLayout, Breadcrumb, PrevNext | DocLayout only |
| navOrder | 38-item hardcoded array | None |
| Breadcrumb | Built from slug, rendered | Not rendered |
| PrevNext | Computed from navOrder | Not rendered |
| H1 | Explicit h1 tag | Relies on markdown content |

---

## Landing Page Differences

| Feature | Constitution | Docs |
|---|---|---|
| Layout | Side-by-side hero + AegisWordmark (width 400) | Centered hero + AegisLogo (size 80) + nav grid |
| CSS variables | 6 light + 6 dark | 10 light + 6 dark |
| Responsive | 480px + 768px | 640px |

---

## Shared CSS (100% Identical in DocLayout)

These blocks are byte-for-byte identical and should be extracted:

- All 26 light theme CSS variables
- All 24 dark theme CSS variables
- All 10 font-face declarations
- CSS reset (box-sizing, margin, padding)
- Base typography (html, body, h1-h6, p, hr, ul, ol, li, a)
- Table styles
- Footnote styles (8 rules)
- Watermark styles
- Page layout (.page-wrapper, .main-content)
- Responsive rules (560px font-size, 1024px margin-left, 1367px margin-right)
- ToC global rules (rail + dropdown)

**Total: ~500 lines of shared CSS.**

---

## Extraction Tiers

### Tier 1: Share directly (zero changes)

AegisLogo, AegisWordmark, Aside, PrevNext, Search, TableOfContents, remark-asides, rehype-asides

### Tier 2: Share with parameterization (props/config)

Breadcrumb (homeName), Footer (link URLs), Header (siteName, githubUrl, PDF options), DocLayout (siteName, description, CSS extraction)

### Tier 3: Share architecture, customize data

Sidebar (nav data as prop, optional legal nav, optional version badge, fix CSS)
