# Components

This directory will contain Astro components shared with the aegis-constitution site.

## Shared Design System

aegis-docs and aegis-constitution use the same custom design system. Components will be
extracted from aegis-constitution and shared here when the design system package is built.

### Components to share from constitution:

- `Header.astro` — Site header with navigation and theme toggle
- `Footer.astro` — Site footer with links and copyright
- `AegisWordmark.astro` — SVG wordmark component
- `ThemeToggle.astro` — Dark/light mode toggle
- `SearchDialog.astro` — Pagefind search modal
- `Aside.astro` — Callout/admonition blocks (note, tip, caution, danger)
- `TableOfContents.astro` — Heading-based ToC sidebar

### Design tokens (CSS custom properties):

The shared design system uses IBM Plex Sans for body text and Poppins for headings,
with a light/dark theme toggle. All color tokens are defined as CSS custom properties
on `:root` and `[data-theme]` selectors.

See the aegis-constitution repository for the current implementation.
