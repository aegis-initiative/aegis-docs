---
title: Enforcement API
description: Endpoints for managing capabilities, policies, and enforcement configuration.
---

# Enforcement API

The enforcement API provides endpoints for inspecting and managing the governance configuration -- capabilities, policies, and actor grants.

> **Status:** Only `GET /api/v1/capabilities` is implemented today. All other endpoints described on this page (creating capabilities, policy CRUD, actor grants) are planned but not yet available. Authentication is not yet implemented.

## Implemented Endpoints

### GET /api/v1/capabilities

List all registered capabilities. This endpoint is working at `https://demo.aegis-platform.net`.

```bash
curl -s https://demo.aegis-platform.net/api/v1/capabilities
```

The demo configuration returns four capabilities:

- `file.read`
- `file.write`
- `network.fetch`
- `shell.exec`

These capabilities define the universe of actions that agents can request through the [governance proposal endpoint](/api/governance/).

---

## Planned Endpoints

The following endpoints are designed but not yet implemented:

### Capabilities Management

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/api/v1/capabilities` | Implemented | List registered capabilities |
| `POST` | `/api/v1/capabilities` | Planned | Register a new capability |
| `GET` | `/api/v1/capabilities/:id` | Planned | Get capability details |

### Policies

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/api/v1/policies` | Planned | List active policies |
| `POST` | `/api/v1/policies` | Planned | Create a new policy |
| `PUT` | `/api/v1/policies/:id` | Planned | Update an existing policy |

### Actor Grants

| Method | Path | Status | Description |
|---|---|---|---|
| `GET` | `/api/v1/actors/:id/grants` | Planned | List capability grants for an actor |
| `POST` | `/api/v1/actors/:id/grants` | Planned | Grant a capability to an actor |
| `DELETE` | `/api/v1/actors/:id/grants/:capability` | Planned | Revoke a capability grant |

---

## Capability Risk Levels (Planned)

When capability registration is implemented, capabilities will be assigned a base risk level:

| Level | Description |
|---|---|
| `low` | Read-only or informational operations |
| `medium` | Operations that modify non-critical state |
| `high` | Operations that affect production systems or sensitive data |
| `critical` | Operations with potential for significant damage or irreversibility |

## Policy Format (Planned)

When policy management is implemented, policies will follow this structure:

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

## Further Reading

- [API Overview](/api/) -- All available endpoints
- [Governance API](/api/governance/) -- Submitting action proposals
- [Audit API](/api/audit/) -- Querying the audit event log
