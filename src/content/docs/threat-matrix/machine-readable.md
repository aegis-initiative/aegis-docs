---
title: Machine-Readable Formats
description: Consuming ATX-1 v2.3 data programmatically — STIX 2.1, JSON Schema, and structured datasets served from aegis-governance.com
sidebar:
  order: 4
---

# Machine-Readable Formats

ATX-1 is designed for programmatic consumption. The canonical machine-readable artifacts live at
[aegis-governance.com/atx-1/](https://aegis-governance.com/atx-1/) and are served as static JSON for direct fetch by
security tooling, compliance dashboards, and automated governance systems.

## Quick Reference: Live Endpoints

All artifacts are public, CC-BY-SA-4.0, and updated whenever ATX-1 ships a new version.

| Artifact | URL |
|---|---|
| Dataset index | [`/atx-1/index.json`](https://aegis-governance.com/atx-1/index.json) |
| Current version | [`/atx-1/VERSION`](https://aegis-governance.com/atx-1/VERSION) |
| Technique database | [`/atx-1/techniques.json`](https://aegis-governance.com/atx-1/techniques.json) |
| STIX 2.1 bundle | [`/atx-1/stix-bundle.json`](https://aegis-governance.com/atx-1/stix-bundle.json) |
| Regulatory cross-reference | [`/atx-1/regulatory-crossref.json`](https://aegis-governance.com/atx-1/regulatory-crossref.json) |
| ATM-1 ↔ ATX-1 mapping | [`/atx-1/atm1-mapping.json`](https://aegis-governance.com/atx-1/atm1-mapping.json) |
| ATT&CK Navigator layer | [`/atx-1/navigator-layer.json`](https://aegis-governance.com/atx-1/navigator-layer.json) |
| Validation against aegis-core | [`/atx-1/validation-aegis-core.json`](https://aegis-governance.com/atx-1/validation-aegis-core.json) |
| ACF-1 counterfactual bundle | [`/atx-1/acf-1-bundle.json`](https://aegis-governance.com/atx-1/acf-1-bundle.json) |
| Version-mapping history | [`/atx-1/version-mapping.json`](https://aegis-governance.com/atx-1/version-mapping.json) |
| Technique JSON Schema | [`/schemas/atx-technique.schema.json`](https://aegis-governance.com/schemas/atx-technique.schema.json) |

The `index.json` file is the source of truth for the full artifact list — point your tooling at it for discovery.

## STIX 2.1 Bundle

The canonical interchange format for ATX-1 is a [STIX 2.1](https://oasis-open.github.io/cti-documentation/stix/intro.html)
bundle that uses MITRE ATT&CK STIX extensions (`x-mitre-tactic`, `x-mitre-matrix`) for compatibility with ATT&CK-aware
tooling.

### Bundle Contents

| STIX Object Type | ATX-1 Mapping |
|---|---|
| `identity` | ATX-1 / AEGIS Operations LLC as the source identity |
| `x-mitre-matrix` | The ATX-1 matrix container |
| `x-mitre-tactic` | All tactics (TA001–TA010) |
| `attack-pattern` | All techniques and sub-techniques |
| `course-of-action` | AEGIS governance mitigations |
| `relationship` | Cross-references between techniques, tactics, and mitigations |

### Python Example

Load and query the bundle using the `stix2` library:

```python
import json
import urllib.request
from stix2 import MemoryStore, Filter

# Load the live ATX-1 STIX bundle
with urllib.request.urlopen("https://aegis-governance.com/atx-1/stix-bundle.json") as resp:
    bundle = json.load(resp)

store = MemoryStore(stix_data=bundle["objects"])

# List every tactic
tactics = store.query([Filter("type", "=", "x-mitre-tactic")])
for tactic in sorted(tactics, key=lambda t: t.get("x_mitre_shortname", "")):
    ext = next(r for r in tactic["external_references"] if r.get("source_name") == "atx-1")
    print(f'{ext["external_id"]}: {tactic["name"]}')

# List the techniques in TA001
techniques = store.query([Filter("type", "=", "attack-pattern")])
ta001 = [
    t for t in techniques
    if any(p.get("kill_chain_name") == "atx-1" and p.get("phase_name") == "ta001"
           for p in t.get("kill_chain_phases", []))
]
for tech in ta001:
    ext = next(r for r in tech["external_references"] if r.get("source_name") == "atx-1")
    print(f'  {ext["external_id"]}: {tech["name"]}')
```

### jq Example

Fetch and query the bundle directly:

```bash
# List every technique with its tactic
curl -s https://aegis-governance.com/atx-1/stix-bundle.json | jq '
  .objects[]
  | select(.type == "attack-pattern")
  | {
      id: (.external_references[] | select(.source_name == "atx-1") | .external_id),
      name: .name,
      tactic: .kill_chain_phases[0].phase_name
    }'
```

## Plain-JSON Technique Database

For consumers that do not need STIX semantics, `techniques.json` is a flat array of technique objects validated against
[`atx-technique.schema.json`](https://aegis-governance.com/schemas/atx-technique.schema.json) (JSON Schema Draft 2020-12).

### Schema (representative entry)

The actual file is a flat top-level array. Each entry has the following shape:

```json
[
  {
    "id": "T1001",
    "name": "Execute Non-Owner Instruction",
    "tactic": "TA001",
    "tactic_name": "Violate Authority Boundaries",
    "description": "...",
    "root_cause": "RC1 (No Stakeholder Model) — ...",
    "agents_of_chaos_case": [1],
    "owasp_mapping": ["LLM06"],
    "aegis_mitigation": {
      "constitutional_article": "Authority Delegation",
      "agp_mechanism": "AGP Stakeholder Model",
      "mechanism": "Formal principal hierarchy ..."
    },
    "v1_id": "T1001"
  }
]
```

Sub-techniques carry an additional `parent_technique` field with the parent's `id`, e.g. `"parent_technique": "T9002"`.

### Validating with ajv

```bash
# Install ajv-cli
npm install -g ajv-cli ajv-formats

# Pull both files locally
curl -sO https://aegis-governance.com/schemas/atx-technique.schema.json
curl -sO https://aegis-governance.com/atx-1/techniques.json

# Validate
ajv validate -c ajv-formats -s atx-technique.schema.json -d techniques.json
```

## Regulatory Cross-Reference Structure

`regulatory-crossref.json` shape (top-level fields, then per-technique mapping):

```json
{
  "version": "2.3.0",
  "date": "2026-04-24",
  "techniques": [
    {
      "id": "T1001",
      "name": "Execute Non-Owner Instruction",
      "tactic": "TA001",
      "nist_ai_rmf": {
        "functions": ["Govern", "Manage"],
        "description": "GOVERN 1.1 ..."
      },
      "eu_ai_act": {
        "articles": ["Article 9", "Article 14"],
        "description": "Art. 9 Risk management system ..."
      },
      "owasp_llm_top_10": ["LLM06"],
      "atm_1_scenario": "Agent executes destructive operations ..."
    }
  ]
}
```

## Polling for New Versions

The lightest-weight integration is to poll `/atx-1/VERSION` (a 6-byte text file containing a semver string) and refresh
your local cache when it changes. The `aegis-docs` site itself uses this pattern — see
[`scripts/fetch-atx.mjs`](https://github.com/aegis-initiative/aegis-docs/blob/main/scripts/fetch-atx.mjs) for a reference
implementation that pins a minimum version, validates JSON, and refuses to downgrade.

## Source Repository

All ATX-1 source files live in
[`aegis-governance/docs/atx/v2/`](https://github.com/aegis-initiative/aegis-governance/tree/main/docs/atx/v2). The deploy
to `aegis-governance.com/atx-1/` is automated by
[`site/scripts/sync-atx.mjs`](https://github.com/aegis-initiative/aegis-governance/blob/main/site/scripts/sync-atx.mjs)
in the `prebuild` step of the governance site. To file an issue or contribute a technique, open against
[`aegis-initiative/aegis-governance`](https://github.com/aegis-initiative/aegis-governance).

## Integration Notes

- **ATT&CK Navigator** — Load the layer file via "Open Existing Layer" → "Upload from URL," pointing at
  [`/atx-1/navigator-layer.json`](https://aegis-governance.com/atx-1/navigator-layer.json). ATX-1 uses a custom kill
  chain; techniques render in Navigator but are not part of the ATT&CK or ATLAS matrices.
- **Threat intelligence platforms** — Any STIX 2.1-compatible platform (TAXII servers, OpenCTI, MISP) can ingest the
  bundle as-is.
- **CI/CD integration** — Use `atx-technique.schema.json` to validate custom ATX-1 data or to gate PRs that touch
  technique definitions.
- **Custom tooling** — The plain-JSON files are designed for easy consumption without requiring STIX libraries.
