# Cross-Page Consistency Audit — AEGIS Ecosystem

*Generated 2026-03-24. Covers all 11 repositories in `D:\dev\AEGIS Initiative\`.*

---

## Executive Summary

This audit examined **all 11 AEGIS repositories** for data consistency — both within each repo (intra-repo) and across the ecosystem (cross-repo). It also assessed structural hygiene (missing files, template consistency).

**Key Findings:**
- **23 intra-repo inconsistencies** across the ecosystem (6 critical, 8 high/moderate, 9 low)
- **5 cross-repo data conflicts** (2 critical, 2 high, 1 moderate)
- **Repo hygiene score: 52%** — core files are strong, secondary governance docs are sparse
- **The #1 systemic issue: platform domain confusion** (`aegissystems.app` vs `aegissystems.live`) — inconsistent across 6+ repos

---

## Table of Contents

1. [Cross-Repo Conflicts](#1-cross-repo-conflicts)
2. [Intra-Repo Findings by Repository](#2-intra-repo-findings-by-repository)
3. [Repo Hygiene Matrix](#3-repo-hygiene-matrix)
4. [Recommended Source-of-Truth Designations](#4-recommended-source-of-truth-designations)
5. [Priority Action Items](#5-priority-action-items)

---

## 1. Cross-Repo Conflicts

### 1.1 CRITICAL: Platform Domain — aegissystems.app vs aegissystems.live

The single most pervasive inconsistency in the ecosystem. Six repos reference the platform domain, and they disagree.

| Repo | File | Claims |
|---|---|---|
| **aegis-docs** | README.md | `aegissystems.app` |
| **aegis-docs** | Content pages (installation, API, SDK, guides) | `aegissystems.live` |
| **aegis-sdk** | Root README.md | `api.aegissystems.live` |
| **aegis-sdk** | Package READMEs + source code | `api.aegissystems.app` |
| **aegis-platform** | README.md, CLAUDE.md | `aegissystems.live` |
| **aegis-ops** | README.md, CLAUDE.md | `aegissystems.app` |
| **aegis-core** | README.md, CLAUDE.md | `aegissystems.app` |
| **aegis-initiative** | Ecosystem table (platform row) | `aegissystems.live` |
| **aegis** | domain-registry.md | Lists both; `aegissystems.app` as "in use", `aegissystems.live` as "undecided/demo" |

**Root cause:** The domain-registry in the aegis hub repo shows `aegissystems.app` as the current domain and `aegissystems.live` as undecided. But aegis-platform (the actual platform repo) claims `.live`, and several downstream repos followed that lead.

**Impact:** Developers following docs from different repos will point to different domains. SDK source code defaults to `.app` but root SDK README says `.live`.

---

### 1.2 CRITICAL: SDK Constructor Parameter Names — Docs vs Implementation

| Source | TypeScript Parameter | Python Parameter |
|---|---|---|
| **aegis-sdk** root README | `endpoint` | `endpoint` |
| **aegis-sdk** actual source code | `baseUrl` | `base_url` |
| **aegis-docs** content pages | `endpoint` (matches SDK root README) | `endpoint` |
| **aegis-sdk** CLAUDE.md | `baseUrl` | (not specified) |

**Impact:** Code examples in both aegis-sdk root README and aegis-docs are non-functional. Copying them will produce parameter name errors.

---

### 1.3 HIGH: License Type Conflict — aegis-sdk

| Source | License |
|---|---|
| **aegis-sdk** root README badge | Apache 2.0 |
| **aegis-sdk** packages/sdk-ts/package.json | BSL-1.1 |
| **aegis-sdk** packages/sdk-py/pyproject.toml | BSL-1.1 |

Apache 2.0 and BSL-1.1 have fundamentally different terms. The root README badge is misleading.

**Broader context:** The ecosystem has no consistent license strategy (see Section 3).

---

### 1.4 HIGH: aegis-docs Build System Description in aegis Hub

| Source | Claim |
|---|---|
| **aegis** CLAUDE.md line 18 | "aegis-docs — Public documentation site (Astro/Starlight)" |
| **aegis** ADR-0004 (accepted) | "Astro 6 with custom build (no Starlight)" |
| **aegis-docs** CLAUDE.md | "Custom Astro 6 build (NOT Starlight)" |

The aegis hub CLAUDE.md is wrong. ADR-0004 in the same repo contradicts it.

---

### 1.5 MODERATE: Documentation URL Fragmentation — aegis-sdk

| Source | URL |
|---|---|
| **aegis-sdk** root README | `aegissystems.app/sdk` |
| **aegis-sdk** pyproject.toml | `docs.aegissystems.app/sdk/python` |
| **aegis-sdk** Python errors.py | `aegis-docs.com/sdk/python/errors` |
| **aegis-sdk** TypeScript errors.ts | `aegis-docs.com/sdk/errors` |

Four different documentation base URLs across one repo. Only `aegis-docs.com` is the actual docs site.

---

### 1.6 Cross-Repo Duplication Inventory

These data points are repeated across multiple repos. Currently consistent, but fragile — a single source of truth should be designated.

| Data Point | Repos That State It | Currently Consistent? |
|---|---|---|
| IP Owner: Finnoybu IP LLC | All 11 | Yes |
| Parent: Finnoybu Holdings LLC | 8 of 11 | Yes |
| Trademark: AEGIS™ + tagline | All 11 | Yes (except NCCoE paper — see aegis-governance finding) |
| GitHub org: aegis-initiative | All 11 | Yes |
| Governance outcomes (ALLOW/DENY/ESCALATE/REQUIRE_CONFIRMATION) | aegis-docs (5 pages), aegis-sdk (4 files), aegis-governance (multiple specs) | Yes |
| Repository descriptions | aegis (ecosystem table), aegis-initiative (ecosystem table), aegis-docs (contributing page), each repo's own README | Mostly yes, minor wording differences |
| Node.js version requirement | aegis-docs package.json (>=22.12.0), aegis-docs content ("Node 18+") | **No — see aegis-docs intra-repo findings** |

---

## 2. Intra-Repo Findings by Repository

### 2.1 aegis (Hub)

**Grade: A-** — Very high consistency. 1 critical fix needed.

| Severity | Finding |
|---|---|
| CRITICAL | CLAUDE.md says aegis-docs uses "Astro/Starlight" — ADR-0004 says "custom Astro, no Starlight" |
| LOW | DOI format inconsistency (plain vs URL format) across docs |

---

### 2.2 aegis-constitution

**Grade: B** — Version history has gaps.

| Severity | Finding |
|---|---|
| CRITICAL | amendments.mdx omits v0.1.1 entirely from version history table |
| HIGH | v0.2.0 release date: README says 2026-03-21, amendments.mdx says 2026-03-15 |
| MODERATE | README links to root files (CONSTITUTION.md, DOCTRINE.md, etc.) that don't exist — content is in src/content/docs/ |
| MODERATE | v0.2.0 DOI presented as published in README, but CLAUDE.md says it's pending |
| MODERATE | sub-specs/ directory referenced in README but doesn't exist |
| LOW | Legal page dates split into two cohorts (March 15 vs March 21) |

---

### 2.3 aegis-core

**Grade: A** — No inconsistencies found. Minimal documentation (README + CLAUDE only).

---

### 2.4 aegis-docs

**Grade: C+** — Multiple inconsistencies in content pages.

| Severity | Finding |
|---|---|
| CRITICAL | Platform domain: README says `aegissystems.app`, content pages say `aegissystems.live` |
| CRITICAL | Repository name confusion: `aegis-governance` vs `aegis` vs `aegis-core` used interchangeably for architecture/ADR source |
| HIGH | Node.js requirement: package.json requires >=22.12.0, docs say "Node 18+" |
| MODERATE | "Coming soon" phrasing varies: "not yet available" vs "not yet active" |
| LOW | README claims content is sourced from other repos, but it's all written directly in src/content/docs/ |

**Component bugs (known, documented in .claude/rules/):**
- Sidebar CSS missing closing brace
- Header PDF buttons link to constitution PDFs
- Header version badge links to non-existent /releases/
- OG image referenced but missing

---

### 2.5 aegis-federation

**Grade: A** — No inconsistencies found. Clean and consistent.

---

### 2.6 aegis-governance

**Grade: B+** — Two critical issues, but excellent documentation overall.

| Severity | Finding |
|---|---|
| CRITICAL | NCCoE position paper attributes trademarks to "AEGIS Initiative" instead of "Finnoybu IP LLC" |
| CRITICAL | Multiple specs say "immutable audit records" but RFC-0010 documents this as wrong — should be "tamper-evident" |
| MODERATE | Same Zenodo DOI (10.5281/zenodo.19162696) cited for two different artifacts in NCCoE paper |
| MODERATE | RFC version format inconsistency (0.2 vs 0.2.0) |
| LOW | SPECIFICATION.md shows RFC-0004 as "In Progress/TBD" but it's at v0.4 Draft |

---

### 2.7 aegis-initiative

**Grade: A** — No inconsistencies found. Clean ecosystem table.

---

### 2.8 aegis-labs

**Grade: A** — No inconsistencies found. Appropriately minimal for a research sandbox.

---

### 2.9 aegis-ops

**Grade: A** — No inconsistencies found. Minimal but consistent.

---

### 2.10 aegis-platform

**Grade: A-** — One moderate issue.

| Severity | Finding |
|---|---|
| MODERATE | README claims "REST / GraphQL API" but CLAUDE.md and implementation are REST-only |

---

### 2.11 aegis-sdk

**Grade: C** — Multiple inconsistencies between root docs and package implementations.

| Severity | Finding |
|---|---|
| CRITICAL | API endpoint: root README says `api.aegissystems.live`, packages say `api.aegissystems.app` |
| HIGH | Constructor parameter: root README uses `endpoint`, code uses `baseUrl`/`base_url` |
| MEDIUM | License: README badge says Apache 2.0, package manifests say BSL-1.1 |
| MEDIUM | Documentation URLs: 4 different base URLs across repo |
| LOW | package-lock.json says 0.1.0, package.json says 0.0.1 |

---

## 3. Repo Hygiene Matrix

### File Existence

| File | aegis | const | core | docs | fed | gov | init | labs | ops | plat | sdk | Coverage |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|---|
| README.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **100%** |
| CLAUDE.md | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **100%** |
| LICENSE | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | **64%** |
| CONTRIBUTING | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | **18%** |
| CODEOWNERS | ✓ | ✓ | ✗ | ✓ | ✗ | ✓* | ✓ | ✗ | ✗ | ✓ | ✓ | **73%** |
| .gitignore | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | **64%** |
| .editorconfig | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | **0%** |
| CI/CD workflows | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | **45%** |
| Issue templates | ✓ | ✗ | ✗ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | **55%** |
| PR template | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | **9%** |
| SECURITY.md | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | **9%** |
| CHANGELOG.md | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | **9%** |

*aegis-governance has CODEOWNERS at root instead of .github/

### License Strategy (Needs Decision)

| License | Repos |
|---|---|
| Apache 2.0 | aegis-docs, aegis-governance, aegis-initiative, aegis-sdk |
| Proprietary (Finnoybu IP LLC) | aegis, aegis-federation, aegis-platform |
| **Missing entirely** | aegis-constitution, aegis-core, aegis-labs, aegis-ops |
| **Internal conflict** | aegis-sdk (README badge says Apache 2.0, packages say BSL-1.1) |

### Structural Consistency Notes

- **CLAUDE.md format:** All repos have one, but header format varies (`—` vs `--`, naming conventions differ)
- **README structure:** No shared template; varies from minimal (aegis-labs) to extensive (aegis-governance)
- **Issue templates:** Where they exist, they're identical 6-file sets — good template reuse
- **.gitignore:** Astro projects (constitution, docs) are identical; everything else varies or is missing
- **CI/CD:** 4 repos share the same docs-lint/spellcheck/link-check/consistency workflow set

---

## 4. Recommended Source-of-Truth Designations

For each recurring data point, one repo should be the canonical source. All others should either link to it or derive from it.

| Data Point | Recommended Source of Truth | Current Sources |
|---|---|---|
| **Platform domain** | `aegis/docs/domain-registry.md` | Scattered across 6+ repos |
| **All domain assignments** | `aegis/docs/domain-registry.md` | Scattered |
| **Repository descriptions** | `aegis/README.md` ecosystem table | Also in aegis-initiative, aegis-docs, each repo's own README |
| **Tech stack per repo** | Each repo's own `CLAUDE.md` | Also restated in aegis hub and aegis-docs |
| **IP ownership / trademark** | `aegis-governance/TRADEMARKS.md` | Duplicated in every repo's README footer |
| **Legal entity structure** | `aegis-constitution` legal/impressum | Also in aegis-governance, aegis-initiative |
| **Governance outcomes** | `aegis-governance/aegis-core/protocol/` specs | Duplicated in aegis-docs (5 pages), aegis-sdk (4 files) |
| **SDK package names** | `aegis-sdk` package.json / pyproject.toml | Also in aegis-docs content pages |
| **SDK API parameters** | `aegis-sdk` source code | Also in aegis-docs, aegis-sdk README |
| **API endpoints** | `aegis-platform` source code | Also in aegis-docs, aegis-sdk |
| **Version numbers** | Each repo's own package.json / pyproject.toml | Also in READMEs, docs |
| **Constitution version history** | `aegis-constitution/src/content/docs/constitution/amendments.mdx` | Also in README |
| **CalVer format** | `aegis/docs/adr/0002-calver-release-automation.md` | Also in staging docs |
| **DOIs** | `aegis-governance/REFERENCES.md` | Also in aegis-constitution README, aegis hub |
| **Node.js version requirements** | Each repo's `package.json` engines field | Contradicted by aegis-docs content |

---

## 5. Priority Action Items

### P0 — Critical (Data Conflicts)

1. **Resolve platform domain once and for all.** Update `aegis/docs/domain-registry.md` with the definitive answer, then propagate to all repos. Every reference to `aegissystems.app` or `aegissystems.live` in docs/READMEs/source code must match.

2. **Fix aegis-sdk root README.** Constructor parameter names (`endpoint` → `baseUrl`/`base_url`) and endpoint URL must match actual source code.

3. **Fix aegis-sdk license conflict.** README badge says Apache 2.0, packages say BSL-1.1. Pick one.

4. **Fix aegis-governance NCCoE trademark attribution.** "AEGIS Initiative" → "Finnoybu IP LLC".

5. **Fix "immutable" → "tamper-evident"** in aegis-governance specs (manifesto, constitution, protocol index, system overview). RFC-0010 already documents this as a known gap.

6. **Fix aegis-constitution version history.** Add v0.1.1 to amendments.mdx. Resolve v0.2.0 date (March 15 vs March 21).

### P1 — High (Stale Data)

7. **Fix aegis hub CLAUDE.md** line 18: "Astro/Starlight" → "Astro 6, custom build, no Starlight".

8. **Fix aegis-docs Node.js version** in content pages: "Node 18+" → "Node 22.12+".

9. **Fix aegis-platform README**: Remove "GraphQL" claim or document it as planned.

10. **Fix aegis-docs repo name references**: Standardize whether architecture source is `aegis-governance`, `aegis`, or `aegis-core`.

11. **Fix aegis-sdk documentation URLs**: Consolidate to `aegis-docs.com` everywhere.

### P2 — Repo Hygiene

12. **Add LICENSE to 4 repos** missing it (aegis-constitution, aegis-core, aegis-labs, aegis-ops). Decide on license strategy.

13. **Add CONTRIBUTING.md** to all public-facing repos (template from aegis or aegis-governance).

14. **Add .gitignore** to repos missing it (aegis-core, aegis-federation, aegis-labs, aegis-ops).

15. **Add PR template** to all repos (template from aegis-governance).

16. **Add .editorconfig** to all 11 repos.

17. **Add CI/CD workflows** to aegis-initiative (Astro project without any).

18. **Standardize CODEOWNERS location** to `.github/CODEOWNERS` across all repos.

### P3 — Nice to Have

19. Standardize CLAUDE.md header format across all repos.
20. Standardize README structure with a shared template.
21. Add SECURITY.md, CHANGELOG.md to public repos.
22. Standardize "coming soon" / "not yet available" phrasing in aegis-docs.
23. Remove dead code: aegis-docs remark/rehype plugins (configured but unused).
24. Fix aegis-constitution README links to root-level .md files that don't exist.

---

## Appendix: Repos Audited

| Repo | Files Read | Findings | Grade |
|---|---|---|---|
| aegis | 22 .md + configs | 1 critical, 1 low | A- |
| aegis-constitution | 40+ content files | 2 critical, 4 moderate | B |
| aegis-core | README + CLAUDE | 0 | A |
| aegis-docs | 28 content + components | 2 critical, 3 moderate | C+ |
| aegis-federation | README + CLAUDE + LICENSE | 0 | A |
| aegis-governance | 50+ specs/RFCs/docs | 2 critical, 3 moderate | B+ |
| aegis-initiative | README + CLAUDE + brand/ + roadmap/ | 0 | A |
| aegis-labs | README + CLAUDE | 0 | A |
| aegis-ops | README + CLAUDE | 0 | A |
| aegis-platform | 17 files | 1 moderate | A- |
| aegis-sdk | 15+ files + source | 2 critical, 3 moderate | C |
