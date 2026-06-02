---
title: Audit API
description: Query the audit event log for governance decisions and compliance reporting.
---

# Audit API

The audit API provides read access to the governance audit log. Every governance decision is recorded and queryable
through this endpoint.

> **Status:** The `GET /api/v1/audit/events` endpoint is implemented and functional at
`https://demo.aegis-platform.net`. The API is not yet deployed to `aegis-platform.net`. Authentication is not yet
implemented.

## GET /api/v1/audit/events

Query the audit event log. Returns all recorded governance decision events.

### Request

```bash
curl -s https://demo.aegis-platform.net/api/v1/audit/events
```

### Response

The response is a JSON array of audit event objects. Each event records a governance decision that was made:

```json
[
  {
    "agent_id": "demo-agent",
    "action": "file.read",
    "target": "file.read",
    "decision": "ALLOW",
    "reason": "Approved by policy 'Allow file reads'.",
    "timestamp": "2026-03-24T12:00:00Z"
  },
  {
    "agent_id": "demo-agent",
    "action": "network.fetch",
    "target": "network.fetch",
    "decision": "ESCALATE",
    "reason": "Escalation required by policy 'Escalate network requests'.",
    "timestamp": "2026-03-24T12:01:00Z"
  }
]
```

### Event Fields

| Field | Type | Description |
|---|---|---|
| `agent_id` | string | The agent that submitted the proposal |
| `action` | string | The action that was proposed |
| `target` | string | The target resource |
| `decision` | string | The governance outcome: `ALLOW`, `DENY`, `ESCALATE`, or `REQUIRE_CONFIRMATION` |
| `reason` | string | Human-readable explanation of the decision |
| `timestamp` | string | ISO 8601 timestamp of when the decision was recorded |

### Example: Check Recent Decisions

After submitting several proposals, you can inspect the audit trail:

```bash
# Submit a proposal
curl -s -X POST https://demo.aegis-platform.net/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "shell.exec", "target": "shell.exec"}'

# Then query the audit log
curl -s https://demo.aegis-platform.net/api/v1/audit/events
```

The audit log will include the `REQUIRE_CONFIRMATION` decision for the `shell.exec` proposal.

---

## Planned Enhancements

The following audit capabilities are designed but not yet implemented:

- **Filtering** -- Query by `agent_id`, `action`, `decision`, or time range
- **Pagination** -- Cursor-based pagination for large result sets
- **Decision detail endpoint** (`GET /api/v1/audit/log/:decision_id`) -- Full audit trail for a specific decision,
including evaluation path and policy chain
- **Hash-chained integrity** -- Tamper-evident audit entries with SHA-256 hash chains
- **Bulk export** -- Time-range queries for compliance reporting

## Further Reading

- [API Overview](/api/) -- All available endpoints
- [Governance API](/api/governance/) -- How governance decisions are created
- [Core Concepts](/getting-started/core-concepts/) -- Understanding the audit trail
