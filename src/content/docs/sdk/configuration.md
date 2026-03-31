---
title: SDK Configuration
description: Configuration options for the AEGIS TypeScript and Python SDKs.
---

# SDK Configuration

This page documents the configuration options available in both AEGIS SDKs, and is honest about what is implemented
versus planned.

## Constructor Options

Both SDKs currently accept a minimal set of constructor options. Additional configuration (retries, timeouts, logging)
is planned but not yet implemented.

### Python

```python
from aegis_sdk import AegisClient

client = AegisClient(
    base_url="http://127.0.0.1:8000",
    api_key="your-api-key",          # optional
)
```

| Parameter | Type | Required | Default | Status |
|---|---|---|---|---|
| `base_url` | `str` | Yes | -- | Implemented |
| `api_key` | `str \| None` | No | `None` | Implemented (stored, not yet sent in requests) |

### TypeScript

```typescript
import { AegisClient } from "@aegis-initiative/sdk";

const client = new AegisClient({
  baseUrl: "http://127.0.0.1:8000",
  apiKey: "your-api-key",            // optional
});
```

| Property | Type | Required | Default | Status |
|---|---|---|---|---|
| `baseUrl` | `string` | Yes | -- | Implemented |
| `apiKey` | `string` | No | `undefined` | Implemented (stored, not yet sent in requests) |

## What Is Implemented

The SDKs currently implement:

- **Client construction** with `base_url`/`baseUrl` and optional `api_key`/`apiKey`
- **`propose()` method signature** accepting an `ActionProposal` and returning `Promise<GovernanceDecision>` --
currently stubbed with `NotImplementedError` / `Error`
- **Type definitions** -- `ActionProposal`, `GovernanceDecision`, `Verdict` enum
- **Error hierarchy** -- `AegisError`, `AegisConnectionError`, `AegisAuthError`, `AegisDeniedError`

## What Is Planned (Not Yet Implemented)

The following features are planned but do not exist in the current source code:

### Timeout Configuration

Not yet available. When implemented, both SDKs will support a configurable request timeout.

### Retry Logic

Not yet available. Planned behavior:

- Automatic retries for transient failures (network errors, timeouts, 5xx responses)
- Governance decisions (including `DENY`) will never be retried
- Exponential backoff with jitter

### Environment Variables

Not yet implemented. Planned variables:

| Variable | Description |
|---|---|
| `AEGIS_API_KEY` | API key for authentication |
| `AEGIS_ENDPOINT` | Platform API URL |

### Logging

Not yet available. The SDKs do not currently emit logs. Standard Python `logging` integration and a TypeScript
`logLevel` option are planned.

### Custom HTTP Client

Not yet available. The SDKs do not currently accept a custom HTTP client or fetch implementation.

### Async Client (Python)

There is no separate `AsyncAegisClient` class. The existing `AegisClient.propose()` method is already `async`. A
synchronous wrapper may be added in the future.

## Local Development

For local development against a running aegis-platform instance:

### Python

```python
from aegis_sdk import AegisClient, ActionProposal

client = AegisClient(base_url="http://127.0.0.1:8000")

proposal = ActionProposal(
    capability="file:write",
    resource="/tmp/test.txt",
    parameters={"content": "hello"},
)

# Will raise NotImplementedError until platform API is deployed
decision = await client.propose(proposal)
```

### TypeScript

```typescript
import { AegisClient } from "@aegis-initiative/sdk";

const client = new AegisClient({
  baseUrl: "http://127.0.0.1:8000",
});

// Will throw Error until platform API is deployed
const decision = await client.propose({
  capability: "file:write",
  resource: "/tmp/test.txt",
  parameters: { content: "hello" },
});
```

## Further Reading

- [Python SDK](/sdk/python/) -- Full Python reference
- [TypeScript SDK](/sdk/javascript/) -- Full TypeScript reference
- [Source code](https://github.com/aegis-initiative/aegis-sdk)
