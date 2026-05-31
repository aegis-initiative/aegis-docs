---
title: Decision Records
description: Architecture Decision Records (ADRs) documenting key design decisions in the AEGIS ecosystem.
---

# Architecture Decision Records

Architecture Decision Records (ADRs) document the significant technical and architectural decisions made in the AEGIS
ecosystem. Each ADR captures the context, decision drivers, considered options, and consequences of a decision.

## What Are ADRs?

ADRs are short documents that record architectural decisions along with their context and consequences. They follow the
[MADR (Markdown Any Decision Record)](https://adr.github.io/madr/) format and are numbered sequentially.

Each ADR includes:

- **Status** -- proposed, accepted, deprecated, or superseded
- **Context** -- The situation and forces driving the decision
- **Decision Drivers** -- The key factors that influenced the choice
- **Considered Options** -- Alternatives that were evaluated
- **Decision Outcome** -- The chosen option and why
- **Consequences** -- Positive and negative outcomes of the decision

## ADR Lifecycle

| Status | Meaning |
|---|---|
| `proposed` | Under discussion in a pull request |
| `accepted` | Merged and in effect |
| `deprecated` | No longer relevant but retained for historical context |
| `superseded` | Replaced by a newer ADR (linked to replacement) |

## Where ADRs Live

The canonical source for AEGIS ADRs is the [aegis governance repository](https://github.com/aegis-initiative/aegis)
under `docs/adr/`. ADRs in that repository govern decisions that span the entire ecosystem.

Individual component repositories may maintain their own ADRs for component-specific decisions, but cross-cutting
architectural decisions are always recorded in the central governance repository.

## Contributing an ADR

1. Copy the template at `docs/adr/0000-template.md`
2. Number it sequentially (e.g., `0004-your-decision.md`)
3. Fill in all sections -- especially Context, Decision Drivers, and Consequences
4. Set status to `proposed`
5. Open a pull request for review

For full contribution guidelines, see the [Contributing guide](/contributing/).
