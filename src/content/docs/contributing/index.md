---
title: Contributing Overview
description: How to contribute to the AEGIS ecosystem -- repositories, conventions, and processes.
---

# Contributing to AEGIS

AEGIS is an ecosystem of interconnected repositories, each with a specific role. This guide explains how to contribute
effectively, covering repository structure, conventions, and processes.

## Repository Map

| Repository | What It Contains | Contribute Here For |
|---|---|---|
| [aegis-governance](https://github.com/aegis-initiative/aegis-governance) | Architecture specs, protocol definitions, threat model | Specification changes, protocol updates, security analysis |
| [aegis-platform](https://github.com/aegis-initiative/aegis-platform) | Hosted runtime, dashboard, API surface | Platform features, API endpoints, dashboard UI |
| [aegis-sdk](https://github.com/aegis-initiative/aegis-sdk) | TypeScript and Python client libraries | SDK features, bug fixes, new language support |
| [aegis-docs](https://github.com/aegis-initiative/aegis-docs) | This documentation site | Documentation improvements, new guides |
| [aegis-ops](https://github.com/aegis-initiative/aegis-ops) | CI/CD pipelines, infrastructure-as-code | Workflow improvements, deployment automation |
| [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Public governance charter | Charter amendments, governance clarifications |
| [aegis](https://github.com/aegis-initiative/aegis) | Governance doctrine, ADRs, cross-component specs | Architecture decisions, interface schemas, doctrine |
| [aegis-labs](https://github.com/aegis-initiative/aegis-labs) | Research sandbox | Experimental work, prototypes |

## General Conventions

### Branch Strategy

- `main` is the protected default branch across all repositories
- All changes go through pull requests with at least one approving review
- Use descriptive branch names: `docs/add-quickstart-guide`, `feat/policy-engine-conditions`

### Commit Style

All repositories use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>

[optional body]
```

| Type | Use For |
|---|---|
| `feat` | New features, new specifications, new capabilities |
| `docs` | Documentation updates, clarifications, typo fixes |
| `fix` | Bug fixes, corrections to existing specs |
| `chore` | Repo maintenance, tooling, CI configuration |
| `refactor` | Restructuring without changing behavior or meaning |

### Pull Requests

- Keep PRs focused -- one logical change per PR
- Write a clear description explaining the *why*, not just the *what*
- Reference related issues or ADRs where applicable
- Ensure CI checks pass before requesting review

## Contributing to Documentation

This documentation site ([aegis-docs](https://github.com/aegis-initiative/aegis-docs)) is built with
[Astro](https://astro.build/) and uses Markdown content pages.

### Content Structure

Documentation pages live in `src/content/docs/` and are organized by section:

```
src/content/docs/
  getting-started/
  architecture/
  api/
  sdk/
  guides/
  contributing/
```

### Page Format

Each page requires frontmatter with a title and description:

```markdown
---
title: Page Title
description: A brief description of the page content.
---

# Page Title

Page content in Markdown...
```

### Running Locally

```bash
git clone https://github.com/aegis-initiative/aegis-docs.git
cd aegis-docs
npm install
npm run dev
```

The development server will start at `http://localhost:4321`.

## Contributing Architecture Decisions

Architecture Decision Records (ADRs) are the formal mechanism for proposing and recording cross-cutting design
decisions. ADRs live in the [aegis repository](https://github.com/aegis-initiative/aegis) under `docs/adr/`.

To propose an ADR:

1. Copy the template at `docs/adr/0000-template.md`
2. Number it sequentially
3. Fill in all sections (Context, Decision Drivers, Considered Options, Outcome, Consequences)
4. Set status to `proposed`
5. Open a pull request for discussion

See the [Decision Records](/architecture/adr/) page for more details on the ADR format and lifecycle.

## IP Notice

All contributions to AEGIS repositories become proprietary intellectual property of **Finnoybu IP LLC** under the terms
of the contributor agreement. AEGIS is a trademark of Finnoybu IP LLC.

For the full contributing guidelines for the governance repository, see the [CONTRIBUTING.md in
aegis](https://github.com/aegis-initiative/aegis/blob/main/CONTRIBUTING.md).
