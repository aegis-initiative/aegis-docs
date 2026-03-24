---
title: API Overview
description: Overview of the AEGIS platform API -- working endpoints, base URL, and integration patterns.
---

# API Reference

The AEGIS platform exposes a REST API for governance operations, capability inspection, health checking, and audit queries.

> **Status:** The API is running locally at `https://demo.aegis-platform.net` and is functional. It is not yet deployed to `aegis-platform.net`. Authentication is not yet implemented -- all requests are currently accepted without credentials.

## Base URL

```
https://demo.aegis-platform.net
```

All API routes are under `/api/v1/`. When the platform is deployed, the base URL will change to `https://api.aegis-platform.net`.

## Working Endpoints

These four endpoints are implemented and tested:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/governance/propose` | Submit an action proposal for governance evaluation |
| `GET` | `/api/v1/health` | Health check -- verify the API is running |
| `GET` | `/api/v1/capabilities` | List registered capabilities |
| `GET` | `/api/v1/audit/events` | Query the audit event log |

## Quick Examples

### Health Check

```bash
curl -s https://demo.aegis-platform.net/api/v1/health
```

### List Capabilities

```bash
curl -s https://demo.aegis-platform.net/api/v1/capabilities
```

The demo configuration registers four capabilities: `file.read`, `file.write`, `network.fetch`, and `shell.exec`.

### Submit a Governance Proposal

```bash
curl -s -X POST https://demo.aegis-platform.net/api/v1/governance/propose \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "demo-agent", "action": "file.read", "target": "file.read"}'
```

```json
{
  "decision": "ALLOW",
  "reason": "Approved by policy 'Allow file reads'."
}
```

### Query Audit Events

```bash
curl -s https://demo.aegis-platform.net/api/v1/audit/events
```

## Response Format

All responses use JSON. Governance decisions return a consistent two-field structure:

```json
{
  "decision": "ALLOW",
  "reason": "Approved by policy 'Allow file reads'."
}
```

The four possible `decision` values are `ALLOW`, `DENY`, `ESCALATE`, and `REQUIRE_CONFIRMATION`.

## Authentication

Authentication is not yet implemented. The API currently accepts all requests without credentials. See the [Authentication](/api/authentication/) page for the planned authentication model.

## Planned Endpoints

The following endpoints are designed but not yet implemented:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/v1/governance/decisions/:id` | Retrieve a specific governance decision |
| `GET` | `/api/v1/governance/decisions` | List governance decisions (paginated) |
| `POST` | `/api/v1/capabilities` | Register a new capability |
| `GET` | `/api/v1/policies` | List active policies |
| `POST` | `/api/v1/policies` | Create a new policy |

## Further Reading

- [Governance API](/api/governance/) -- Detailed documentation for the governance proposal endpoint
- [Audit API](/api/audit/) -- Querying the audit event log
- [Authentication](/api/authentication/) -- Planned authentication model
- [Enforcement API](/api/enforcement/) -- Capabilities and policy management