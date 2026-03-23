# Content Architecture

This directory contains documentation about the aegis-docs content architecture.

## Content Sources

aegis-docs aggregates documentation from multiple AEGIS repositories:

| Section | Source | Description |
|---------|--------|-------------|
| Governance | aegis-constitution, aegis (doctrine/) | Constitution, governance charter, foundational doctrine |
| Architecture | aegis (docs/adr/) | Architecture Decision Records and cross-component specs |
| Platform API | aegis-platform | REST API reference, integration guides |
| SDK | aegis-sdk | Client SDK usage, examples, API reference |
| Contributing | aegis, aegis-ops | Contribution guidelines, development setup |

## Content Pipeline

Content flows from source repos into aegis-docs through:

1. **Direct authoring** -- Content written directly in `src/content/docs/`
2. **Git submodules or CI sync** -- Canonical content pulled from source repos at build time
3. **API reference generation** -- Auto-generated from OpenAPI specs (aegis-platform)

## URL Structure

```
aegis-docs.com/
  docs/                  # Getting started
  docs/governance/       # Constitution and doctrine
  docs/architecture/     # ADRs and system design
  docs/platform/         # Platform API reference
  docs/sdk/              # SDK documentation
  docs/contributing/     # Contribution guides
```

## Build Pipeline

1. `astro build` -- Compiles MDX content into static HTML
2. `pagefind --site dist` -- Indexes built pages for client-side search
3. Deploy to hosting provider (Cloudflare Pages or similar)
