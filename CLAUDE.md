# CLAUDE.md — aegis-docs

## Project
The public AEGIS documentation site — built with Astro and hosted on aegissystems.app.

## Org Context
- GitHub Org: github.com/aegis-initiative
- IP Owner: Finnoybu IP LLC
- Parent Ecosystem: Finnoybu Holdings LLC
- Domain: aegissystems.app

## This Repo's Role
aegis-docs is the public-facing documentation site for the entire AEGIS ecosystem. It renders the governance charter from aegis-constitution, API docs from aegis-platform, SDK docs from aegis-sdk, and conceptual documentation authored directly here. Built with Astro (Starlight theme preferred).

## Related Repos
- aegis-constitution — Charter content rendered by this site
- aegis-platform — API docs sourced from here
- aegis-sdk — SDK reference docs sourced from here
- aegis — ADRs and architecture docs that may be surfaced here

## Stack
Astro (Starlight), Markdown/MDX, deployed to aegissystems.app

## Key Conventions
- Content in /src/content — one directory per section
- Navigation configured in astro.config.mjs
- No hand-edited HTML — all content in Markdown/MDX
- Branch: main is protected; all changes via PR with 1 required review

## Current Focus
Initial Astro/Starlight scaffold and navigation structure
