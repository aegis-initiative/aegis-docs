# CLAUDE.md -- aegis-docs

## Project

The public AEGIS documentation site at aegis-docs.com — built on a custom Astro 6 site (not Starlight) consuming the
shared `@aegis-initiative/design-system` package.

## Org Context

- GitHub Org: github.com/aegis-initiative
- Operating Entity: AEGIS Operations LLC
- Trademark Owner: Finnoybu IP LLC
- Domain: aegis-docs.com

## This Repo's Role

aegis-docs is the public-facing **administrator and user guide** for the entire AEGIS ecosystem. It is the operator's
manual: how to use AEGIS, how to integrate it, how to read its outputs.

It is NOT the spec site. Normative definitions of AGP-1, ATX-1, AIAM-1, GFN-1, etc. live in
[aegis-governance.com](https://aegis-governance.com) and are fetched at build time when this site needs to render them
(see ATX-1 below).

## Stack

- **Framework:** Astro 6 with MDX integration (custom build, NOT Starlight)
- **Content:** Markdown/MDX via Astro content collections (glob loader)
- **Components:** Shared via `@aegis-initiative/design-system` npm package
- **Search:** Pagefind (client-side, built at deploy time)
- **Styling:** Custom CSS with IBM Plex Sans + Poppins (self-hosted fonts)
- **Node requirement:** >= 22.12.0

## Architecture

### Content Collections

Content lives in `src/content/docs/` using Astro's glob loader. Schema in `src/content.config.ts`: title, description,
section?, sidebar.{order, hidden}.

### Local Content Sections

| Section | Notes |
|---------|-------|
| `getting-started/` | Onboarding |
| `architecture/` | Architecture overviews + ADR index |
| `api/` | Operator-facing API guide (platform API) |
| `sdk/` | SDK how-to (consumes aegis-sdk) |
| `guides/` | Operational how-tos (deployment, monitoring, troubleshooting, MCP integration, policy authoring) |
| `contributing/` | Contributor onboarding |
| `aiam/` | AIAM-1 user-facing intro |
| `threat-matrix/` | ATX-1 user-facing guide (see below — body rendered from aegis-governance) |
| `releases/` | Calendar-versioned release notes (YY/M/D structure) |

### ATX-1: Build-Time Fetch from aegis-governance

The threat-matrix section consumes the canonical ATX-1 spec from
[aegis-governance.com/atx-1/](https://aegis-governance.com/atx-1/) at build time.

- **Fetcher:** [`scripts/fetch-atx.mjs`](scripts/fetch-atx.mjs) runs in `predev` and `prebuild`. Pulls `VERSION`,
  `index.json`, `techniques.json`, `regulatory-crossref.json`, `version-mapping.json`, `atm1-mapping.json`, and
  `atx-technique.schema.json` into `src/data/atx/` (gitignored).
- **Pinned minimum version:** `package.json#aegisGovernance.atxMinVersion`. The fetcher refuses to use a remote version
  older than this.
- **Render components:** [`src/components/atx/TechniqueCatalog.astro`](src/components/atx/TechniqueCatalog.astro) and
  [`src/components/atx/RegulatoryCrossRef.astro`](src/components/atx/RegulatoryCrossRef.astro). Embedded in
  `techniques.mdx` and `regulatory-crossref.mdx`.
- **Editorial framing stays local:** `index.md`, `tactics.md`, and `machine-readable.md` are hand-maintained
  operator-facing prose. Tactic descriptions and operator framing belong here, not in the spec.
- **Offline mode:** `npm run fetch-atx:offline` (or `ATX_OFFLINE=1`) uses cached data without hitting the network.
- **CI drift check:** `npm run fetch-atx:check` exits non-zero if local cache differs from remote.

### Cross-Repo Pointers (Read, Don't Restate)

| Topic | Canonical home |
|-------|---------------|
| Constitution | [aegis-constitution.com](https://aegis-constitution.com) (repo: aegis-constitution) |
| Specs / RFCs / ATX-1 / AGP-1 / AIAM-1 / GFN-1 | [aegis-governance.com](https://aegis-governance.com) (repo: aegis-governance) |
| Runtime engine (AGP-1) | aegis-core |
| Client SDKs (TS / Python) | aegis-sdk |
| Brand assets, design system, public roadmap, legal pages | aegis-initiative |
| Internal doctrine, ADRs, detailed roadmap | aegis (private) |
| Research, experiments, adversarial testing | aegis-labs |
| CI/CD, infra-as-code, runbooks | aegis-ops (private) |
| Commercial platform | aegis-platform (private) |

### Build Pipeline

1. `predev` / `prebuild` runs `node scripts/fetch-atx.mjs` (refreshes ATX-1 cache from aegis-governance).
2. `astro build` compiles MD/MDX + Astro components to static HTML.
3. `pagefind --site dist` generates the search index.
4. `postbuild` copies pagefind output to `public/` for dev mode.

Cloudflare Pages picks up `main` and runs the same pipeline on each push.

## Repo Structure

```
src/
  content.config.ts         # Content collection schema
  content/docs/             # Documentation content (MD/MDX)
  components/
    atx/                    # ATX-1 render components (consume src/data/atx/)
    *.astro                 # Site-local wrappers around design-system components
  data/atx/                 # GITIGNORED — populated by scripts/fetch-atx.mjs
  layouts/                  # DocLayout, BaseLayout
  pages/                    # Astro pages (index, [...slug], threat-matrix/matrix)
  plugins/                  # Remark/rehype plugins
  assets/                   # SVG logos, optimized images
public/
  fonts/                    # Self-hosted IBM Plex Sans + Poppins
  favicon.svg               # AEGIS shield favicon
scripts/
  fetch-atx.mjs             # Build-time fetch of ATX-1 from aegis-governance
  append-dev-log.py         # Release pipeline (calendar versioning)
  generate-release-notes.py
  nightly-release.py
docs/                       # Internal architecture / decision notes
```

## Key Conventions

- Content in `src/content/docs/` — one subdirectory per section.
- Custom Astro 6 build with MDX (no Starlight).
- Self-hosted fonts (no CDN).
- Pagefind for search (no server-side search).
- Content is Markdown/MDX. Pages that need to embed Astro components use MDX (`.mdx`).
- **Spec content is fetched at build time, never duplicated.** If you find yourself hand-typing a technique definition,
  an article number, or a regulatory mapping, stop — that belongs in aegis-governance and should be fetched.
- Branch: `main` is protected; all changes via PR with 1 required review.
- Commit style: Conventional Commits (feat:, docs:, chore:, fix:).

## Live State Pointers

- ATX-1 current version live: <https://aegis-governance.com/atx-1/VERSION>
- ATX-1 dataset index: <https://aegis-governance.com/atx-1/index.json>
- Pinned minimum version: `package.json#aegisGovernance.atxMinVersion`

## Known Follow-Ups

- [`src/pages/threat-matrix/matrix.astro`](src/pages/threat-matrix/matrix.astro) hand-codes a duplicate copy of the
  ATX-1 technique data (~690 lines). Should be refactored to consume `src/data/atx/techniques.json` like the MDX pages
  do — separate change.
- The two `.claude/rules/*.md` files (`component-comparison.md`, `product-knowledge.md`) date from 2026-03-23 when the
  design system was inline and the site had only six placeholder sections. They no longer reflect reality
  (design-system is consumed via npm; threat-matrix exists; release-notes pipeline exists; etc.). Either refresh or
  delete.

## Addendum Files

None yet. Create under `.claude/` if needed (per ecosystem registry rules):

- `HISTORY.md` — long-form historical decisions
- `GOTCHAS.md` — site-specific anti-patterns
