---
title: JavaScript / TypeScript SDK
description: Getting started with the AEGIS TypeScript/JavaScript SDK.
---

# JavaScript / TypeScript SDK

The `@aegis-initiative/sdk` package provides a TypeScript-first client for the AEGIS governance platform. It works in Node.js, Deno, and any TypeScript/JavaScript runtime.

## Installation

> **Note:** The `@aegis-initiative/sdk` package is not yet published to npm. The install commands below will not work until the package is published. You can build the TypeScript SDK from source at [aegis-sdk/packages/sdk-ts](https://github.com/aegis-initiative/aegis-sdk/tree/main/packages/sdk-ts).

```bash
npm install @aegis-initiative/sdk
```

Or with other package managers:

```bash
yarn add @aegis-initiative/sdk
pnpm add @aegis-initiative/sdk
```

## Setup

> **Note:** The endpoint `https://api.aegissystems.live` is coming soon and not yet active. Authentication via API keys is not yet implemented.

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({
  endpoint: 'https://api.aegissystems.live',
  apiKey: process.env.AEGIS_API_KEY,
});
```

### Configuration Options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `endpoint` | string | Yes | -- | AEGIS platform API URL |
| `apiKey` | string | Yes | -- | API key for authentication |
| `timeout` | number | No | 30000 | Request timeout in milliseconds |
| `retries` | number | No | 3 | Number of retry attempts on transient failures |
| `retryDelay` | number | No | 1000 | Base delay between retries in milliseconds |

## Proposing an Action

```typescript
const decision = await aegis.propose({
  actor: {
    id: 'agent-001',
    type: 'ai-agent',
  },
  action: {
    capability: 'database.query',
    parameters: {
      query: 'SELECT * FROM users LIMIT 10',
      database: 'production',
    },
  },
  context: {
    session_id: 'sess_abc123',
    metadata: {
      source: 'customer-support-bot',
    },
  },
});
```

## Handling Decisions

```typescript
switch (decision.outcome) {
  case 'ALLOW':
    // Safe to execute the action
    const result = await executeQuery(decision);
    break;

  case 'DENY':
    console.log(`Action denied: ${decision.reason}`);
    break;

  case 'ESCALATE':
    // Route to human reviewer
    await notifyReviewer(decision);
    break;

  case 'REQUIRE_CONFIRMATION':
    // Present to user for approval
    const confirmed = await promptUser(decision);
    if (confirmed) {
      // Resubmit with confirmation token
    }
    break;
}
```

## Decision Object

The `propose()` method returns a typed `Decision` object:

```typescript
interface Decision {
  decision_id: string;
  outcome: 'ALLOW' | 'DENY' | 'ESCALATE' | 'REQUIRE_CONFIRMATION';
  reason: string;
  risk_score: number;
  constraints: Record<string, unknown>;
  timestamp: string;
  audit_ref: string;
}
```

## Error Handling

The SDK distinguishes between governance decisions and transport/system errors:

```typescript
import { AegisClient, AegisError, GovernanceError } from '@aegis-initiative/sdk';

try {
  const decision = await aegis.propose({ ... });
} catch (error) {
  if (error instanceof GovernanceError) {
    // Governance system error (e.g., invalid capability)
    console.error(`Governance error: ${error.message}`);
  } else if (error instanceof AegisError) {
    // Transport error (network, timeout, auth failure)
    console.error(`Transport error: ${error.message}`);
  }
}
```

## Integration Patterns

### Express Middleware

```typescript
import { AegisClient } from '@aegis-initiative/sdk';

const aegis = new AegisClient({ ... });

function governedAction(capability: string) {
  return async (req, res, next) => {
    const decision = await aegis.propose({
      actor: { id: req.agentId, type: 'ai-agent' },
      action: { capability, parameters: req.body },
    });

    if (decision.outcome === 'ALLOW') {
      req.governanceDecision = decision;
      next();
    } else {
      res.status(403).json({ outcome: decision.outcome, reason: decision.reason });
    }
  };
}
```

## Further Reading

- [SDK Overview](/sdk/) -- All supported languages
- [Python SDK](/sdk/python/) -- Python equivalent
- [SDK Configuration](/sdk/configuration/) -- Advanced configuration
- [API Reference](/api/) -- Underlying API endpoints

> **Note:** The TypeScript SDK is under active development. The package will be published to npm as the platform reaches general availability. See the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) for current status.
