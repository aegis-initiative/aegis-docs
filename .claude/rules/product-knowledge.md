# Product Knowledge -- aegis-docs

*Comprehensive design and behavior reference for the AEGIS Documentation site. Generated 2026-03-23.*

---

## 1. Site Overview

The AEGIS Documentation site is a static documentation website built
with **Astro 6** and deployed to **Cloudflare Pages** at aegis-docs.com.
It publishes public documentation for the AEGIS ecosystem —
architecture, APIs, SDK, and developer guides.

- **Framework:** Astro 6 with MDX integration
- **Search:** Pagefind (static search index, built post-build)
- **Fonts:** Self-hosted woff2 (no external font dependencies)
- **Node requirement:** >= 22.12.0
- **Build output:** dist/
- **Deployment:** Cloudflare Pages, automatic on push to main

### Build Commands

| Command | Purpose |
|---|---|
| npm run dev | Local dev server at localhost:4321 |
| npm run build | Production build + Pagefind index |
| npm run postbuild | Copy Pagefind assets to public/ |
| npm run preview | Preview production build |

### Dependencies

- @astrojs/mdx ^5.0.2
- @pagefind/default-ui ^1.4.0
- astro ^6.0.8
- pagefind ^1.4.0 (dev)

### What is Missing vs Constitution

- No PDF generation (no Puppeteer, no /print/ page, no scripts/)
- No 404 page
- No OG image (referenced in DocLayout but no file in public/)
- No unist-util-visit in package.json (plugins import it but it is not a declared dependency)
- Plugins (remark-asides.mjs, rehype-asides.mjs) exist but are NOT configured in astro.config.mjs -- they are dead code

---

## 2. Site Architecture

### Page Types

1. **Landing page** (/) -- Centered hero with logo, nav card grid, no sidebar, no ToC
2. **Doc pages** (/[...slug]/) -- Three-column layout with sidebar, content, and ToC rail

### Routing

- / -- src/pages/index.astro (landing page, standalone layout)
- All other routes -- src/pages/[...slug].astro (dynamic, uses DocLayout)

The slug page uses getStaticPaths() to generate routes from the docs content collection. Every .md and .mdx file in
src/content/docs/ becomes a page.

### Pages That Do NOT Exist (vs Constitution)

- No /404 page
- No /print/ page

### Content Collection

Defined in src/content.config.ts. Uses glob loader for md/mdx in src/content/docs. Schema: title (string, required),
description (string, optional), section (string, optional), sidebar.hidden (boolean, optional), sidebar.order (number,
optional).

**Difference from constitution:** docs adds a section field that constitution does not have.

---

## 3. Content Sections

6 sections, 28 total content files (all .md, no .mdx):

- **Getting Started** (4): index.md, quick-start.md, installation.md, core-concepts.md
- **Architecture** (5): index.md, system-design.md, security-model.md, data-flow.md, adr.md
- **API Reference** (5): index.md, authentication.md, governance.md, enforcement.md, audit.md
- **SDK** (4): index.md, javascript.md, python.md, configuration.md
- **Guides** (5): index.md, policy-authoring.md, deployment.md, monitoring.md, troubleshooting.md
- **Contributing** (4): index.md, development-setup.md, code-of-conduct.md, pull-requests.md
- **Root**: docs/index.md (sidebar order 0)

---

## 4. Layout System

### DocLayout (src/layouts/DocLayout.astro)

Primary layout. Default description: "Official documentation for the AEGIS ecosystem". Title: {title} | AEGIS
Documentation.

Structure: html > head + body > Header, breadcrumb slot, page-wrapper (Sidebar + main-content + ToC). main-content has
slot, Footer, watermark (AegisWordmark height 720).

Three-column layout: **identical to constitution** (sidebar 320px, content flexible, ToC 320px).

### Landing Page

Centered card-grid design (NOT the constitution hero+wordmark). AegisLogo size 80, title, tagline, 6 nav cards. Own CSS
variables.

---

## 5. CSS Variables

### DocLayout: **Identical to constitution** (both light and dark)

### Landing Page Differences vs Constitution Landing

| Variable | Docs Light | Docs Dark | Constitution Light | Constitution Dark |
|---|---|---|---|---|
| --color-text-muted | #757575 | #8a8a8a | #5c5c5c | #adadad |
| --color-border | #c9c9c9 | #5c5c5c | (not set) | (not set) |
| --color-bg-subtle | #f5f5f5 | (not set) | (not set) | (not set) |
| --color-brand-gray | #9ca3af | (not set) | (not set) | (not set) |

---

## 6-8. Typography, Aside Colors, Spacing

**All identical to constitution.**

---

## 9. Breakpoints

Same as constitution except docs landing uses 640px (not 480px/768px).

---

## 10. Theme System

**Identical to constitution.** Three-state toggle, localStorage "aegis-theme", FOUC prevention.

---

## 11. Navigation

### Sidebar -- 6 groups, 27 items

Getting Started (4), Architecture (5), API Reference (5), SDK (4), Guides (5), Contributing (4).

Same accordion mechanism as constitution. Missing: legal nav, version badge.

### CRITICAL BUG: Sidebar CSS

Missing closing brace on .sidebar rule (line 105). Subsequent rules nested via CSS nesting. Missing bottom:0 and
height:calc(100vh - 4rem).

### PrevNext: NOT IMPLEMENTED (component exists, unused)

### Breadcrumb: NOT USED (component exists, unused). Bug: home link says "AEGIS Constitution"

---

## 12. Search

**Identical to constitution.** Pagefind, Ctrl+K, recent searches, site-search web component.

---

## 13. Header

Same structure, different text. Site name: "AEGIS Docs". GitHub: aegis-docs.

**BUG:** PDF buttons link to /AEGIS_Constitution_print.pdf and /AEGIS_Constitution.pdf (do not exist).
**BUG:** Version badge links to /releases/ (does not exist).

---

## 14. Table of Contents

**Identical to constitution.** Rail, dropdown, scroll spy, click behavior all the same.

---

## 15. Footer

Same layout. External links (aegis-initiative.com/about/, aegis-initiative.com/legal/) instead of relative.

---

## 16-17. Watermark, Aside

Watermark: **identical**. Aside component: **identical**. BUG: Plugins not configured in astro.config.mjs.

---

## 18-20. Footnotes, Animations, Accessibility

**All identical to constitution.**

---

## 21-22. OG, Assets

OG references /OG_image.png which does not exist. Assets: favicon.svg and fonts present. No OG image, icons, or PDFs.

---

## 23. Known Issues

### Critical

1. **Sidebar CSS nesting bug** -- Missing closing brace, missing height/bottom
2. **Breadcrumb not used** -- Component exists, slug page never renders it
3. **PrevNext not used** -- Component exists, slug page never renders it

### Moderate

1. **PDF buttons** -- Link to constitution PDFs that do not exist here
2. **OG image missing** -- /OG_image.png referenced but absent
3. **Breadcrumb text** -- Says "AEGIS Constitution" instead of "AEGIS Docs"
4. **Plugins dead code** -- remark-asides.mjs, rehype-asides.mjs not in astro.config.mjs
5. **Version links** -- CalVer links to /releases/ which has no content

### Minor

1. **Stale READMEs** -- Describe planned items that exist
2. **Root index.md** -- Duplicates getting-started content
3. **Section field** -- In schema but unused by content
