---
title: Python SDK
description: Getting started with the AEGIS Python SDK.
---

# Python SDK

The `aegis-sdk` package provides a Python client for the AEGIS governance platform. It supports Python 3.10+ and provides both synchronous and asynchronous interfaces.

## Installation

> **Note:** The `aegis-sdk` package is not yet published to PyPI. The install commands below will not work until the package is published. You can build the Python SDK from source at [aegis-sdk/packages/sdk-py](https://github.com/aegis-initiative/aegis-sdk/tree/main/packages/sdk-py).

```bash
pip install aegis-sdk
```

Or with a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
pip install aegis-sdk
```

## Setup

> **Note:** The endpoint `https://api.aegissystems.live` is coming soon and not yet active. Authentication via API keys is not yet implemented.

```python
from aegis_sdk import AegisClient
import os

aegis = AegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
)
```

### Configuration Options

| Option | Type | Required | Default | Description |
|---|---|---|---|---|
| `endpoint` | str | Yes | -- | AEGIS platform API URL |
| `api_key` | str | Yes | -- | API key for authentication |
| `timeout` | float | No | 30.0 | Request timeout in seconds |
| `retries` | int | No | 3 | Number of retry attempts on transient failures |
| `retry_delay` | float | No | 1.0 | Base delay between retries in seconds |

## Proposing an Action

```python
decision = aegis.propose(
    actor={"id": "agent-001", "type": "ai-agent"},
    action={
        "capability": "database.query",
        "parameters": {
            "query": "SELECT * FROM users LIMIT 10",
            "database": "production",
        },
    },
    context={
        "session_id": "sess_abc123",
        "metadata": {"source": "customer-support-bot"},
    },
)
```

## Handling Decisions

```python
match decision.outcome:
    case "ALLOW":
        # Safe to execute the action
        result = execute_query(decision)

    case "DENY":
        print(f"Action denied: {decision.reason}")

    case "ESCALATE":
        # Route to human reviewer
        notify_reviewer(decision)

    case "REQUIRE_CONFIRMATION":
        # Present to user for approval
        confirmed = prompt_user(decision)
        if confirmed:
            # Resubmit with confirmation token
            pass
```

## Decision Object

The `propose()` method returns a `Decision` object with typed attributes:

```python
@dataclass
class Decision:
    decision_id: str
    outcome: Literal["ALLOW", "DENY", "ESCALATE", "REQUIRE_CONFIRMATION"]
    reason: str
    risk_score: float
    constraints: dict
    timestamp: str
    audit_ref: str
```

## Async Support

The SDK provides an async client for use with `asyncio`:

```python
from aegis_sdk import AsyncAegisClient

aegis = AsyncAegisClient(
    endpoint="https://api.aegissystems.live",
    api_key=os.environ["AEGIS_API_KEY"],
)

decision = await aegis.propose(
    actor={"id": "agent-001", "type": "ai-agent"},
    action={"capability": "database.query", "parameters": {"query": "..."}},
)
```

## Error Handling

```python
from aegis_sdk import AegisClient, AegisError, GovernanceError

try:
    decision = aegis.propose(...)
except GovernanceError as e:
    # Governance system error (e.g., invalid capability)
    print(f"Governance error: {e}")
except AegisError as e:
    # Transport error (network, timeout, auth failure)
    print(f"Transport error: {e}")
```

## Integration Patterns

### FastAPI Dependency

```python
from fastapi import Depends, HTTPException
from aegis_sdk import AsyncAegisClient

aegis = AsyncAegisClient(...)

async def require_governance(capability: str, parameters: dict, agent_id: str):
    decision = await aegis.propose(
        actor={"id": agent_id, "type": "ai-agent"},
        action={"capability": capability, "parameters": parameters},
    )
    if decision.outcome != "ALLOW":
        raise HTTPException(status_code=403, detail=decision.reason)
    return decision
```

### LangChain Tool Wrapper

```python
from aegis_sdk import AegisClient

aegis = AegisClient(...)

def governed_tool(capability: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            decision = aegis.propose(
                actor={"id": "langchain-agent", "type": "ai-agent"},
                action={"capability": capability, "parameters": kwargs},
            )
            if decision.outcome == "ALLOW":
                return func(*args, **kwargs)
            raise PermissionError(f"Governance denied: {decision.reason}")
        return wrapper
    return decorator
```

## Further Reading

- [SDK Overview](/sdk/) -- All supported languages
- [TypeScript SDK](/sdk/javascript/) -- TypeScript equivalent
- [SDK Configuration](/sdk/configuration/) -- Advanced configuration
- [API Reference](/api/) -- Underlying API endpoints

> **Note:** The Python SDK is under active development. The package will be published to PyPI as the platform reaches general availability. See the [aegis-sdk repository](https://github.com/aegis-initiative/aegis-sdk) for current status.
