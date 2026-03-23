# Layouts

This directory will contain page layouts for the documentation site.

## Planned Layouts

### DocLayout.astro

The primary documentation layout, adapted from aegis-constitution's DocLayout pattern:

- Responsive sidebar navigation
- Table of contents (right rail)
- Content area with typography styles
- Breadcrumb navigation
- Previous/Next page links
- Pagefind search integration

### BaseLayout.astro

Minimal layout for non-documentation pages (landing page, 404, etc.):

- Header and footer only
- No sidebar or ToC
- Full-width content area

These layouts will be implemented when the shared design system is built.
See aegis-constitution for the reference implementation.
