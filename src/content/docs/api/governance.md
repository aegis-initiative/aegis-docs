---
title: Governance API
description: The POST /api/v1/governance/propose endpoint -- submit action proposals for governance evaluation.
---

# Governance API

The governance API is the primary integration point for AI systems. It accepts action proposals, evaluates them against registered capabilities, agent grants, and policies, and returns deterministic decisions.

> **Status:** The API is running locally at `http://127.0.0.1:8000` and is functional. It is not yet deployed to `aegissystems.live`. Authentication is not yet implemented -- requests are currently accepted without credentials.

## POST /api/v1/governance/propose

Submit an action proposal for governance evaluation. The engine checks whether the requesting agent has the required capability grant, then evaluates matching policies to produce an outcome.

### Request Format

```json
{
  "agent_id": "demo-agent",
  "action": "file.read",
  "target": "file.read"
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `agent_id` | string | Yes | Identifier of the agent requesting the action |
| `action` | string | Yes | The action being requested (maps to a registered capability) |
| `target` | string | Yes | The target resource for the action |

### Response Format

```json
{
  "decision": "ALLOW",
  "reason": "Approved by policy 'Allow file reads'."
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `decision` | string | One of `ALLOW`, `DENY`, `ESCALATE`, or `REQUIRE_CONFIRMATION` |
| `reason` | string | Human-readable explanation of why the decision was made |

All governance outcomes return HTTP 200. The `decision` field determines the result. HTTP error codes (4xx) indicate request-level validation failures, not governance decisions.

---

## Decision Outcomes

The governance engine supports four outcomes. When multiple policies match, the strictest outcome wins according to this precedence rule:

**DENY > ESCALATE > REQUIRE_CONFIRMATION > ALLOW**

### ALLOW

The action is approved. The agent may proceed.

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "file.read", "target": "file.read"}'
```

```json
{
  "decision": "ALLOW",
  "reason": "Approved by policy 'Allow file reads'."
}
```

### DENY

The action is rejected. The agent must not proceed.

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "file.write", "target": "file.write"}'
```

```json
{
  "decision": "DENY",
  "reason": "Agent 'demo-agent' lacks a capability covering action 'file_write' on target 'file.write'."
}
```

Note: `demo-agent` is not granted the `file.write` capability, so the request is denied at the capability-check stage before policy evaluation.

### ESCALATE

The action requires elevated review. It is neither approved nor denied -- a human or higher-authority system must make the final call.

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "network.fetch", "target": "network.fetch"}'
```

```json
{
  "decision": "ESCALATE",
  "reason": "Escalation required by policy 'Escalate network requests'."
}
```

### REQUIRE_CONFIRMATION

The action needs explicit human confirmation before the agent may proceed.

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "shell.exec", "target": "shell.exec"}'
```

```json
{
  "decision": "REQUIRE_CONFIRMATION",
  "reason": "Human confirmation required by policy 'Require confirmation for shell execution'."
}
```

---

## Error Handling

### 400 -- Validation Error

Returned when the request body is missing required fields or is malformed.

```bash
curl -s -X POST http://127.0.0.1:8000/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{}'
```

Returns HTTP 400 with a validation error describing which fields are missing.

### Other Error Codes

| HTTP Status | Meaning |
|---|---|
| 400 | Invalid request body (missing required fields, malformed JSON) |
| 500 | Internal server error |

> **Note:** Authentication (401/403) and rate limiting (429) are not yet implemented.

---

## How Decisions Are Made

The governance engine evaluates proposals in this order:

1. **Capability check** -- Does the agent have a grant covering the requested action? If not, the result is `DENY` immediately.
2. **Policy evaluation** -- All matching policies are evaluated. If multiple policies match, the strictest outcome wins per the precedence rule: `DENY > ESCALATE > REQUIRE_CONFIRMATION > ALLOW`.

### Demo Configuration

The current demo environment is configured with:

**Capabilities:** `file.read`, `file.write`, `network.fetch`, `shell.exec`

**Agent grants for `demo-agent`:** `file.read`, `network.fetch`, `shell.exec`
(Note: `demo-agent` is deliberately not granted `file.write`)

**Policies:**

| Policy | Capability | Outcome |
|---|---|---|
| Allow file reads | `file.read` | ALLOW |
| Deny file writes | `file.write` | DENY |
| Escalate network requests | `network.fetch` | ESCALATE |
| Require confirmation for shell execution | `shell.exec` | REQUIRE_CONFIRMATION |

---

## Further Reading

- [API Overview](/api/) -- All available endpoints
- [Audit API](/api/audit/) -- Query the audit event log
- [Enforcement API](/api/enforcement/) -- Capabilities and policy management
