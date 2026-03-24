---
title: SDK Overview
description: Client SDK libraries for integrating with the AEGIS governance platform.
---

# SDK Overview

The AEGIS SDK provides client libraries for submitting action proposals to the AEGIS governance engine and receiving typed governance decisions. Both SDKs wrap the `POST /v1/governance/propose` REST endpoint.

## Current Status

Both SDKs are in early development. The `propose()` method is stubbed -- it raises `NotImplementedError` (Python) / throws `Error` (TypeScript) until the aegis-platform API is deployed. The type definitions, error hierarchy, and client structure are implemented and usable for development.

**The packages are not yet published to npm or PyPI.** Install from source:

```bash
# Python
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-py
pip install -e .

# TypeScript
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-ts
npm install && npm run build
```

## Supported Languages

| Package | Language | Version | Registry |
|---|---|---|---|
| `aegis-sdk` | Python 3.10+ | 0.0.1 | PyPI *(not yet published)* |
| `@aegis-initiative/sdk` | TypeScript | 0.0.1 | npm *(not yet published)* |

## What the SDK Provides Today

- **Action proposal** -- Submit governance proposals via `propose()` (stubbed, awaiting platform API)
- **Typed models** -- `ActionProposal` and `GovernanceDecision` dataclasses/interfaces matching the AGP schema
- **Verdict enum** -- `ALLOW`, `DENY`, `ESCALATE`, `REQUIRE_CONFIRMATION`
- **Error hierarchy** -- `AegisError`, `AegisConnectionError`, `AegisDeniedError`, `AegisAuthError`, each with documentation URLs
- **Type safety** -- Full TypeScript types and Python type hints

## Quick Example

### Python

```python
from aegis_sdk import AegisClient, ActionProposal, Verdict

client = AegisClient(base_url="http://127.0.0.1:8000")

proposal = ActionProposal(
    capability="file:write",
    resource="/etc/config",
    parameters={"content": "new config"},
)

# Once the platform API is deployed:
decision = await client.propose(proposal)

if decision.decision == Verdict.ALLOW:
    # Safe to proceed
    pass
```

### TypeScript

```typescript
import { AegisClient, Verdict } from "@aegis-initiative/sdk";

const client = new AegisClient({
  baseUrl: "http://127.0.0.1:8000",
});

// Once the platform API is deployed:
const decision = await client.propose({
  capability: "file:write",
  resource: "/etc/config",
  parameters: { content: "new config" },
});

if (decision.decision === Verdict.ALLOW) {
  // Safe to proceed
}
```

## Governance Verdicts

Both SDKs use the same four verdicts, defined in the `Verdict` enum:

| Verdict | Meaning |
|---|---|
| `ALLOW` | Action is permitted under current policy |
| `DENY` | Action is forbidden under current policy |
| `ESCALATE` | Action requires review by a higher authority |
| `REQUIRE_CONFIRMATION` | Action is permitted only after explicit human confirmation |

## Language-Specific Guides

- [Python SDK](/sdk/python/) -- Full reference for the Python client
- [TypeScript / JavaScript SDK](/sdk/javascript/) -- Full reference for the TypeScript client
- [SDK Configuration](/sdk/configuration/) -- Constructor options and planned configuration

## Source Code

The SDK source code is maintained in the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk):

```
aegis-sdk/
  packages/
    sdk-ts/        # TypeScript/JavaScript SDK
    sdk-py/        # Python SDK
```
