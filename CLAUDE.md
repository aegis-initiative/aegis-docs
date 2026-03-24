# CLAUDE.md -- aegis-docs

## Project
The public AEGIS documentation site at aegis-docs.com -- built with a custom Astro 6 build (not Starlight), sharing a design system with aegis-constitution.

## Org Context
- GitHub Org: github.com/aegis-initiative
- IP Owner: Finnoybu IP LLC
- Parent Ecosystem: Finnoybu Holdings LLC
- Domain: aegis-docs.com (public docs), aegis-platform.net (platform)

## This Repo's Role
aegis-docs is the public-facing documentation hub for the entire AEGIS ecosystem. It aggregates content from multiple source repos -- governance from aegis-constitution, architecture from aegis, API docs from aegis-platform, and SDK docs from aegis-sdk. All rendered as a unified documentation site.

## Stack
- **Framework:** Astro 6 (custom build, NOT Starlight)
- **Content:** Markdown/MDX via Astro content collections (glob loader)
- **Search:** Pagefind (client-side, built at deploy time)
- **Styling:** Custom CSS with IBM Plex Sans + Poppins (self-hosted fonts)
- **Design System:** Shared with aegis-constitution -- same components, tokens, and patterns

## Architecture

### Design System Sharing
aegis-docs and aegis-constitution use the same custom design system:
- IBM Plex Sans (body) + Poppins (headings)
- Light/dark theme toggle via CSS custom properties
- Shared components: Header, Footer, Aside, SearchDialog, ThemeToggle
- Components will be extracted into a shared package; until then, copied from constitution

### Content Collections
Content lives in `src/content/docs/` using Astro's glob loader. Schema defined in `src/content.config.ts` with fields: title, description, section, sidebar (order, hidden).

### Content Sources
| Section | Source Repo |
|---------|-------------|
| Governance | aegis-constitution, aegis (doctrine/) |
| Architecture | aegis (docs/adr/) |
| Platform API | aegis-platform |
| SDK | aegis-sdk |
| Contributing | aegis, aegis-ops |

### Build Pipeline
`astro build` compiles MDX to static HTML, then `pagefind --site dist` generates the search index. The postbuild script copies pagefind output to `public/` for dev mode.

## Repo Structure
```
src/
  content.config.ts      # Content collection schema
  content/docs/          # Documentation content (MDX/MD)
  components/            # Astro components (shared with constitution)
  layouts/               # Page layouts (DocLayout, BaseLayout)
  pages/                 # Astro pages (index, [...slug])
  plugins/               # Remark/rehype plugins
  assets/                # SVG logos, optimized images
public/
  fonts/                 # Self-hosted IBM Plex Sans + Poppins
  favicon.svg            # AEGIS shield favicon
docs/                    # Content architecture documentation
```

## Related Repos
- aegis-constitution -- Shares design system; governance content source
- aegis-platform -- API docs source
- aegis-sdk -- SDK reference docs source
- aegis -- ADRs, doctrine, architecture specs source
- aegis-ops -- CI/CD workflows and deployment configs

## Key Conventions
- Content in `src/content/docs/` -- one subdirectory per section
- Custom Astro 6 build with MDX (no Starlight)
- Self-hosted fonts (no CDN)
- Pagefind for search (no server-side search)
- All content in Markdown/MDX -- no hand-edited HTML pages
- Branch: main is protected; all changes via PR with 1 required review
- Commit style: conventional commits (feat:, docs:, chore:, fix:)

## Current Focus
Initial site scaffold -- Astro config, content collections, landing page stub. Next: copy shared design system components from aegis-constitution.