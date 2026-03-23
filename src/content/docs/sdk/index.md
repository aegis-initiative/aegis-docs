---
title: SDK Overview
description: Client SDK libraries for integrating with the AEGIS governance platform.
---

# SDK Overview

The AEGIS SDK provides client libraries for integrating AI systems with the AEGIS governance platform. Rather than calling the REST API directly, the SDK handles authentication, request formatting, retries, and response parsing.

## Supported Languages

| Package | Language | Registry | Install |
|---|---|---|---|
| `@aegis-initiative/sdk` | TypeScript / JavaScript | npm | `npm install @aegis-initiative/sdk` |
| `aegis-sdk` | Python | PyPI | `pip install aegis-sdk` |

## What the SDK Provides

- **Action proposal** -- Submit governance proposals with a simple `propose()` call
- **Decision handling** -- Typed responses with outcome, reasoning, and constraints
- **Authentication** -- Automatic API key management and token refresh
- **Retries** -- Configurable retry logic with exponential backoff
- **Error handling** -- Typed errors for governance failures vs. transport failures
- **Type safety** -- Full TypeScript types and Python type hints

## Quick Example

### TypeScript

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
});

const decision = await aegis.propose({
  actor: { id: 'agent-001', type: 'ai-agent' },
  action: { capability: 'database.query', parameters: { query: '...' } },
});

if (decision.outcome === 'ALLOW') {
  // execute
}
```

### Python

```python
from aegis_sdk import AegisClient

aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
)

decision = aegis.propose(
    actor={"id": "agent-001", "type": "ai-agent"},
    action={"capability": "database.query", "parameters": {"query": "..."}},
)

if decision.outcome == "ALLOW":
    # execute
    pass
```

## Governance Outcomes

Both SDKs return one of four governance outcomes:

| Outcome | Meaning |
|---|---|
| `ALLOW` | Action approved -- proceed with execution |
| `DENY` | Action rejected -- do not execute |
| `ESCALATE` | Requires elevated review before proceeding |
| `REQUIRE_CONFIRMATION` | Requires explicit human approval |

## Language-Specific Guides

- [TypeScript / JavaScript SDK](/sdk/javascript/) -- Installation, configuration, and usage
- [Python SDK](/sdk/python/) -- Installation, configuration, and usage
- [SDK Configuration](/sdk/configuration/) -- Advanced configuration options

## Source Code

The SDK source code is maintained in the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk):

```
aegis-sdk/
  packages/
    sdk-ts/        # TypeScript/JavaScript SDK
    sdk-py/        # Python SDK
```

> **Note:** The AEGIS SDKs are under active development. Packages will be published to npm and PyPI as the platform reaches general availability.
