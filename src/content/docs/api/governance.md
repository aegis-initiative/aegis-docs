---
title: Governance API
description: The ACTION_PROPOSE endpoint -- how to submit action proposals for governance evaluation.
---

# Governance API

> **Note:** The `POST /api/v1/governance/propose` endpoint exists in `aegis-platform/api/main.py` but the API is not yet deployed to a public URL. The additional endpoints (`GET /api/v1/governance/decisions/:id`, `GET /api/v1/governance/decisions`) described below are planned but not yet implemented. Authentication (API keys, scopes) is not yet available. Check back soon.

The governance API is the primary integration point for AI systems. It accepts action proposals, evaluates them against the governance runtime, and returns deterministic decisions.

## POST /api/v1/governance/propose

Submit an action proposal for governance evaluation. This is the API equivalent of the `ACTION_PROPOSE` message in the AGP-1 protocol.

### Request

```json
{
  "actor": {
    "id": "agent-001",
    "type": "ai-agent"
  },
  "action": {
    "capability": "database.query",
    "parameters": {
      "query": "SELECT * FROM users LIMIT 10",
      "database": "production"
    }
  },
  "context": {
    "session_id": "sess_abc123",
    "metadata": {
      "source": "customer-support-bot",
      "environment": "production"
    }
  }
}
```

### Request Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `actor.id` | string | Yes | Unique identifier for the requesting actor |
| `actor.type` | string | Yes | Actor type: `ai-agent`, `ai-copilot`, `automation`, or `human` |
| `action.capability` | string | Yes | The registered capability being requested |
| `action.parameters` | object | Yes | Parameters for the requested operation |
| `context.session_id` | string | No | Session identifier for correlating related proposals |
| `context.metadata` | object | No | Additional context for risk scoring and policy evaluation |

### Response

```json
{
  "decision_id": "dec_7f3a2b1c",
  "outcome": "ALLOW",
  "reason": "Capability 'database.query' authorized for actor 'agent-001'. Policy 'read-access-default' permits read-only queries. Risk score 0.12 within threshold.",
  "risk_score": 0.12,
  "constraints": {},
  "timestamp": "2026-03-23T12:00:00Z",
  "audit_ref": "aud_9e8d7c6b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `decision_id` | string | Unique identifier for this governance decision |
| `outcome` | string | `ALLOW`, `DENY`, `ESCALATE`, or `REQUIRE_CONFIRMATION` |
| `reason` | string | Human-readable explanation of the decision |
| `risk_score` | number | Computed risk score (0.0 to 1.0) |
| `constraints` | object | Any constraints applied to the allowed action |
| `timestamp` | string | ISO 8601 timestamp of the decision |
| `audit_ref` | string | Reference to the full audit trail entry |

### Outcome Semantics

| Outcome | HTTP Status | Meaning |
|---|---|---|
| `ALLOW` | 200 | Action approved -- safe to execute |
| `DENY` | 200 | Action rejected -- do not execute |
| `ESCALATE` | 200 | Requires elevated review; action not yet decided |
| `REQUIRE_CONFIRMATION` | 200 | Requires explicit human approval before proceeding |

All outcomes return HTTP 200. The `outcome` field in the response body determines the governance decision. HTTP error codes (4xx, 5xx) indicate request-level failures, not governance decisions.

### Error Responses

| HTTP Status | Meaning |
|---|---|
| 400 | Invalid request body (missing required fields, invalid capability format) |
| 401 | Authentication failure |
| 403 | API key does not have `governance:propose` scope |
| 429 | Rate limit exceeded |
| 500 | Internal server error (fail-closed: treated as DENY) |

## GET /api/v1/governance/decisions/:id

Retrieve a specific governance decision by its `decision_id`.

### Response

Returns the same structure as the `propose` response, plus additional audit information.

## GET /api/v1/governance/decisions

List recent governance decisions with pagination and filtering.

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `actor_id` | string | Filter by actor |
| `capability` | string | Filter by capability |
| `outcome` | string | Filter by outcome (ALLOW, DENY, etc.) |
| `since` | string | ISO 8601 timestamp for start of range |
| `until` | string | ISO 8601 timestamp for end of range |
| `limit` | integer | Results per page (default 50, max 200) |
| `cursor` | string | Pagination cursor |

## Further Reading

- [API Overview](/api/) -- Full endpoint listing
- [Audit API](/api/audit/) -- Query the audit log for full decision details
- [SDK Reference](/sdk/) -- Use the SDK instead of calling the API directly

> **Note:** The governance API is under active development. Request and response schemas may evolve before general availability. See the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform) for the latest OpenAPI specification.
