---
title: Enforcement API
description: Endpoints for managing capabilities, policies, and enforcement configuration.
---

# Enforcement API

> **Note:** The only enforcement-related endpoint implemented today is `GET /api/v1/capabilities` (in `aegis-platform/api/main.py`). The remaining endpoints described below (POST capabilities, policies CRUD, actor grants) represent the planned API design and are not yet available. The API is not yet deployed to a public URL. Check back soon.

The enforcement API provides endpoints for managing the governance configuration -- registering capabilities, defining policies, and configuring enforcement behavior.

## Capabilities

### GET /api/v1/capabilities

List all registered capabilities.

```json
{
  "capabilities": [
    {
      "id": "cap_abc123",
      "name": "database.query",
      "description": "Execute a read-only database query",
      "risk_level": "low",
      "parameter_schema": { "type": "object", "properties": { "query": { "type": "string" } } },
      "created_at": "2026-03-01T00:00:00Z"
    }
  ],
  "total": 12,
  "cursor": "next_abc"
}
```

### POST /api/v1/capabilities

Register a new capability.

```json
{
  "name": "infrastructure.deploy",
  "description": "Deploy a service to the target environment",
  "risk_level": "critical",
  "parameter_schema": {
    "type": "object",
    "required": ["service", "environment"],
    "properties": {
      "service": { "type": "string" },
      "environment": { "type": "string", "enum": ["staging", "production"] }
    }
  }
}
```

### Risk Levels

Capabilities are assigned a base risk level that feeds into risk scoring:

| Level | Description |
|---|---|
| `low` | Read-only or informational operations |
| `medium` | Operations that modify non-critical state |
| `high` | Operations that affect production systems or sensitive data |
| `critical` | Operations with potential for significant damage or irreversibility |

## Policies

### GET /api/v1/policies

List active policies.

### POST /api/v1/policies

Create a new governance policy.

```json
{
  "name": "production-deploy-confirmation",
  "description": "Require human confirmation for production deployments",
  "rules": [
    {
      "capability": "infrastructure.deploy",
      "condition": "parameters.environment == 'production'",
      "outcome": "REQUIRE_CONFIRMATION",
      "priority": 100
    }
  ],
  "enabled": true
}
```

### PUT /api/v1/policies/:id

Update an existing policy. Policy updates take effect immediately and are recorded in the audit log.

## Actor Grants

### GET /api/v1/actors/:id/grants

List capability grants for a specific actor.

### POST /api/v1/actors/:id/grants

Grant a capability to an actor.

```json
{
  "capability": "database.query",
  "constraints": {
    "time_window": { "start": "09:00", "end": "17:00", "timezone": "UTC" },
    "rate_limit": { "max_requests": 100, "window_seconds": 3600 }
  }
}
```

### DELETE /api/v1/actors/:id/grants/:capability

Revoke a capability grant from an actor.

## Further Reading

- [API Overview](/api/) -- Full endpoint listing
- [Governance API](/api/governance/) -- Submitting action proposals
- [Policy Authoring Guide](/guides/policy-authoring/) -- How to write effective governance policies

> **Note:** The enforcement API is under active development. See the [aegis-platform repository](https://github.com/aegis-initiative/aegis-platform) for the latest OpenAPI specification.
