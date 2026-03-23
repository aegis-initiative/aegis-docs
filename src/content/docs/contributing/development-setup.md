---
title: Development Setup
description: Set up a local development environment for contributing to AEGIS repositories.
---

# Development Setup

This guide covers setting up a local development environment for contributing to the AEGIS ecosystem.

## Prerequisites

- **Git** -- Version control ([git-scm.com](https://git-scm.com/))
- **Node.js 18+** -- Required for the documentation site and TypeScript SDK
- **Python 3.10+** -- Required for the Python SDK and runtime
- **GitHub CLI** -- Recommended for pull request workflows (`gh`)

## Documentation Site (aegis-docs)

```bash
git clone https://github.com/aegis-initiative/aegis-docs.git
cd aegis-docs
npm install
npm run dev
```

The site runs at `http://localhost:4321`. Content pages are in `src/content/docs/` -- edit a Markdown file and the page reloads automatically.

### Project Structure

```
aegis-docs/
  src/
    content/docs/    # Markdown content pages
    components/      # Astro components (Sidebar, Header, etc.)
    layouts/         # Page layouts
    pages/           # Route definitions
    plugins/         # Remark/Rehype plugins
  public/
    fonts/           # Web fonts
  astro.config.mjs   # Astro configuration
```

## TypeScript SDK (aegis-sdk)

```bash
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-ts
npm install
npm run build
npm test
```

## Python SDK (aegis-sdk)

```bash
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-py
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -e ".[dev]"
pytest
```

## Governance Specifications (aegis-governance)

The governance repository contains Markdown specifications, JSON schemas, and a Python reference runtime:

```bash
git clone https://github.com/aegis-initiative/aegis-governance.git
cd aegis-governance
```

- Specifications are in `aegis-core/` (Markdown, no build step)
- JSON schemas are in `aegis-core/schemas/` (validate with any JSON Schema tool)
- The reference runtime is in `aegis-runtime/` (Python)

## Governance Hub (aegis)

The central governance repo is documentation-only (Markdown, YAML, JSON Schema):

```bash
git clone https://github.com/aegis-initiative/aegis.git
cd aegis
```

No build step is required. ADRs are in `docs/adr/`, schemas in `schemas/`, doctrine in `doctrine/`.

## Editor Recommendations

- **VS Code** with the following extensions:
  - Astro (for `.astro` files)
  - Markdown All in One
  - Prettier
  - ESLint (for TypeScript work)
  - Python (for Python work)

## Next Steps

- [Contributing Overview](/contributing/) -- Conventions and processes
- [Code of Conduct](/contributing/code-of-conduct/) -- Community standards
- [Pull Request Guide](/contributing/pull-requests/) -- How to submit changes
