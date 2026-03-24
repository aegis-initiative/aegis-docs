---
title: Audit API
description: Query the immutable audit log for governance decisions, compliance reporting, and forensic analysis.
---

# Audit API

> **Note:** The only audit endpoint implemented today is `GET /api/v1/audit/events` (in `aegis-platform/api/main.py`). The endpoints described below (`/api/v1/audit/log`, `/api/v1/audit/log/:decision_id`) represent the planned API design and are not yet available. The API is not yet deployed to a public URL. Check back soon.

The audit API provides read access to the immutable governance audit log. Every governance decision, policy change, and enforcement action is recorded and queryable through this API.

## GET /api/v1/audit/log

Query the audit log with filtering and pagination.

### Query Parameters

| Parameter | Type | Description |
|---|---|---|
| `actor_id` | string | Filter by actor identifier |
| `capability` | string | Filter by capability name |
| `outcome` | string | Filter by decision outcome |
| `decision_id` | string | Filter by specific decision ID |
| `since` | string | ISO 8601 start of time range |
| `until` | string | ISO 8601 end of time range |
| `event_type` | string | Filter by event type (see below) |
| `limit` | integer | Results per page (default 50, max 200) |
| `cursor` | string | Pagination cursor for next page |

### Event Types

| Type | Description |
|---|---|
| `governance.decision` | A governance decision was made (ALLOW, DENY, ESCALATE, REQUIRE_CONFIRMATION) |
| `governance.execution` | An approved action was executed via the tool proxy |
| `policy.created` | A new policy was created |
| `policy.updated` | An existing policy was modified |
| `capability.registered` | A new capability was registered |
| `actor.grant.created` | A capability grant was issued to an actor |
| `actor.grant.revoked` | A capability grant was revoked |

### Response

```json
{
  "entries": [
    {
      "id": "aud_9e8d7c6b",
      "event_type": "governance.decision",
      "timestamp": "2026-03-23T12:00:00Z",
      "actor_id": "agent-001",
      "capability": "database.query",
      "outcome": "ALLOW",
      "risk_score": 0.12,
      "decision_id": "dec_7f3a2b1c",
      "policies_evaluated": ["read-access-default", "production-restrict"],
      "policy_matched": "read-access-default",
      "hash": "sha256:abc123...",
      "previous_hash": "sha256:def456..."
    }
  ],
  "total": 1847,
  "cursor": "next_xyz"
}
```

## GET /api/v1/audit/log/:decision_id

Get the complete audit trail for a specific governance decision, including the full request, evaluation path, and execution result (if applicable).

### Response

```json
{
  "decision_id": "dec_7f3a2b1c",
  "request": {
    "actor": { "id": "agent-001", "type": "ai-agent" },
    "action": { "capability": "database.query", "parameters": { "query": "..." } },
    "context": { "session_id": "sess_abc123" }
  },
  "evaluation": {
    "capability_check": "pass",
    "authority_check": "pass",
    "risk_score": 0.12,
    "risk_threshold": 0.8,
    "policies_evaluated": ["read-access-default", "production-restrict"],
    "policy_matched": "read-access-default"
  },
  "decision": {
    "outcome": "ALLOW",
    "reason": "Policy 'read-access-default' permits read-only queries",
    "constraints": {},
    "timestamp": "2026-03-23T12:00:00Z"
  },
  "execution": {
    "status": "completed",
    "result_summary": "Query returned 10 rows",
    "duration_ms": 42,
    "completed_at": "2026-03-23T12:00:01Z"
  },
  "integrity": {
    "hash": "sha256:abc123...",
    "previous_hash": "sha256:def456...",
    "chain_verified": true
  }
}
```

## Audit Log Integrity

Audit entries are hash-chained: each entry includes a SHA-256 hash of its contents and a reference to the previous entry's hash. This creates a tamper-evident chain that can be independently verified.

The `chain_verified` field indicates whether the integrity chain is intact up to and including this entry.

## Compliance and Export

For compliance reporting, the audit log can be exported in bulk:

- Use broad time-range queries with pagination to extract full audit trails
- Filter by `event_type` to isolate governance decisions, policy changes, or execution results
- The hash chain provides cryptographic proof of log integrity for auditors

## Further Reading

- [API Overview](/api/) -- Full endpoint listing
- [Governance API](/api/governance/) -- How decisions are created
- [Core Concepts](/getting-started/core-concepts/) -- Understanding the audit trail

> **Note:** The audit API is under active development. See the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform) for the latest API specification.
