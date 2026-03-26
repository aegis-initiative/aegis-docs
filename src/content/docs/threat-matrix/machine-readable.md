---
title: Machine-Readable Formats
description: Consuming ATX-1 data programmatically — STIX 2.1, JSON Schema, and structured datasets
sidebar:
  order: 4
---

# Machine-Readable Formats

ATX-1 is designed for programmatic consumption. All threat matrix data is available in structured formats for integration into security tooling, compliance dashboards, and automated governance systems.

## STIX 2.1 Bundle

The canonical machine-readable representation of ATX-1 is a [STIX 2.1](https://oasis-open.github.io/cti-documentation/stix/intro.html) bundle. STIX (Structured Threat Information Expression) is the standard format for sharing cyber threat intelligence, and ATX-1 uses it to enable interoperability with existing security infrastructure.

### Bundle Contents

The ATX-1 STIX bundle contains the following object types:

| STIX Object Type | ATX-1 Mapping | Count |
|---|---|---|
| `identity` | ATX-1 as a source identity | 1 |
| `x-mitre-matrix` | The ATX-1 matrix structure | 1 |
| `x-mitre-tactic` | Tactics (TA001--TA009) | 9 |
| `attack-pattern` | Techniques (T1001--T9001) | 20 |
| `course-of-action` | Mitigations (AEGIS governance mechanisms) | 20 |
| `relationship` | Links between techniques, tactics, and mitigations | 60+ |

The bundle uses MITRE ATT&CK STIX extensions (`x-mitre-tactic`, `x-mitre-matrix`) for compatibility with ATT&CK-aware tooling.

### Python Example

Load and query the STIX bundle using the `stix2` library:

```python
from stix2 import MemoryStore, Filter

# Load the ATX-1 STIX bundle
store = MemoryStore()
store.load_from_file("atx-1-stix-bundle.json")

# Get all tactics
tactics = store.query([Filter("type", "=", "x-mitre-tactic")])
for tactic in sorted(tactics, key=lambda t: t.get("x_mitre_shortname", "")):
    print(f"{tactic['external_references'][0]['external_id']}: {tactic['name']}")

# Get all critical-severity techniques
techniques = store.query([Filter("type", "=", "attack-pattern")])
critical = [t for t in techniques if t.get("x_mitre_severity") == "critical"]
for tech in critical:
    ext_id = tech["external_references"][0]["external_id"]
    print(f"{ext_id}: {tech['name']}")

# Get mitigations for a specific technique
relationships = store.query([
    Filter("type", "=", "relationship"),
    Filter("relationship_type", "=", "mitigates"),
    Filter("target_ref", "=", technique_id),
])
for rel in relationships:
    mitigation = store.get(rel["source_ref"])
    print(f"Mitigation: {mitigation['name']}")
```

### jq Example

Query the STIX bundle directly with `jq`:

```bash
# List all techniques with their severity
jq '.objects[]
  | select(.type == "attack-pattern")
  | {
      id: .external_references[0].external_id,
      name: .name,
      severity: .x_mitre_severity
    }' atx-1-stix-bundle.json

# Get all critical techniques
jq '.objects[]
  | select(.type == "attack-pattern" and .x_mitre_severity == "critical")
  | .external_references[0].external_id + ": " + .name' atx-1-stix-bundle.json

# Count techniques per tactic
jq '[.objects[]
  | select(.type == "relationship" and .relationship_type == "uses")]
  | group_by(.source_ref)
  | map({tactic: .[0].source_ref, count: length})' atx-1-stix-bundle.json
```

---

## JSON Schema Validation

ATX-1 data files conform to JSON Schemas defined in the aegis-governance repository. Use these schemas to validate custom ATX-1 data or to build tooling that consumes ATX-1 structures.

### Validating with ajv

```bash
# Install ajv-cli
npm install -g ajv-cli

# Validate the technique data file
ajv validate -s atx1-technique-schema.json -d atx1-techniques.json

# Validate the regulatory cross-reference
ajv validate -s atx1-regulatory-crossref-schema.json -d atx1-regulatory-crossref.json
```

### Technique Schema Structure

The technique data file (`atx1-techniques.json`) uses the following structure:

```json
{
  "matrix_id": "ATX-1",
  "version": "1.0.0",
  "techniques": [
    {
      "id": "T1001",
      "name": "Non-Owner Instruction Compliance",
      "tactic": "TA001",
      "severity": "high",
      "root_causes": ["RC1"],
      "case_study": "CS1",
      "owasp_mapping": "LLM06",
      "description": "...",
      "aegis_mitigation": {
        "constitutional_article": "Article II",
        "agp_mechanism": "Authority verification via signed actor_id"
      }
    }
  ]
}
```

### Regulatory Cross-Reference Structure

The regulatory cross-reference file (`atx1-regulatory-crossref.json`) uses the following structure:

```json
{
  "matrix_id": "ATX-1",
  "version": "1.0.0",
  "frameworks": {
    "nist_ai_rmf": {
      "version": "1.0",
      "mappings": [
        {
          "technique_id": "T1001",
          "functions": ["Map", "Manage"],
          "categories": ["MAP 3.5", "MG 2.2"],
          "rationale": "..."
        }
      ]
    },
    "eu_ai_act": {
      "regulation": "2024/1689",
      "mappings": [
        {
          "technique_ids": ["T1001", "T1002", "T1003"],
          "article": "Art. 9",
          "obligation": "Risk Management",
          "relevance": "..."
        }
      ]
    },
    "owasp_llm_top10": {
      "version": "2025",
      "mappings": [
        {
          "category": "LLM01",
          "name": "Prompt Injection",
          "technique_ids": ["T1002", "T3001", "T7002", "T8001", "T8002"],
          "relationship": "..."
        }
      ]
    }
  }
}
```

---

## Data File Locations

ATX-1 machine-readable files are maintained in the [aegis-governance](https://github.com/aegis-initiative/aegis-governance) repository:

| File | Path | Description |
|---|---|---|
| STIX 2.1 Bundle | `threat-model/atx-1/stix/atx-1-stix-bundle.json` | Complete STIX bundle with all ATX-1 objects |
| Technique Data | `threat-model/atx-1/data/atx1-techniques.json` | Structured technique catalog |
| Regulatory Cross-Ref | `threat-model/atx-1/data/atx1-regulatory-crossref.json` | Framework mappings |
| Technique Schema | `threat-model/atx-1/schemas/atx1-technique-schema.json` | JSON Schema for technique validation |
| Cross-Ref Schema | `threat-model/atx-1/schemas/atx1-regulatory-crossref-schema.json` | JSON Schema for cross-reference validation |

These files are also available for direct programmatic consumption at [aegis-governance.com](https://aegis-governance.com) — the machine-readable governance data portal. Fetch the [ATX-1 dataset index](https://aegis-governance.com/atx-1/index.json) for a complete listing of available artifacts and URLs.

---

## Integration Notes

- **ATT&CK Navigator** -- A Navigator-compatible layer file is available at [aegis-governance.com/atx-1/navigator-layer.json](https://aegis-governance.com/atx-1/navigator-layer.json) for visualization in the [ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/). Load it via "Open Existing Layer" → "Upload from URL." Note: ATX-1 uses a custom domain; techniques will display in the Navigator but are not part of the ATT&CK or ATLAS matrices.
- **Threat intelligence platforms** -- Any STIX 2.1-compatible platform (TAXII servers, OpenCTI, MISP) can ingest the ATX-1 bundle.
- **CI/CD integration** -- Use the JSON Schema files to validate ATX-1 data as part of your CI pipeline, ensuring data integrity across updates.
- **Custom tooling** -- The structured JSON data files are designed for easy consumption by custom scripts and dashboards without requiring STIX libraries.
