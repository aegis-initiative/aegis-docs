---
title: TypeScript / JavaScript SDK
description: Full reference for the AEGIS TypeScript SDK.
---

# TypeScript / JavaScript SDK

The `@aegis-initiative/sdk` package provides a typed TypeScript client for submitting action proposals to the AEGIS
governance engine.

## Installation

The package is not yet published to npm. Install from source:

```bash
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-ts
npm install
npm run build
```

## AegisClient

The client is constructed with an `AegisClientOptions` object:

```typescript
import { AegisClient } from "@aegis-initiative/sdk";

// Minimal -- no auth (local development)
const client = new AegisClient({
  baseUrl: "http://127.0.0.1:8000",
});

// With API key
const client = new AegisClient({
  baseUrl: "http://127.0.0.1:8000",
  apiKey: "your-api-key",
});
```

### AegisClientOptions

```typescript
interface AegisClientOptions {
  /** Base URL of the AEGIS Platform API */
  baseUrl: string;
  /** Optional API key for authentication */
  apiKey?: string;
}
```

| Property | Type | Required | Description |
|---|---|---|---|
| `baseUrl` | `string` | Yes | Base URL of the AEGIS Platform API |
| `apiKey` | `string` | No | API key for authentication |

### `propose()` Method

```typescript
async propose(proposal: ActionProposal): Promise<GovernanceDecision>
```

Submits an `ActionProposal` to the governance engine and returns a `GovernanceDecision`.

**Current status:** Throws `Error("Not yet implemented -- awaiting aegis-platform API")` until the HTTP call to `POST
/v1/governance/propose` is implemented.

```typescript
const decision = await client.propose({
  capability: "database:query",
  resource: "production.users",
  parameters: { query: "SELECT * FROM users LIMIT 10" },
  traceId: "req-abc-123",
});
```

## ActionProposal

An interface representing an action to be evaluated by the governance engine.

```typescript
interface ActionProposal {
  /** The capability being invoked (e.g. "file:write", "network:request") */
  capability: string;
  /** The target resource for the action */
  resource: string;
  /** Action-specific parameters */
  parameters: Record<string, unknown>;
  /** Optional trace ID for request correlation */
  traceId?: string;
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `capability` | `string` | Yes | The capability being invoked |
| `resource` | `string` | Yes | The target resource for the action |
| `parameters` | `Record<string, unknown>` | Yes | Action-specific parameters |
| `traceId` | `string` | No | Optional trace ID for request correlation |

### Examples

```typescript
// File write
const proposal = {
  capability: "file:write",
  resource: "/etc/config",
  parameters: { content: "server.port=8080" },
};

// Network request with trace ID
const proposal = {
  capability: "network:request",
  resource: "https://api.example.com/data",
  parameters: { method: "POST", body: { key: "value" } },
  traceId: "trace-456",
};
```

## GovernanceDecision

An interface returned by `propose()`, containing the governance verdict.

```typescript
interface GovernanceDecision {
  /** The unique ID of the evaluated action */
  actionId: string;
  /** The governance verdict */
  decision: Verdict;
  /** Human-readable explanation of the decision */
  reason?: string;
  /** IDs of the policies that influenced this decision */
  policyIds?: string[];
  /** ISO 8601 timestamp of the decision */
  timestamp: string;
}
```

| Field | Type | Description |
|---|---|---|
| `actionId` | `string` | Unique ID of the evaluated action |
| `decision` | `Verdict` | The governance verdict |
| `reason` | `string \| undefined` | Human-readable explanation (may be absent) |
| `policyIds` | `string[] \| undefined` | IDs of the policies that influenced this decision |
| `timestamp` | `string` | ISO 8601 timestamp of the decision |

### Handling Decisions

```typescript
import { Verdict } from "@aegis-initiative/sdk";

const decision = await client.propose(proposal);

switch (decision.decision) {
  case Verdict.ALLOW:
    console.log("Approved -- proceeding");
    await executeAction();
    break;

  case Verdict.DENY:
    console.log(`Denied: ${decision.reason}`);
    console.log(`Policies: ${decision.policyIds}`);
    break;

  case Verdict.ESCALATE:
    console.log("Escalated -- routing to human reviewer");
    await notifyReviewer(decision);
    break;

  case Verdict.REQUIRE_CONFIRMATION:
    console.log("Awaiting human confirmation");
    await requestConfirmation(decision);
    break;
}
```

## Verdict Enum

```typescript
enum Verdict {
  ALLOW = "ALLOW",
  DENY = "DENY",
  ESCALATE = "ESCALATE",
  REQUIRE_CONFIRMATION = "REQUIRE_CONFIRMATION",
}
```

## Error Classes

All errors include a `helpUrl` property pointing to troubleshooting documentation at
`https://aegis-docs.com/sdk/errors`.

### AegisError

Base error for all AEGIS SDK errors. Extends the native `Error`.

```typescript
import { AegisError } from "@aegis-initiative/sdk";

try {
  const decision = await client.propose(proposal);
} catch (error) {
  if (error instanceof AegisError) {
    console.log(error.message); // Human-readable description
    console.log(error.helpUrl); // Link to troubleshooting docs
  }
}
```

**Constructor:** `new AegisError(message: string, helpUrl?: string)`

Default `helpUrl`: `https://aegis-docs.com/sdk/errors/general`

### AegisConnectionError

Thrown when the SDK cannot reach the AEGIS platform API. Subclass of `AegisError`.

```typescript
import { AegisConnectionError } from "@aegis-initiative/sdk";

try {
  const decision = await client.propose(proposal);
} catch (error) {
  if (error instanceof AegisConnectionError) {
    console.log(error.message); // e.g. "Connection refused"
    console.log(error.helpUrl); // https://aegis-docs.com/sdk/errors/connection
  }
}
```

Common causes: wrong `baseUrl`, network issues, DNS failure.

### AegisAuthError

Thrown when authentication fails (HTTP 401/403). Subclass of `AegisError`.

```typescript
import { AegisAuthError } from "@aegis-initiative/sdk";

try {
  const decision = await client.propose(proposal);
} catch (error) {
  if (error instanceof AegisAuthError) {
    console.log(error.message); // e.g. "Invalid API key"
    console.log(error.helpUrl); // https://aegis-docs.com/sdk/errors/auth
  }
}
```

Common causes: missing API key, expired key, insufficient permissions.

### AegisDeniedError

Thrown when a governance proposal is denied. Subclass of `AegisError`. Includes the denial reason and the policies that
caused it.

```typescript
import { AegisDeniedError } from "@aegis-initiative/sdk";

try {
  const decision = await client.propose(proposal);
} catch (error) {
  if (error instanceof AegisDeniedError) {
    console.log(error.reason);    // Why the action was denied
    console.log(error.policyIds); // Policy IDs that caused the denial
    console.log(error.helpUrl);   // https://aegis-docs.com/sdk/errors/denied
  }
}
```

**Constructor:** `new AegisDeniedError(reason: string, policyIds: string[])`

### Error Hierarchy

```
AegisError
  +-- AegisConnectionError
  +-- AegisAuthError
  +-- AegisDeniedError
```

### Combined Error Handling

```typescript
import {
  AegisError,
  AegisConnectionError,
  AegisAuthError,
  AegisDeniedError,
} from "@aegis-initiative/sdk";

try {
  const decision = await client.propose(proposal);
} catch (error) {
  if (error instanceof AegisDeniedError) {
    console.warn(`Denied by policies ${error.policyIds}: ${error.reason}`);
  } else if (error instanceof AegisAuthError) {
    console.error(`Auth failed: ${error.message}`);
  } else if (error instanceof AegisConnectionError) {
    console.error(`Cannot reach AEGIS: ${error.message}`);
  } else if (error instanceof AegisError) {
    console.error(`Unexpected AEGIS error: ${error.message}`);
  }
}
```

## Exports

The following are exported from `@aegis-initiative/sdk`:

```typescript
// Classes
export { AegisClient } from "./client";

// Types and enums
export { Verdict } from "./types";
export type { GovernanceDecision, ActionProposal } from "./types";

// Errors (from ./errors)
export { AegisError, AegisConnectionError, AegisDeniedError, AegisAuthError };
```

## Further Reading

- [SDK Overview](/sdk/) -- Both SDKs at a glance
- [Python SDK](/sdk/python/) -- Python equivalent
- [SDK Configuration](/sdk/configuration/) -- Constructor options and planned features
- [Source code](https://github.com/aegis-initiative/aegis-sdk/tree/main/packages/sdk-ts)
