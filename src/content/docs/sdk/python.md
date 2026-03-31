---
title: Python SDK
description: Full reference for the AEGIS Python SDK.
---

# Python SDK

The `aegis-sdk` Python package provides a typed client for submitting action proposals to the AEGIS governance engine.
It requires Python 3.10+ and uses `dataclasses`, `StrEnum`, and `from __future__ import annotations`.

## Installation

The package is not yet published to PyPI. Install from source:

```bash
git clone https://github.com/aegis-initiative/aegis-sdk.git
cd aegis-sdk/packages/sdk-py
pip install -e .
```

## AegisClient

The client is constructed with a `base_url` and an optional `api_key`:

```python
from aegis_sdk import AegisClient

# Minimal -- no auth (local development)
client = AegisClient(base_url="http://127.0.0.1:8000")

# With API key
client = AegisClient(
    base_url="http://127.0.0.1:8000",
    api_key="your-api-key",
)
```

### Constructor Parameters

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `base_url` | `str` | Yes | -- | Base URL of the AEGIS Platform API |
| `api_key` | `str \| None` | No | `None` | API key for authentication |

Both parameters are keyword-only.

### `propose()` Method

```python
async def propose(self, proposal: ActionProposal) -> GovernanceDecision
```

Submits an `ActionProposal` to the governance engine and returns a `GovernanceDecision`. This is an `async` method.

**Current status:** Raises `NotImplementedError` -- the HTTP call to `POST /v1/governance/propose` is stubbed until the
aegis-platform API is deployed.

```python
from aegis_sdk import AegisClient, ActionProposal

client = AegisClient(base_url="http://127.0.0.1:8000")

proposal = ActionProposal(
    capability="database:query",
    resource="production.users",
    parameters={"query": "SELECT * FROM users LIMIT 10"},
    trace_id="req-abc-123",
)

decision = await client.propose(proposal)
```

## ActionProposal

A frozen dataclass representing an action to be evaluated by the governance engine.

```python
@dataclass(frozen=True)
class ActionProposal:
    capability: str
    resource: str
    parameters: dict[str, Any] = field(default_factory=dict)
    trace_id: str | None = None
```

| Field | Type | Required | Description |
|---|---|---|---|
| `capability` | `str` | Yes | The capability being invoked (e.g. `"file:write"`, `"network:request"`) |
| `resource` | `str` | Yes | The target resource for the action |
| `parameters` | `dict[str, Any]` | No | Action-specific parameters (defaults to `{}`) |
| `trace_id` | `str \| None` | No | Optional trace ID for request correlation |

### Examples

```python
from aegis_sdk import ActionProposal

# File write
proposal = ActionProposal(
    capability="file:write",
    resource="/etc/config",
    parameters={"content": "server.port=8080"},
)

# Network request
proposal = ActionProposal(
    capability="network:request",
    resource="https://api.example.com/data",
    parameters={"method": "POST", "body": {"key": "value"}},
    trace_id="trace-456",
)

# Minimal -- no parameters
proposal = ActionProposal(
    capability="file:read",
    resource="/var/log/app.log",
)
```

## GovernanceDecision

A frozen dataclass returned by `propose()`, containing the governance verdict.

```python
@dataclass(frozen=True)
class GovernanceDecision:
    action_id: str
    decision: Verdict
    timestamp: str
    reason: str | None = None
    policy_ids: list[str] = field(default_factory=list)
```

| Field | Type | Description |
|---|---|---|
| `action_id` | `str` | Unique ID of the evaluated action |
| `decision` | `Verdict` | The governance verdict (`ALLOW`, `DENY`, `ESCALATE`, `REQUIRE_CONFIRMATION`) |
| `timestamp` | `str` | ISO 8601 timestamp of the decision |
| `reason` | `str \| None` | Human-readable explanation (may be `None`) |
| `policy_ids` | `list[str]` | IDs of the policies that influenced this decision |

### Handling Decisions

```python
from aegis_sdk import Verdict

decision = await client.propose(proposal)

match decision.decision:
    case Verdict.ALLOW:
        print("Approved -- proceeding")
        execute_action()

    case Verdict.DENY:
        print(f"Denied: {decision.reason}")
        print(f"Policies: {decision.policy_ids}")

    case Verdict.ESCALATE:
        print("Escalated -- routing to human reviewer")
        notify_reviewer(decision)

    case Verdict.REQUIRE_CONFIRMATION:
        print("Awaiting human confirmation")
        request_confirmation(decision)
```

## Verdict Enum

A `StrEnum` with four values:

```python
class Verdict(StrEnum):
    ALLOW = "ALLOW"
    DENY = "DENY"
    ESCALATE = "ESCALATE"
    REQUIRE_CONFIRMATION = "REQUIRE_CONFIRMATION"
```

Because `Verdict` extends `StrEnum`, you can compare directly with strings:

```python
decision.decision == "ALLOW"       # True
decision.decision == Verdict.ALLOW # True
```

## Error Classes

All errors include a `help_url` attribute pointing to troubleshooting documentation. The base URL for help links is
`https://aegis-docs.com/sdk/python/errors`.

### AegisError

Base exception for all AEGIS SDK errors.

```python
from aegis_sdk.errors import AegisError

try:
    decision = await client.propose(proposal)
except AegisError as e:
    print(e.message)   # Human-readable description
    print(e.help_url)  # Link to troubleshooting docs
```

**Constructor:** `AegisError(message: str, *, help_url: str | None = None)`

The string representation includes both the message and the help URL:
`"Something went wrong  (see https://aegis-docs.com/sdk/python/errors#aegis-error)"`

### AegisConnectionError

Raised when the SDK cannot reach the AEGIS API. Subclass of `AegisError`.

```python
from aegis_sdk.errors import AegisConnectionError

try:
    decision = await client.propose(proposal)
except AegisConnectionError as e:
    print(e.message)   # e.g. "Connection refused"
    print(e.help_url)  # https://aegis-docs.com/sdk/python/errors#connection-error
```

Common causes: wrong `base_url`, network issues, platform service is down.

### AegisAuthError

Raised when authentication fails (HTTP 401/403). Subclass of `AegisError`.

```python
from aegis_sdk.errors import AegisAuthError

try:
    decision = await client.propose(proposal)
except AegisAuthError as e:
    print(e.message)   # e.g. "Invalid API key"
    print(e.help_url)  # https://aegis-docs.com/sdk/python/errors#auth-error
```

Common causes: missing API key, expired key, insufficient permissions.

### AegisDeniedError

Raised when a governance proposal is denied. Subclass of `AegisError`. Includes the denial reason and the policies that
caused it.

```python
from aegis_sdk.errors import AegisDeniedError

try:
    decision = await client.propose(proposal)
except AegisDeniedError as e:
    print(e.reason)      # Why the action was denied
    print(e.policy_ids)  # List of policy IDs that caused the denial
    print(e.help_url)    # https://aegis-docs.com/sdk/python/errors#denied-error
```

**Constructor:** `AegisDeniedError(reason: str, policy_ids: list[str], *, help_url: str | None = None)`

### Error Hierarchy

```
AegisError
  +-- AegisConnectionError
  +-- AegisAuthError
  +-- AegisDeniedError
```

Catch `AegisError` to handle all SDK errors, or catch specific subclasses for targeted handling:

```python
from aegis_sdk.errors import (
    AegisError,
    AegisConnectionError,
    AegisAuthError,
    AegisDeniedError,
)

try:
    decision = await client.propose(proposal)
except AegisDeniedError as e:
    log.warning(f"Denied by policies {e.policy_ids}: {e.reason}")
except AegisAuthError as e:
    log.error(f"Auth failed: {e.message}")
except AegisConnectionError as e:
    log.error(f"Cannot reach AEGIS: {e.message}")
except AegisError as e:
    log.error(f"Unexpected AEGIS error: {e.message}")
```

## Public API

The following names are exported from `aegis_sdk`:

```python
from aegis_sdk import AegisClient, ActionProposal, GovernanceDecision, Verdict
```

Error classes must be imported from `aegis_sdk.errors`:

```python
from aegis_sdk.errors import AegisError, AegisConnectionError, AegisAuthError, AegisDeniedError
```

## Further Reading

- [SDK Overview](/sdk/) -- Both SDKs at a glance
- [TypeScript SDK](/sdk/javascript/) -- TypeScript equivalent
- [SDK Configuration](/sdk/configuration/) -- Constructor options and planned features
- [Source code](https://github.com/aegis-initiative/aegis-sdk/tree/main/packages/sdk-py)
