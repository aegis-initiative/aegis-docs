# CLAUDE.md — aegis-docs

## Identity

You maintain **aegis-docs** — the public AEGIS documentation site at aegis-docs.com. It is the operator's manual
for the entire AEGIS ecosystem: how to use AEGIS, how to integrate it, how to read its outputs. Built on a custom
Astro 6 site (not Starlight) consuming the shared `@aegis-initiative/design-system` package.

It is **NOT** the spec site. Normative definitions of AGP-1, ATX-1, AIAM-1, GFN-1, etc. live in
[aegis-governance.com](https://aegis-governance.com) and are fetched at build time when this site needs to render
them (see the ATX-1 build-time fetch under Conventions).

## Repository catalog

- `sites/docs/` — Astro site at aegis-docs.com (custom Astro 6 build with MDX, not Starlight)
  - `sites/docs/src/content.config.ts` — content collection schema
    (title, description, section?, sidebar.{order, hidden})
  - `sites/docs/src/content/docs/` — documentation content (MD/MDX), one subdirectory per section
  - `sites/docs/src/components/atx/` — ATX-1 render components (consume `src/data/atx/`)
  - `sites/docs/src/components/*.astro` — site-local wrappers around design-system components
  - `sites/docs/src/data/atx/` — GITIGNORED; populated by `../../scripts/fetch-atx.mjs`
  - `sites/docs/src/layouts/` — DocLayout, BaseLayout
  - `sites/docs/src/pages/` — Astro pages (index, `[...slug]`, threat-matrix/matrix)
  - `sites/docs/src/plugins/` — remark/rehype plugins
  - `sites/docs/src/assets/` — SVG logos, optimized images
  - `sites/docs/public/fonts/` — self-hosted IBM Plex Sans + Poppins
- `scripts/` — `fetch-atx.mjs` (build-time ATX-1 fetch), `append-dev-log.py`,
  `generate-release-notes.py`, `nightly-release.py` (release pipeline)
- `docs/` — internal architecture / decision notes

## Data registry

Local content sections live under `sites/docs/src/content/docs/`:

| Section | Notes |
|---------|-------|
| `getting-started/` | Onboarding |
| `architecture/` | Architecture overviews + ADR index |
| `api/` | Operator-facing API guide (platform API) |
| `sdk/` | SDK how-to (consumes aegis-sdk) |
| `guides/` | Operational how-tos (deployment, monitoring, troubleshooting, MCP integration, policy authoring) |
| `contributing/` | Contributor onboarding |
| `aiam/` | AIAM-1 user-facing intro |
| `threat-matrix/` | ATX-1 user-facing guide (body rendered from aegis-governance — see Conventions) |
| `releases/` | Calendar-versioned release notes (YY/M/D structure) |

The ATX-1 dataset (`VERSION`, `index.json`, `techniques.json`, `regulatory-crossref.json`, `version-mapping.json`,
`atm1-mapping.json`, `atx-technique.schema.json`) is **not stored here** — it is fetched at build time into the
gitignored `sites/docs/src/data/atx/` from aegis-governance.com.

## Publication registry

- **Published documentation site**: [aegis-docs.com](https://aegis-docs.com)
- **Release notes**: `sites/docs/src/content/docs/releases/` (calendar-versioned, YY/M/D; per-site CalVer pipeline)

## People & contacts

- **Primary maintainer**: Ken (sole maintainer during pre-ratification)
- **Reviewer routing**: `.github/CODEOWNERS`

## Identifier registry

- **GitHub Org**: [github.com/aegis-initiative](https://github.com/aegis-initiative)
- **Operating Entity**: AEGIS Initiative
- **Trademark Owner**: AEGIS Initiative (public attribution rule — internal IP-holder context lives in the
  workspace CLAUDE.md, never in public repo content)
- **Domain**: aegis-docs.com
- **Pinned ATX-1 minimum version**: `sites/docs/package.json#aegisGovernance.atxMinVersion` (the fetcher refuses
  remote versions older than this)
- **License**: see repo `LICENSE` (full dual-license matrix in the workspace CLAUDE.md)

## Cross-repo pointers

Read these canonical homes; don't restate their content here.

| Topic | Canonical home |
|-------|---------------|
| Constitution | [aegis-constitution.com](https://aegis-constitution.com) (repo: aegis-constitution) |
| Specs / RFCs / ATX-1 / AGP-1 / AIAM-1 / GFN-1 | [aegis-governance.com](https://aegis-governance.com) (repo: aegis-governance) |
| Federation network / GFN-1 spec | [aegis-federation.com](https://aegis-federation.com) (repo: aegis-federation) |
| Runtime engine (AGP-1) | aegis-core |
| Client SDKs (TS / Python) | aegis-sdk |
| Brand assets, design system, public roadmap, legal pages | aegis-initiative |
| Internal doctrine, ADRs, detailed roadmap | aegis (private) |
| Research, experiments, adversarial testing | aegis-labs |
| CI/CD, infra-as-code, runbooks | aegis-ops (private) |
| Commercial platform | aegis-platform (private) |

Ecosystem-wide structure and the full specialist-role matrix live in the workspace-level CLAUDE.md
(`d:/dev/AEGIS Initiative/CLAUDE.md`), inherited automatically — not duplicated here.

## Responsibilities

- Maintain the public operator/administrator and user guide for the AEGIS ecosystem
- Keep the ATX-1 build-time fetch pipeline working so threat-matrix content stays synced with aegis-governance
- Keep editorial/operator framing local while spec bodies are fetched, never duplicated
- Maintain the release-notes pipeline (calendar versioning) for the docs site

## Conventions specific to this repo

- **Stack**: Astro 6 with MDX integration (custom build, NOT Starlight); content via Astro content collections
  (glob loader); shared components from `@aegis-initiative/design-system` npm package; Pagefind for client-side
  search (built at deploy time); custom CSS with IBM Plex Sans + Poppins (self-hosted fonts); Node >= 22.12.0.
- Content lives in `sites/docs/src/content/docs/` — one subdirectory per section. Pages that embed Astro
  components use MDX (`.mdx`).
- Self-hosted fonts (no CDN). Pagefind only (no server-side search).
- **Spec content is fetched at build time, never duplicated.** If you find yourself hand-typing a technique
  definition, an article number, or a regulatory mapping, stop — that belongs in aegis-governance and should be
  fetched.
- Branch: `main` is protected; all changes via PR with 1 required review. Conventional commits
  (`feat:`, `docs:`, `chore:`, `fix:`).

### ATX-1: build-time fetch from aegis-governance

The threat-matrix section consumes the canonical ATX-1 spec from
[aegis-governance.com/atx-1/](https://aegis-governance.com/atx-1/) at build time.

- **Fetcher**: `scripts/fetch-atx.mjs` runs in `predev` and `prebuild`. Pulls `VERSION`, `index.json`,
  `techniques.json`, `regulatory-crossref.json`, `version-mapping.json`, `atm1-mapping.json`, and
  `atx-technique.schema.json` into `sites/docs/src/data/atx/` (gitignored).
- **Pinned minimum version**: `sites/docs/package.json#aegisGovernance.atxMinVersion`. The fetcher refuses to use
  a remote version older than this.
- **Render components**: `sites/docs/src/components/atx/TechniqueCatalog.astro` and
  `sites/docs/src/components/atx/RegulatoryCrossRef.astro`, embedded in `techniques.mdx` and
  `regulatory-crossref.mdx`.
- **Editorial framing stays local**: `index.md`, `tactics.md`, and `machine-readable.md` are hand-maintained
  operator-facing prose. Tactic descriptions and operator framing belong here, not in the spec.
- **Offline mode**: `npm --prefix sites/docs run fetch-atx:offline` (or `ATX_OFFLINE=1`) uses cached data without
  hitting the network.
- **CI drift check**: `npm --prefix sites/docs run fetch-atx:check` exits non-zero if the local cache differs
  from remote.

### Build pipeline

1. `predev` / `prebuild` runs `node ../../scripts/fetch-atx.mjs` from `sites/docs` (refreshes ATX-1 cache from
   aegis-governance).
2. `astro build` compiles MD/MDX + Astro components to static HTML.
3. `pagefind --site dist` generates the search index.
4. `postbuild` copies pagefind output to `public/` for dev mode.

Cloudflare Pages picks up `main` and runs the same pipeline on each push.

## Live state pointers

- **Active issues**: `gh issue list --repo aegis-initiative/aegis-docs`
- **Recent activity**: `git log --since='14 days ago'`
- **ATX-1 current version live**: <https://aegis-governance.com/atx-1/VERSION>
- **ATX-1 dataset index**: <https://aegis-governance.com/atx-1/index.json>
- **Pinned minimum version**: `sites/docs/package.json#aegisGovernance.atxMinVersion`

## Addendum files

The two `.claude/rules/*.md` files (`component-comparison.md`, `product-knowledge.md`) date from 2026-03-23 when
the design system was inline and the site had only six placeholder sections. They no longer reflect reality
(design-system is consumed via npm; threat-matrix exists; release-notes pipeline exists; etc.). Either refresh or
delete (known follow-up).

Create additional addenda under `.claude/` when needed (per ecosystem registry rules):

- `HISTORY.md` — long-form historical decisions
- `GOTCHAS.md` — site-specific anti-patterns
