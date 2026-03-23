---
title: Quick Start
description: Install the AEGIS SDK and make your first governance call in minutes.
---

# Quick Start

This guide walks you through installing the AEGIS SDK and making your first governance call. By the end, you will have a working integration that proposes an action and receives a governance decision.

## Prerequisites

- An AEGIS platform account at [aegissystems.live](https://aegissystems.live)
- Node.js 18+ (for TypeScript) or Python 3.10+ (for Python)
- An API key from the AEGIS operator dashboard

## Install the SDK

### TypeScript / JavaScript

```bash
npm install @aegis-initiative/sdk
```

### Python

```bash
pip install aegis-sdk
```

## Make Your First Governance Call

### TypeScript

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
});

const decision = await aegis.propose({
  actor: { id: 'agent-001', type: 'ai-agent' },
  action: {
    capability: 'database.query',
    parameters: { query: 'SELECT * FROM users LIMIT 10' },
  },
});

console.log(decision.outcome); // ALLOW, DENY, ESCALATE, or REQUIRE_CONFIRMATION

if (decision.outcome === 'ALLOW') {
  // Safe to execute the action
}
```

### Python

```python
from aegis_sdk import AegisClient
import os

aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
)

decision = aegis.propose(
    actor={"id": "agent-001", "type": "ai-agent"},
    action={
        "capability": "database.query",
        "parameters": {"query": "SELECT * FROM users LIMIT 10"},
    },
)

print(decision.outcome)  # ALLOW, DENY, ESCALATE, or REQUIRE_CONFIRMATION

if decision.outcome == "ALLOW":
    # Safe to execute the action
    pass
```

## Understanding the Response

Every governance call returns a decision with one of four outcomes:

| Outcome | Meaning | What to Do |
|---|---|---|
| `ALLOW` | Action approved | Proceed with execution |
| `DENY` | Action rejected | Do not execute; check `decision.reason` for details |
| `ESCALATE` | Requires elevated review | Route to human reviewer or higher-authority governance node |
| `REQUIRE_CONFIRMATION` | Needs explicit human approval | Present to user for confirmation before proceeding |

## Next Steps

- [Core Concepts](/getting-started/core-concepts/) -- Understand the governance model in depth
- [SDK Reference](/sdk/) -- Full SDK documentation for TypeScript and Python
- [Writing Your First Policy](/guides/policy-authoring/) -- Define governance rules for your use case

> **Note:** The AEGIS SDK and platform API are under active development. SDK packages will be published to npm and PyPI as the platform reaches general availability. See the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) for current status.
